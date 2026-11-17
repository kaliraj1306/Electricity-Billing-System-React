import jwt from 'jsonwebtoken';
export function auth(req,res,next){try{const token=(req.headers.authorization||'').replace('Bearer ','');if(!token) return res.status(401).json({message:'Login required'});req.user=jwt.verify(token,process.env.JWT_SECRET);next();}catch{return res.status(401).json({message:'Invalid or expired session'});}}
export function adminOnly(req,res,next){if(req.user?.role!=='admin')return res.status(403).json({message:'Admin access required'});next();}
