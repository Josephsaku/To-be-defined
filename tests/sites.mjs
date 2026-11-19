import {cleanupData} from './cleanup.mjs';
import fs from 'node:fs';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import path from 'node:path';
import {pages,forumOrder} from '../content.mjs';
const game=fileURLToPath(new URL('../',import.meta.url));
const data=fs.mkdtempSync(path.join(os.tmpdir(),'pending-confirmation-test-'));
let count=0;
const parents=new Map(Object.keys(pages).map(k=>[k,[]]));
for(const id of forumOrder)parents.get(id).push('forum-list');
for(const [id,p] of Object.entries(pages))for(const [target] of p.links||[]){assert(pages[target],target);parents.get(target).push(id);count++;}
for(const id of ['hospital','school','warehouse'])parents.get(id).push('archive-directory');
for(const [id,refs] of parents){assert.equal(refs.length,1,`${id}: ${refs}`);count++;}
const visited=new Set();function walk(id){if(visited.has(id))return;visited.add(id);for(const [target] of pages[id].links||[])walk(target);if(id==='archive')for(const target of ['hospital','school','warehouse'])walk(target);}
forumOrder.forEach(walk);assert.equal(visited.size,Object.keys(pages).length);count++;
const child=spawn(process.execPath,['server.mjs'],{cwd:game,env:{...process.env,PORT:'0',GAME_DATA_DIR:data},stdio:['ignore','pipe','pipe']});
try{
 const base=await new Promise((resolve,reject)=>{let out='';child.stdout.on('data',b=>{out+=b;const m=out.match(/localhost:(\d+)/);if(m)resolve('http://127.0.0.1:'+m[1]);});child.on('error',reject);});
 const folders={forum:'forum',platform:'workbench',archive:'pickup',mail:'mail'};
 for(const [id,p] of Object.entries(pages)){
   const r=await fetch(base+'/'+folders[p.site]+'/'+id);assert.equal(r.status,200,id);assert.match(r.headers.get('content-type'),/text\/html/);count+=2;
 }
 for(const p of ['/start','/forum','/forum/search?q=17B','/sites.js','/sites.css','/endings.js','/endings.css','/pickup.js','/pickup.css']){assert.equal((await fetch(base+p)).status,200);count++;}
 for(const p of ['/unknown/absent','/forum/hospital','/archive/complaint','/extra-content.mjs','/story-copy.mjs','/forum-conversations.mjs']){assert.equal((await fetch(base+p)).status,404);count++;}
 for(const [old,next] of [['/archive/dispatch','/pickup/dispatch'],['/archive/voice','/workbench/voice']]){const response=await fetch(base+old,{redirect:'manual'});assert.equal(response.status,302);assert.equal(response.headers.get('location'),next);count+=2;}
 const created=await fetch(base+'/api/create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'routes',capacity:1})});const cookie=created.headers.get('set-cookie').split(';')[0];
 const search=await (await fetch(base+'/api/search?q=F3271',{headers:{Cookie:cookie}})).json();assert(!search.results.some(p=>p.id==='dispatch'));count++;
 console.log(`PASS ${count} checks: ${Object.keys(pages).length} reachable pages, single discovery parent, native routes, wrong-site 404, no search bypass.`);
}finally{const done=once(child,'exit');child.kill();await done;cleanupData(data);}
