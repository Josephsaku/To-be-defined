import {cleanupData} from './cleanup.mjs';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import path from 'node:path';
import fs from 'node:fs';
import {pages,introduction} from '../content.mjs';
import {annotationTasks} from '../annotations.mjs';
const game=fileURLToPath(new URL('../',import.meta.url)),data=fs.mkdtempSync(path.join(os.tmpdir(),'pending-confirmation-test-'));
let child,base,count=0;
async function start(){child=spawn(process.execPath,['server.mjs'],{cwd:game,env:{...process.env,PORT:'0',GAME_DATA_DIR:data},stdio:['ignore','pipe','pipe']});base=await new Promise((resolve,reject)=>{let text='';child.stdout.on('data',b=>{text+=b;const m=text.match(/localhost:(\d+)/);if(m)resolve('http://127.0.0.1:'+m[1]);});child.on('error',reject);});}
async function stop(){const done=once(child,'exit');child.kill();await done;}
async function req(p,url,body,status=200){const res=await fetch(base+url,{method:body===undefined?'GET':'POST',headers:{Cookie:p.cookie||'',...(body===undefined?{}:{'Content-Type':'application/json'})},...(body===undefined?{}:{body:JSON.stringify(body)})});const value=await res.json();assert.equal(res.status,status,JSON.stringify(value));count++;if(res.headers.has('set-cookie'))p.cookie=res.headers.get('set-cookie').split(';')[0];return value;}
const act=(p,body,status)=>req(p,'/api/action',body,status);
const a={},b={};
try{
 await start();const made=await req(a,'/api/create',{name:'A',capacity:2});const joined=await req(b,'/api/join',{name:'B',code:made.room.code});await act(a,{type:'start'});
 const tasks=await req(a,'/api/doc?id=platform');assert.equal(tasks.tasks.length,3);count++;
 const box={x:.2,y:.3,w:.25,h:.4};
 for(const payload of [
  {task:'bad',answer:'none'}, {task:'D04',answer:'person',boxes:[]},
  {task:'D04',answer:'none',boxes:[box]}, {task:'D04',answer:'person',boxes:[{...box,x:-.1}]},
  {task:'D04',answer:'person',boxes:[{...box,w:1}]}, {task:'D04',answer:'person',boxes:[{...box,x:'0.2'}]},
  {task:'D04',answer:'person',boxes:Array(9).fill(box)}, {task:'D04',answer:'person',boxes:[{...box,h:.001}]},
 ])await act(a,{type:'label',...payload},400);
 await act(a,{type:'label',task:'D04',answer:'person',boxes:[box]});
 await act(b,{type:'label',task:'D04',answer:'none',boxes:[]});
 await act(a,{type:'label',task:'S08',answer:'person',boxes:[{x:0,y:0,w:1,h:1}]});
 const before=await req(b,'/api/state');
 assert.deepEqual(before.annotations[made.player.id].D04.boxes,[box]);count++;
 assert.equal(before.annotations[joined.player.id].D04.answer,'none');count++;
 assert.equal(before.annotations[made.player.id].S08.boxes[0].w,1);count++;
 await stop();await start();const after=await req(a,'/api/state');assert.deepEqual(after.annotations,before.annotations);count++;
 const assets=new Set(['close-change','ending-found','ending-substitute','ending-spread']);
 for(const p of Object.values(pages)){if(p.image)assets.add(p.image);for(const im of p.images||[])assets.add(im.name);}
 for(const t of annotationTasks){assets.add(t.image);assets.add(t.resultImage);}
 assert.equal(assets.size,20);count++;
 for(const name of assets){const res=await fetch(base+'/assets/'+name+'.jpg');assert.equal(res.status,200,name);assert.match(res.headers.get('content-type'),/image\/jpeg/);assert((await res.arrayBuffer()).byteLength>10000);count+=3;}
 assert(!('objective' in introduction));count++;
 const app=await (await fetch(base+'/app.js')).text();assert(!app.includes('含两处短促异常画面'));count++;
 assert.equal((await fetch(base+'/annotator.js')).status,200);count++;
 assert.equal((await fetch(base+'/annotations.mjs')).status,404);count++;
 console.log(`PASS ${count} annotation and asset checks: validation, independent players, multiple images, persistence, 20 live JPEGs, removed text.`);
 
}finally{if(child?.exitCode===null)await stop();cleanupData(data);}
