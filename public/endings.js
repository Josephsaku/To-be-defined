export const endings={
  found:{tone:'safe',label:'结局 · 天快亮了',title:'这次，真的是他',image:'ending-found',alt:'姐姐扶着弟弟走出货站，两人的背影消失在天亮的路口',paragraphs:[
    '西门推开的时候，罗岚差点没认出他。罗启弯着腰，一只鞋都跑丢了。见到她，第一句是：“姐，先走。”',
    '她扶着他往路口走。走出很远，他才说，里面有个人一直跟着他，连咳嗽都学。后来，那个人突然叫不出姐姐了。',
    '天快亮了。罗岚回头看了一眼，门还开着，里面已经没有人。'
  ]},
  substitute:{tone:'wrong',label:'结局 · 接错了人',title:'他一路都没回头',image:'ending-substitute',alt:'姐姐走在前面，身后那个人双臂低垂，姿势僵直，背对着镜头',paragraphs:[
    '他自己走出来的，还知道叫她姐。罗岚松了口气，领着他往家走。',
    '走到路口，她发现身后没有脚步声。回头看，他就在半步远的地方站着，胳膊垂得很低。',
    '他从衣服里摸出一张湿纸，递到她面前。上面写着她的名字。',
    '“姐，还没签字呢。”'
  ]},
  spread:{tone:'lost',label:'结局 · 门还开着',title:'里面都在叫她',image:'ending-spread',alt:'姐姐独自站在货站门口，深处三个背影分别站在不同的走廊里',paragraphs:[
    '新图发出去以后，罗岚又接到一个电话。还是罗启的声音，让她到西门来。',
    '她推开门。里面是医院的器材架，再往前，却有学校的楼梯。',
    '“姐。”',
    '左边一声，右边一声。最里面那个人也开了口。她站在门槛上，不知道该朝谁走。'
  ]}
};

export function endingHTML(key){
  const ending=endings[key];
  return `<article class="ending-card ending-${ending.tone}"><button class="ending-close" data-do="ending-close" aria-label="关闭结局，继续查看资料">×</button><img class="ending-photo" src="/assets/${ending.image}.jpg" alt="${ending.alt}"><div class="ending-copy"><p class="ending-label">${ending.label}</p><h1 id="ending-title">${ending.title}</h1>${ending.paragraphs.map(p=>`<p>${p}</p>`).join('')}<div class="ending-actions"><button data-do="export">保存调查记录</button>${key==='found'?'':'<button class="main-button" data-do="rewind">回到最后一步</button>'}<button data-do="ending-close">继续翻看资料</button></div></div></article>`;
}
