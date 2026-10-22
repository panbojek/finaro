import {pathToFileURL} from 'node:url';
export const minimumNode='24.22.1';
export function supportedRuntime(version=process.versions.node) {
 const match=/^(\d+)\.(\d+)\.(\d+)$/.exec(version);
 if(!match)return false;
 const [major,minor,patch]=match.slice(1).map(Number);
 return major===24 && (minor>22 || (minor===22 && patch>=1));
}
export function assertRuntime(version=process.versions.node) {
 if(!supportedRuntime(version))throw Error('Zainstaluj Node.js 24 LTS w wersji co najmniej '+minimumNode+' z nodejs.org.');
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
 try { assertRuntime(); } catch(e) { console.error(e.message);process.exitCode=1; }
}
