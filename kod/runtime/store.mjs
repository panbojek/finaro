import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {emptyState,validateState} from './catalog.mjs';
export function protect(action,bytes){return new Promise((resolve,reject)=>{
 const child=spawn('powershell.exe',['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',fileURLToPath(new URL('./dpapi.ps1',import.meta.url))],{windowsHide:true,stdio:['pipe','pipe','pipe']});let out='';
 child.stdout.on('data',b=>out+=b);child.stderr.resume();child.on('error',()=>reject(Error('Nie można uruchomić lokalnego szyfrowania Windows.')));child.on('close',code=>code===0?resolve(Buffer.from(out.trim(),'base64')):reject(Error('Nie można odczytać lub zabezpieczyć danych dla tego konta Windows.')));
 child.stdin.on('error',()=>{});child.stdin.end(JSON.stringify({action,data:bytes.toString('base64')}));
});}
export class Store{
 constructor(dir,codec=protect,seed=null,io=fs){this.io=io;this.dir=path.resolve(dir);this.codec=codec;this.seed=seed;this.file=path.join(this.dir,'portfolio.enc');}
 async init(){await this.io.mkdir(path.join(this.dir,'backups'),{recursive:true});try{return validateState(JSON.parse((await this.codec('decrypt',await this.io.readFile(this.file))).toString('utf8')));}catch(e){if(e.code==='ENOENT'){const s=this.seed?this.seed():emptyState();if(this.seed)await this.save(s);return s;}return {...emptyState(),recoveryError:'Nie można otworzyć danych. Zapis jest zablokowany. Przywróć kopię w Ustawieniach.'};}}
 async save(state) {
  validateState(state);
  const bytes=await this.codec('encrypt',Buffer.from(JSON.stringify(state)));
  const temp=this.file+'.'+randomUUID()+'.tmp';
  let owned=false,handle;
  try {
   handle=await this.io.open(temp,'wx',0o600);owned=true;
   await handle.writeFile(bytes);await handle.sync();await handle.close();handle=null;
   try { await this.io.copyFile(this.file,path.join(this.dir,'backups',Date.now()+'-'+randomUUID()+'.enc')); }
   catch(e) {
    if(e.code!=='ENOENT')throw Error('Nie udało się utworzyć kopii. Zapis zatrzymany.');
    // ENOENT may mean a missing destination directory, not a first save.
    let firstSave=false;
    try { await this.io.stat(this.file); } catch(missing) { if(missing.code==='ENOENT')firstSave=true; }
    if(!firstSave)throw Error('Nie udało się utworzyć kopii. Zapis zatrzymany.');
   }
   await this.io.rename(temp,this.file);
  } finally {
   if(handle)await handle.close().catch(()=>{});
   if(owned)await this.io.unlink(temp).catch(()=>{});
  }
 }
 async backups(){return (await this.io.readdir(path.join(this.dir,'backups'))).filter(n=>/^\d+-[a-f0-9-]+\.enc$/.test(n)).sort().reverse();}
 async readBackup(name){if(!/^\d+-[a-f0-9-]+\.enc$/.test(name))throw Error('Nieprawidłowa kopia.');return validateState(JSON.parse((await this.codec('decrypt',await this.io.readFile(path.join(this.dir,'backups',name)))).toString('utf8')));}
}
