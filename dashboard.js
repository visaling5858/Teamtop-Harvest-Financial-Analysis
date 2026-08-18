(function(){
  const d=window.HARVEST_DATA,page=document.body.dataset.page||"overview";
  const nav=[['overview','index.html','整体概要'],['capital','capital.html','资金管理分析'],['expenses','expenses.html','核心费用分析'],['business','business.html','业务数据分析'],['insights','insights.html','核心观点']];
  const f=(v,n=2)=>typeof v==='number'?v.toLocaleString('zh-CN',{minimumFractionDigits:n,maximumFractionDigits:n}):v;
  const pct=v=>`${f(v,2)}%`, cls=v=>Number(v)<0?'down':'up';
  const mom=(a,b)=>b===0?null:(a/b-1)*100;
  const spark=values=>{const max=Math.max(...values.map(v=>Math.abs(v)),1);return `<div class="spark-wrap"><div class="spark">${values.map((v,i)=>`<i class="${v<0?'bad':''}" style="height:${Math.max(6,Math.abs(v)/max*48)}px" data-label="${d.months[i]}"></i>`).join('')}</div></div>`};
  const table=(headers,rows)=>`<div class="table-wrap"><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td class="${typeof c==='object'&&c?c.c||'':''}">${typeof c==='object'&&c?c.v:c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const panel=(eyebrow,title,body,note='')=>`<section class="panel"><div class="panel-head"><div><small>${eyebrow}</small><h3>${title}</h3></div>${note?`<small>${note}</small>`:''}</div>${body}</section>`;
  const cards=items=>`<div class="cards">${items.map(x=>`<article class="card ${x[3]||''}"><small>${x[0]}</small><strong>${x[1]}</strong><span>${x[2]}</span></article>`).join('')}</div>`;
  const pageHead=(e,t,p)=>`<div class="hero"><div><span class="eyebrow">${e}</span><h2>${t}</h2><p>${p}</p></div></div>`;
  function shell(content){document.body.innerHTML=`<div class="app"><aside class="sidebar"><a class="brand" href="index.html"><img src="harvest-logo.jpg" alt="天拓海汇 HARVEST"><span><strong>财务分析看板</strong><small>MONTHLY BUSINESS REVIEW</small></span></a><nav class="nav">${nav.map(n=>`<a href="${n[1]}" class="${n[0]===page?'active':''}">${n[2]}</a>`).join('')}</nav><div class="source-note"><b>当前数据期 ${d.period}</b><br>${d.sourceFile}<br>源表已复核 · 单位：万元</div></aside><main class="main"><header class="topbar"><h1>${nav.find(n=>n[0]===page)[2]}</h1><span class="period">${d.periodLabel}当月 + ${d.ytdLabel}</span></header><div class="content">${content}<footer class="footer">© 2026 天拓海汇 HARVEST · 汇报对象：总经理 · 财务总监</footer></div></main></div>`}
  function overview(){
    const p=d.profit,b=d.balance,revMom=mom(p.revenue[6],p.revenue[5]),netMom=p.net[6]-p.net[5];
    const profitRows=[['二、营业利润',p.operating],['三、利润总额',p.total],['四、净利润',p.net]].map(([n,a])=>[n,{v:spark(a),c:'trend'},f(a[5]),{v:f(a[6]),c:cls(a[6])},{v:f(p.ytd[n.includes('营业利润')?'operating':n.includes('总额')?'total':'net']),c:'down'}]);
    const balanceRows=[['货币资金',b.cash,'万元'],['存货',b.inventory,'万元'],['资产总计',b.assets,'万元'],['负债合计',b.liabilities,'万元'],['所有者权益合计',b.equity,'万元'],['资产负债率',b.debtRatio,'%']].map(([n,a,u])=>[n,{v:spark(a),c:'trend'},u==='%'?pct(a[5]):f(a[5]),{v:u==='%'?pct(a[6]):f(a[6]),c:n==='负债合计'||n==='资产负债率'?'down':cls(a[6]-a[5])},u==='%'?`${f(a[6]-a[5])}pct`:`${f(mom(a[6],a[5]))}%`]);
    shell(pageHead('EXECUTIVE OVERVIEW','收入延续回升，亏损仍处高位','7月收入环比增长，但离职赔偿推高费用与账面亏损；库存继续下降，资产负债率进一步上升。')+cards([
      ['7月营业收入',`${f(p.revenue[6])}万元`,`环比 `+f(revMom)+'%','good'],['7月净利润',`${f(p.net[6])}万元`,`较6月改善 ${f(netMom)}万元`,'bad'],['1—7月累计净利润',`${f(p.ytd.net)}万元`,'连续亏损需重点修复','bad'],['资产负债率',pct(b.debtRatio[6]),`环比上升 ${f(b.debtRatio[6]-b.debtRatio[5])}pct`,'warn']
    ])+panel('MONTHLY PROFIT TRACKING','1—7月利润变化趋势',table(['源表利润指标','月度趋势','6月','202607','本年累计'],profitRows),'金额单位：万元')+panel('BALANCE SHEET TRACKING','1—7月核心资产负债指标',table(['核心指标','月度趋势','2606','2607','环比/变动'],balanceRows),'资产负债表为月末时点口径'));
  }
  function capital(){
    const cfRows=d.cashflow.current.map((r,i)=>[r[0],f(r[1]),{v:f(r[2]),c:cls(r[2])},{v:f(r[3]),c:cls(r[3])},f(d.cashflow.ytd[i][1]),{v:f(d.cashflow.ytd[i][2]),c:cls(d.cashflow.ytd[i][2])},{v:f(d.cashflow.ytd[i][3]),c:cls(d.cashflow.ytd[i][3])}]);
    const loanRows=d.loans.rows.map(r=>[r[0],f(r[1]),f(r[2])]); loanRows.push(['合计',f(d.loans.balance),f(d.loans.interest)]);
    const channelRows=d.funds.channels.map(r=>[r[0],f(r[1]),pct(r[2])]);
    shell(pageHead('CAPITAL MANAGEMENT','资金余额下降，7月项目现金流小幅转正','账户资金、项目现金流与融资余额分口径呈现；项目累计分摊后净值仍为负。')+cards([
      ['资产负债表货币资金',`${f(d.balance.cash[6])}万元`,`较6月下降 ${f(d.balance.cash[5]-d.balance.cash[6])}万元`,'warn'],['渠道账户本位币合计',`${f(d.funds.accountTotal)}万元`,'来源：各渠道资金余额情况表',''],['7月分摊后项目净值',`${f(d.cashflow.current[5][3])}万元`,'由6月46.52万元降至10.74万元','good'],['贷款余额',`${f(d.loans.balance)}万元`,`7月利息 ${f(d.loans.interest)}万元`,'warn']
    ])+panel('PROJECT CASH FLOW','7月与1—7月项目现金流',table(['项目','7月进账','7月业务净值','7月分摊后净值','累计进账','累计业务净值','累计分摊后净值'],cfRows),'金额单位：万元')+`<div class="grid-2">`+panel('CHANNEL BALANCE','主要渠道资金结构',table(['渠道','折合人民币','占渠道资金'],channelRows),'渠道表口径')+panel('FINANCING','贷款余额及7月利息',table(['贷款账户','人民币余额','7月利息'],loanRows),'1—7月累计利息 '+f(d.loans.ytdInterest)+'万元')+`</div>`);
  }
  function expenses(){
    const opRows=d.operatingExpenses.rows.map(r=>[r[0],{v:spark(r[1]),c:'trend'},f(r[1][5]),f(r[1][6]),f(r[2]),{v:`${f(mom(r[1][6],r[1][5]))}%`,c:cls(mom(r[1][6],r[1][5]))},r[3]]);
    const laborRows=d.labor.summary.map(r=>[r[0],f(r[1]),f(r[2]),f(r[3]),{v:`${f(mom(r[2],r[1]))}%`,c:cls(mom(r[2],r[1]))}]);
    const payRows=d.procurement.payments.map(r=>[r[0],f(r[1]),f(r[2],0),pct(r[3])]);
    const logRows=d.logistics.rows.map(r=>[r[0],f(r[1]),pct(r[2])]);
    const invRows=d.inventory.rows.map(r=>[r[0],f(r[1]),f(r[2]),{v:`${f(mom(r[2],r[1]))}%`,c:cls(mom(r[2],r[1]))},f(r[3])]);
    shell(pageHead('COST & OPERATIONS','综合费用回落，但人工成本显著上升','7月运营费用小幅回落；离职赔偿使人工相关成本明显上升，采购与物流保持较高规模。')+cards([
      ['7月综合运营费用','330.55万元','环比下降1.66%','good'],['7月人工及相关成本','251.89万元','含辞退赔偿69.86万元','bad'],['7月采购支付','379.53万元','386笔付款',''],['全公司库存','1,058.43万元','环比下降18.72%','good']
    ])+panel('OPERATING EXPENSES','1—7月综合运营费用',table(['费用项目','趋势','2606','2607','累计','环比','变动说明'],opRows),'金额单位：万元')+`<div class="grid-2">`+panel('LABOR','人工及相关成本',table(['项目','2606','2607','累计','环比'],laborRows),'金额单位：万元')+panel('PROCUREMENT','202607采购支付结构',table(['支付方式','金额','订单数','金额占比'],payRows),`入库 ${f(d.procurement.inbound.july)}万元 / ${d.procurement.inbound.orders}票`)+`</div>`+`<div class="grid-2">`+panel('LOGISTICS','202607项目物流费用',table(['项目','物流费用','占收比'],logRows),'金额单位：万元')+panel('INVENTORY','库存余额与年化周转率',table(['项目','2606存货','2607存货','环比','2607周转率'],invRows),'金额单位：万元')+`</div>`);
  }
  function business(){
    const projectRows=d.projects.map(r=>[r[0],pct(r[1]),pct(r[2]),pct(r[3]),pct(r[4]),pct(r[5]),pct(r[6]),{v:pct(r[7]),c:r[7]<0?'down':'up'},{v:`${r[8]>=0?'+':''}${f(r[8])}pct`,c:cls(r[8])},f(r[9]),pct(r[10])]);
    const regionRows=d.seaRegion.map(r=>[r[0],f(r[1]),f(r[2]),{v:f(r[3]),c:cls(r[3])},{v:pct(r[4]),c:r[4]<8?'down':'up'},{v:pct(r[5]),c:r[5]>20?'down':''}]);
    const liveRows=d.seaLive.map(r=>[r[0],f(r[1]),f(r[2]),{v:f(r[3]),c:cls(r[3])},{v:pct(r[4]),c:r[4]<5?'down':'up'},{v:pct(r[5]),c:r[5]>20?'down':''}]);
    const uplivRows=d.uplivRegion.map(r=>[r[0],f(r[1]),f(r[2]),{v:f(r[3]),c:cls(r[3])},{v:pct(r[4]),c:r[4]<0?'down':'up'},pct(r[5])]);
    const prodRows=d.productivity.map(r=>[r[0],r[1],f(r[2]),{v:f(r[3]),c:cls(r[3])},f(r[2]/r[1]),{v:f(r[3]/r[1]),c:cls(r[3])}]);
    shell(pageHead('BUSINESS PERFORMANCE','东南亚毛利回升，欧美项目继续亏损','7月核心项目合计毛利171.55万元；欧美服装毛利率进一步降至-25.47%，越南退款率达到37.90%。')+cards([
      ['核心项目收入','1,177.81万元','7月核心业务部门口径','good'],['核心项目毛利','171.55万元','综合毛利率14.57%','good'],['欧美服装毛利率','-25.47%','连续为负','bad'],['东南亚退款率','14.39%','越南37.90%','warn']
    ])+panel('CORE PROJECTS','核心项目费项占比、毛利与累计',table(['项目','商品成本','物流','成交费','推广','仓储','其他','7月毛利率','环比','累计毛利','累计毛利率'],projectRows),'金额单位：万元')+`<div class="grid-2">`+panel('SEA REGION','东南亚区域维度',table(['区域','销售额','退款额','毛利额','毛利率','退款率'],regionRows),'202607')+panel('SEA LIVE','东南亚直播间汇总',table(['区域','GMV','退款','毛利额','毛利率','退款率'],liveRows),'202607')+`</div>`+`<div class="grid-2">`+panel('UPLIV REGION','upliv区域维度',table(['区域','销售额','退款额','毛利额','毛利率','退款率'],uplivRows),'源表末段数据按2607识别')+panel('PRODUCTIVITY','202607业务部门人效',table(['业务部门','人数','收入','毛利','人均产能','人均毛利'],prodRows),'人数含海外')+`</div>`+`<div class="alert">upliv直播间2607源表为零值；本页不沿用6月直播间数据，避免将历史值误标为7月。</div>`);
  }
  function insights(){
    const warningRows=[
      ['利润','四、净利润',`${f(d.profit.net[6])}万元`,'剔除离职赔偿后仍为亏损'],['费用','人工及相关成本','251.89万元','辞退赔偿69.86万元'],['项目','欧美业务部-服装','毛利率-25.47%','连续为负且环比下降'],['区域','东南亚越南','退款率37.90%','高退款风险'],['库存','全公司库存','1,058.43万元','环比下降18.72%'],['资金','贷款余额',`${f(d.loans.balance)}万元`,`7月利息${f(d.loans.interest)}万元`],['现金流','累计分摊后业务净值','-387.75万元','2026累计为负']
    ].map(r=>[r[0],r[1],{v:r[2],c:String(r[2]).includes('-')?'down':''},r[3]]);
    const cardsHtml=`<div class="insights">${[
      ['收入与毛利','收入环比继续回升','7月营业收入1,177.85万元，环比增长4.66%；核心项目毛利171.55万元。','good'],
      ['净利润','账面亏损仍处高位','7月净利润-161.36万元，1—7月累计-586.93万元。','bad'],
      ['费用','离职赔偿推高人工成本','7月人工及相关成本251.89万元，其中辞退赔偿69.86万元。','bad'],
      ['库存','库存继续下降','全公司库存降至1,058.43万元，年化周转率升至4.97。','good']
    ].map(x=>`<article class="panel insight ${x[3]}"><small>${x[0]}</small><h3>${x[1]}</h3><p>${x[2]}</p></article>`).join('')}</div>`;
    const vp=table(['序号','源表核心业务观点'],d.viewpoints.map((v,i)=>[i+1,v]));
    const source=panel('DATA UPDATE','数据中心',`<div class="source-box" id="data-update"><dl><dt>当前数据期</dt><dd>${d.periodLabel}</dd><dt>累计口径</dt><dd>${d.ytdLabel}</dd><dt>接入文件</dt><dd>${d.sourceFile}</dd><dt>映射方式</dt><dd>共享数据文件统一驱动五个页面；利润、资产负债、资金、费用、采购、物流、库存、核心项目及区域指标均按源表标签映射。</dd><dt>数据质量提示</dt><dd>源表中少量空白业务行含 #DIV/0!，部分外部引用含 #REF!；核心看板仅使用已成功计算的指标。upliv区域末段虽仍标为2606，但数值与2607核心项目表一致，已按2607识别；upliv直播间2607为零值。</dd></dl></div>`);
    shell(pageHead('MANAGEMENT INSIGHTS','7月管理层核心观点','以源表已填写的“核心业务观点”为主，并结合利润、现金流、项目毛利与资产负债率形成预警。')+cardsHtml+panel('RISK WATCH','202607管理层重点关注事项',table(['类别','指标/项目','202607或累计值','预警说明'],warningRows))+panel('SOURCE VIEWPOINTS','源表特殊情况说明',vp)+source);
  }
  ({overview,capital,expenses,business,insights}[page]||overview)();
  if(location.hash){requestAnimationFrame(()=>document.querySelector(location.hash)?.scrollIntoView({block:'start'}));}
})();
