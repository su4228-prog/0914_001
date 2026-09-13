
const PROFILE = window.DONGNE_PROFILE || [];
const HOUSING = window.DONGNE_HOUSING_SEGMENT || [];
const GEO_URL='https://raw.githubusercontent.com/southkorea/seoul-maps/master/kostat/2013/json/seoul_municipalities_geo_simple.json';

const PERSONAS=[
{id:'cost',label:'주거비 부담이 적은 곳',weights:{housing_affordability:5}},
{id:'space',label:'넓은 집이 많은 곳',weights:{spacious_housing:5}},
{id:'calm',label:'조용하고 안정적인 곳',weights:{low_complaint:5,commercial_stable:4}},
{id:'convenient',label:'생활이 편리한 곳',weights:{parking:4,medical:5}},
{id:'family',label:'아이 키우기 좋은 곳',weights:{low_complaint:4,medical:4,education:5}},
{id:'young',label:'젊고 활기찬 곳',weights:{young:5,commercial_dynamic:5}}
];
const SCOREMAP={
low_complaint:'score_low_complaint',parking:'score_parking',medical:'score_medical_infrastructure',
young:'score_young_population',commercial_stable:'score_commercial_longevity',
commercial_dynamic:'score_commercial_dynamic',education:'score_education_2024'
};
const REASONS={
housing_affordability:'선택한 주거조건에서 주거비 부담이 상대적으로 낮아요.',
spacious_housing:'선택한 주거조건에서 임대면적이 상대적으로 넓어요.',
low_complaint:'인구 대비 생활민원 신고 수준이 상대적으로 낮아요.',
parking:'주택가 주차 여건이 상대적으로 좋아요.',
medical:'의료기관·의사 밀도가 상대적으로 높아요.',
young:'20·30대 상주인구 비중이 상대적으로 높아요.',
commercial_stable:'점포 평균 영업기간이 상대적으로 길어요.',
commercial_dynamic:'변화·확장이 활발한 상권 유형에 해당해요.',
education:'2024년 교육 보조지표가 상대적으로 좋아요.',
class_size:'2024년 학급당 학생 수가 상대적으로 적어요.',
teacher_ratio:'2024년 교원 1인당 학생 수가 상대적으로 적어요.',
budget:'설정한 예산 범위와 상대적으로 잘 맞아요.'
};

let latestRanking=[],hasRecommended=false,mapReady=false;

// heading
const heading=document.getElementById('animatedHeading');
heading.innerHTML='';
let ci=0;
'나에게 맞는 서울 동네를\n데이터로 추천드립니다.'.split('\n').forEach(line=>{
 const row=document.createElement('div');
 [...line].forEach(ch=>{
  const s=document.createElement('span'); s.textContent=ch;
  s.style.transitionDelay=`${200+ci*30}ms`; row.appendChild(s); ci++;
 });
 heading.appendChild(row);
});
requestAnimationFrame(()=>heading.querySelectorAll('span').forEach(s=>{s.style.opacity='1';s.style.transform='translateX(0)'}));
setTimeout(()=>document.getElementById('subText').classList.add('show'),800);

// persona
const personaBtns=[...document.querySelectorAll('.persona')];
const selectedInfo=document.getElementById('selectedInfo');
function selectedPersonaIds(){return personaBtns.filter(b=>b.classList.contains('active')).map(b=>b.dataset.persona)}
function updateInfo(msg){
 const n=selectedPersonaIds().length;
 selectedInfo.textContent=msg||(n?`${n}개 성향이 선택되었어요.`:'성향을 선택해 주세요.');
}
personaBtns.forEach(btn=>btn.addEventListener('click',()=>{
 const n=selectedPersonaIds().length;
 if(!btn.classList.contains('active')&&n>=3){updateInfo('성향은 최대 3개까지 선택할 수 있어요.');return}
 btn.classList.toggle('active'); updateInfo();
}));

