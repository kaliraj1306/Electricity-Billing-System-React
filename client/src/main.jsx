import React,{useEffect,useState} from 'react';import{createRoot}from'react-dom/client';import{BrowserRouter,Routes,Route,Navigate,Link,useNavigate}from'react-router-dom';import axios from'axios';import{Zap,LayoutDashboard,Receipt,Users,Plug,MessageSquare,Wallet,Settings,LogOut,Menu,X,Search,Plus,ArrowUpRight,Activity,ShieldCheck,FileText,CheckCircle2,Clock,UserRound,Send,Trash2}from'lucide-react';import './style.css';
const api=axios.create({baseURL:'http://localhost:5000/api'});api.interceptors.request.use(c=>{const t=localStorage.getItem('token');if(t)c.headers.Authorization=`Bearer ${t}`;return c});
const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(n||0);const date=d=>d?new Date(d).toLocaleDateString('en-IN'):'—';
function App(){const[user,setUser]=useState(()=>JSON.parse(localStorage.getItem('user')||'null'));const[collapsed,setCollapsed]=useState(false);function logout(){localStorage.clear();setUser(null)}return <BrowserRouter><Routes><Route path="/login" element={<Auth setUser={setUser}/>}/><Route path="/register" element={<Register/>}/><Route path="*" element={user?<Shell user={user} logout={logout} collapsed={collapsed} setCollapsed={setCollapsed}/>:<Navigate to="/login"/>}/></Routes></BrowserRouter>}
function Auth({setUser}){const[email,setEmail]=useState('');const[password,setPassword]=useState('');const[error,setError]=useState('');const nav=useNavigate();async function submit(e){e.preventDefault();setError('');try{const{data}=await api.post('/auth/login',{email,password});localStorage.setItem('token',data.token);localStorage.setItem('user',JSON.stringify(data.user));setUser(data.user);nav('/');}catch(e){setError(e.response?.data?.message||'Unable to connect to server')}}return <div className="auth-wrap"><div className="auth-art"><div className="brand"><span className="brand-icon"><Zap/></span> volt<span>bill</span></div><div className="art-copy"><span className="eyebrow">SMART UTILITY MANAGEMENT</span><h1>Powering a simpler way to manage energy.</h1><p>One clear view of your electricity usage, bills and service requests.</p><div className="art-stats"><div><b>01</b><small>Track bills</small></div><div><b>02</b><small>Manage meters</small></div><div><b>03</b><small>Stay in control</small></div></div></div><div className="art-foot">ELECTRICITY BILLING SYSTEM · 2026</div></div><div className="auth-panel"><div className="auth-box"><span className="eyebrow">WELCOME BACK</span><h2>Sign in to your account</h2><p className="muted">Enter your details to continue to VoltBill.</p>{error&&<div className="alert">{error}</div>}<form onSubmit={submit}><label>Email address</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" required/><button className="primary full">Sign in <ArrowUpRight size={17}/></button></form><p className="auth-bottom">New customer? <Link to="/register">Create an account</Link></p><p className="hint">Admin demo: admin@electricity.com / Admin@123</p></div></div></div>}
function Register(){const[form,setForm]=useState({name:'',email:'',password:'',contact:'',address:''});const[msg,setMsg]=useState('');const nav=useNavigate();function change(e){setForm({...form,[e.target.name]:e.target.value})}async function submit(e){e.preventDefault();try{await api.post('/auth/register',form);setMsg('Account created. You can now sign in.');setTimeout(()=>nav('/login'),900)}catch(e){setMsg(e.response?.data?.message||'Registration failed')}}return <div className="auth-wrap"><div className="auth-art"><div className="brand"><span className="brand-icon"><Zap/></span> volt<span>bill</span></div><div className="art-copy"><span className="eyebrow">GET STARTED</span><h1>Your electricity account, made simple.</h1><p>Create an account to view bills, meter details and service requests.</p></div></div><div className="auth-panel"><div className="auth-box"><span className="eyebrow">NEW CUSTOMER</span><h2>Create your account</h2>{msg&&<div className="alert">{msg}</div>}<form onSubmit={submit}><label>Full name</label><input name="name" value={form.name} onChange={change} required/><label>Email address</label><input name="email" type="email" value={form.email} onChange={change} required/><label>Password</label><input name="password" type="password" value={form.password} onChange={change} minLength="6" required/><label>Contact number</label><input name="contact" value={form.contact} onChange={change}/><label>Address</label><textarea name="address" value={form.address} onChange={change} required/><button className="primary full">Create account <ArrowUpRight size={17}/></button></form><p className="auth-bottom">Already registered? <Link to="/login">Sign in</Link></p></div></div></div>}
const navItems=[['Overview','/',LayoutDashboard],['Bills','/bills',Receipt],['Meters','/meters',Plug],['Complaints','/complaints',MessageSquare],['Payments','/payments',Wallet],['Profile','/profile',Settings]];
function Shell({user,logout,collapsed,setCollapsed}){const[mobile,setMobile]=useState(false);const items=user.role==='admin'?[['Overview','/',LayoutDashboard],['Customers','/customers',Users],['Meters','/meters',Plug],['Bills','/bills',Receipt],['Complaints','/complaints',MessageSquare],['Payments','/payments',Wallet],['Audit log','/audit',ShieldCheck]]:navItems;return <div className="app-shell"><aside className={`sidebar ${collapsed?'slim':''} ${mobile?'mobile-open':''}`}><div className="side-brand"><span className="brand-icon"><Zap/></span>{!collapsed&&<span>volt<b>bill</b></span>}<button className="mobile-close" onClick={()=>setMobile(false)}><X/></button></div><div className="side-label">WORKSPACE</div><nav>{items.map(([label,path,Icon])=><Link onClick={()=>setMobile(false)} key={path} to={path} className={({})=>location.pathname===path?'nav-link active':'nav-link'}><Icon size={18}/>{!collapsed&&<span>{label}</span>}</Link>)}</nav><div className="sidebar-bottom"><div className="help-card"><span className="help-dot"/>{!collapsed&&<div><b>System status</b><small>All services operational</small></div>}</div><button className="nav-link logout" onClick={logout}><LogOut size={18}/>{!collapsed&&<span>Sign out</span>}</button></div></aside><main className="main-area"><header className="topbar"><button className="icon-btn menu-btn" onClick={()=>setMobile(true)}><Menu/></button><button className="icon-btn collapse-btn" onClick={()=>setCollapsed(!collapsed)}><Menu/></button><div className="crumb">Workspace <span>/</span> <b>{items.find(x=>x[1]===location.pathname)?.[0]||'Overview'}</b></div><div className="top-right"><span className="today">Electricity Billing Portal</span><div className="avatar">{user.name?.[0]?.toUpperCase()}</div><div className="user-mini"><b>{user.name}</b><small>{user.role==='admin'?'Administrator':'Customer'}</small></div></div></header><div className="page-content"><Routes><Route path="/" element={<Dashboard user={user}/>}/><Route path="/bills" element={<Bills user={user}/>}/><Route path="/meters" element={<Meters user={user}/>}/><Route path="/complaints" element={<Complaints user={user}/>}/><Route path="/payments" element={<Payments/>}/><Route path="/profile" element={<Profile/>}/><Route path="/customers" element={<Customers/>}/><Route path="/audit" element={<Audit/>}/><Route path="*" element={<Navigate to="/"/>}/></Routes></div></main></div>}
function Heading({tag,title,sub,action}){return <div className="page-heading"><div><span className="eyebrow">{tag}</span><h1>{title}</h1><p>{sub}</p></div>{action}</div>}
function Dashboard({user}){const[stats,setStats]=useState({bills:[],meters:[],complaints:[],users:[]});useEffect(()=>{Promise.all([api.get('/bills'),api.get('/meters'),api.get('/complaints'),user.role==='admin'?api.get('/users'):Promise.resolve({data:[]})]).then(([b,m,c,u])=>setStats({bills:b.data,meters:m.data,complaints:c.data,users:u.data})).catch(()=>{});},[]);const pending=stats.bills.filter(x=>x.status==='Pending');const total=pending.reduce((s,x)=>s+x.amount,0);return <><Heading tag="YOUR CONTROL CENTRE" title={`Good day, ${user.name?.split(' ')[0]||'there'}.`} sub="Here’s what’s happening with your electricity account today."/><div className="stat-grid">{(user.role==='admin'?[['Total customers',stats.users.length,Users,'Across the platform'],['Meters registered',stats.meters.length,Plug,'Assigned and available'],['Bills generated',stats.bills.length,Receipt,'All billing records'],['Open complaints',stats.complaints.filter(x=>x.status!=='Resolved').length,MessageSquare,'Need attention']]:[['Outstanding amount',money(total),Wallet,`${pending.length} unpaid bills`],['Total bills',stats.bills.length,Receipt,'Your billing history'],['My meters',stats.meters.length,Plug,'Connected meters'],['Requests',stats.complaints.length,MessageSquare,'Submitted complaints']]).map(([t,v,I,d])=><div className="stat-card" key={t}><div className="stat-top"><span>{t}</span><i><I size={18}/></i></div><strong>{v}</strong><small>{d}</small></div>)}</div><div className="content-grid"><section className="panel"><div className="panel-head"><div><h3>{user.role==='admin'?'Recent bills':'Recent bills'}</h3><p>Latest billing activity</p></div><Link to="/bills" className="text-link">View all <ArrowUpRight size={15}/></Link></div><BillTable bills={stats.bills.slice(0,5)} admin={user.role==='admin'}/></section><section className="panel insight-panel"><div className="panel-head"><div><h3>Quick actions</h3><p>Common account tasks</p></div><Activity size={19}/></div><div className="quick-list"><Link to="/bills"><span className="quick-icon"><Receipt/></span><span><b>View electricity bills</b><small>Check due amounts and status</small></span><ArrowUpRight size={16}/></Link><Link to="/meters"><span className="quick-icon"><Plug/></span><span><b>Meter details</b><small>See your assigned meters</small></span><ArrowUpRight size={16}/></Link><Link to="/complaints"><span className="quick-icon"><MessageSquare/></span><span><b>Raise a complaint</b><small>Get help with an issue</small></span><ArrowUpRight size={16}/></Link></div><div className="notice"><ShieldCheck size={19}/><span><b>Your account is protected</b><small>Use Sign out when leaving a shared device.</small></span></div></section></div></>}
function BillTable({bills,admin}){return <div className="table-wrap"><table><thead><tr>{admin&&<th>Customer</th>}<th>Meter number</th><th>Consumption</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead><tbody>{bills.length?bills.map(b=><tr key={b._id}>{admin&&<td>{b.userId?.name||'Customer'}</td>}<td className="mono">{b.meterNumber}</td><td>{b.consumption} kWh</td><td className="amount">{money(b.amount)}</td><td>{date(b.createdAt)}</td><td><Status value={b.status}/></td></tr>):<tr><td colSpan="6" className="empty">No bills to display yet.</td></tr>}</tbody></table></div>}
function Status({value}){return <span className={`status ${String(value).toLowerCase().replaceAll(' ','-')}`}>{value}</span>}

function calculateTNEBDomesticBill(units) {
  let amount = 0;

  if (units <= 500) {
    amount += Math.max(0, Math.min(units, 400) - 200) * 4.70;
    amount += Math.max(0, units - 400) * 6.30;
  } else {
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
        amount +=
          (Math.min(units, slab.limit) - previousLimit) * slab.rate;
      }

      previousLimit = slab.limit;
      if (units <= slab.limit) break;
    }
  }

  return Math.round(amount);
}
function Bills({user}){const[data,setData]=useState([]),[users,setUsers]=useState([]),[meters,setMeters]=useState([]),[open,setOpen]=useState(false),[form,setForm]=useState({userId:'',meterNumber:'',currentReading:'',dueDate:''}),[msg,setMsg]=useState('');useEffect(() => {
  if (!form.userId) return;

  const customerMeters = meters.filter(
    m => String(m.customerId?._id || m.customerId) === String(form.userId)
  );

  setForm(prev => ({
    ...prev,
    meterNumber: customerMeters.length === 1
      ? customerMeters[0].meterNumber
      : ''
  }));
}, [form.userId, meters]);
async function load(){const r=await api.get('/bills');setData(r.data)}useEffect(()=>{load();if(user.role==='admin'){api.get('/users').then(r=>setUsers(r.data));api.get('/meters').then(r=>setMeters(r.data))}},[]);
async function create(e) {
  e.preventDefault();

  try {
    await api.post('/bills', {
      ...form,
      currentReading: Number(form.currentReading)
    });

    setOpen(false);
    setForm({
      userId: '',
      meterNumber: '',
      currentReading: '',
      dueDate: ''
    });

    setMsg('');
    load();
  } catch (e) {
    setMsg(e.response?.data?.message || 'Could not create bill');
  }
}
async function pay(id){if(!confirm('Record this as a demo payment? No real money will be charged.'))return;try{await api.post(`/bills/${id}/pay`,{paymentMethod:'Demo payment'});load()}catch(e){alert(e.response?.data?.message||'Payment failed')}}
const selectedMeter = meters.find(
  m => m.meterNumber === form.meterNumber
);

const previousReading = Number(selectedMeter?.lastReading ?? 0);

const unitsConsumed =
  form.currentReading === ''
    ? null
    : Number(form.currentReading) - previousReading;

const estimatedAmount =
  unitsConsumed !== null && unitsConsumed >= 0
    ? calculateTNEBDomesticBill(unitsConsumed)
    : null;
return <><Heading tag="BILLING" title="Electricity bills" sub="Review consumption, due amounts and payment status." action={user.role==='admin'&&<button className="primary" onClick={()=>setOpen(true)}><Plus size={17}/> Generate bill</button>}/>{msg&&<div className="alert">{msg}</div>}<section className="panel"><div className="panel-head"><div><h3>Billing records</h3><p>{data.length} records found</p></div><span className="table-meta"><Search size={15}/> Updated just now</span></div><div className="table-wrap"><table><thead><tr>{user.role==='admin'&&<th>Customer</th>}<th>Meter number</th><th>Units consumed</th><th>Bill amount</th><th>Bill date</th><th>Status</th>{user.role!=='admin'&&<th>Action</th>}</tr></thead><tbody>{data.length?data.map(b=><tr key={b._id}>{user.role==='admin'&&<td>{b.userId?.name}</td>}<td className="mono">{b.meterNumber}</td><td>{b.consumption} kWh</td><td className="amount">{money(b.amount)}</td><td>{date(b.createdAt)}</td><td><Status value={b.status}/></td>{user.role!=='admin'&&<td>{b.status==='Pending'?<button className="small-btn" onClick={()=>pay(b._id)}>Pay now</button>:'—'}</td>}</tr>):<tr><td colSpan="7" className="empty">No billing records found.</td></tr>}</tbody></table></div></section>{open&&<Modal title="Generate a bill" close={()=>setOpen(false)}>
<form onSubmit={create} className="modal-form">

  <label>Customer</label>
  <select
    value={form.userId}
    onChange={e => setForm({
      ...form,
      userId: e.target.value,
      meterNumber: ''
    })}
    required
  >
    <option value="">Select customer</option>
    {users.map(u => (
      <option key={u._id} value={u._id}>
        {u.name} · {u.email}
      </option>
    ))}
  </select>

  <label>Meter number</label>
  <select
    value={form.meterNumber}
    onChange={e => setForm({
      ...form,
      meterNumber: e.target.value
    })}
    required
  >
    <option value="">Select meter</option>
    {meters
  .filter(m =>
    String(m.customerId?._id || m.customerId) === String(form.userId)
  )
  .map(m => (
    <option key={m._id} value={m.meterNumber}>
      {m.meterNumber}
    </option>
  ))}
  </select>

  <label>Previous Meter Reading</label>
  <input
    type="number"
    value={previousReading}
    readOnly
  />

  <label>Current Meter Reading</label>
  <input
    type="number"
    min={previousReading}
    value={form.currentReading}
    onChange={e => setForm({
      ...form,
      currentReading: e.target.value
    })}
    required
  />

  {unitsConsumed !== null && (
    <div className="alert">
      {unitsConsumed < 0
        ? 'Current reading cannot be less than previous reading'
        : `Units Consumed: ${unitsConsumed} kWh`}
    </div>
  )}

  {estimatedAmount !== null && (
    <div className="alert">
      Estimated Bill Amount: ₹{estimatedAmount}
    </div>
  )}

  <label>Due date</label>
  <input
    type="date"
    value={form.dueDate}
    onChange={e => setForm({
      ...form,
      dueDate: e.target.value
    })}
  />

  <button
    className="primary full"
    disabled={
      !form.userId ||
      !form.meterNumber ||
      unitsConsumed === null ||
      unitsConsumed < 0
    }
  >
    Generate bill
  </button>

</form>
</Modal>}</>}
function Meters({user}){const[data,setData]=useState([]),[users,setUsers]=useState([]),[open,setOpen]=useState(false),[form,setForm]=useState({meterNumber:'',address:'',meterType:'Single Phase',customerId:''});async function load(){setData((await api.get('/meters')).data)}useEffect(()=>{load();if(user.role==='admin')api.get('/users').then(r=>setUsers(r.data))},[]);async function add(e){e.preventDefault();try{await api.post('/meters',form);setOpen(false);load()}catch(e){alert(e.response?.data?.message||'Could not add meter')}}async function assign(id,customerId){try{await api.put(`/meters/${id}/assign`,{customerId});load()}catch(e){alert('Assignment failed')}}return <><Heading tag="METER MANAGEMENT" title="Meter connections" sub="View registered meters and customer assignments." action={user.role==='admin'&&<button className="primary" onClick={()=>setOpen(true)}><Plus size={17}/> Add meter</button>}/><div className="meter-grid">{data.map(m=><div className="meter-card" key={m._id}><div className="meter-card-top"><span className="quick-icon"><Plug/></span><Status value={m.assigned?'Assigned':'Available'}/></div><span className="eyebrow">METER NUMBER</span><h2>{m.meterNumber}</h2><p>{m.address||'Address not provided'}</p><div className="meter-meta"><span>Type</span><b>{m.meterType}</b></div>{user.role==='admin'&&<div className="assign-row"><select value={m.customerId?._id||''} onChange={e=>assign(m._id,e.target.value)}><option value="">{m.assigned?'Unassigned':'Assign customer'}</option>{users.map(u=><option key={u._id} value={u._id}>{u.name}</option>)}</select></div>}{user.role==='user'&&<div className="meter-meta"><span>Connection</span><b>Active</b></div>}</div>)}{!data.length&&<div className="panel empty">No meter records found.</div>}</div>{open&&<Modal title="Register a meter" close={()=>setOpen(false)}><form className="modal-form" onSubmit={add}><label>Meter number</label><input value={form.meterNumber} onChange={e=>setForm({...form,meterNumber:e.target.value})} required/><label>Installation address</label><textarea value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/><label>Meter type</label><select value={form.meterType} onChange={e=>setForm({...form,meterType:e.target.value})}><option>Single Phase</option><option>Three Phase</option></select><button className="primary full">Save meter</button></form></Modal>}</>}
function Complaints({user}){const[data,setData]=useState([]),[open,setOpen]=useState(false),[form,setForm]=useState({requestType:'Billing issue',meterNumber:'',description:''});async function load(){setData((await api.get('/complaints')).data)}useEffect(()=>{load()},[]);async function submit(e){e.preventDefault();try{await api.post('/complaints',form);setOpen(false);setForm({requestType:'Billing issue',meterNumber:'',description:''});load()}catch(e){alert(e.response?.data?.message||'Could not submit complaint')}}async function update(id,status){await api.patch(`/complaints/${id}`,{status});load()}return <><Heading tag="CUSTOMER SUPPORT" title="Complaints & requests" sub="Raise a service request and follow its resolution." action={user.role!=='admin'&&<button className="primary" onClick={()=>setOpen(true)}><Plus size={17}/> New complaint</button>}/><section className="panel"><div className="panel-head"><div><h3>{user.role==='admin'?'Customer requests':'Your requests'}</h3><p>Track request status and updates</p></div></div><div className="table-wrap"><table><thead><tr>{user.role==='admin'&&<th>Customer</th>}<th>Request type</th><th>Meter</th><th>Description</th><th>Submitted</th><th>Status</th>{user.role==='admin'&&<th>Update</th>}</tr></thead><tbody>{data.length?data.map(c=><tr key={c._id}>{user.role==='admin'&&<td>{c.customerName||c.userId?.name}</td>}<td>{c.requestType}</td><td className="mono">{c.meterNumber||'—'}</td><td className="desc-cell">{c.description}</td><td>{date(c.createdAt)}</td><td><Status value={c.status}/></td>{user.role==='admin'&&<td><select className="status-select" value={c.status} onChange={e=>update(c._id,e.target.value)}><option>Pending</option><option>In Progress</option><option>Resolved</option></select></td>}</tr>):<tr><td colSpan="7" className="empty">No complaints submitted yet.</td></tr>}</tbody></table></div></section>{open&&<Modal title="Submit a complaint" close={()=>setOpen(false)}><form className="modal-form" onSubmit={submit}><label>Request type</label><select value={form.requestType} onChange={e=>setForm({...form,requestType:e.target.value})}><option>Billing issue</option><option>Meter fault</option><option>Payment issue</option><option>Other service request</option></select><label>Meter number (optional)</label><input value={form.meterNumber} onChange={e=>setForm({...form,meterNumber:e.target.value})}/><label>Describe the issue</label><textarea rows="4" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required/><button className="primary full"><Send size={16}/> Submit request</button></form></Modal>}</>}
function Payments(){const[data,setData]=useState([]);useEffect(()=>{api.get('/payments').then(r=>setData(r.data)).catch(()=>{})},[]);return <><Heading tag="TRANSACTION HISTORY" title="Payments" sub="A record of completed bill payments."/><section className="panel"><div className="panel-head"><div><h3>Payment history</h3><p>{data.length} transactions</p></div></div><div className="table-wrap"><table><thead><tr><th>Transaction date</th><th>Meter number</th><th>Amount</th><th>Payment method</th><th>Status</th></tr></thead><tbody>{data.length?data.map(p=><tr key={p._id}><td>{date(p.createdAt)}</td><td className="mono">{p.meterNumber}</td><td className="amount">{money(p.amount)}</td><td>{p.paymentMethod}</td><td><Status value={p.status}/></td></tr>):<tr><td colSpan="5" className="empty">No payments recorded yet.</td></tr>}</tbody></table></div></section></>}
function Customers(){const[data,setData]=useState([]);async function load(){setData((await api.get('/users')).data)}useEffect(()=>{load()},[]);async function remove(id){if(!confirm('Remove this customer account?'))return;await api.delete(`/users/${id}`);load()}return <><Heading tag="CUSTOMER DIRECTORY" title="Customers" sub="View and manage registered customer accounts."/><section className="panel"><div className="panel-head"><div><h3>Registered customers</h3><p>{data.length} customer accounts</p></div></div><div className="table-wrap"><table><thead><tr><th>Customer</th><th>Email</th><th>Contact</th><th>Address</th><th>Joined</th><th>Action</th></tr></thead><tbody>{data.map(u=><tr key={u._id}><td><b>{u.name}</b></td><td>{u.email}</td><td>{u.contact||'—'}</td><td>{u.address}</td><td>{date(u.createdAt)}</td><td><button className="danger-icon" onClick={()=>remove(u._id)} title="Remove customer"><Trash2 size={16}/></button></td></tr>)}</tbody></table></div></section></>}
function Profile(){const[form,setForm]=useState({name:'',address:'',contact:''}),[msg,setMsg]=useState('');useEffect(()=>{api.get('/me').then(r=>setForm({name:r.data.name||'',address:r.data.address||'',contact:r.data.contact||''}))},[]);async function save(e){e.preventDefault();try{await api.put('/me',form);setMsg('Profile updated successfully.');const u=JSON.parse(localStorage.getItem('user')||'{}');localStorage.setItem('user',JSON.stringify({...u,name:form.name}));}catch(e){setMsg(e.response?.data?.message||'Update failed')}}return <><Heading tag="ACCOUNT SETTINGS" title="Your profile" sub="Keep your contact information up to date."/><div className="profile-layout"><div className="profile-card"><div className="profile-avatar">{form.name[0]?.toUpperCase()||'U'}</div><h3>{form.name}</h3><p>Account information</p><div className="profile-line"><ShieldCheck size={17}/> Secure account</div></div><section className="panel profile-form"><h3>Personal information</h3><p className="muted">Update the details associated with your account.</p>{msg&&<div className="alert">{msg}</div>}<form className="modal-form" onSubmit={save}><label>Full name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/><label>Contact number</label><input value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})}/><label>Address</label><textarea value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/><button className="primary">Save changes</button></form></section></div></>}
function Audit(){const[data,setData]=useState([]);useEffect(()=>{api.get('/audit').then(r=>setData(r.data)).catch(()=>{})},[]);return <><Heading tag="SYSTEM ACTIVITY" title="Audit log" sub="Review administrative actions recorded by the system."/><section className="panel"><div className="table-wrap"><table><thead><tr><th>Timestamp</th><th>Action</th><th>Administrator</th><th>Details</th></tr></thead><tbody>{data.length?data.map(a=><tr key={a._id}><td>{date(a.timestamp)}</td><td>{a.action}</td><td>{a.adminEmail}</td><td>{a.details}</td></tr>):<tr><td colSpan="4" className="empty">No activity has been recorded yet.</td></tr>}</tbody></table></div></section></>}
function Modal({title,close,children}){return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&close()}><div className="modal"><div className="modal-head"><h3>{title}</h3><button className="icon-btn" onClick={close}><X size={19}/></button></div>{children}</div></div>}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
