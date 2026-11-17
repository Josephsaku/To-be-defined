const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function pickupChrome(){
  return `<div class="shop-topline"><span>文化路十八号 · 修车铺隔壁</span><span>周一至周六 8:30—19:00</span></div><header class="shop-header"><div class="shop-mark">桥</div><div><strong>长桥图文</strong><p>打印　复印　照片扫描　资料装订</p></div><div class="shop-header-right"><b>网上取文件，到店拿原件</b><span>文件下载 / 原件领取</span></div></header><nav class="shop-nav"><a href="/pickup/pickup" data-doc="pickup">在线取件</a><span>单位批量扫描 / 散客打印 / 原件暂存</span><button class="site-back" data-do="back">返回刚才的页面</button></nav>`;
}

export function pickupDoc(d,{picture,special,docURL}){
  const home=d.kind==='pickup-home';
  const links=(d.links||[]).map(([id,label])=>`<a href="${docURL(id)}" data-doc="${id}" data-from="${esc(d.title)}"><span>${esc(label)}</span><b>›</b></a>`).join('');
  const body=d.body.map(p=>`<p>${esc(p)}</p>`).join('');
  const table=d.table?`<div class="shop-table-scroll"><table class="record-table"><thead><tr>${d.table.columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${d.table.rows.map(row=>`<tr>${row.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'';
  const files=[...(d.image?[{name:d.image,caption:d.title}]:[]),...(d.images||[])];
  const images=files.map(im=>`${picture(im.name,im.caption)}<p class="scan-download"><a href="/assets/${im.name}.jpg" download="${esc(im.caption)}.jpg">下载这张扫描件 · JPG</a></p>`).join('');
  const paperwork=!home&&!['pickup-info'].includes(d.kind);
  return `<div class="shop-crumb">长桥图文 / ${esc(d.board)}</div><div class="shop-layout"><section class="shop-main">
    ${home?`<div class="shop-welcome"><div><p class="shop-kicker">给来店里做过东西的老客户</p><h1>文件扫好了，在这里拿。</h1><p>回执别扔，订单号和联系人都在上面。</p></div><img src="/assets/archive-boxes.jpg" alt="店里装好待领取的纸箱"></div><div class="pickup-steps"><span><b>1</b> 查自己的订单</span><span><b>2</b> 下载扫描文件</span><span><b>3</b> 按约定领原件</span></div><div class="shop-content">${special(d)}<div class="shop-copy">${body}</div><h2>来之前看一下</h2><div class="shop-links">${links}</div><div class="shop-service-note"><b>本周柜台留言</b><p>门店没搬。只下载文件不用跑库房；拿纸质原件，看订单上的预约地点。</p><p>单位批量件请带回执。需要补扫哪一页，在原订单里说清楚，别重新下一单。</p></div></div>`:
    `<header class="shop-document-heading"><span>${esc(d.board)}</span><h1>${esc(d.title)}</h1><p>${esc(d.author)}　·　${esc(d.date)}</p></header><div class="shop-content record-body"><div class="shop-copy">${body}</div>${table}${images}${special(d)}${d.evidence?'<button data-collect="'+d.evidence+'" class="collect">收藏这份资料</button>':''}${paperwork?'<button class="shop-download-text" data-do="download-record" data-id="'+d.id+'">保存本页文字 · TXT</button>':''}${links?'<h2>本页相关文件</h2><div class="shop-links">'+links+'</div>':''}</div>`}
  </section><aside class="shop-sidebar"><section><h2>长桥图文</h2><p>文化路十八号<br>修自行车铺隔壁</p><dl><dt>门店营业</dt><dd>周一至周六<br>8:30—19:00</dd><dt>周日</dt><dd>只接少量复印</dd></dl></section><section class="shop-location"><h2>纸质原件放在哪儿</h2><p>南郊货站西侧租用库房。</p><p>文化路门店放不下的单位批量件，暂存在这里。到库房之前先看预约时间，值班台不临时加印。</p></section><section><h2>交件时说清楚</h2><ul><li>单面还是双面</li><li>照片背面要不要扫</li><li>原件自己拿，还是有人代领</li></ul><p>下载扫描件不算原件签收。</p></section></aside></div>`;
}