// advanced
document.getElementById('advancedToggle').addEventListener('click',e=>{
 e.currentTarget.classList.toggle('open'); document.getElementById('advanced').classList.toggle('open');
});
document.querySelectorAll('.segmented').forEach(g=>g.querySelectorAll('.seg-btn').forEach(b=>b.addEventListener('click',()=>{
 g.querySelectorAll('.seg-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active');
 if(g.dataset.group==='contract'){
  const v=b.dataset.value||b.textContent.trim();
  const box=document.getElementById('monthlyBudgetBox');
  if(box) box.style.display=v==='전세'?'none':'';
 }
})));

const detailBtns=[...document.querySelectorAll('.condition-btn')];
detailBtns.forEach(btn=>btn.addEventListener('click',()=>{
 btn.classList.toggle('active');
}));
function selectedDetails(){
 return detailBtns.filter(b=>b.classList.contains('active')).map(b=>b.dataset.detail);
}

function selected(group){const b=document.querySelector(`.segmented[data-group="${group}"] .seg-btn.active`);return b?.dataset.value||b?.textContent.trim()||'전체'}
function parseBudget(id){const x=document.getElementById(id)?.value?.replace(/[^0-9.]/g,'');return x?Number(x):null}

function mm(rows,key,higher=true){
 const vals=rows.map(r=>Number(r[key])).filter(Number.isFinite); const out={};
 if(!vals.length)return out; const mn=Math.min(...vals),mx=Math.max(...vals);
 rows.forEach(r=>{let v=Number(r[key]); if(!Number.isFinite(v)){out[r.district]=0;return}
  let s=mx===mn?50:(v-mn)/(mx-mn)*100; out[r.district]=higher?s:100-s;});
 return out;
}
function segRows(ct,ht){return HOUSING.filter(r=>r.contract_type===ct&&r.housing_type===ht)}
function housingScores(ct,ht){
 const rows=segRows(ct,ht).map(r=>({...r}));
 const space=mm(rows,'rental_area_median_pyeong',true),dep=mm(rows,'deposit_median_10k',false),rent=mm(rows,'monthly_rent_median_10k',false);
 const out={}; rows.forEach(r=>out[r.district]={...r,score_spacious_housing:space[r.district]||0,score_housing_affordability:0});
 if(ct==='전세')Object.values(out).forEach(r=>r.score_housing_affordability=dep[r.district]||0);
 else if(ct==='월세')Object.values(out).forEach(r=>r.score_housing_affordability=(rent[r.district]||0)*.7+(dep[r.district]||0)*.3);
 else{
  const j=segRows('전세',ht),m=segRows('월세',ht),js=mm(j,'deposit_median_10k',false),mr=mm(m,'monthly_rent_median_10k',false),md=mm(m,'deposit_median_10k',false);
  Object.values(out).forEach(r=>{const a=[js[r.district],(mr[r.district]||0)*.7+(md[r.district]||0)*.3].filter(Number.isFinite);r.score_housing_affordability=a.reduce((x,y)=>x+y,0)/a.length});
 }
 return out;
}
function budgetFit(v,b){v=Number(v);if(b==null||!Number.isFinite(v))return null;return v<=b?100:Math.max(0,Math.min(100,b/v*100))}

const educationClassScore=mm(PROFILE,'students_per_class',false);
const educationTeacherScore=mm(PROFILE,'students_per_teacher',false);

