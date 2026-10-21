import assert from 'node:assert/strict';
import fs from 'node:fs/promises';import path from 'node:path';import os from 'node:os';
import fixture from '../demo/portfolio.json' with {type:'json'};
import {createDemoState} from '../kod/runtime/demo-seed.mjs';
import {catalog,day,validateState,productFields,series} from '../kod/runtime/catalog.mjs';
import {Store,protect} from '../kod/runtime/store.mjs';import {startServer} from '../kod/runtime/server.mjs';
let checks=0;const check=(condition,label)=>{assert.ok(condition,label);console.log('OK '+(++checks)+' '+label);};
const s=createDemoState();check(s.synthetic&&s.products.length===16&&s.history.length===13,'Entire initial portfolio is synthetic');
check(s.products.filter(p=>p.type==='ETF-y').length===4&&s.products.filter(p=>p.type==='Akcje').length===7,'Mixed portfolio and separate ETF accounts');
check(catalog.every(c=>c.symbol.startsWith('DEMO-')),'Fictional catalog only');
check(s.products.filter(p=>!p.auto).some(p=>(Date.parse(day())-Date.parse(p.updated))/86400000>=14),'Stale manual valuation example');
const shifted=createDemoState('2027-02-20');check(shifted.history.at(-1).date==='2027-02-20'&&shifted.history.at(-1).at.startsWith('2027-02-20'),'Seed dates and timestamps shift together');
check(fixture.anchor==='2026-10-20'&&fixture.products[0].added==='2026-07-28','Fixture remains unchanged');
const last=s.history.at(-1).assets,value=last.reduce((n,p)=>n+p.value,0),capital=last.reduce((n,p)=>n+p.capital,0);check(series(s.history,s.history[0].date,day()).at(-1).y===(value-capital)/capital,'Weighted portfolio percentage');
check(productFields({...s.products[0],auto:false,type:'Portu'}).type==='Portfel zarządzany','Legacy managed type accepted and normalized');
const legacy=structuredClone(s);legacy.products.find(p=>p.type==='Portfel zarządzany').type='Portu';const oldValues=legacy.products.map(p=>p.value);validateState(legacy);check(legacy.products.some(p=>p.type==='Portfel zarządzany')&&!legacy.products.some(p=>p.type==='Portu')&&JSON.stringify(legacy.products.map(p=>p.value))===JSON.stringify(oldValues),'Legacy saved state normalizes type without changing values');
assert.throws(()=>productFields({...s.products[0],capital:-1}));check(true,'Invalid capital blocked');
const dir=await fs.mkdtemp(path.join(os.tmpdir(),'finaro-demo-test-')),store=new Store(dir,async(a,b)=>b,createDemoState);
let unexpectedFetch=0;const app=await startServer({store,port:0,fetcher:async()=>{unexpectedFetch++;throw Error('External network forbidden');}});
const headers={'X-Finaro-Token':app.csrf,'Content-Type':'application/json'},post=async(action,b)=>{const r=await fetch(app.origin+'/api/'+action,{method:'POST',headers,body:JSON.stringify(b)});return {status:r.status,body:await r.json()};};
try{
 check((await store.init()).products.length===16,'Seed persists on first open');
 const page=await (await fetch(app.origin)).text();check(page.includes('DEMO · DANE SYNTETYCZNE')&&page.includes('content="demo-v1"'),'Page clearly identifies demo');
 check((await fetch(app.origin+'/api/state')).status===403,'API requires local session token');
 check((await fetch(app.origin+'/runtime/store.mjs')).status===404&&(await fetch(app.origin+'/demo/portfolio.json')).status===404,'Only intended static files served');
 const before=structuredClone(app.service.state.products.filter(p=>!p.auto));let r=await post('refresh',{revision:app.service.state.revision});
 check(r.status===200&&r.body.dataMode==='synthetic'&&unexpectedFetch===0,'Refresh uses no external network');
 check(r.body.products.filter(p=>p.auto).every(p=>p.quote.source==='synthetic'),'Quotes marked synthetic');
 check(JSON.stringify(r.body.products.filter(p=>!p.auto))===JSON.stringify(before),'Simulation leaves manual valuations unchanged');
 const priorValues=r.body.products.map(p=>p.value);r=await post('refresh',{revision:r.body.revision});check(JSON.stringify(r.body.products.map(p=>p.value))===JSON.stringify(priorValues),'Same-day simulation is deterministic');
 const p=r.body.products[0],historic=structuredClone(r.body.history);r=await post('product',{revision:r.body.revision,id:p.id,product:{...p,name:'TEST changed demo'}});
 check(r.status===200&&r.body.products[0].name==='TEST changed demo','Product editing saves');
 check(JSON.stringify(r.body.history.slice(0,historic.length))===JSON.stringify(historic),'Editing preserves historic observations');
 const bad=await post('product',{revision:0,id:p.id,product:p});check(bad.status===400,'Stale revision rejected');
 check((await post('delete',{revision:r.body.revision,id:p.id,confirm:false})).status===400,'Deletion requires explicit confirmation');
 check((await post('key',{key:'SYNTHETIC_TEST_TOKEN'})).status===400,'Demo refuses API credentials');
 const origin=await fetch(app.origin+'/api/read',{method:'POST',headers:{...headers,Origin:'https://example.com'},body:'{}'});check(origin.status===403,'Foreign origin writes blocked');
 r=await post('reset-demo',{revision:r.body.revision,confirm:true});check(r.status===200&&r.body.products[0].name!==p.name+' changed'&&r.body.products[0].name!=='TEST changed demo','Confirmed reset restores fake portfolio');
 const backups=await store.backups();check(backups.length>=3,'Writes and reset create backups');
 check((await new Store(dir,async(a,b)=>b).init()).products.length===16,'Saved state survives restart');
 const backup=await store.readBackup(backups[0]);check(!!validateState(backup),'Backup can be read and validated');
 if(process.platform==='win32'){
  const encrypted=await protect('encrypt',Buffer.from(JSON.stringify(s)));check(!encrypted.toString('utf8').includes(s.products[0].name),'DPAPI ciphertext hides names');
  const restored=JSON.parse((await protect('decrypt',encrypted)).toString('utf8'));check(restored.products.length===16,'Windows encryption roundtrip');
 }
 await fs.writeFile(store.file,'TEST_CORRUPT');const recovery=await store.init();check(!!recovery.recoveryError,'Corrupt store enters recovery without silently reseeding');
}finally{await new Promise(r=>app.server.close(r));}
console.log('PASS '+checks+' core checks; temporary synthetic store only');
