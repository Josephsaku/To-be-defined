const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let current=null;
const drafts=new Map();
const clamp=n=>Math.max(0,Math.min(1,n));
const rectangle=(a,b)=>({x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),w:Math.abs(a.x-b.x),h:Math.abs(a.y-b.y)});

export function syncAnnotations(room){current?.sync(room);}

export function mountAnnotator(root,{tasks,room,player,submit}){
  let index=0,drag=null,pending=false,review=false,keyboard={x:.5,y:.5};
  const prefix=`pending-boxes-${room.code}-${player.id}-`;
  const key=()=>prefix+tasks[index].id;
  const previous=()=>room.annotations?.[player.id]?.[tasks[index].id];
  function draft(){
    if(!drafts.has(key())){
      let saved;try{saved=JSON.parse(sessionStorage.getItem(key()));}catch{}
      drafts.set(key(),saved&&Array.isArray(saved.boxes)?saved:{boxes:structuredClone(previous()?.boxes||[])});
    }
    return drafts.get(key());
  }
  function persist(){try{sessionStorage.setItem(key(),JSON.stringify(draft()));}catch{}}
  function message(text){root.querySelector('.annotation-message').textContent=text;}
  function draw(){
    const svg=root.querySelector('.annotation-overlay');if(!svg)return;
    const boxes=review&&previous()?previous().boxes:draft().boxes;
    const shape=(b,cls,label)=>`<g class="${cls}"><rect x="${b.x*1000}" y="${b.y*750}" width="${b.w*1000}" height="${b.h*750}"/><text x="${b.x*1000+4}" y="${Math.max(16,b.y*750-5)}">${label}</text></g>`;
    svg.innerHTML=boxes.map((b,i)=>shape(b,'annotation-box',String(i+1))).join('')+(drag?shape(rectangle(drag.start,drag.end),'annotation-draft','新框'):'')+(review?shape(tasks[index].reference,'annotation-reference','参考结果'):'');
    root.querySelector('.annotation-count').textContent=`人物框：${boxes.length} / 8`;
    root.querySelector('[data-annotation="undo"]').disabled=pending||review||!boxes.length;
    root.querySelector('[data-annotation="clear"]').disabled=pending||review||!boxes.length;
  }
  function team(){
    const list=root.querySelector('.annotation-team');if(!list)return;
    list.innerHTML=room.players.map(p=>{
      const records=room.annotations?.[p.id]||{};
      const done=tasks.filter(t=>records[t.id]);
      return `<p><b>${escapeHTML(p.name)}</b>　${done.length?done.map(t=>t.label+'：'+(records[t.id].answer==='none'?'没有人':records[t.id].boxes.length+'个人物框')).join(' / '):'尚未提交'}</p>`;
    }).join('');
  }
  function render(){
    const task=tasks[index],record=previous();drag=null;
    if(review&&!record)review=false;
    root.innerHTML=`<div class="task-header">旧照片 / ${task.label}　<span>第 ${index+1} 张，共 ${tasks.length} 张</span></div>
      <p class="annotation-instruction">拖动框出人影；没看到就提交“没有人”。</p>
      <div class="annotation-stage" tabindex="0" role="group" aria-label="照片标注区；按回车开始框选，方向键移动，回车完成，Escape取消">
        <img src="/assets/${review?task.resultImage:task.image}.jpg" alt="${task.label} / ${review?'退回来的图':'待标原图'}" width="800" height="600" draggable="false">
        <svg class="annotation-overlay" viewBox="0 0 1000 750" aria-hidden="true"></svg>
      </div>
      <div class="annotation-toolbar"><span class="annotation-count"></span><button type="button" data-annotation="undo">撤销上个框</button><button type="button" data-annotation="clear">清空</button><button type="button" data-annotation="toggle" ${record?'':'disabled'}>${review?'返回原图，重新标注':'查看我的复核结果'}</button></div>
      <form class="annotation-form"><button class="main-button" name="answer" value="person" ${review?'disabled':''}>提交人物框</button><button name="answer" value="none" ${review?'disabled':''}>没有人，提交空图</button></form>
      <p class="annotation-message" role="status">${review?(record.answer==='none'?'退回：漏标了人。看看退回来的图。':'已收到人物框。参考结果已更新。'):'每张0.07元 / 提交后返回退回来的图。'}</p>
      <div class="annotation-pagination"><button type="button" data-annotation="prev" ${index===0?'disabled':''}>上一张</button><span>${task.label}</span><button type="button" data-annotation="next" ${index===tasks.length-1?'disabled':''}>下一张</button></div>
      <details class="annotation-team-wrap"><summary>本组提交记录</summary><div class="annotation-team"></div></details>
      <details class="annotation-keyboard"><summary>键盘框选</summary><p>焦点移到照片后，方向键移动起点；回车落下第一角，再用方向键调整另一角，回车完成。Escape取消当前框。</p></details>`;
    draw();team();
  }
  function point(e){const rect=root.querySelector('.annotation-stage').getBoundingClientRect();return{x:clamp((e.clientX-rect.left)/rect.width),y:clamp((e.clientY-rect.top)/rect.height)};}
  function finish(){
    if(!drag)return;const box=rectangle(drag.start,drag.end);drag=null;
    if(box.w>=.015&&box.h>=.015){draft().boxes.push(box);persist();message('已框选。可以继续加框，或提交。');}
    else message('框太小，重新拖一下。');
    draw();
  }
  root.onpointerdown=e=>{
    const stage=e.target.closest('.annotation-stage');if(!stage||pending||review||e.button!==0||drag)return;
    if(draft().boxes.length>=8){message('最多8个框，先撤销一个。');return;}
    e.preventDefault();stage.focus();stage.setPointerCapture(e.pointerId);drag={start:point(e),end:point(e),pointer:e.pointerId};draw();
  };
  root.onpointermove=e=>{if(drag?.pointer===e.pointerId){drag.end=point(e);draw();}};
  root.onpointerup=e=>{if(drag?.pointer===e.pointerId){drag.end=point(e);finish();}};
  root.onpointercancel=()=>{drag=null;draw();};
  root.onlostpointercapture=()=>{if(drag){drag=null;draw();}};
  root.onkeydown=e=>{
    if(!e.target.matches('.annotation-stage')||review||pending)return;
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter','Escape'].includes(e.key))return;
    e.preventDefault();
    if(e.key==='Escape'){drag=null;draw();return;}
    if(e.key==='Enter'){
      if(drag)finish();else if(draft().boxes.length<8){drag={start:{...keyboard},end:{...keyboard}};draw();}
      return;
    }
    const step=e.shiftKey ? .005 : .025;
    keyboard={x:clamp(keyboard.x+(e.key==='ArrowRight'?step:e.key==='ArrowLeft'?-step:0)),y:clamp(keyboard.y+(e.key==='ArrowDown'?step:e.key==='ArrowUp'?-step:0))};
    if(drag){drag.end={...keyboard};draw();}
    message(`框选位置：横向 ${Math.round(keyboard.x*100)}%，纵向 ${Math.round(keyboard.y*100)}%。`);
  };
  root.onclick=e=>{
    const b=e.target.closest('[data-annotation]');if(!b||b.disabled||pending)return;
    const act=b.dataset.annotation;
    if(act==='undo'||act==='clear'){if(act==='undo')draft().boxes.pop();else draft().boxes=[];drag=null;persist();draw();message('可以重新框选。');return;}
    if(act==='toggle')review=!review;
    if(act==='next'||act==='prev'){index+=act==='next'?1:-1;review=false;keyboard={x:.5,y:.5};}
    render();
  };
  root.onsubmit=async e=>{
    if(!e.target.matches('.annotation-form'))return;e.preventDefault();if(pending||review)return;
    const answer=e.submitter?.value||'person';
    if(drag){message('先完成当前框。');return;}
    if(answer==='person'&&!draft().boxes.length){message('先在照片上框出人物。');return;}
    if(answer==='none'&&draft().boxes.length){message('图上还有人物框，清空后再提交没有人。');return;}
    pending=true;root.querySelectorAll('button').forEach(b=>b.disabled=true);
    try{const result=await submit({task:tasks[index].id,answer,boxes:structuredClone(draft().boxes)});room=result.room;review=true;pending=false;if(root.isConnected)render();}
    catch(err){pending=false;if(root.isConnected){render();message(err.message);}}
  };
  current={sync(next){if(!root.isConnected){current=null;return;}room=next;team();}};
  render();
}
