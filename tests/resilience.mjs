import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {Store} from '../kod/runtime/store.mjs';
import {createDemoState} from '../kod/runtime/demo-seed.mjs';
import {validateState,day} from '../kod/runtime/catalog.mjs';
import {startServer} from '../kod/runtime/server.mjs';
import {supportedRuntime} from '../kod/runtime/runtime-version.mjs';
let checks=0;const check=(ok,label)=>{assert.ok(ok,label);console.log('OK '+(++checks)+' '+label)};
const fixture=createDemoState();
const invalid=[
 ['negative revision',s=>s.revision=-1],['unsafe revision',s=>s.revision=Number.MAX_SAFE_INTEGER+1],
 ['null alert',s=>s.alerts.push(null)],['duplicate alert',s=>s.alerts.push(s.alerts[0])],
 ['invalid alert URL',s=>s.alerts[0].url='javascript:alert(1)'],['nonboolean read status',s=>s.alerts[0].read=1],
 ['invalid dividend',s=>s.alerts.find(a=>a.type==='dividend').dividend.perShare=-1],
 ['invalid event date',s=>s.alerts[0].eventDate='2026-02-30'],
 ['history without id',s=>delete s.history[0].assets[0].id],['duplicate history id',s=>s.history[0].assets.push(s.history[0].assets[0])],
 ['history without timestamp',s=>delete s.history[0].at],['invalid product quote',s=>s.products[0].quote.close=-1],
 ['invalid exchange rate',s=>s.fx.USD={rate:-1,date:day()}],['invalid cached quote',s=>s.quotes.TEST={close:'bad'}],
 ['invalid rule',s=>s.rules.threshold=NaN],['invalid watch list',s=>s.watch.push(null)],
 ['invalid last check',s=>s.lastCheck={at:'bad',messages:[]}],['nontext product name',s=>s.products[0].name=123]
];
for(const [label,mutate] of invalid){const s=structuredClone(fixture);mutate(s);assert.throws(()=>validateState(s));check(true,'Reject '+label)}
const deleted=structuredClone(fixture);deleted.products.shift();check(!!validateState(deleted),'Deleted product history remains valid');
check(supportedRuntime('24.22.1')&&supportedRuntime('24.23.0')&&!supportedRuntime('24.16.0')&&!supportedRuntime('24.22.0')&&!supportedRuntime('25.0.0'),'Runtime compatibility bounds');
const versionScript=fileURLToPath(new URL('../kod/runtime/runtime-version.mjs',import.meta.url));
check(spawnSync(process.execPath,[versionScript],{windowsHide:true}).status===0,'Launcher version command succeeds on patched Node');
const dir=await fs.mkdtemp(path.join(os.tmpdir(),'finaro-resilience-'));
let failure=null;
const io={...fs,open:async(...args)=>{
 const handle=await fs.open(...args);
 if(failure!=='write')return handle;
 return {writeFile:async bytes=>{await handle.writeFile(bytes.subarray(0,10));throw Error('Injected partial write')},sync:()=>handle.sync(),close:()=>handle.close()};
},copyFile:async(...args)=>{if(failure==='backup')throw Error('Injected backup failure');return fs.copyFile(...args)},rename:async(...args)=>{if(failure==='rename')throw Error('Injected rename failure');return fs.rename(...args)}};
const store=new Store(dir,async(a,b)=>{if(failure==='encrypt')throw Error('Injected encryption failure');return b},createDemoState,io);
const app=await startServer({port:0,store,fetcher:async()=>{throw Error('Network forbidden')}});
const headers={'X-Finaro-Token':app.csrf,'Content-Type':'application/json'};
const post=async(action,body)=>{const r=await fetch(app.origin+'/api/'+action,{method:'POST',headers,body:JSON.stringify(body)});return {status:r.status,body:await r.json()}};
const state=async()=>{const r=await fetch(app.origin+'/api/state',{headers});assert.equal(r.status,200);return r.json()};
try {
 const malformed=await new Promise((resolve,reject)=>{
  const req=http.request(app.origin,{path:'http://[',headers:{Host:new URL(app.origin).host}},res=>{res.resume();res.on('end',()=>resolve(res.statusCode))});req.on('error',reject);req.end();
 });
 check(malformed===400,'Malformed request without token returns 400');
 check((await state()).products.length===16,'Server survives malformed request');
 const originalView=app.service.view;app.service.view=()=>{throw Error('Injected view failure')};
 const broken=await fetch(app.origin+'/api/state',{headers});check(broken.status===500,'Unhandled view error is contained');app.service.view=originalView;
 check((await state()).products.length===16,'Server survives view failure');
 check((await post('refresh',null)).status===400,'Null request body returns 400');
 const beforeRefresh=await state();const first=await post('refresh',{revision:beforeRefresh.revision});assert.equal(first.status,200);
 const bytes=await fs.readFile(store.file),backups=await store.backups(),revision=first.body.revision,history=first.body.history.length;
 for(let i=0;i<3;i++)assert.equal((await post('refresh',{revision})).status,200);
 check((await state()).revision===revision&&(await state()).history.length===history,'Repeated same-day refresh keeps revision and history');
 check((await store.backups()).length===backups.length&&Buffer.compare(bytes,await fs.readFile(store.file))===0,'No-op refresh produces no write or backup');
 // New reminders must persist even when all quotes are unchanged.
 app.service.state.alerts.push({id:'test-due',companyId:app.service.state.products[0].symbol,type:'dividend',title:'TEST',text:'TEST',time:'TEST',sourceName:'TEST',url:'',read:false,dividend:{status:'approved',perShare:1,currency:'PLN',recordDate:day(),paymentDate:null,exDate:null}});
 const reminder=await post('refresh',{revision});check(reminder.status===200&&reminder.body.alerts.some(a=>a.id.startsWith('dividend-reminder:test-due:'))&&reminder.body.revision>revision,'New reminder persists despite unchanged quotes');
 const before=await state(),p=before.products[0];
 await post('product',{revision:before.revision,id:p.id,product:{...p,name:'TEST changed'}});
 const backupName=(await store.backups())[0];
 check((await post('restore',{revision:(await state()).revision,name:backupName,confirm:false})).status===400,'Restore requires confirmation');
 check((await post('restore',{revision:-1,name:backupName,confirm:true})).status===400,'Restore rejects stale revision');
 const changed=await state();const restored=await post('restore',{revision:changed.revision,name:backupName,confirm:true});
 check(restored.status===200&&restored.body.products[0].name===p.name,'Restore API restores products');
 check(JSON.stringify(restored.body.history)===JSON.stringify(before.history)&&JSON.stringify(restored.body.alerts)===JSON.stringify(before.alerts)&&JSON.stringify(restored.body.rules)===JSON.stringify(before.rules),'Restore API restores history alerts and settings');
 const restoreBackups=await store.backups();
 const snapshots=await Promise.all(restoreBackups.map(n=>store.readBackup(n)));
 check(snapshots.some(s=>s.products[0].name==='TEST changed'),'Restore preserves outgoing state in backup');
 const reopened=await new Store(dir,async(a,b)=>b).init();check(reopened.products[0].name===p.name&&JSON.stringify(reopened.history)===JSON.stringify(before.history),'Restored state survives reload');
 const badName='1000000000000-aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa.enc';
 const bad=structuredClone(before);bad.alerts.push(null);await fs.writeFile(path.join(dir,'backups',badName),JSON.stringify(bad));
 const safeBytes=await fs.readFile(store.file),safeState=JSON.stringify(app.service.state);
 check((await post('restore',{revision:app.service.state.revision,name:badName,confirm:true})).status===400,'Invalid backup rejected by restore API');
 check(Buffer.compare(safeBytes,await fs.readFile(store.file))===0&&safeState===JSON.stringify(app.service.state),'Rejected restore leaves disk and memory unchanged');
 for(const kind of ['encrypt','write','backup','rename']) {
  failure=kind;const current=await state();const old=await fs.readFile(store.file),oldMemory=JSON.stringify(app.service.state);
  const result=await post('product',{revision:current.revision,id:p.id,product:{...current.products[0],name:'TEST must not save'}});
  check(result.status===400&&Buffer.compare(old,await fs.readFile(store.file))===0&&oldMemory===JSON.stringify(app.service.state),'Failed '+kind+' preserves disk and memory');
  check(!(await fs.readdir(dir)).some(n=>n.endsWith('.tmp')),'Failed '+kind+' removes owned temporary file');failure=null;
 }
 const backupDir=path.join(dir,'backups'),held=path.join(dir,'backups-held');await fs.rename(backupDir,held);
 try {const r=await post('valuation',{revision:app.service.state.revision,id:p.id,value:9999});check(r.status===400&&Buffer.compare(safeBytes,await fs.readFile(store.file))===0,'Missing backup directory cannot overwrite existing portfolio');}
 finally{await fs.rename(held,backupDir)}
 const next=await post('valuation',{revision:app.service.state.revision,id:p.id,value:3456});check(next.status===200,'Server and write queue recover after failures');
 // A new day must still add history, even with exclusively manual positions.
 app.service.state.products.forEach(p=>{p.auto=false;p.quote=null});
 const yesterday=new Date(Date.parse(day())-86400000).toISOString().slice(0,10);app.service.state.history.at(-1).date=yesterday;
 const count=app.service.state.history.length;await post('refresh',{revision:app.service.state.revision});
 check(app.service.state.history.length===count+1,'New-day manual portfolio gets an observation');
} finally {app.server.closeAllConnections();await new Promise(r=>app.server.close(r))}
console.log('PASS '+checks+' resilience checks; synthetic temporary data only');