function runRecommendation(){
 const ids=selectedPersonaIds(); if(!ids.length){updateInfo('성향을 최소 1개 선택해 주세요.');return}
 const ct=selected('contract'),ht=selected('housing'),depB=parseBudget('depositBudget'),monB=parseBudget('monthlyBudget');
 const detailIds=selectedDetails();
 const hs=housingScores(ct,ht); const weights={};
 ids.forEach(id=>{const p=PERSONAS.find(x=>x.id===id);Object.entries(p.weights).forEach(([k,w])=>weights[k]=(weights[k]||0)+w)});
 const detailWeightMap={
  parking:'parking',
  medical:'medical',
  low_complaint:'low_complaint',
  young:'young',
  commercial_stable:'commercial_stable',
  commercial_dynamic:'commercial_dynamic',
  class_size:'class_size',
  teacher_ratio:'teacher_ratio'
 };
 detailIds.forEach(id=>{const k=detailWeightMap[id]; if(k)weights[k]=(weights[k]||0)+3});
 const hasBudget=depB!=null||(ct==='월세'&&monB!=null); if(hasBudget)weights.budget=5;
 const tw=Object.values(weights).reduce((a,b)=>a+b,0);
 latestRanking=PROFILE.map(base=>{
  const h=hs[base.district]||{}; let bs=[];
  if(depB!=null){const s=budgetFit(h.deposit_median_10k,depB);if(s!=null)bs.push(s)}
  if(ct==='월세'&&monB!=null){const s=budgetFit(h.monthly_rent_median_10k,monB);if(s!=null)bs.push(s)}
  const lookup={
   housing_affordability:Number(h.score_housing_affordability||0),
   spacious_housing:Number(h.score_spacious_housing||0),
   budget:bs.length?bs.reduce((a,b)=>a+b,0)/bs.length:0,
   class_size:Number(educationClassScore[base.district]||0),
   teacher_ratio:Number(educationTeacherScore[base.district]||0)
  };
  Object.entries(SCOREMAP).forEach(([k,c])=>lookup[k]=Number(base[c]||0));
  let sum=0,rc=[];Object.entries(weights).forEach(([k,w])=>{sum+=lookup[k]*w;rc.push([lookup[k]*w,k])});rc.sort((a,b)=>b[0]-a[0]);
  return {...base,...h,match_score:sum/tw,recommend_reasons:rc.slice(0,3).map(x=>REASONS[x[1]])}
 }).sort((a,b)=>b.match_score-a.match_score).map((r,i)=>({...r,rank:i+1}));
 hasRecommended=true;updateMapRanks();
 const t=latestRanking.slice(0,3);document.getElementById('bottomTitle').textContent='TOP 3';document.getElementById('bottomText').textContent=t.map(r=>r.district).join(' · ')+'가 현재 조건에 잘 맞아요.';
 showDistrict(t[0].district);
}

function fmt(v,d=1){const n=Number(v);return Number.isFinite(n)?n.toLocaleString('ko-KR',{maximumFractionDigits:d}):'—'}
function level(v){v=Number(v);if(v>=80)return'매우 우수';if(v>=60)return'우수';if(v>=40)return'보통';if(v>=20)return'낮은 편';return'상대적으로 낮음'}
function showDistrict(name){
 const detail=document.getElementById('detail'),base=PROFILE.find(r=>r.district===name),r=latestRanking.find(x=>x.district===name);
 document.getElementById('detailName').textContent=name;
 if(!hasRecommended){
  document.getElementById('detailRank').textContent='추천 전';document.getElementById('detailScore').textContent='—';document.getElementById('scoreUnit').textContent='';
  document.getElementById('reasons').innerHTML='<div class="reason">적합도는 추천을 실행한 뒤 계산됩니다.</div><div class="reason">먼저 원하는 동네 성향을 선택해 주세요.</div>';
  document.getElementById('metrics').innerHTML=base?`<div class="metric"><b>${fmt(base.parking_supply_rate_pct)}%</b><span>주차장 확보율</span></div><div class="metric"><b>${fmt(base.medical_facilities_per_10k)}</b><span>인구 1만 명당 의료기관</span></div><div class="metric"><b>${base.commercial_change_type||'—'}</b><span>상권 유형</span></div><div class="metric"><b>${base.air_grade||'—'}</b><span>현재 대기질</span></div>`:'';
  detail.classList.add('show');return;
 }
 document.getElementById('detailRank').textContent=r.rank<=3?`추천 ${r.rank}위`:`전체 ${r.rank}위`;
 document.getElementById('detailScore').textContent=r.match_score.toFixed(1);document.getElementById('scoreUnit').textContent=' / 100';
 document.getElementById('reasons').innerHTML=r.recommend_reasons.map(x=>`<div class="reason">${x}</div>`).join('');
 const ct=selected('contract'),ht=selected('housing');
 document.getElementById('metrics').innerHTML=`<div class="metric"><b>${fmt(r.deposit_median_10k,0)}만원</b><span>${ct==='전세'?'전세 보증금':ct==='월세'?'월세 보증금':'보증금'} 중앙값</span></div>${ct==='월세'?`<div class="metric"><b>${fmt(r.monthly_rent_median_10k,0)}만원</b><span>월세 중앙값</span></div>`:''}<div class="metric"><b>${fmt(r.rental_area_median_pyeong)}평</b><span>임대면적 중앙값 · ${ht}</span></div><div class="metric"><b>${level(r.score_medical_infrastructure)}</b><span>의료 인프라</span></div><div class="metric"><b>${fmt(r.parking_supply_rate_pct)}%</b><span>주차장 확보율</span></div><div class="metric"><b>${r.commercial_change_type||'—'}</b><span>상권 유형</span></div>`;
 detail.classList.add('show');
}

