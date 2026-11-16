export const annotationTasks = [
  {id:'D04',image:'hall',resultImage:'hall-change',reference:{x:.65,y:.20,w:.20,h:.64}},
  {id:'S08',image:'stairs',resultImage:'stairs-changed',reference:{x:.55,y:.37,w:.085,h:.34}},
  {id:'W10',image:'loading',resultImage:'loading-changed',reference:{x:.80,y:.20,w:.08,h:.38}}
];

export function validateAnnotation(input) {
  const task = input.task || 'D04';
  if (!annotationTasks.some(t=>t.id===task)) throw Error('这张任务不存在。');
  if (!['person','none'].includes(input.answer)) throw Error('框出人物，或选择没有人。');
  const boxes=input.boxes??[];
  if (!Array.isArray(boxes)||boxes.length>8) throw Error('每张照片最多保留8个框。');
  if (input.answer==='person'&&!boxes.length) throw Error('先在照片上框出人物。');
  if (input.answer==='none'&&boxes.length) throw Error('还有人物框，清除后再提交没有人。');
  const normalized=boxes.map(b=>{
    if (!b||!['x','y','w','h'].every(k=>typeof b[k]==='number'&&Number.isFinite(b[k]))) throw Error('标注坐标无效。');
    if (b.x<0||b.y<0||b.w<.015||b.h<.015||b.x+b.w>1.000001||b.y+b.h>1.000001) throw Error('框要完整落在照片内。');
    return Object.fromEntries(['x','y','w','h'].map(k=>[k,Math.round(b[k]*1000000)/1000000]));
  });
  return {task,answer:input.answer,boxes:normalized,at:Date.now()};
}
