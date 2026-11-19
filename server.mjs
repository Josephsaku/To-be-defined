import {plainText} from './story-copy.mjs';
import {caseCredentials} from './dark-case.mjs';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {pages,evidence,introduction,forumOrder,hints} from './content.mjs';
import {annotationTasks,validateAnnotation} from './annotations.mjs';
const root=path.dirname(fileURLToPath(import.meta.url)), dataDir=process.env.GAME_DATA_DIR||path.join(root,'data');
fs.mkdirSync(dataDir,{recursive:true}); const saveFile=path.join(dataDir,'rooms.json');
const rooms=fs.existsSync(saveFile)?JSON.parse(fs.readFileSync(saveFile,'utf8')):{};
for(const r of Object.values(rooms))if(r.scene?.at&&!r.scene.acks.length)r.scene.at=null;
for(const r of Object.values(rooms))r.pickupAccess??=Boolean(r.unlocked||r.discoveries?.some(d=>['dispatch','archive'].includes(d.id))||r.players.some(p=>p.seen?.includes('dispatch')));
const live=new Map(),presence=new Map();
function readyPlayer(p){return [...(presence.get(p.id)?.entries()||[])].some(([tab,a])=>a.visible&&a.assets&&Date.now()-a.time<12000&&[...(live.get(p.id)||[])].some(res=>res.gameTab===tab));}
function lanAddresses(port){return Object.entries(os.networkInterfaces()).flatMap(([name,items])=>
  /vmware|virtualbox|vethernet|docker|loopback|tailscale|zerotier|clash|tun/i.test(name)?[]:
  items.filter(a=>a.family==='IPv4'&&!a.internal&&!a.address.startsWith('198.18.')&&!a.address.startsWith('198.19.')&&!a.address.startsWith('169.254.')).map(a=>({name,url:'http://'+a.address+':'+port}))
);}
const id=()=>crypto.randomBytes(18).toString('hex');
const error=(message,status=400)=>{throw Object.assign(new Error(message),{status});};
const clean=(v,n=100)=>String(v??'').trim().slice(0,n);
function save(){fs.writeFileSync(saveFile+'.tmp',JSON.stringify(rooms));fs.renameSync(saveFile+'.tmp',saveFile);}
function active(p){return Boolean(live.get(p.id)?.size);}
function snapshot(r){return {code:r.code,capacity:r.capacity,host:r.host,started:r.started,phase:r.phase,players:r.players.map(p=>({id:p.id,name:p.name,online:active(p)})),evidence:r.evidence.map(e=>evidence[e]),discoveries:r.discoveries.map(d=>({...d,title:pages[d.id]?.title||plainText(d.title),from:plainText(d.from)})),notes:r.notes,events:r.events.slice(-30).map(e=>({...e,message:plainText(e.message)})),unlocked:r.unlocked,pickupAccess:Boolean(r.pickupAccess),labeled:r.labeled,accountStage:r.accountStage||0,handoffSealed:Boolean(r.handoffSealed),annotations:r.annotations||{},mapped:r.mapped,scene:r.scene,sceneHistory:r.sceneHistory,report:r.report,signatures:r.signatures,feedback:r.feedback,ending:r.ending,hint:plainText(caseHint(r)),hintLevel:r.hintLevel,startedAt:r.startedAt,serverTime:Date.now()};}
function push(r){const packet='event: state\ndata: '+JSON.stringify(snapshot(r))+'\n\n';for(const p of r.players)for(const res of live.get(p.id)||[])res.write(packet);}
function event(r,p,message,source){r.events.push({id:id(),by:p?.name||'站内通知',message,source,at:Date.now()});r.events=r.events.slice(-80);}
function auth(req){const token=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('pending_session='))?.slice(16);for(const r of Object.values(rooms)){const p=r.players.find(p=>p.token===token);if(p)return{r,p};}error('先登录房间。',401);}
function hasAccess(r,page){return !page.access||(page.access==='pickup'?r.pickupAccess:r.accountStage===2);}
function readable(r,page){return (page.minPhase||0)<=r.phase&&hasAccess(r,page);}
function available(r,key){const page=pages[key];if(!page)error('没有这个页面。',404);if((page.minPhase||0)>r.phase)error('这份附件尚未开放。',403);if(!hasAccess(r,page))error(page.access==='pickup'?'先在长桥图文查询本单，再打开文件。':'账户验证尚未完成。',403);return page;}
function caseHint(r){if(!r.hintLevel)return '';const n=r.hintLevel-1;
 if((r.accountStage||0)<2&&r.discoveries.some(d=>d.id==='account'))return ['登录名与旧号码在空罐头补传的维修单里；密码也和这张单子有关。','手机号缺的四位在他旧机交易帖里。网名拼音首字母kgt删掉中间的g，再接维修单入店日期。','账号lq0317，密码kt20090514；登记手机号13968054062。'][n];
 if(r.unlocked&&!r.sceneHistory.includes('preview'))return ['回到空罐头的讨薪帖，比较他的截图、结算记录和分图网退回的图。','帖子里的分图网入口可以试着交一次标注。原图没人的话，直接交空图。','打开讨薪帖和结算截图，到分图网提交一张标注，等同伴一起看到退回的预览。'][n];
 if(!r.pickupAccess)return ['老周在论坛发过取件网址，罗启的结算截图旁边留了查单回执。','先看长桥图文的营业通知。取件站查订单号和联系人；文件密码另看扫描日期。','订单3271，联系人罗启；扫描日期8月14日，文件密码32710814。'][n];
 if(r.phase>=2&&!r.handoffSealed)return ['来源分清了，代领申请还没取消。再看看罗启最后补传的照片。','从账户操作记录找到最后补传，再看他贴出的代领申请。','代领人是罗岚。填她的名字取消代领，再把三处地方分开，停用改过的图。'][n];
 return hints[Math.min(r.phase,2)][n];}

