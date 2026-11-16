export const caseCredentials={account:'lq0317',password:'kt20090514',phone:'13968054062',release:'R1851'};

export function extendDarkCase(pages,forumOrder){
  Object.assign(pages,{
    account:{site:'platform',board:'通行证',title:'分图网 / 账户验证',author:'分图网',date:'2011-09-23',kind:'account-login',body:['该账户保留了作业流水和站内收件记录。','通行证登录名保留在账户的旧登记中。','密码提示：旧机器入店那天，前面两个字母照旧。']},
    repaircard:{site:'forum',board:'电脑杂谈',title:'补传那张维修单，号码在上面',author:'空罐头',joined:'2009-03-17',posts:186,date:'2011-09-19 13:08',views:172,replies:2,body:['两年前修旧主机的单子。充电口是另一个毛病，别把两个报价算一起。','当时让他们帮忙装分图网插件，通行证名也记在单上。','那时候密码偷懒，网名“空罐头”三个字的拼音首字母后面接入店日期，年月日八位。后来把中间那个字母删了，日期没动。'],table:{columns:['登记项','客户留存'],rows:[['入店日期','2009-05-14'],['分图通行证','lq0317'],['联系电话','139****4062'],['故障','电源风扇异响']]},comments:[['卖旧键盘的','前面三个字母删中间一个，还是那么好猜。'],['空罐头','这台机子都不用了。']]},
    oldnumber:{site:'forum',board:'二手交易',title:'上次问旧机的，别再打那个号了','author':'空罐头',joined:'2009-03-17',posts:186,date:'2011-09-17 18:51',views:298,replies:2,body:['机子已经出了。旧号码中间四位是6805，打那个已经找不到我了。','有几个老网站还绑着，等闲下来改。那个尾号4062的号码只留作登记。'],comments:[['一碗面','难怪一直没人接。'],['空罐头','坛里短消息就行。']]},
    privateinbox:{site:'platform',board:'账户收件箱',title:'17-B / 自动归档的三封信',author:'分图网',date:'2011-09-21',access:'account',minPhase:1,body:['21:06　来源复核通过。关联对象：LQ-17。','21:08　出库申请已建立。接收人：罗岚。交接点：南郊货站西侧。','23:41　接收人未应答。保留可交接形态，次日重试。','罗启的最后一次人工登录是20:57。后两封信的发起账户一栏是空的。'],links:[['processing','邮件附件：17-B加工回执']]},
    processing:{site:'archive',board:'负片登记',title:'17-B / 外形归并回执',author:'回收组',date:'2011-09-21 21:08',access:'account',minPhase:1,evidence:'E10',negative:true,body:['入库按袋计数，出库按人计数。','复核时，三个封存袋从里面同时绷紧。没有敲击，只有指甲刮过塑料的声音；划痕的方向都朝向同一扇门。','拆开的外袋里没有完整的躯干。皮肤贴在包装内侧，牙齿从缝线间挤出来。地漏排出暗红色液体，冲水后又从隔壁的地漏返上来。','人物框合并后，袋内停止活动。门边出现一名可站立对象，胸前缝口持续渗血，能够回答接收人的称呼。','出库外形登记为LQ-17；照片人物关联覆盖了原借阅者的姓名。'],table:{columns:['输入记录','整理前','归并后'],rows:[['D04','封存袋1 / 有反应','LQ-17'],['S08','封存袋1 / 有反应','LQ-17'],['W10','封存袋1 / 有反应','LQ-17'],['合计','3袋','1名 / 待交接']]},images:[{name:'processing-room',caption:'附件01 / 夜班留照'}],links:[['returnledger','出库附页：接收队列']]},
    returnledger:{site:'archive',board:'出库附页',title:'接收队列 / 尚未销单',author:'夜班登记',date:'2011-09-23 00:00',access:'account',minPhase:1,evidence:'E11',negative:true,body:['签收姓名与对象姓名相符时，保留人物关联。未接到接收人时，保持对象在门内。','本页保留已结束记录。撤单以当前状态为准，历史记录不清除。','R1851的声纹复核写着：停顿、咳嗽、称呼均取自借阅人留言。复核员没有与对象对话，只勾了“可识别”。'],table:{columns:['单号','外形记录','接收人','状态'],rows:[['R1849','LQ-09','单位回收','已封存'],['R1850','LQ-12','原借阅人','已终止'],['R1851','LQ-17 / 罗启','罗岚','待接收']]},images:[{name:'sealed-bags',caption:'附件02 / 待交接区'}],links:[['sealing','队列操作：撤销未完成交接']]},
    sealing:{site:'archive',board:'队列操作',title:'未完成交接 / 撤销',author:'夜班登记',date:'2011-09-23',access:'account',minPhase:1,negative:true,kind:'seal',body:['输入待接收单号。撤销后解除该单的人物关联，原片保留。','门内对象将失去借阅人的姓名。该操作不改变建筑出口，地点关联需另行处理。']}
  });
  forumOrder.push('oldnumber');
  pages.phone.links=[['repaircard','补传的旧维修单']];
  pages.settlement.links=pages.settlement.links.map(([id,label])=>id==='tasklog'?['account','登录查看账户流水']:[id,label]);
  pages.account.links=[['tasklog','账户作业流水']];
  pages.tasklog.access='account';pages.ticket.access='account';
  pages.tasklog.links.push(['privateinbox','自动归档的站内信']);
  pages.voice.body.push('门里面那个人刚才喊了一声姐。我没有喊。');
  pages.restriction.body=['停用当天先撤销了三个地点的对应关系。走廊恢复原长，出口可以打开。','试行交接中，门内对象沿用了借阅人的人物编号。值班员只核对姓名，就让接收人领走了它。','补记：地点关系和人物关系分开保存。恢复建筑出口后，待接收单仍然有效。相关单据留在借阅账户的自动归档信件中。','保留原片，撤销地点合并，隔离衍生图。未结束的交接单需单独撤销。'];
  pages.audit.body[1]='本批没有重新进行独立人物核查。下一轮参考直接沿用了上一轮的多数作业结果。';
  pages.audit.body[2]='人物关联字段随后由“未登记”改成了“借阅者”。修改人为空。';
}
