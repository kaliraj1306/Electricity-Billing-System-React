import express from 'express'; import cors from 'cors'; import mongoose from 'mongoose'; import dotenv from 'dotenv'; import bcrypt from 'bcryptjs'; import jwt from 'jsonwebtoken';
import {User,Meter,Bill,Complaint,Payment,Audit} from './models/Models.js'; import {auth,adminOnly} from './middleware.js';
dotenv.config(); const app=express(); app.use(cors({origin:true})); app.use(express.json());
app.get('/api/health',(req,res)=>res.json({status:'ok',message:'Electricity Billing API is running'}));
app.post('/api/auth/register',async(req,res)=>{try{const {name,email,password,contact,address}=req.body;if(!name||!email||!password||!address)return res.status(400).json({message:'Please fill all required fields'});if(await User.findOne({email}))return res.status(409).json({message:'Email already registered'});const user=await User.create({name,email,password:await bcrypt.hash(password,10),contact,address,role:'user'});res.status(201).json({message:'Registration successful',user:{id:user._id,name:user.name,email:user.email,role:user.role}});}catch(e){res.status(500).json({message:e.message});}});
app.post('/api/auth/login',async(req,res)=>{try{const {email,password}=req.body;const user=await User.findOne({email});if(!user||!(await bcrypt.compare(password,user.password)))return res.status(401).json({message:'Invalid email or password'});const token=jwt.sign({id:user._id,name:user.name,email:user.email,role:user.role},process.env.JWT_SECRET,{expiresIn:'1d'});res.json({token,user:{id:user._id,name:user.name,email:user.email,role:user.role,address:user.address,contact:user.contact}});}catch(e){res.status(500).json({message:e.message});}});
app.get('/api/me',auth,async(req,res)=>{const user=await User.findById(req.user.id).select('-password');res.json(user);});
app.put('/api/me',auth,async(req,res)=>{const user=await User.findByIdAndUpdate(req.user.id,{$set:{name:req.body.name,address:req.body.address,contact:req.body.contact}},{new:true}).select('-password');res.json(user);});
app.get('/api/users',auth,adminOnly,async(req,res)=>res.json(await User.find({role:'user'}).select('-password').sort({createdAt:-1})));
app.delete('/api/users/:id',auth,adminOnly,async(req,res)=>{await User.findByIdAndDelete(req.params.id);res.json({message:'Customer removed'});});
app.get('/api/meters',auth,async(req,res)=>res.json(await Meter.find(req.user.role==='admin'?{}:{customerId:req.user.id}).populate('customerId','name email').sort({createdAt:-1})));
app.post('/api/meters',auth,adminOnly,async(req,res)=>{try{const meter=await Meter.create({meterNumber:req.body.meterNumber,address:req.body.address,meterType:req.body.meterType});await Audit.create({action:'Meter added',adminEmail:req.user.email,details:`Meter ${meter.meterNumber} added`});res.status(201).json(meter);}catch(e){res.status(400).json({message:e.message});}});

app.put('/api/meters/:id/assign', auth, adminOnly, async (req, res) => {
  try {
    const { customerId } = req.body;

    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({
        message: 'Please select a valid customer'
      });
    }

    const meter = await Meter.findByIdAndUpdate(
      req.params.id,
      { customerId, assigned: true },
      { new: true, runValidators: true }
    ).populate('customerId', 'name email');

    if (!meter) {
      return res.status(404).json({ message: 'Meter not found' });
    }

    res.json(meter);
  } catch (error) {
    console.error('Meter assignment error:', error);
    res.status(500).json({ message: 'Failed to assign meter' });
  }
});
app.get('/api/bills',auth,async(req,res)=>res.json(await Bill.find(req.user.role==='admin'?{}:{userId:req.user.id}).populate('userId','name email').sort({createdAt:-1})));