function maybeArm(r){if(r.ending||r.scene)return;if(r.labeled&&r.discoveries.some(d=>d.id==='complaint')&&r.discoveries.some(d=>d.id==='settlement')&&!r.sceneHistory.includes('preview'))r.scene={id:'preview',at:null,acks:[]};else if(r.sceneHistory.includes('preview')&&r.mapped&&r.evidence.includes('E07')&&r.evidence.includes('E09')&&!r.sceneHistory.includes('close'))r.scene={id:'close',at:null,acks:[]};}
function schedule(r){if(!r.scene||r.scene.at)return;const ready=r.players.length===r.capacity&&r.players.every(readyPlayer);if(ready){r.scene.at=Date.now()+1800;save();push(r);}}
function completeScene(r){if(!r.scene||r.scene.acks.length!==r.capacity)return;const name=r.scene.id;r.sceneHistory.push(name);r.scene=null;if(name==='close'){r.phase=2;r.hintLevel=0;event(r,null,'同组照片的旧工单附件已找回。','restriction');}save();push(r);}
function update(r,p,b){
 if(b.type==='soloStart'){if(r.host!==p.id||r.started||r.players.length!==1)error('只有独自在等待中的房主可以单人开始。');r.capacity=1;r.started=true;r.startedAt=Date.now();return;}
 if(b.type==='capacity'){if(r.host!==p.id||r.started)error('只有房主能在开始前修改人数。');if(![2,3].includes(b.value)||b.value<r.players.length)error('人数不匹配。');r.capacity=b.value;return;}
 if(b.type==='start'){if(r.host!==p.id)error('等房主开始。');if(r.players.length!==r.capacity)error('人还没到齐。');if(!r.started){r.started=true;r.startedAt=Date.now();}return;}
 if(!r.started)error('房间尚未开始。');
 if(b.type==='presence'){const tab=clean(b.tab,80)||'legacy';if(!presence.has(p.id))presence.set(p.id,new Map());const tabs=presence.get(p.id);for(const [key,a]of tabs)if(Date.now()-a.time>12000)tabs.delete(key);tabs.set(tab,{visible:b.visible===true,assets:b.assets===true,time:Date.now()});schedule(r);return;}
 if(b.type==='sceneAck'){if(r.scene?.id===b.id&&r.scene.at&&Date.now()>=r.scene.at){if(!r.scene.acks.includes(p.id))r.scene.acks.push(p.id);completeScene(r);}return;}
 if(b.type==='collect'){const e=evidence[b.id];if(!e)error('没有这份资料。');available(r,e.source);if(!p.seen.includes(e.source))error('先打开原文。');if(!r.evidence.includes(b.id)){r.evidence.push(b.id);event(r,p,'收藏了「'+e.title+'」',e.source);}return;}
 if(b.type==='note'){const body=clean(b.body,1500);if(!body)error('笔记还是空的。');if(r.notes.length>=100)error('笔记已满。');r.notes.push({id:id(),by:p.name,body});return;}
 if(b.type==='hint'){r.hintLevel=Math.min(3,r.hintLevel+1);return;}
 if(b.type==='rewind'&&['spread','substitute'].includes(r.ending)){r.ending=null;r.report=null;r.signatures=[];r.feedback='';return;}
 if(r.ending)error('这份记录已归档。');
 if(b.type==='pickupLookup'){if(!p.seen.includes('pickup'))error('先打开取件页。');if(clean(b.order)!=='3271'||clean(b.name)!=='罗启')error('订单号或联系人对不上，照回执再看一下。');r.pickupAccess=true;r.hintLevel=0;event(r,p,'查到了长桥图文的订单3271。','pickup');return;}
 if(b.type==='accountLogin'){if(!p.seen.includes('account'))error('先打开账户登录页。');if(clean(b.account).toLowerCase()!==caseCredentials.account||clean(b.password)!==caseCredentials.password)error('通行证名或密码不匹配。');r.accountStage=Math.max(1,r.accountStage||0);r.hintLevel=0;event(r,p,'完成了通行证登录。','account');return;}
 if(b.type==='accountPhone'){if((r.accountStage||0)<1)error('先完成通行证登录。');if(clean(b.phone).replace(/[\s-]/g,'')!==caseCredentials.phone)error('号码与旧登记不一致。');r.accountStage=2;r.hintLevel=0;event(r,p,'打开了分图网账户记录。','account');return;}
 if(b.type==='seal'){available(r,'sealing');if(!p.seen.includes('returnledger'))error('先查看本单代领申请。');if(!['罗岚',caseCredentials.release].includes(clean(b.code).toUpperCase()))error('名字对不上。看看本单登记的代领人。');r.handoffSealed=true;r.hintLevel=0;event(r,p,'取消了罗岚的代领申请。','sealing');return;}
 if(b.type==='label'){let record;try{record=validateAnnotation(b);}catch(e){error(e.message);}r.annotations||={};r.annotations[p.id]||={};r.annotations[p.id][record.task]=record;r.labeled=true;event(r,p,'提交了17-B / '+record.task+' 标注。','platform');return;}
 if(b.type==='unlock'){available(r,'archive');if(!p.seen.includes('archive'))error('先打开本单扫描文件。');if(clean(b.password).replace(/[\s-]/g,'')!=='32710814')error('密码不对。订单后四位，再接扫描的月份和日期，各两位。');r.unlocked=true;r.phase=Math.max(r.phase,1);r.hintLevel=0;event(r,p,'打开了8月14日扫描件，全组可以查阅。','archive');return;}
 if(b.type==='map'){if(!r.unlocked)error('先核对原片。');if(b.D04!=='hospital'||b.S08!=='school'||b.W10!=='warehouse')error('来源对应不上。再对照原片上的拍摄单位。');r.mapped=true;event(r,p,'完成了三组原片的来源核对。','sources');return;}
 if(b.type==='report'){if(r.phase<2)error('还缺封存附件。');const wanted=['E04','E05','E06','E07','E08','E09','E10','E11'];if(!wanted.every(k=>r.evidence.includes(k)))error('还缺资料：三处地方的原片、参考答案的修改记录、旧工单处理记录、罗启留言、最后补传的照片和代领申请。');if(!['warehouse','school','hospital'].includes(b.location)||!['quarantine','publish','delete'].includes(b.decision)||!['feedback','clock','prank'].includes(b.cause))error('回信有空项。');r.report={location:b.location,decision:b.decision,cause:b.cause,text:clean(b.text,2000),by:p.name};r.signatures=[p.id];r.feedback='';finishReport(r);return;}
 if(b.type==='sign'){if(!r.report)error('还没有草稿。');if(!r.signatures.includes(p.id))r.signatures.push(p.id);finishReport(r);return;}
 if(b.type==='unsign'){r.signatures=r.signatures.filter(x=>x!==p.id);return;}
 if(b.type==='reconsider'){r.report=null;r.signatures=[];r.feedback='';return;}
 error('无法执行这个操作。');
}
function finishReport(r){if(r.signatures.length!==r.capacity)return;const p=r.report;if(p.location!=='warehouse')r.feedback='去向还对不上：再看出库单和罗启留言。';else if(p.cause!=='feedback')r.feedback='复核记录并不能支持这个原因。';else if(p.decision==='delete')r.feedback='停用登记记载，单独删除图片不能解除对应关系。';else{r.ending=p.decision==='quarantine'?(r.handoffSealed?'found':'substitute'):'spread';event(r,null,'回信已发出。','ending');return;}r.signatures=[];}
function json(res,status,data,headers={}){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers});res.end(JSON.stringify(data));}
async function body(req){let s='';for await(const c of req){s+=c;if(s.length>18000)error('内容过长。',413);}try{return JSON.parse(s||'{}');}catch{error('格式不正确。');}}
const server=http.createServer(async(req,res)=>{res.setHeader('X-Content-Type-Options','nosniff');try{
 const u=new URL(req.url,'http://localhost');
 if(req.method==='POST'){if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)error('从游戏页面操作。',403);if(!req.headers['content-type']?.includes('application/json'))error('格式不正确。',415);}
 if(u.pathname==='/api/session'){try{const{r,p}=auth(req);return json(res,200,{room:snapshot(r),player:{id:p.id,name:p.name},intro:introduction});}catch{return json(res,200,{room:null,player:null,intro:introduction});}}
 if(['/api/create','/api/join'].includes(u.pathname)&&req.method==='POST'){
  const b=await body(req),solo=u.pathname==='/api/create'&&b.mode==='solo',name=clean(b.name,20)||(solo?'访客':'');if(!name)error('填个昵称。');let r;
  if(u.pathname==='/api/create'){let code;do{code=crypto.randomBytes(3).toString('hex').toUpperCase();}while(rooms[code]);r={code,capacity:solo?1:([1,2,3].includes(b.capacity)?b.capacity:3),host:null,players:[],started:solo,startedAt:solo?Date.now():undefined,phase:0,evidence:[],discoveries:[],notes:[],events:[],unlocked:false,pickupAccess:false,labeled:false,mapped:false,scene:null,sceneHistory:[],report:null,signatures:[],feedback:'',ending:null,hintLevel:0};rooms[code]=r;}
  else{r=rooms[clean(b.code).toUpperCase()];if(!r)error('房间码不对。',404);if(r.started||r.players.length>=r.capacity)error('房间已开始或已满员。');}
  if(r.players.some(p=>p.name===name))error('昵称有人用了。');const p={id:id(),token:id(),name,seen:[]};r.players.push(p);r.host||=p.id;save();push(r);return json(res,200,{room:snapshot(r),player:{id:p.id,name}}, {'Set-Cookie':`pending_session=${p.token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=2592000`});
 }
 if(u.pathname==='/api/network')return json(res,200,{addresses:lanAddresses(server.address().port).map(a=>a.url)});
 if(u.pathname==='/api/events'){
  const{r,p}=auth(req);res.gameTab=clean(u.searchParams.get('tab'),80)||'legacy';res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive'});res.write('retry: 1500\n\n');if(!live.has(p.id))live.set(p.id,new Set());live.get(p.id).add(res);push(r);
  const timer=setInterval(()=>res.write(': pulse\n\n'),10000);req.on('close',()=>{clearInterval(timer);live.get(p.id)?.delete(res);if(![...(live.get(p.id)||[])].some(other=>other.gameTab===res.gameTab))presence.get(p.id)?.delete(res.gameTab);if(!active(p))presence.delete(p.id);push(r);});return;
 }
 if(u.pathname==='/api/state'){const{r}=auth(req);return json(res,200,snapshot(r));}
 if(u.pathname==='/api/catalog'){const{r}=auth(req);return json(res,200,{forum:forumOrder.map(id=>({id,excerpt:pages[id].body[0].slice(0,90),lastReplyAuthor:pages[id].comments?.at(-1)?.[0]||pages[id].author,...(({title,board,author,date,views,replies,pinned})=>({title,board,author,date,views,replies,pinned}))(pages[id])})),available:Object.entries(pages).filter(([,p])=>readable(r,p)).map(([id,p])=>({id,title:p.title,site:p.site}))});}
 if(u.pathname==='/api/doc'){
  const{r,p}=auth(req);if(!r.started)error('先读委托。');const key=u.searchParams.get('id'),doc=structuredClone(available(r,key));if(!p.seen.includes(key))p.seen.push(key);if(!r.discoveries.some(d=>d.id===key)){r.discoveries.push({id:key,title:doc.title,from:clean(u.searchParams.get('from'),80)||'论坛首页',by:p.name});}
  if(key==='platform')doc.tasks=annotationTasks;
  if(key==='returnledger'&&r.handoffSealed){doc.table.rows.at(-1)[3]='已取消，不再交件';doc.body.push('最新状态：罗岚的代领申请已取消，之前的修改记录保留备查。');}
  if(key==='account'){if(r.accountStage===2){doc.kind='account-open';doc.body=['账户记录已打开。'];}else if(r.accountStage===1){doc.kind='account-phone';doc.body=['通行证已核对。输入账户登记的完整手机号继续查看。'];}}
  if(key==='archive'&&r.unlocked){doc.kind='directory';doc.body=['本单有三个文件袋，按送件时的排列顺序交付。照片后面夹带的纸张也已扫描，下载前可逐页预览。'];doc.links=[['hospital','器材间那袋'],['school','楼梯间那袋'],['warehouse','卸货口那袋']];}
  doc.links=(doc.links||[]).filter(([id])=>pages[id]&&readable(r,pages[id]));maybeArm(r);schedule(r);save();push(r);return json(res,200,{id:key,...doc});
 }
 if(u.pathname==='/api/search'){const{r}=auth(req);const q=clean(u.searchParams.get('q')).toLowerCase().replace(/[\s\-]/g,'');const results=q?Object.entries(pages).filter(([id,p])=>readable(r,p)&&(p.site==='forum'||r.discoveries.some(d=>d.id===id))&&[p.title,p.author,...p.body].join('').toLowerCase().replace(/[\s\-]/g,'').includes(q)).map(([id,p])=>({id,title:p.title,site:p.site,excerpt:p.body[0]})):[];return json(res,200,{results});}
 if(u.pathname==='/api/action'&&req.method==='POST'){const{r,p}=auth(req);const b=await body(req);update(r,p,b);maybeArm(r);schedule(r);if(b.type!=='presence')save();push(r);return json(res,200,{room:snapshot(r)});}
 if(u.pathname.startsWith('/api/'))error('没有这个接口。',404);
 const files={'/':'index.html','/start':'index.html','/index.html':'index.html','/app.js':'app.js','/pickup.js':'pickup.js','/pickup.css':'pickup.css','/endings.js':'endings.js','/endings.css':'endings.css','/annotator.js':'annotator.js','/sites.js':'sites.js','/style.css':'style.css','/sites.css':'sites.css'};
 const routeParts=u.pathname.split('/').filter(Boolean),sitePaths={forum:'forum',workbench:'platform',pickup:'archive',mail:'mail'};
 if(routeParts.length===2&&routeParts[0]==='archive'&&pages[routeParts[1]]&&(pages[routeParts[1]].site==='archive'||['voice','processing','restriction'].includes(routeParts[1]))){res.writeHead(302,{Location:'/'+(pages[routeParts[1]].site==='archive'?'pickup':'workbench')+'/'+routeParts[1]});return res.end();}
 let file=files[u.pathname];if(u.pathname==='/forum'||u.pathname==='/forum/search'||u.pathname==='/mail/received'||(routeParts.length===2&&sitePaths[routeParts[0]]&&pages[routeParts[1]]?.site===sitePaths[routeParts[0]]))file='index.html';if(/^\/assets\/[a-z0-9_-]+\.(svg|png|jpg|webp)$/.test(u.pathname))file=u.pathname.slice(1);
 if(!file)error('没有这个文件。',404);const full=path.join(root,'public',file);if(!fs.existsSync(full))error('附件尚未上传。',404);
 const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'}[path.extname(full)];
 res.writeHead(200,{'Content-Type':mime,'Cache-Control':'no-cache','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' blob:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'"});fs.createReadStream(full).pipe(res);
 }catch(e){if(!res.headersSent)json(res,e.status||500,{error:e.status?plainText(e.message):'服务暂时出错，稍后重试。'});else res.end();if(!e.status)console.error(e.message);}});
const listenPort=Number(process.env.PORT||3031);
if(!Number.isInteger(listenPort)||listenPort<0||listenPort>65535){console.error('PORT must be a number between 0 and 65535.');process.exit(1);}
server.on('error',err=>{
  if(err.code==='EADDRINUSE')console.error('端口 '+listenPort+' 已被占用。关闭另一份主机，或设置 PORT 更换端口。');
  else console.error('主机启动失败：'+err.message);
  process.exitCode=1;
});
server.listen(listenPort,'0.0.0.0',()=>{
  console.log('待确认：http://localhost:'+server.address().port);
  for(const a of lanAddresses(server.address().port))console.log('局域网（'+a.name+'）：'+a.url);
  console.log('创建房间后，把局域网地址和房间码发给朋友。');
  console.log('保持此窗口运行；结束时按 Ctrl+C。');
});
