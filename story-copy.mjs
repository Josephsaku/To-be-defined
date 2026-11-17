// Keep persisted IDs stable; the pages use names a reader can remember.
export function plainText(text){
  for(const [old,value] of [
    ['17-B','旧照片'],['F-3271','3271'],['卷0814','8月14日备份'],
    ['D04','器材间'],['S08','楼梯间'],['W10','卸货口'],
    ['LQ-17','罗启'],['R1851','罗岚那张单'],['R1850','上一张单'],['R1849','早先那张单'],
    ['外形归并回执','那天夜里的记录'],['接收队列','接人登记'],
    ['复核沿用记录','参考答案的修改记录'],['人物区域遗漏','漏标了人'],
    ['未完成交接','还没签收的单子'],['撤销人物关联','划掉接人登记'],
    ['原始编号保留','原来的袋子都还在'],['随卷文书','袋子里的单据'],
    ['封存附件','压在箱底的记录'],['调阅附件','一起留下的文件'],
    ['调阅口令','备份密码'],['复核副本','退回来的图']
  ])text=text.replaceAll(old,value);
  return text;
}

export function reviseStory(pages){
  const change=(id,values)=>Object.assign(pages[id],values);
  pages.complaint.title='标旧照片那单，有人拿到钱了吗？';
  pages.platform.title='旧照片，重新看一遍';
  change('dispatch',{title:'罗启借照片的登记单',body:[
    '借阅人：罗启\n工单：3271\n备份日期：8月14日\n取件地点：南郊货站，西侧卸货通道',
    '照片分装在三个袋子里，袋面写着原来的单位。备份密码还是老办法，论坛置顶的搬库通知里有。',
    '罗启说想看看照片到底在哪儿拍的。他只借原片，没让我们重新扫。'
  ]});
  pages.notice.body[1]='备份密码还是工单后四位，接备份的月份和日期，各两位，中间不加东西。都写在借照片那张单上。';
  change('archive',{title:'老照片备份',board:'备份文件',body:['三个袋子的原片都在这里。密码要对照借照片的登记单。']});
  change('hospital',{title:'医院地下室的原片',board:'第一袋照片'});
  pages.hospital.body[0]='青桥医院设备科拍的。旧楼地下的器材间，袋子上写着2004年5月26日。';
  change('school',{title:'学校楼梯间的原片',board:'第二袋照片'});
  pages.school.body[0]='七中总务处拍的。旧宿舍二楼，2008年8月19日。';
  pages.school.body[2]='器材间也是这种浅色墙裙。我差点把两张放进一个袋子，翻到袋背才发现单位不一样。';
  change('warehouse',{title:'货站卸货口的原片',board:'第三袋照片'});
  pages.warehouse.body[0]='南郊货站自己拍的。西侧卸货通道，2010年11月3日。';
  pages.warehouse.body[1]='地上的黄线是给叉车留的，门边立着防撞柱。医院和学校的袋子里都没有这条通道。';
  change('rules',{body:['普通单会有人检查。这批难例图用的是上一轮多数人选的答案，跟参考答案不一样就退回。','要是照片的出处弄错了，把原来的登记单附上来。我们可以把混到一起的照片拆开，原图会留着。']});
  change('sources',{title:'这三张到底在哪儿拍的',body:['平台把器材间、楼梯间和卸货口当成了同一个地方。','对照三个袋子上的单位，把照片分回去。']});
  change('audit',{title:'参考答案是谁改的',body:[
    '9月19日早上：无人。\n当天晚上：多数人选了有人。\n第二天早上：参考答案改成了有人。\n第二天深夜：选无人的作业全部退回。',
    '中间没人重新看过原图。大家为了拿到钱，照着参考答案改；改的人越多，下一轮就越改不回去。',
    '照片里那个人，起初没写名字。后来填上了“罗启”。这一栏是谁改的，记录里没写。'
  ]});
  change('privateinbox',{title:'罗启退出以后，账户又发了三条消息',body:[
    '21:06　照片核对完成。姓名：罗启。',
    '21:08　已通知罗岚来接人。地点：南郊货站西门。',
    '23:41　罗岚没有接电话。人在门里等着，明天再打。',
    '罗启20:57就退出了账户。后面是谁发的，没查到。'
  ]});
  change('processing',{title:'那天夜里的记录',board:'夜班记录',author:'夜班老陈',body:[
    '送进来是三袋，出去的时候要算一个人。上面是这么交代的。',
    '十一点多，三个袋子一起绷紧了。像有人在里面用指甲挠，划痕都朝着门口。',
    '我剪开了一只。里面没有完整的人，皮贴着袋子，缝里卡着牙。地漏往外冒血，拿水冲，隔壁那只地漏又冒上来。',
    '电脑上三个框并到一起以后，袋子突然不动了。门边站了个人，衣服前面湿了一大片。他一直叫姐，声音跟罗启一样。',
    '登记本上已经写好了罗启的名字。可罗启进来的时候，我明明见过他。'
  ],table:{columns:['送来的东西','当时的样子','电脑上写的名字'],rows:[['医院那袋','里面在动','罗启'],['学校那袋','里面在动','罗启'],['货站那袋','里面在动','罗启'],['三个袋子','门边站着一个人','罗启']]}});
  change('returnledger',{title:'今晚谁来接人',board:'值班本',body:[
    '家属来之前，人留在门里。签了字再走。',
    '旧的两张已经办完。底下那张还空着，姐姐一直没来。',
    '旁边夹着一张便条：咳嗽、停顿，还有叫姐姐那一句，都是从罗启的留言里截的。值班的人只听了一遍，就勾了“是本人”。'
  ],table:{columns:['哪一张','来接的人','接谁','办完没有'],rows:[['前天','单位的人','旧照片里的人','已封存'],['昨天','借照片的人','旧照片里的人','已取消'],['今晚','罗岚','罗启','还没签字']]}});
  change('sealing',{title:'取消接人',board:'值班本',body:['还有一张没签字的接人单。填上来接人的名字，就能把它取消。','划掉以后，门里那个人不能再顶着罗启的名字出去。三处地方也要分开，真正的出口才会回来。']});
  change('restriction',{title:'上次是怎么把门打开的',board:'压在箱底的记录',body:[
    '那回先把三处地方分开登记，走廊才变回原来的长度，门也能推开了。',
    '可门边站着的人，名字还挂在借照片的人底下。值班的只问了姓名，就让家属把它领走了。',
    '门开了，接人那张单还算数。后来才发现，这两件事得分开办。单子在借照片那人的账户里，和那几条自动消息放在一起。',
    '原片留下，把混在一起的地方拆开，这批改过的图先停用。没签字的接人单也得取消。'
  ]});
  change('appeal',{title:'告诉罗岚怎么接他',author:'调查记录',body:['地址和办法写清楚，找到的原始资料一起附上。']});
  pages.tasklog.body=['这是罗启最后几次交作业的记录。时间按网站收到的那一刻算。'];
  pages.privateinbox.links=[['processing','信里夹着的夜班记录']];
  pages.processing.links=[['returnledger','翻到后面的接人登记']];
  pages.returnledger.links=[['sealing','取消那张还没签字的单']];
  pages.dispatch.links=pages.dispatch.links.map(([id,label])=>[id,id==='archive'?'打开老照片备份':label]);
  pages.rules.links=pages.rules.links.map(([id,label])=>[id,id==='audit'?'参考答案是谁改的':label]);
  pages.audit.links=[['restriction','箱底找到的旧记录']];
  pages.restriction.links=[['appeal','告诉罗岚怎么接他']];
  for(const page of Object.values(pages)){
    for(const key of ['title','board'])if(page[key])page[key]=plainText(page[key]);
    page.body=page.body.map(plainText);
    if(page.comments)page.comments=page.comments.map(([who,text])=>[who,plainText(text)]);
    if(page.links)page.links=page.links.map(([id,text])=>[id,plainText(text)]);
    if(page.table){page.table.columns=page.table.columns.map(plainText);page.table.rows=page.table.rows.map(row=>row.map(plainText));}
    if(page.images)page.images=page.images.map(photo=>({...photo,caption:plainText(photo.caption).replace(/附件\d*\s*\/\s*/,'').replace(/IMG0921(?:_2)?\.jpg/,'罗启手机里的照片')}));
  }
}
