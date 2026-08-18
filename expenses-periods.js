(function(){
  const main=document.querySelector('main'); if(!main)return;
  const juneMain=main.innerHTML;
  const months=['1月','2月','3月','4月','5月','6月','7月'];
  const fmt=(v,n=2)=>Number(v).toLocaleString('zh-CN',{minimumFractionDigits:n,maximumFractionDigits:n});
  const pct=v=>`${fmt(v)}%`, mom=(a,b)=>b?((a/b-1)*100):0, sign=v=>v<0?'down':'up';
  const spark=vals=>{
    const lo=Math.min(...vals),hi=Math.max(...vals),range=hi-lo||1,step=vals.length>1?228/(vals.length-1):0;
    const points=vals.map((v,i)=>({v,x:16+i*step,y:66-(v-lo)/range*36}));
    const labels=points.map(p=>`<text class="spark-label ${p.v<0?'negative':'positive'}" x="${p.x}" y="${p.y+(p.y<48?14:-8)}" text-anchor="middle">${fmt(p.v,0)}</text>`).join('');
    return `<div class="spark-bars spark-line" aria-label="${vals.map((v,i)=>`${months[i]} ${v}`).join('，')}"><svg viewBox="0 0 260 96" role="img" aria-hidden="true" focusable="false"><line class="spark-axis" x1="10" y1="66" x2="250" y2="66"></line><polyline class="spark-line-path" points="${points.map(p=>`${p.x},${p.y}`).join(' ')}"></polyline>${points.map(p=>`<circle class="${p.v<0?'negative':'positive'}" cx="${p.x}" cy="${p.y}" r="3.4"></circle>`).join('')}${labels}</svg>${vals.map((v,i)=>`<span class="spark-col" title="${months[i]}：${v}"><small>${months[i]}</small></span>`).join('')}</div>`;
  };
  const cell=c=>typeof c==='object'&&c?`<td class="${c.c||''}">${c.v}</td>`:`<td>${c}</td>`;
  function setTable(index,headers,rows){const t=document.querySelectorAll('table')[index];if(!t)return;t.innerHTML=`<thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(cell).join('')}</tr>`).join('')}</tbody>`}
  function setHeading(oldText,newText){[...document.querySelectorAll('h3')].find(x=>x.textContent.trim()===oldText)?.replaceChildren(newText)}
  function setupSelect(period){const sel=document.querySelector('.period-select');if(!sel)return;sel.innerHTML='<option value="202607">2026年7月</option><option value="202606">2026年6月</option>';sel.value=period;sel.onchange=()=>switchPeriod(sel.value)}
  function updateProcurementTrend(){const panel=[...document.querySelectorAll('article.panel')].find(x=>x.innerText.includes('采购资金趋势'));if(!panel)return;const list=panel.querySelector('.metric-trend-list');if(list)list.innerHTML=`<div><b>采购支付</b>${spark([695.70,726.09,664.33,484.13,448.56,369.82,379.53])}<span>7月 379.53｜累计 3,768.17</span></div><div><b>采购入库</b>${spark([780.45,403.98,563.64,426.24,356.99,459.78,478.56])}<span>7月 478.56｜累计 3,469.64</span></div>`}
  const dept=[
    ['欧美业务部',[3.92,3.93,3.21,2.85,2.84,2.82,2.82]],['拉美业务部',[1.89,1.76,1.96,1.88,2.87,2.76,3.24]],['澳洲业务部',[32.11,30.85,31.74,27.14,28.65,29.05,77.97]],['东南亚业务部',[55.72,47.22,53.98,57.92,58.12,60.73,70.29]],['Upliv业务部',[0,0,0,3.50,3.39,3.50,3.51]],['仓储部',[14.00,11.21,11.21,10.99,11.23,11.21,21.91]],['物流部',[9.22,6.83,6.91,7.51,7.53,7.53,9.04]],['采购部',[11.84,9.46,9.49,9.53,9.64,9.57,11.33]],['技术研发部',[7.82,6.36,6.33,4.69,4.69,4.67,5.74]],['总经办',[19.31,18.83,18.67,18.70,18.64,18.56,18.59]],['财务部',[13.25,11.31,11.30,11.29,11.32,11.22,13.23]],['人事行政部',[9.09,8.10,8.13,8.16,8.18,9.14,10.45]]
  ];
  const productivity=[['澳洲业务部',[1.80,3.18,2.61,2.80,2.19,2.24,.55],14.83],['欧美业务部',[1.82,-10.96,-5.99,-3.33,-1.60,-1.05,-1.62],-21.10],['拉美业务部',[2.90,2.32,-.34,4.09,.49,2.50,3.84],11.96],['东南亚业务部',[1.66,3.76,2.87,1.78,1.58,1.62,1.60],13.28],['保健品项目',[0,0,0,.04,.76,.15,2.41],2.41],['业务部门汇总',[1.74,2.81,2.42,1.90,1.61,1.70,1.09],12.17]];
  function renderJuly(){
    document.querySelector('.period').textContent='数据口径 202607当月 + 2026年1—7月累计 · 单位：万元';
    const status=document.querySelector('.status');if(status)status.innerHTML='<b></b> 源表已复核 · 2026年7月';
    const k=document.querySelectorAll('.kpi-card');
    const kpi=[['综合运营费用｜2607','330.55万元','-1.66%','较上月'],['人工及相关成本｜2607','251.89万元','+44.0%','含辞退赔偿69.86万元'],['采购入库｜202607','478.56万元','+4.08%','累计3,469.64万元'],['库存余额｜202607期末','1,058.43万元','-18.72%','周转率 4.97 次']];
    kpi.forEach((r,i)=>{if(k[i])k[i].innerHTML=`<div class="kpi-top"><span>${r[0]}</span><span class="kpi-dot"></span></div><strong>${r[1]}</strong><div class="kpi-foot"><span class="${r[2].startsWith('-')?'down':'up'}">${r[2]}</span><small>${r[3]}</small></div>`});
    setHeading('1—6月费用趋势与变动说明','1—7月费用趋势与变动说明');setHeading('差旅及业务招待费趋势','差旅及业务招待费趋势（含7月）');setHeading('各部门1—6月人工成本变化','各部门1—7月人工成本变化');setHeading('1—6月采购资金趋势','1—7月采购资金趋势');setHeading('202606支付结构','202607支付结构');setHeading('当月环比与年度累计汇总','6月、7月与年度累计汇总');setHeading('6月与年度累计采购资金占回款比例','7月与年度累计采购资金占回款比例');setHeading('202606费用与占收比','202607费用与占收比');setHeading('202606各国全职、兼职人员及成本变化','202607各国全职、兼职人员及成本变化');setHeading('202606各国海外仓库存变化与周转','202607各国海外仓库存变化与周转');
    const op=[
      ['固定性开支 / 销售费用',[192.91,129.50,134.57,166.41,147.66,162.06,223.79],1156.90,'新增离职赔偿金69.89万元'],['固定性开支 / 管理费用',[116.94,74.29,66.69,65.84,67.63,71.91,68.47],531.77,'环比下降'],['固定性开支 / 财务费用',[10.03,7.74,33.34,25.75,6.78,20.02,25.62],129.29,'新增利息费用2.33万元'],['波动性开支 / 其他出库头程费用',[.56,0,1.03,4.20,.99,.46,1.98],9.21,'含平台预提额'],['波动性开支 / 其他出库盘亏盘盈成本',[.09,-1.81,5.68,21.43,16.18,81.70,10.69],133.96,'清仓金额显著减少'],['综合运营费用合计',[320.53,209.72,241.31,283.62,239.24,336.14,330.55],1961.12,'']
    ];
    setTable(0,['费用项目','1—7月趋势','2606','2607','本年累计','环比','变动说明'],op.map(r=>[r[0],{v:spark(r[1]),c:'trend-cell'},fmt(r[1][5]),fmt(r[1][6]),fmt(r[2]),{v:`${mom(r[1][6],r[1][5])>=0?'+':''}${fmt(mom(r[1][6],r[1][5]))}%`,c:sign(mom(r[1][6],r[1][5]))},r[3]]));
    const focus=[['差旅费用',[1.87,5.91,1.63,3.75,8.52,12.00,4.18],37.85],['业务招待费用',[.99,.03,.73,.64,.66,1.64,.85],5.52],['重点费用合计',[2.85,5.94,2.35,4.39,9.17,13.64,5.03],43.37]];
    setTable(1,['重点费用','1—7月趋势','2606','2607','本年累计','环比'],focus.map(r=>[r[0],{v:spark(r[1]),c:'trend-cell'},fmt(r[1][5]),fmt(r[1][6]),fmt(r[2]),{v:`${fmt(mom(r[1][6],r[1][5]))}%`,c:sign(mom(r[1][6],r[1][5]))}]));
    setTable(2,['部门',...months,'1—7月合计','7月环比'],dept.map(r=>[r[0],...r[1].map(v=>fmt(v)),fmt(r[1].reduce((a,b)=>a+b,0)),{v:`${mom(r[1][6],r[1][5])>=0?'+':''}${fmt(mom(r[1][6],r[1][5]))}%`,c:sign(mom(r[1][6],r[1][5]))}]));
    setTable(3,['项目','1—7月趋势','2607','源表汇总'],productivity.map(r=>[r[0],{v:spark(r[1]),c:'trend-cell'},{v:fmt(r[1][6]),c:sign(r[1][6])},{v:fmt(r[2]),c:sign(r[2])}]));
    setTable(4,['项目','2606','2607','1—7月累计'],[['人工成本',167.01,178.24,1256.39],['辞退赔偿',3.75,69.86,83.74],['工会经费',.54,.58,4.21],['福利费用',3.64,3.21,41.99],['合计',174.95,251.89,1386.33]].map(r=>[r[0],fmt(r[1]),fmt(r[2]),fmt(r[3])]));
    const region=[['马来西亚',9,7.61,8,4.04,17,11.65,3,.46],['泰国',9,4.27,18,4.32,27,8.59,3,.45],['印度尼西亚',13,3.21,15,.99,28,4.20,8,.67],['菲律宾',8,2.29,'—','—',8,2.29,0,-.04],['越南',8,2.85,8,1.11,16,3.96,4,-.42],['新加坡',2,.81,9,5.83,11,6.63,6,2.83],['海外合计',49,21.03,58,16.28,107,37.32,24,3.96],['国内（广东）',28,32.97,'—','—',28,32.97,1,5.60],['东南亚业务部合计',77,54.01,58,16.28,135,70.29,25,9.56]];
    setTable(5,['区域','全职人数','全职成本','兼职人数','兼职成本','总人数','总成本','人数环比','成本环比额'],region.map(r=>r.map((v,i)=>typeof v==='number'&&![1,3,5,7].includes(i)?fmt(v):v)));
    setTable(6,['支付方式','支付金额','订单数','金额占比'],[['国内对私银行',288.27,69,75.95],['诚e赊',36.03,163,9.49],['支付宝(淘宝)',.20,3,.05],['WF(跨境宝）',28.58,146,7.53],['国内对公银行',26.45,5,6.97],['合计',379.53,386,100]].map(r=>[r[0],fmt(r[1]),r[2],pct(r[3])]));
    setTable(7,['源表','2606','2607','环比','本年累计','7月业务量'],[['核心采购明细表——支付数据',369.82,379.53,mom(379.53,369.82),3768.17,'采购付款'],['核心采购明细表-入库数据',459.78,478.56,mom(478.56,459.78),3469.64,'282票 / 152家供应商']].map(r=>[r[0],fmt(r[1]),fmt(r[2]),{v:`+${fmt(r[3])}%`,c:'up'},fmt(r[4]),r[5]]));
    const purchasing=[['澳洲业务部',231.14,100.84,43.63,2125.35,825.61,38.85],['欧美业务部',8.43,0,0,409.64,290.40,70.89],['拉美业务部',69.06,.29,.41,335.32,175.02,52.19],['东南亚业务部',510.13,275.45,54.00,3725.54,2518.71,67.61],['保健品项目',66.40,35.73,53.80,103.93,85.15,81.94],['合计',885.16,412.30,46.58,6699.78,3894.89,58.13]];
    setTable(8,['项目','7月销售回款','7月采购资金','7月占比','累计销售回款','累计采购资金','累计占比'],purchasing.map(r=>[r[0],fmt(r[1]),fmt(r[2]),pct(r[3]),fmt(r[4]),fmt(r[5]),pct(r[6])]));
    const logistics=[['澳洲业务部-汽配家居eBay',56.61,21.68],['欧美业务部-服装',7.65,42.58],['拉美业务部-kitbeez',14.82,16.83],['东南亚业务部-kitbeez',17.59,2.52],['保健品项目-upliv',6.23,7.75],['澳洲业务部-汽配家居TEMU',8.55,27.94],['合计',111.46,9.46]];
    setTable(9,['项目','物流费用','占收比'],logistics.map(r=>[r[0],fmt(r[1]),pct(r[2])]));
    const inv=[['澳洲业务部-汽配家居',428.71,360.81,34.09,[3.5,3.37,3.35,3.33,3.33,2.87,3.11],3.11],['欧美业务部-服装',157.39,42.77,4.04,[3.47,1.35,.77,.46,.42,.48,.66],.66],['拉美业务部-kitbeez',52.14,6.54,.62,[0,3.46,3.36,5.01,4.46,6.59,16.62],16.62],['东南亚业务部-kitbeez',644.06,593.21,56.05,[5.57,6.02,6.23,4.32,4.55,6.02,6.64],6.64],['保健品项目-upliv',12.82,48.41,4.57,[0,0,2.37,6.78,3.06,5.60,5.69],5.69],['全公司',1302.14,1058.43,100,[4.4,4.11,4.14,3.33,3.43,4.01,4.97],4.97]];
    setTable(10,['项目','2606存货','2607存货','2607占比','1—7月周转率趋势','2607周转率'],inv.map(r=>[r[0],fmt(r[1]),fmt(r[2]),pct(r[3]),{v:spark(r[4]),c:'trend-cell'},fmt(r[5])]));
    const wh=[['马来西亚海外仓（含FBS）',87.65,67.91,-19.74,15.27,23.90],['泰国海外仓',81.97,79.57,-2.41,16.42,22.23],['印度尼西亚海外仓',97.83,72.42,-25.41,7.61,47.99],['菲律宾海外仓',58.74,35.10,-23.64,8.91,40.95],['新加坡海外仓',25.62,18.80,-6.82,17.07,21.38],['越南海外仓',37.97,41.12,3.15,9.58,38.09],['海外仓小计',389.78,314.91,-74.87,12.30,29.67]];
    setTable(11,['仓库','期初采购成本','期末采购成本','变动额','年化周转率','周转天数'],wh.map(r=>[r[0],fmt(r[1]),fmt(r[2]),{v:`${r[3]>=0?'+':''}${fmt(r[3])}`,c:sign(r[3])},fmt(r[4]),fmt(r[5])]));
    updateProcurementTrend();
  }
  function switchPeriod(period){main.innerHTML=juneMain;setupSelect(period);if(period==='202607')renderJuly();const url=new URL(location.href);url.searchParams.set('period',period);history.replaceState(null,'',url)}
  const requested=new URL(location.href).searchParams.get('period');switchPeriod(requested==='202606'?'202606':'202607');
})();