// map — original D3 + GeoJSON projection
const svg=d3.select('#mapSvg');

function nameOf(d){
  return d.properties.name || d.properties.SIG_KOR_NM || d.properties.adm_nm || '자치구';
}

async function drawMap(){
  try{
    const geo=await d3.json(GEO_URL);
    const node=document.getElementById('mapSvg');
    const w=node.clientWidth || 900;
    const h=node.clientHeight || 620;

    svg.attr('viewBox',`0 0 ${w} ${h}`).selectAll('*').remove();

    const projection=d3.geoMercator().fitExtent([[26,22],[w-26,h-22]],geo);
    const path=d3.geoPath(projection);
    const g=svg.append('g');

    g.selectAll('path')
      .data(geo.features)
      .join('path')
      .attr('class','gu-path')
      .attr('data-name',d=>nameOf(d))
      .attr('d',path)
      .on('click',(event,d)=>showDistrict(nameOf(d)));

    const labels=g.selectAll('.label-group')
      .data(geo.features)
      .join('g')
      .attr('class','label-group')
      .attr('transform',d=>{
        const c=path.centroid(d);
        return `translate(${c[0]},${c[1]})`;
      });

    labels.append('text')
      .attr('class','gu-label')
      .attr('y',-1)
      .text(d=>nameOf(d));

    labels.append('text')
      .attr('class','gu-score')
      .attr('data-score-for',d=>nameOf(d))
      .attr('y',12)
      .text('');

    document.getElementById('loading').style.display='none';
    mapReady=true;
    updateMapRanks();
  }catch(err){
    document.getElementById('loading').textContent=
      '지도를 불러오지 못했습니다. 인터넷 연결을 확인해주세요.';
    console.error(err);
  }
}

function updateMapRanks(){
  if(!mapReady)return;

  d3.selectAll('.gu-path')
    .classed('rank1',false)
    .classed('rank2',false)
    .classed('rank3',false);

  d3.selectAll('.gu-score').text('');
  d3.selectAll('.label-group').classed('active',false);

  if(!hasRecommended)return;

  latestRanking.slice(0,3).forEach((r,i)=>{
    d3.select(`.gu-path[data-name="${r.district}"]`)
      .classed(`rank${i+1}`,true);

    const scoreNode=d3.select(`.gu-score[data-score-for="${r.district}"]`)
      .text(`${i+1}위 · ${r.match_score.toFixed(1)}`)
      .node();

    scoreNode?.parentNode?.classList.add('active');
  });
}

document.getElementById('recommendBtn').addEventListener('click',runRecommendation);
document.getElementById('closeBtn').addEventListener('click',()=>document.getElementById('detail').classList.remove('show'));
const about=document.getElementById('aboutModal');
document.getElementById('aboutBtn')?.addEventListener('click',()=>about?.classList.add('show'));
document.getElementById('modalClose')?.addEventListener('click',()=>about?.classList.remove('show'));
about?.addEventListener('click',e=>{if(e.target===about)about.classList.remove('show')});
window.addEventListener('resize',()=>{clearTimeout(window.__m);window.__m=setTimeout(drawMap,150)});
drawMap();