function calculateTNEBDomesticBill(units) {
  let amount = 0;

  if (units <= 500) {
    // First 200 units free
    if (units > 200) {
      amount += Math.min(units, 400) - 200 > 0
        ? (Math.min(units, 400) - 200) * 4.70
        : 0;
    }

    if (units > 400) {
      amount += (units - 400) * 6.30;
    }
  } else {
    // First 100 units free when consumption exceeds 500
    const slabs = [
      { limit: 400, rate: 4.70 },
      { limit: 500, rate: 6.30 },
      { limit: 600, rate: 8.40 },
      { limit: 800, rate: 9.45 },
      { limit: 1000, rate: 10.50 },
      { limit: Infinity, rate: 11.55 }
    ];

    let previousLimit = 100;

    for (const slab of slabs) {
      if (units > previousLimit) {
        const slabUnits =
          Math.min(units, slab.limit) - previousLimit;

        amount += slabUnits * slab.rate;
      }

      previousLimit = slab.limit;

      if (units <= slab.limit) break;
    }
  }

  // Final bill rounded to nearest rupee
  return Math.round(amount);
}

app.post('/api/bills', auth, adminOnly, async (req, res) => {
  try {
    const { userId, meterNumber, currentReading, dueDate } = req.body;

    const reading = Number(currentReading);

    if (!userId || !meterNumber || !Number.isFinite(reading) || reading < 0) {
      return res.status(400).json({
        message: 'Please provide valid customer, meter and reading details'
      });
    }

    // Find the meter assigned to this customer
    const meter = await Meter.findOne({
      meterNumber,
      customerId: userId,
      assigned: true
    });

    if (!meter) {
      return res.status(404).json({
        message: 'Meter is not assigned to this customer'
      });
    }

    const previousReading = meter.lastReading || 0;

    if (reading < previousReading) {
      return res.status(400).json({
        message: 'Current reading cannot be less than previous reading'
      });
    }

    // Calculate units and Tamil Nadu domestic bill
    const consumption = reading - previousReading;
    const amount = calculateTNEBDomesticBill(consumption);

    const bill = await Bill.create({
      userId,
      meterNumber,
      previousReading,
      currentReading: reading,
      consumption,
      amount,
      dueDate
    });

    // Save current reading for the next billing cycle
    meter.lastReading = reading;
    await meter.save();

    await Audit.create({
      action: 'Bill generated',
      adminEmail: req.user.email,
      details: `Bill ${bill._id} generated for ${meterNumber}`
    });

    res.status(201).json(bill);

  } catch (e) {
    console.error('Bill generation error:', e);
    res.status(400).json({ message: e.message });
  }
});
app.post('/api/bills/:id/pay',auth,async(req,res)=>{const bill=await Bill.findOne({_id:req.params.id,userId:req.user.id});if(!bill)return res.status(404).json({message:'Bill not found'});if(bill.status==='Paid')return res.status(400).json({message:'Bill already paid'});bill.status='Paid';await bill.save();const payment=await Payment.create({userId:req.user.id,meterNumber:bill.meterNumber,amount:bill.amount,status:'Success',paymentMethod:req.body.paymentMethod||'Demo payment',billId:bill._id});res.json({message:'Demo payment recorded successfully',payment});});
app.get('/api/payments',auth,async(req,res)=>res.json(await Payment.find(req.user.role==='admin'?{}:{userId:req.user.id}).populate('userId','name email').sort({createdAt:-1})));
app.get('/api/complaints',auth,async(req,res)=>res.json(await Complaint.find(req.user.role==='admin'?{}:{userId:req.user.id}).populate('userId','name email').sort({createdAt:-1})));
app.post('/api/complaints',auth,async(req,res)=>{const complaint=await Complaint.create({userId:req.user.id,customerName:req.user.name,customerEmail:req.user.email,requestType:req.body.requestType,meterNumber:req.body.meterNumber,description:req.body.description});res.status(201).json(complaint);});
app.patch('/api/complaints/:id',auth,adminOnly,async(req,res)=>res.json(await Complaint.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true})));
app.get('/api/audit',auth,adminOnly,async(req,res)=>res.json(await Audit.find().sort({timestamp:-1}).limit(100)));
const port=process.env.PORT||5000;
await mongoose.connect(process.env.MONGO_URI||'mongodb://127.0.0.1:27017/electricity_billing');
if(process.env.ADMIN_EMAIL&&process.env.ADMIN_PASSWORD&&!await User.findOne({email:process.env.ADMIN_EMAIL})){await User.create({name:process.env.ADMIN_NAME||'System Admin',email:process.env.ADMIN_EMAIL,password:await bcrypt.hash(process.env.ADMIN_PASSWORD,10),role:'admin'});console.log('Default admin account created');}
app.listen(port,()=>console.log(`API running at http://localhost:${port}`));
