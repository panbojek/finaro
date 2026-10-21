import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
for(const file of ['core.mjs','client.mjs']){
 const result=spawnSync(process.execPath,[fileURLToPath(new URL(file,import.meta.url))],{stdio:'inherit',windowsHide:true});
 if(result.status!==0)process.exit(result.status||1);
}
console.log('All Finaro demo tests passed. No browser visual QA is implied.');
