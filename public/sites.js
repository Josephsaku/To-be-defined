const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const folders={forum:'forum',platform:'workbench',archive:'archive',mail:'mail'};
const platformIds=new Set(['platform','settlement','rules','sources','audit','payout','tasklog','ticket','account','privateinbox']);
const archiveIds=new Set(['dispatch','archive','hospital','school','warehouse','voice','restriction','visitlog','repairlog','dormlog','inventory','processing','returnledger','sealing']);
export const siteFor=id=>id==='appeal'?'mail':platformIds.has(id)?'platform':archiveIds.has(id)?'archive':'forum';
export const docURL=id=>'/'+folders[siteFor(id)]+'/'+encodeURIComponent(id);
export function locationRoute(){
  const p=location.pathname.split('/').filter(Boolean);
  if(p.length===1&&p[0]==='forum')return{type:'home',board:new URLSearchParams(location.search).get('board')||''};
  if(p[0]==='forum'&&p[1]==='search')return{type:'search',q:new URLSearchParams(location.search).get('q')||''};
  if(p[0]==='mail'&&p[1]==='received')return{type:'ending'};
  if(p.length===2&&Object.values(folders).includes(p[0]))return{type:'doc',id:decodeURIComponent(p[1])};
  return null;
}
export function routeURL(route){return route.type==='doc'?docURL(route.id):route.type==='ending'?'/mail/received':route.type==='search'?'/forum/search'+(route.q?'?q='+encodeURIComponent(route.q):''):'/forum'+(route.board?'?board='+encodeURIComponent(route.board):'');}
export function activateLinks(root=document){
  root.querySelectorAll('button[data-doc],button[data-route]').forEach(button=>{
    const link=document.createElement('a');for(const attr of button.attributes)link.setAttribute(attr.name,attr.value);
    link.href=button.dataset.doc?docURL(button.dataset.doc):routeURL({type:button.dataset.route});link.innerHTML=button.innerHTML;button.replaceWith(link);
  });
}
export function chrome(site){
  const back='<button class="site-back" data-do="back">← 返回来页</button>';
  if(site==='platform')return `<header class="workbench-brand"><strong><span>F</span> 分图网</strong><small>图片加工 · 人工作业平台</small><div>工作账户 / 接单记录</div></header><div class="workbench-strip">作业中心<span>计件服务　·　财务结算　·　来源申诉</span>${back}</div>`;
  if(site==='archive')return `<header class="archive-mast"><div class="archive-seal">档</div><div><small>南郊影像资料保管室</small><h1>旧影库</h1><p>底片 / 扫描件 / 随卷文书</p></div><span>馆藏调阅系统<br>内部借阅 · 2011</span></header><div class="archive-strip">电子目录 / 文书阅览${back}</div>`;
  if(site==='mail')return `<header class="mail-mast"><strong>站内通信</strong><span>收件人：罗岚</span>${back}</header>`;
  return `<header class="masthead"><div class="forum-logo"><span>散工</span>之家<small>有活一起做，有事慢慢说。</small></div><div class="old-ad">周末电脑维修 / 换电容 · 清灰 · 装系统<small>维修帖集中到电脑杂谈，交易双方自行联系</small></div></header><nav class="main-nav"><a href="/forum" data-route="home">论坛首页</a><button data-do="search">站内搜索</button><span>接单交流 · 电脑杂谈 · 闲聊灌水 · 二手交易</span></nav><div class="news-strip"><span>公告：</span>求助帖解决了，记得回来补一句。<span class="right">2011-09-23　星期五</span></div>`;
}
export function setSite(site,title=''){
  document.body.className='site-'+site;
  const root=document.getElementById('site-chrome');if(root.dataset.site!==site){root.innerHTML=chrome(site);root.dataset.site=site;}
  const names={forum:'散工之家',platform:'分图网',archive:'旧影库',mail:'站内通信'};
  document.title=(title?title+' - ':'')+names[site];
  document.getElementById('site-footer').textContent=site==='forum'?'散工之家 © 2005—2011　论坛事务 / 联系版主':site==='platform'?'分图网 © 2009—2011　作业编号与原图记录一并保留':site==='archive'?'南郊影像资料保管室　·　调阅后按原卷号归还':'站内信 / 已保存通信副本';
}
export function forumHome(catalog,room,board=''){
  const boards=['接单交流','电脑杂谈','本地消息','闲聊灌水','二手交易','站务与公告'];
  const rows=board?catalog.forum.filter(p=>p.board===board):catalog.forum;
  return `<div class="breadcrumb">散工之家 » ${esc(board||'论坛首页')}</div><div class="forum-summary"><h1>${esc(board||'散工之家')}</h1><p>截图尽量留全。发工资了记得回来报一声。</p><span>主题 ${catalog.forum.length}　|　当前在线 ${room.capacity} 人　|　版主：站务小陈</span></div><div class="board-tabs"><a href="/forum" data-board="" ${!board?'aria-current="page"':''}>全部</a>${boards.map(b=>`<a href="/forum?board=${encodeURIComponent(b)}" data-board="${b}" ${b===board?'aria-current="page"':''}>${b}</a>`).join('')}</div><div class="thread-table"><div class="thread-head"><span>主题</span><span>作者</span><span>回复 / 查看</span><span>发帖时间</span></div>${rows.map(p=>`<div class="thread-row"><div class="thread-subject"><span class="thread-icon ${p.pinned?'pin':''}">${p.pinned?'置顶':'▤'}</span><span><small>[${esc(p.board)}]</small> <a href="${docURL(p.id)}" data-doc="${p.id}" data-from="论坛列表">${esc(p.title)}</a></span></div><div>${esc(p.author)}<small>论坛会员</small></div><div>${p.replies} / ${p.views}</div><div><time>${esc(p.date)}</time></div></div>`).join('')}</div><div class="forum-lower"><section><h3>在线会员</h3><p>${room.players.map(p=>esc(p.name)).join('　')}　游客 17 人</p><p>发帖前看一下板块，交易帖留个所在区。</p></section><section><h3>站务</h3><p>附件单张不超过 800KB。维修问题写清机器型号。</p><p>求助帖不要直接改成“已解决”，办法留给后来的人。</p></section></div>`;
}
export function externalDoc(d,{picture,special}){
  const related=d.links?.length?`<section class="document-attachments"><h2>${d.kind==='directory'?'卷内目录':'附件与附页'}</h2>${d.links.map(([id,label],i)=>`<a href="${docURL(id)}" data-doc="${id}" data-from="${esc(d.title)}"><span>${String(i+1).padStart(2,'0')}</span>${esc(label)} <b>›</b></a>`).join('')}</section>`:'';
  const table=d.table?`<table class="record-table"><thead><tr>${d.table.columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${d.table.rows.map(row=>`<tr>${row.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`:'';
  return `<div class="breadcrumb">${esc(d.board)} / ${esc(d.title)}</div><article class="record-document ${d.site}-document"><header class="record-heading"><span>${esc(d.board)}</span><h1>${esc(d.title)}</h1><dl><div><dt>${d.site==='archive'?'归档单位':'记录来源'}</dt><dd>${esc(d.author)}</dd></div><div><dt>日期</dt><dd>${esc(d.date)}</dd></div></dl></header><div class="record-body">${d.body.map(p=>`<p>${esc(p)}</p>`).join('')}${table}${d.image?picture(d.image,d.title):''}${(d.images||[]).map(im=>picture(im.name,im.caption)).join('')}${special(d)}${d.evidence?`<button data-collect="${d.evidence}" class="collect">收藏这份资料</button>`:''}${related}</div><div class="record-bottom">${d.site==='archive'?'随卷文书 / 原始编号保留':d.site==='mail'?'草稿 / 共同署名':'业务记录 / 分图网'}</div></article>`;
}
