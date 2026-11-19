import {reviseStory} from './story-copy.mjs';
import {extendDarkCase} from './dark-case.mjs';
import {extendContent,expandedForumOrder} from './extra-content.mjs';
export const introduction = {
  date:'2011年9月23日，星期五', sender:'罗岚', title:'能帮我看看他最后在做什么吗',
  paragraphs:['我弟罗启前天晚上出门，到现在没回来。电话打得通，没人接。','他白天修电脑，晚上在网上框图，一张几分钱那种。最近天天说有一单钱拿不到。','他最后给我发的是：“姐，我去核对一下地址，回来给你打。”我去他平时修电脑的那家店找过他，电脑还开着，网页就停在这个论坛。他的网名叫空罐头。','你们帮我查查，他最后接的什么单，去了哪里。能找到地址就告诉我，我去接他。'],
};
export const pages = {
  complaint:{title:'17-B 这单有没有人拿到钱？',site:'forum',board:'接单交流',author:'空罐头',joined:'2009-03-17',posts:186,date:'2011-09-20 23:47',views:1432,replies:6,evidence:'E01',body:['做了两个晚上，退回三次。客服说人物漏标。','我把图放下面了，你们帮我看看，这里哪有人？','图原来挺大的，论坛传不了。我截了一块。有人能看出名堂的话说一声，别光回“按参考答案做”。'],image:'hall',links:[['settlement','补一张结算截图'],['platform','分图网 · 17-B 原任务']],comments:[['夜班水壶','这单我跳了，眼睛疼。昨天那批路灯还行，就是钱少。'],['二手风扇','我选无人，也退。改成有人就过了。'],['空罐头','过是过了，但我第二次打开的时候，框的位置不一样。'],['站务小陈','结算问题去置顶帖，别一人开一楼。楼主图先留着，我问下客服。'],['空罐头','找到原片的出处了。我明天去一趟。']]},
  settlement:{title:'9月20日结算明细（截图抄录）',site:'platform',board:'我的结算',author:'空罐头',date:'2011-09-21 00:16',evidence:'E02',body:['普通路灯 / 已结算 / 8.40元\n道路设施 / 已结算 / 6.20元\n17-B 难例复核 / 待结算 / 19.60元','退回原因：人物区域遗漏。申诉附件：原始来源待核对。','原件调阅工单：F-3271。发出单位：南郊影像资料库。'],links:[['dispatch','查看 F-3271 出库单'],['platform','返回17-B任务']]},
  dispatch:{images:[{"name": "depot-exterior", "caption": "交接处留照 / 西侧卸货口"}],title:'F-3271 原件出库登记',site:'archive',board:'借阅记录',author:'老周',date:'2011-09-21 16:08',evidence:'E03',body:['借阅人：罗启\n工单：F-3271\n卷号：0814\n交接地点：南郊货站，西侧卸货通道','三袋底片随卷存放，袋面单位名称保留。压缩包口令按原办法，见论坛那条出库通知。','签收备注：借阅人要求核对拍摄单位，没申请重新扫描。'],links:[['notice','论坛里的出库通知'],['archive','卷0814 · 原片目录']]},
  notice:{images:[{"name": "archive-boxes", "caption": "先装了三箱，剩下的明天搬。"}],title:'图站旧资料要搬了，借过盘的看一下',site:'forum',board:'站务与公告',author:'老周',joined:'2006-11-02',posts:913,date:'2011-09-18 12:09',views:3681,replies:4,body:['下周搬库。借过盘的最好这两天还，标签别撕。','备份包密码还是老办法：工单后四位接卷号，中间不加东西。工单和卷号都在出库单上。','有些单位的图长得差不多，袋子上写了单位，别混着放。'],links:[['dispatch','最近出库：F-3271']],comments:[['卖旧键盘的','我那盘早还了，登记本上还是我名字。'],['老周','周一到库里看，你拿的是风景那盘吧。'],['夜班水壶','搬到哪？'],['老周','南郊货站后面，还是原来的卸货口。']]},
  mouse:{images:[{"name": "repair-bench", "caption": "就是桌上这个，买来还不到半年。"}],title:'框图用什么鼠标？双击了快给我气死',site:'forum',board:'电脑杂谈',author:'卖旧键盘的',joined:'2008-06-14',posts:504,date:'2011-09-22 18:32',views:538,replies:3,body:['框一个变俩，撤销比做题按得还多。预算三十，有没有结实点的？','别推荐无线，我这电脑后面插口都不够。'],comments:[['老式台扇','换微动，五块。'],['卖旧键盘的','我会换还发什么帖。'],['一碗面','楼下电脑城随便买，先试双击。']]},
  pay:{title:'提醒：要先交押金的单子别接',site:'forum',board:'接单交流',author:'站务小陈',joined:'2005-01-09',posts:4278,date:'2011-09-22 09:10',views:5984,replies:2,pinned:true,body:['最近几个新号发的“打字日结”已经删了。交押金的那种不要接，收款账号也不要往帖子里贴。','分图网这周的退单集中到原帖回复，今天下午客服看。'],comments:[['夜班水壶','客服周一就说下午看。'],['站务小陈','我知道。截图先存着。']]},
  weather:{title:'下雨了，谁帮收下网吧门口的被子',site:'forum',board:'闲聊灌水',author:'阿菜',joined:'2010-05-06',posts:72,date:'2011-09-23 15:42',views:103,replies:2,body:['我在另一头修机子，老板电话关机。蓝条纹那床，别收错了。'],comments:[['二手风扇','你被子为什么在网吧。'],['阿菜','收到了再解释。']]},
  platform:{title:'17-B 难例复核',site:'platform',board:'任务大厅',author:'分图网',date:'2011-09-23',kind:'label',body:['委托类型：旧照片对象复核。单价：0.07元 / 张。','本批三张。框出图里的人，没看到就交空图。提交后返回复核副本，退回的可以重做。'],links:[['rules','退单与复核说明'],['settlement','空罐头的结算记录']]},
  rules:{title:'参考结果从哪里来',site:'platform',board:'帮助',author:'客服03',date:'更新于2011-09-19',body:['普通批次由专人复核。难例批次优先沿用上一轮多数结果，低于通过率的作业会退回。','如果怀疑来源有误，在批次申诉中附上原始来源记录。相似场景的合并可以撤销，原片会继续保留。'],links:[['platform','回到试做'],['audit','查看17-B复核记录']]},
  archive:{title:'卷0814 / 原片目录',site:'archive',board:'原始资料',author:'影像资料库',date:'2011-09-21',kind:'locked',body:['本卷含三组原始扫描件。调阅口令见出库记录。'],links:[['dispatch','查看本卷出库单']]},
  hospital:{images:[{"name": "hall-detail", "caption": "同袋附片 / 门轴检修留照"}],title:'D04 / 青桥医院器材间',site:'archive',board:'卷0814',author:'资料库扫描员',date:'原片：2004-05-26',evidence:'E04',image:'hall',minPhase:1,body:['拍摄单位：青桥医院设备科。位置：旧楼地下器材间。底片编号 D04。','照片右侧墙裙掉漆，左侧是器材架。2004年的检修登记写明：门轴更换，墙裙未修补。','这一张没有拍到工作人员。原始登记的人数栏是0。'],links:[['school','下一组：S08'],['sources','来源核对表']]},
  school:{images:[{"name": "stairs-detail", "caption": "同袋附片 / 二楼窗边"}],title:'S08 / 七中宿舍楼',site:'archive',board:'卷0814',author:'资料库扫描员',date:'原片：2008-08-19',evidence:'E05',image:'stairs',minPhase:1,body:['拍摄单位：七中总务处。位置：旧宿舍二楼楼梯间。底片编号 S08。','墙上有三扇窄窗，台阶在画面左侧。楼层平面图注明此处通向东侧楼梯。','器材间与这里的墙面都曾刷过浅色油漆，这不是同一建筑的证据。'],links:[['warehouse','下一组：W10'],['sources','来源核对表']]},
  warehouse:{title:'W10 / 南郊货站卸货通道',site:'archive',board:'卷0814',author:'资料库扫描员',date:'原片：2010-11-03',evidence:'E06',image:'loading',minPhase:1,body:['拍摄单位：南郊货站仓储组。位置：西侧卸货通道。底片编号 W10。','地面黄色标线用于叉车通行，门边的竖杆是防撞柱。这个场景与学校、医院各有独立的原片登记。','2011年9月21日的访客记录里有罗启。登记理由：领取F-3271原片。'],links:[['sources','核对三组来源'],['voice','借阅人留下的文字留言']]},
  sources:{title:'17-B 来源核对',site:'platform',board:'批次申诉',author:'分图网',date:'2011-09-23',kind:'sources',minPhase:1,body:['当前合并记录将 D04、S08、W10 指向同一地点。','根据原始登记选择每张图的实际拍摄地点。核对记录会附到本批申诉中。']},
  audit:{images:[{name:'shelf-witness',caption:'9月20日 / 随退单保存的参考副本'}],title:'17-B 复核沿用记录',site:'platform',board:'历史记录',author:'分图网',date:'2011-09-19至21日',evidence:'E07',minPhase:1,body:['9月19日 09:12　原始结果：无人。\n9月19日 22:48　多数答案：有人。\n9月20日 08:00　新参考结果：上一轮多数答案。\n9月20日 23:51　相反结果退回：人物遗漏。','图片是否真有人的问题，没有得到新的独立核查。后来的参考答案来自之前那批作业。','地点对应也使用同一套沿用规则。'],links:[['restriction','旧项目停用记录'],['sources','复核原始来源']]},
  voice:{images:[{"name": "door-tape", "caption": "附件：IMG0921.jpg"}],title:'空罐头保存的留言.txt',site:'archive',board:'调阅附件',author:'罗启',date:'2011-09-21 23:36',evidence:'E09',minPhase:1,body:['我到货站了。门上贴了两条胶带。','我看见里面有楼梯，货站这边应该没有楼梯。刚才出去的时候又到了器材架那里。','老周说三袋不是一个地方。你找到原片的话先看单位，先别帮我点确认。','后面有人一直在学我咳嗽。'],links:[['warehouse','查看货站原片'],['audit','核对平台的合并记录']]},
  restriction:{images:[{name:'door-return',caption:'恢复附件 / IMG0921_2.jpg'}],title:'旧项目停用登记 / 复印件',site:'archive',board:'封存附件',author:'资料库',date:'2010-12-08',evidence:'E08',minPhase:2,body:['对象暂称“未定形”。原始影像各自存放时，只能观察到不完整形态。','重复确认人物轮廓、将独立地点合并后，三个原始场景之间出现通行。该通行不符合建筑平面图。','处置记录：保留原片；撤销跨地点合并；封存本批衍生图。随后，原建筑出口重新有效。','不得将合并结果公开分发。单独删除某张缩略图无效，已生成的对应关系仍然存在。'],links:[['appeal','为17-B提交处置意见']]},
  appeal:{title:'给罗岚的回信',site:'mail',board:'草稿',author:'共同署名',date:'2011-09-23',kind:'report',minPhase:2,body:['把查到的去向和处理办法写在这里，附上来源。署名齐了以后，这封信才会发出。所有邮件均为游戏内剧情。']}
};
extendContent(pages);
extendDarkCase(pages,expandedForumOrder);
reviseStory(pages);
export const evidence = Object.fromEntries(Object.entries(pages).filter(([,p])=>p.evidence).map(([id,p])=>[p.evidence,{id:p.evidence,title:p.title,source:id,excerpt:p.body[0]}]));
export const forumOrder=expandedForumOrder;
export const hints=[
  ['从空罐头的原帖和结算记录开始，找出17-B的原始图片出处。','本单详情有扫描日期。店铺的取件说明写了文件密码怎么拼。','订单3271，再接8月14日的0814，密码就是32710814。'],
  ['原片目录有三组资料。每组的送件单位和拍摄时间都能回查。','来源核对表问的是实际拍摄地点，不是暗部看起来像不像。','器材间是医院，楼梯间是学校，卸货口是货站。'],
  ['回信需要交代罗启去了哪、平台出了什么问题、现在怎么处理。','复核记录解释错误答案怎样累积；旧工单提供处置办法。','罗启去了南郊货站。留下原片，把三处地方分开，停用改过的图。别漏掉代领申请。']
];
