import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({name:{type:String,required:true},email:{type:String,required:true,unique:true,lowercase:true},password:{type:String,required:true},contact:String,address:String,role:{type:String,enum:['user','admin'],default:'user'}},{timestamps:true});

const meterSchema = new mongoose.Schema({
  meterNumber: {
    type: String,
    unique: true,
    required: true
  },
  address: String,
  meterType: {
    type: String,
    default: 'Single Phase'
  },
  assigned: {
    type: Boolean,
    default: false
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  lastReading: {
    type: Number,
    default: 0,
    min: 0
  }
}, { timestamps: true });

const billSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  meterNumber: {
    type: String,
    required: true
  },
  previousReading: {
    type: Number,
    required: true
  },
  currentReading: {
    type: Number,
    required: true
  },
  consumption: {
    type: Number,
    required: true,
    min: 0
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  tariffType: {
    type: String,
    default: 'TN Domestic LT-IA'
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending'
  },
  dueDate: Date
}, { timestamps: true });

const complaintSchema = new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},customerName:String,customerEmail:String,requestType:{type:String,default:'General'},meterNumber:String,description:{type:String,required:true},status:{type:String,enum:['Pending','In Progress','Resolved'],default:'Pending'}},{timestamps:true});
const paymentSchema = new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},meterNumber:String,amount:Number,status:String,paymentMethod:String,billId:{type:mongoose.Schema.Types.ObjectId,ref:'Bill'}},{timestamps:true});
const auditSchema = new mongoose.Schema({action:String,adminEmail:String,details:String,timestamp:{type:Date,default:Date.now}});
export const User=mongoose.model('User',userSchema); export const Meter=mongoose.model('Meter',meterSchema); export const Bill=mongoose.model('Bill',billSchema); export const Complaint=mongoose.model('Complaint',complaintSchema); export const Payment=mongoose.model('Payment',paymentSchema); export const Audit=mongoose.model('Audit',auditSchema);
