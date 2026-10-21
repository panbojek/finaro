import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes} from 'node:crypto';
import {Store} from './store.mjs';
import {DemoService as Service} from './demo-service.mjs';
import {createDemoState} from './demo-seed.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
export async function startServer({dir,port=47832,store=null,fetcher=fetch}={}){
 if(!store){if(process.platform!=='win32')throw Error('Ta wersja korzysta z ochrony danych Windows.');store=new Store(dir||path.join(process.env.LOCALAPPDATA,'FinaroDemo','demo-v1'),undefined,createDemoState);}
 const service=new Service(store,await store.init(),fetcher);await service.syncKey();const csrf=randomBytes(32).toString('hex');let queue=Promise.resolve(),origin;
 const staticFiles={'/':'index.html','/dashboard.js':'dashboard.js','/live.js':'live.js','/export.js':'export.js','/assets/finaro-logo-v2.png':'assets/finaro-logo-v2.png'};
 const server=http.createServer(async(req,res)=>{
  const json=(code,data)=>{res.writeHead(code,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data));};
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
  if(req.headers.host!==new URL(origin).host)return json(403,{error:'Niedozwolony adres aplikacji.'});
  const url=new URL(req.url,origin);
  if(url.pathname.startsWith('/api/')){
   if(req.headers['x-finaro-token']!==csrf||(req.headers.origin&&req.headers.origin!==origin))return json(403,{error:'Otwórz aplikację przez lokalny skrót Finaro.'});
   if(req.method==='GET'&&url.pathname==='/api/state')return json(200,service.view());
   if(req.method==='GET'&&url.pathname==='/api/backups'){try{return json(200,{backups:await store.backups()});}catch{return json(500,{error:'Nie można odczytać listy kopii.'});}}
   if(req.method!=='POST')return json(405,{error:'Nieobsługiwana czynność.'});
   let raw='';try{for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>1024*1024)throw Error('Za duże żądanie.');}}catch{return json(413,{error:'Za duże żądanie.'});}
   let b;try{b=JSON.parse(raw);}catch{return json(400,{error:'Nieprawidłowe dane.'});}
   const run=async()=>{try{
    const action=url.pathname.slice(5);let result;
    if(action==='stop'){json(200,{stopped:true});setTimeout(()=>server.close(),100).unref();return;}
    if(action==='refresh')result=await service.refresh({retry:b.retry===true});
    else if(action==='key'){throw Error('Nie można zapisać klucza w wersji demo. Dane są symulowane.');}else if(action==='restore'){
     if(!b.confirm||b.revision!==service.state.revision)throw Error('Potwierdź przywrócenie kopii i odśwież stan.');const s=await store.readBackup(b.name);s.hasKey=false;await service.commit(s);result=service.view();
    }else result=await service.change(action,b);
    json(200,result);
   }catch(e){const known=/^(Uzupełnij|Podaj|Nieprawidłow|Sprawdź|Dla automatu|Nie znaleziono|Dane zmieniły|Usunięcie|Próg|Wybierz|Potwierdź|Wpisz|Nie udało|Nie można|Uszkodzon)/.test(e.message);json(400,{error:known?e.message:'Nie udało się wykonać czynności. Zachowano poprzedni stan.'});}};
   queue=queue.then(run,run);return;
  }
  if(req.method!=='GET'||!staticFiles[url.pathname])return json(404,{error:'Nie znaleziono.'});
  try{let bytes=await fs.readFile(path.join(root,staticFiles[url.pathname]));if(url.pathname==='/')bytes=Buffer.from(bytes.toString('utf8').replace('<head>','<head><meta name="finaro-token" content="'+csrf+'">'));
   res.setHeader('Content-Type',url.pathname.endsWith('.png')?'image/png':url.pathname.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8');res.end(bytes);
  }catch{json(500,{error:'Brak plików aplikacji.'});}
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});origin='http://127.0.0.1:'+server.address().port;
 return {server,service,origin,csrf};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 try{const {origin}=await startServer();console.log('FINARO_LOCAL_URL='+origin);}catch(e){console.error(e.code==='EADDRINUSE'?'Finaro jest już uruchomione. Otwórz http://127.0.0.1:47832':'Finaro nie wystartowało. '+e.message);process.exitCode=1;}
}
