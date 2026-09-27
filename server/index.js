import express from 'express';import {fetchEnka,importWishHistory,PublicError} from './services.js';
const app=express();app.disable('x-powered-by');app.use(express.json({limit:'80kb'}));
app.get('/api/enka/:uid',async(req,res)=>{try{const data=await fetchEnka(String(req.params.uid));res.set('Cache-Control',`private, max-age=${Math.max(0,Math.floor((data.expiresAt-Date.now())/1000))}`);res.json(data)}catch(e){res.set('Cache-Control','no-store');res.status(e instanceof PublicError?e.status:503).json({message:e instanceof PublicError?e.message:'Account data is temporarily unavailable.'})}});
app.post('/api/wishes/import',async(req,res)=>{res.set('Cache-Control','no-store');try{res.json(await importWishHistory(req.body?.url))}catch(e){res.status(e instanceof PublicError?e.status:502).json({message:e instanceof PublicError?e.message:'Wish history could not be fetched right now.'})}});
app.listen(3001,'0.0.0.0',()=>console.log('API server listening on 3001'));
