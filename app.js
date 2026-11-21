{
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const WD=['dom','seg','ter','qua','qui','sex','sáb'],MO=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const DD=s=>new Date(s+'T12:00:00');
const isoL=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const fD=s=>{if(!s)return'';const d=DD(s.slice(0,10));return WD[d.getDay()]+' '+d.getDate()+' '+MO[d.getMonth()]};
const fDT=s=>!s?'':fD(s)+(s.length>10?', '+s.slice(11,16):'');
const daysTo=s=>Math.round((DD(s.slice(0,10))-DD(isoL(new Date())))/864e5);
const num=v=>Math.round(+v||0).toLocaleString('pt-BR');
const kg=g=>(g/1000).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})+' kg';

/* reference data */
const PL={centro:['Centro (Stortorget)',69.6496,18.956],aeroporto:['Aeroporto de Tromsø (TOS)',69.6833,18.9189],catedral:['Catedral do Ártico',69.6481,18.9874],fjellheisen:['Fjellheisen / Storsteinen',69.6395,19.004],polaria:['Polaria',69.6436,18.9479],museu:['Museu Polar',69.6532,18.9622],mack:['Ølhallen (Mack)',69.6463,18.9535],pust:['Sauna flutuante (porto)',69.6487,18.9603],cais:['Cais Prostneset',69.6478,18.9603],prestvannet:['Lago Prestvannet',69.6609,18.9334],telegrafbukta:['Telegrafbukta',69.6316,18.9216],huskies:['Fazenda de huskies (Kvaløya)',69.66,18.8],renas:['Acampamento de renas (Kvaløya)',69.72,18.7],ersfjord:['Ersfjordbotn',69.697,18.656],sommaroy:['Sommarøy',69.634,18.013],skjervoy:['Skjervøy (baleias)',70.034,20.971],lyngen:['Alpes de Lyngen',69.576,20.219],tamok:['Vale de Tamok',69.15,19.7]};
const CAT={aurora:'Aurora',passeio:'Passeio',natureza:'Natureza',cultura:'Cultura',comida:'Comida',transporte:'Transporte',descanso:'Descanso'};
const AST={ideia:['Ideia',''],planejado:['Planejado','pet'],reservado:['Reservado','aur'],feito:['Feito','ok']};
const DT={aurora:'Noite de aurora',descanso:'Descanso',flex:'Flexível',viagem:'Viagem'};
const RT={voo:'Voo',hospedagem:'Hospedagem',trem:'Trem',onibus:'Ônibus',balsa:'Balsa',carro:'Aluguel de carro',passeio:'Passeio'};
const RS={pendente:['Sem confirmação','warn'],confirmada:['Confirmada','ok'],cancelada:['Cancelada','']};
const DTY={passaporte:'Passaporte',seguro:'Seguro viagem',voucher:'Voucher',ingresso:'Ingresso',comprovante:'Comprovante',outro:'Outro'};
const MC={roupas:'Roupas',acessorios:'Acessórios',eletronicos:'Eletrônicos',higiene:'Higiene',saude:'Saúde e remédios',documentos:'Documentos'};
const MS=['Pendente','Separado','Na mala'];
const TPL=[['roupas','Segunda pele térmica (blusa)',2,200,'desp'],['roupas','Segunda pele térmica (calça)',2,180,'desp'],['roupas','Camada intermediária (fleece ou lã)',2,450,'desp'],['roupas','Jaqueta de pluma',1,700,'mao'],['roupas','Casaco corta-vento impermeável',1,600,'desp'],['roupas','Calça de neve',1,700,'desp'],['roupas','Meias de lã',6,80,'desp'],['acessorios','Botas de neve',1,1600,'desp'],['acessorios','Luva fina (forro)',1,60,'mao'],['acessorios','Luva grossa impermeável',1,250,'desp'],['acessorios','Balaclava',1,80,'mao'],['acessorios','Gorro',1,100,'mao'],['acessorios','Grampos antiderrapantes para gelo',1,250,'desp'],['eletronicos','Power bank (o frio descarrega a bateria)',1,350,'mao'],['eletronicos','Câmera e baterias extras',1,900,'mao'],['eletronicos','Tripé',1,1200,'desp'],['higiene','Hidratante e protetor labial',1,150,'mao'],['saude','Remédios de uso pessoal',1,150,'mao']];

/* state */
const COLS=['atv','res','docs','contatos','mala','dias'];
const S={cfg:null,atv:{},res:{},docs:{},contatos:{},mala:{},dias:{}};
let db=null,fb=null,user=null,mode='loading',ro=false;
const CONF=window.TROMSO_CONFIG||{};
try{const c=JSON.parse(localStorage.getItem('tromsoapp')||'null');if(c)Object.assign(S,c)}catch(e){}
const CFG=()=>Object.assign({a:'Pessoa 1',b:'Pessoa 2',ini:isoL(new Date()),fim:isoL(new Date(Date.now()+6*864e5)),rate:0.53,lim:{a:{desp:23,mao:8},b:{desp:23,mao:8}}},S.cfg||{});
const NM=q=>q==='a'?CFG().a:q==='b'?CFG().b:'Casal';
const list=c=>Object.entries(S[c]).map(([id,v])=>({id,...v}));
function days(){const c=CFG(),o=[];let d=DD(c.ini);const e=DD(c.fim);for(let i=0;i<40&&d<=e;i++){o.push(isoL(d));d=new Date(d.getTime()+864e5)}return o}
let cacheT;function cache(){clearTimeout(cacheT);cacheT=setTimeout(()=>{try{localStorage.setItem('tromsoapp',JSON.stringify(S))}catch(e){}},300)}
const chains={};
function put(c,id,data){const clean={...data};delete clean.id;if(c==='cfg')S.cfg=clean;else S[c][id]=clean;cache();render();
if(!db)return;const p=c==='cfg'?'cfg/trip':c+'/'+id;chains[p]=(chains[p]||Promise.resolve()).then(()=>db.doc(p).set(clean)).catch(err)}
function del(c,id){delete S[c][id];cache();render();if(!db)return;const p=c+'/'+id;chains[p]=(chains[p]||Promise.resolve()).then(()=>db.doc(p).delete()).catch(err)}
function err(e){const c=e&&e.code;if(c==='invalid_argument'||c==='permission-denied'){ro=true;sync('warn','Somente leitura');toast('Você não tem permissão para editar este app.')}else if(c==='quota_exceeded')toast('O espaço do banco acabou. Apaguem itens antigos.');else toast('Não consegui salvar. Tente de novo.')}
function sync(cls,t){const s=$('#sync');s.className=cls;s.lastElementChild.textContent=t}
let tt;function toast(t){const x=$('#toast');x.textContent=t;x.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>x.classList.remove('on'),2600)}

/* sun for Tromsø, local time (UTC+1), minutes */
function sun(ds){const d=DD(ds),n=Math.round((d-new Date(d.getFullYear(),0,1,12))/864e5)+1,g=2*Math.PI/365*(n-1);
const dec=.006918-.399912*Math.cos(g)+.070257*Math.sin(g)-.006758*Math.cos(2*g)+.000907*Math.sin(2*g)-.002697*Math.cos(3*g)+.00148*Math.sin(3*g);
const eq=229.18*(.000075+.001868*Math.cos(g)-.032077*Math.sin(g)-.014615*Math.cos(2*g)-.040849*Math.sin(2*g));
const lat=69.6492*Math.PI/180,noon=720-4*18.9553-eq+60;
const ha=h=>{const c=(Math.sin(h*Math.PI/180)-Math.sin(lat)*Math.sin(dec))/(Math.cos(lat)*Math.cos(dec));return c>1?null:c<-1?720:Math.acos(c)*180/Math.PI*4};
const s=ha(-.833),t=ha(-6);return{s:s==null?null:[noon-s,noon+s],t:t==null?null:[noon-t,noon+t]}}
const hm=m=>{m=Math.round(m);return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0')};
const pc=m=>(m/1440*100).toFixed(2)+'%';
function lightBar(k){const s=sun(k);
const h=`<div class="light" aria-hidden="true"><i class="au" style="left:${pc(1080)};width:${pc(360)}"></i><i class="au" style="left:0;width:${pc(60)}"></i>${s.t?`<i class="tw" style="left:${pc(s.t[0])};width:${pc(s.t[1]-s.t[0])}"></i>`:''}${s.s?`<i class="sn" style="left:${pc(s.s[0])};width:${pc(Math.max(6,s.s[1]-s.s[0]))}"></i>`:''}</div><div class="ticks"><span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>24h</span></div>`;
const t=s.s?`Sol ${hm(s.s[0])}–${hm(s.s[1])} · claridade ${hm(s.t[0])}–${hm(s.t[1])}`:s.t?`Noite polar, sem sol · claridade ${hm(s.t[0])}–${hm(s.t[1])}`:'Sem claridade';
return h+`<div class="sub" style="margin-top:4px">${t}</div>`}

/* derived */
const dayAtv=k=>list('atv').filter(a=>a.dia===k).sort((x,y)=>(x.ord??99)-(y.ord??99)||(x.hora||'99').localeCompare(y.hora||'99'));
const resOn=k=>list('res').filter(r=>r.status!=='cancelada'&&(r.ini||'').slice(0,10)===k);
function bagW(q,onde){return list('mala').filter(m=>m.quem===q&&m.onde===onde).reduce((s,m)=>s+(+m.peso||0)*(+m.qtd||1),0)}
function alerts(){const c=CFG(),out=[],now=Date.now(),lim90=new Date(DD(c.fim).getTime()+90*864e5);
for(const d of list('docs')){if(d.validade){const v=DD(d.validade);
if(v<DD(c.fim))out.push(['bad',`${d.titulo} vence antes do fim da viagem`,`Validade ${fD(d.validade)}`,'docs',d.id]);
else if(d.tipo==='passaporte'&&v<lim90)out.push(['bad',`${d.titulo}: validade curta`,`Vence ${fD(d.validade)}; precisa valer até 3 meses após a saída do Schengen (${lim90.getDate()} ${MO[lim90.getMonth()]})`,'docs',d.id])}
if(d.tipo==='seguro'&&d.inverno!=='sim')out.push(['warn','Confirmar cobertura de esportes de inverno',`${d.titulo}: trenó, snowmobile e similares costumam exigir cobertura específica`,'docs',d.id]);
if(d.tipo==='seguro'&&!d.tel)out.push(['warn','Falta o telefone do seguro',d.titulo,'docs',d.id])}
for(const r of list('res')){if(r.status==='cancelada')continue;
if(r.cancelAte){const dl=new Date(r.cancelAte).getTime(),dd=Math.ceil((dl-now)/864e5);if(dl>now&&dd<=14)out.push([dd<=3?'bad':'warn',`Cancelamento grátis acaba em ${dd} ${dd===1?'dia':'dias'}`,`${r.titulo} · até ${fDT(r.cancelAte)}`,'res',r.id])}
if(r.status==='pendente')out.push(['warn','Reserva sem confirmação',r.titulo,'res',r.id])}
for(const q of['a','b']){const l=c.lim&&c.lim[q]||{};const d=bagW(q,'desp')/1000,m=bagW(q,'mao')/1000;
if(l.desp&&d>l.desp)out.push(['bad',`Mala despachada de ${NM(q)} acima do limite`,`${kg(d*1000)} de ${l.desp} kg (estimado)`,'mala',q]);
if(l.mao&&m>l.mao)out.push(['warn',`Mala de mão de ${NM(q)} acima do limite`,`${kg(m*1000)} de ${l.mao} kg (estimado)`,'mala',q])}
return out.sort((x,y)=>(x[0]==='bad'?0:1)-(y[0]==='bad'?0:1))}

/* views */
let V='inicio',selDay=null,rotMode='lista',resF='todas',docQ='a',malaQ='a',onlyMiss=false,themeMode='auto';
const exBanner=()=>Object.values(S).some(o=>o&&typeof o==='object'&&(o.ex||Object.values(o).some(v=>v&&v.ex)))?`<div class="exb"><span>Estes são dados de exemplo para vocês verem como fica.</span><button class="btn" data-x="goclear">Como limpar</button></div>`:'';
function meter(l,a,b,tot){const pa=tot?a/tot*100:0,pb=tot?b/tot*100:0;return `<div class="meter"><div class="l">${esc(l)}<span>${a} de ${tot}${b?` · ${b} separados`:''}</span></div><div class="bar"><i class="a" style="width:${pa}%"></i><i class="b" style="width:${pb}%"></i></div></div>`}
function scene(){let s=7,st='';const r=()=>(s=s*16807%2147483647)/2147483647;for(let i=0;i<60;i++)st+=`<circle cx="${(r()*800)|0}" cy="${(r()*120)|0}" r="${(r()*1.2+.3).toFixed(1)}" opacity="${(r()*.6+.3).toFixed(2)}"/>`;
let h='',x=16;const col=['#c9473c','#e2a53b','#f1ece0','#7a3b3b','#d8c27a'];while(x<250){const w=14+r()*12,t=10+r()*12,y=206-t;h+=`<rect x="${x|0}" y="${y|0}" width="${w|0}" height="${t|0}" fill="${col[(r()*5)|0]}"/><polygon points="${(x-2)|0},${y|0} ${(x+w/2)|0},${(y-7)|0} ${(x+w+2)|0},${y|0}" fill="#eef6f7"/><rect x="${(x+w/2-2)|0}" y="${(y+4)|0}" width="4" height="5" fill="#ffd98a"/>`;x+=w+3+r()*5}
return `<svg viewBox="0 0 800 240" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05202c"/><stop offset=".55" stop-color="#0d5566"/><stop offset=".85" stop-color="#7d6aa8"/><stop offset="1" stop-color="#e79aa8"/></linearGradient><linearGradient id="ag" x1="0" x2="1"><stop offset="0" stop-color="#5fe0d2" stop-opacity="0"/><stop offset=".35" stop-color="#5fe0d2" stop-opacity=".85"/><stop offset=".7" stop-color="#b6a0ff" stop-opacity=".7"/><stop offset="1" stop-color="#b6a0ff" stop-opacity="0"/></linearGradient><linearGradient id="m1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eaf2f6"/><stop offset=".4" stop-color="#8aa3bd"/><stop offset="1" stop-color="#3d5f7a"/></linearGradient><linearGradient id="m2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d3e6ea"/><stop offset=".3" stop-color="#1f5468"/><stop offset="1" stop-color="#0a2e3c"/></linearGradient></defs>
<rect width="800" height="240" fill="url(#sk)"/><g fill="#fff">${st}</g><g class="aurb"><path d="M-40 110 C 140 30 300 130 470 60 S 720 30 840 90" stroke="url(#ag)" stroke-width="34" fill="none" opacity=".6"/><path d="M-40 84 C 160 40 320 90 500 40 S 700 50 840 44" stroke="url(#ag)" stroke-width="10" fill="none" opacity=".75"/></g>
<path d="M0 180 L80 130 L150 160 L240 110 L320 158 L420 126 L520 166 L610 118 L700 150 L800 120 V240 H0Z" fill="url(#m1)" opacity=".9"/><path d="M0 206 L60 176 L130 194 L200 170 L260 200 L460 204 L620 198 L690 164 L760 182 L800 170 V240 H0Z" fill="url(#m2)"/><rect y="206" width="800" height="24" fill="#082c3a"/>
<path d="M270 206 Q 470 164 650 204" stroke="#e8f4f6" stroke-width="3" fill="none"/><g stroke="#e8f4f6" stroke-width="1.6"><path d="M320 196V206M380 185V206M440 180V206M500 180V206M560 186V206M610 196V206"/></g>
<g transform="translate(680 0)"><polygon points="0,206 30,150 60,206" fill="#c9d8e6"/><polygon points="10,206 32,162 56,206" fill="#f4fafb"/><polygon points="26,206 34,186 44,206" fill="#ffd98a"/></g><g>${h}</g><path d="M0 226 Q 220 212 420 224 T 800 220 V240 H0Z" fill="#f3f8f9"/></svg>`}

function vInicio(){const c=CFG(),ds=days(),today=isoL(new Date()),dl=daysTo(c.ini),de=daysTo(c.fim);
let big,sm;if(dl>0){big=dl;sm=dl===1?'dia para embarcar':'dias para embarcar'}else if(de>=0){big='Dia '+(1-dl);sm='de '+ds.length}else{big='♥';sm='viagem concluída'}
const inTrip=ds.includes(today);const k=inTrip?today:(ds.find(d=>(S.dias[d]||{}).tipo!=='viagem')||ds[0]);const di=S.dias[k]||{};
const A=dayAtv(k),R=resOn(k),al=alerts();
const cnt=q=>{const l=list('mala').filter(m=>m.quem===q);return[l.filter(m=>m.estado==2).length,l.filter(m=>m.estado==1).length,l.length]};
const rs=list('res').filter(r=>r.status!=='cancelada'),dc=list('docs');
return exBanner()+`<div class="hero">${scene()}<div class="t"><div><h1>Tromsø</h1><p>${esc(c.a)} &amp; ${esc(c.b)}</p><p>${fD(c.ini)} a ${fD(c.fim)} · ${ds.length} dias</p></div><div class="c"><b>${big}</b><span>${sm}</span></div></div></div>
<div class="two"><div><div class="card"><div class="hdr" style="margin-bottom:4px"><h3>${inTrip?'Hoje':'Prévia do resumo do dia'}</h3><span class="pill ${di.tipo==='aurora'?'aur':''}">${esc(DT[di.tipo]||'Sem tipo')}</span></div><div class="sub">${fD(k)}${inTrip?'':' · é assim que esta tela fica durante a viagem'}</div>${lightBar(k)}
<div style="margin-top:12px">${A.length?A.map(a=>`<div class="row"><span class="tm ${a.hora?'':'none'}">${esc(a.hora||'—')}</span><button class="abody" data-x="edit" data-c="atv" data-id="${a.id}"><b>${esc(a.titulo)}</b><span class="sub">${esc(PL[a.local]?PL[a.local][0]:a.localTxt||'')}</span></button></div>`).join(''):'<p class="empty">Nada planejado.</p>'}</div>
${R.length?`<p class="sub" style="margin:10px 0 4px;font-weight:600">Reservas do dia</p>`+R.map(r=>`<div class="row"><span class="pill ${RS[r.status][1]}">${RS[r.status][0]}</span><button class="abody" data-x="edit" data-c="res" data-id="${r.id}"><b>${esc(r.titulo)}</b><span class="sub">${r.busca?'Busca no hotel '+esc(r.busca):fDT(r.ini)}</span></button></div>`).join(''):''}
<div class="card" style="background:var(--soft);border:0;margin:14px 0 0"><b>${di.tipo==='aurora'?'Noite de caça à aurora':'Aurora'}</b><p class="sub" style="margin:4px 0 8px">${di.tipo==='aurora'?'O que mais pesa é céu limpo, mais do que o índice Kp. Confiram a cobertura de nuvens no fim da tarde.':'Noite sem caça planejada; se o céu abrir, olhem para o norte entre 18h e 1h.'}${di.planoB?` Plano B: ${esc(di.planoB)}`:''}</p><div class="btns"><a class="btn" href="https://www.yr.no/en/forecast/daily-table/1-305409/Norway/Troms/Troms%C3%B8/Troms%C3%B8">Nuvens e clima (yr.no)</a><a class="btn" href="https://www.swpc.noaa.gov/products/aurora-30-minute-forecast">Previsão de aurora (NOAA)</a></div><p class="sub" style="margin:8px 0 0">Em janeiro a cidade costuma ficar entre −5 °C e 0 °C (aprox.); no interior passa de −15 °C. Previsão diária e painel de aurora chegam no módulo Clima.</p></div></div></div>
<div><div class="card"><h3>Pendências</h3>${al.length?al.map(a=>`<div class="alert ${a[0]}"><i></i><button data-x="${a[3]==='mala'?'gomala':'edit'}" data-c="${a[3]}" data-id="${a[4]}"><b>${esc(a[1])}</b><span class="sub">${esc(a[2])}</span></button></div>`).join(''):'<p class="empty">Nada pendente.</p>'}</div>
<div class="card"><h3>Progresso</h3>${(()=>{const a=cnt('a'),b=cnt('b'),s=cnt('casal');return meter('Mala de '+c.a,a[0],a[1],a[2])+meter('Mala de '+c.b,b[0],b[1],b[2])+meter('Itens do casal',s[0],s[1],s[2])})()}${meter('Reservas confirmadas',rs.filter(r=>r.status==='confirmada').length,0,rs.length)}${meter('Documentos com arquivo anexado',dc.filter(d=>(d.arquivos||[]).length).length,0,dc.length)}<p class="sub" style="margin:4px 0 0">Mala: verde escuro está na mala, verde claro está separado.</p></div></div></div>`}

function vRoteiro(){const ds=days();if(!selDay||!ds.includes(selDay))selDay=ds.find(d=>daysTo(d)>=0)||ds[0];const k=selDay,di=S.dias[k]||{};
const head=`<div class="hdr"><div><h2>Roteiro</h2></div><button class="btn p" data-x="new" data-c="atv" data-dia="${k}">+ Atividade</button></div><div class="seg" role="tablist"><button class="${rotMode==='lista'?'on':''}" data-x="rot" data-m="lista">Linha do tempo</button><button class="${rotMode==='cal'?'on':''}" data-x="rot" data-m="cal">Calendário</button><button class="${rotMode==='ideias'?'on':''}" data-x="rot" data-m="ideias">Banco de ideias</button></div>`;
if(rotMode==='cal'){const f=DD(ds[0]),lead=(f.getDay()+6)%7;
return head+`<div class="card"><div class="cal">${['seg','ter','qua','qui','sex','sáb','dom'].map(d=>`<div class="h">${d}</div>`).join('')}${'<div></div>'.repeat(lead)}${ds.map(d=>{const t=(S.dias[d]||{}).tipo||'';const a=dayAtv(d);return `<button data-x="pickday" data-d="${d}" aria-label="${fD(d)}"><div class="tb ${t}"></div><b>${DD(d).getDate()}</b><span>${a.map(x=>esc(x.titulo)).slice(0,3).join(' · ')||'livre'}</span></button>`}).join('')}</div>
<div class="meta" style="margin-top:12px">${Object.entries(DT).map(([k,v])=>`<span class="pill"><span class="dot ${k}"></span>${v}</span>`).join('')}</div></div>
<div class="card"><h3>Equilíbrio da viagem</h3><div class="kv">${Object.entries(DT).map(([t,v])=>`<div><b>${ds.filter(d=>(S.dias[d]||{}).tipo===t).length}</b><span>${v.toLowerCase()}</span></div>`).join('')}</div><p class="sub" style="margin:10px 0 0">Alternar noites de aurora com noites de descanso ajuda a aguentar o frio e o sono curto, e deixa espaço para trocar passeios conforme a previsão.</p></div>`}
if(rotMode==='ideias'){const I=list('atv').filter(a=>!a.dia);
return head+`<p class="lede">Lugares e passeios ainda sem dia. Usem o seletor para encaixar num dia; numa noite nublada, é aqui que mora o plano B.</p><div class="card">${I.length?I.map(a=>`<div class="row" style="flex-wrap:wrap"><button class="abody" style="flex:1 1 200px" data-x="edit" data-c="atv" data-id="${a.id}"><b>${esc(a.titulo)}</b><span class="meta"><span class="pill">${CAT[a.cat]||''}</span>${a.custo?`<span class="pill">kr ${num(a.custo)}</span>`:''}<span class="sub">${esc(PL[a.local]?PL[a.local][0]:a.localTxt||'')}</span></span></button><select aria-label="Agendar para" data-x="sched" data-id="${a.id}" style="width:auto;flex:0 1 180px"><option value="">Agendar…</option>${ds.map(d=>`<option value="${d}">${fD(d)}</option>`).join('')}</select></div>`).join(''):'<p class="empty">Nenhuma ideia guardada.</p>'}</div><button class="btn" data-x="new" data-c="atv" data-dia="">+ Ideia</button>`}
const A=dayAtv(k),i=ds.indexOf(k);
return head+`<div class="chips">${ds.map((d,j)=>`<button class="${d===k?'on':''}" data-x="pickday" data-d="${d}"><small>${WD[DD(d).getDay()]}</small><b>${DD(d).getDate()}</b><span class="dot ${(S.dias[d]||{}).tipo||''}"></span></button>`).join('')}</div>
<div class="two"><div><div class="card"><div class="hdr" style="margin-bottom:8px"><div><h3 style="margin:0">${fD(k)}</h3><span class="sub">Dia ${i+1} de ${ds.length}</span></div></div>
<div class="seg" style="margin-bottom:10px">${Object.entries(DT).map(([t,v])=>`<button class="${di.tipo===t?'on':''}" data-x="dtype" data-t="${t}">${v}</button>`).join('')}</div>
<label class="f">Plano B para noite nublada<textarea id="pb" data-d="${k}" placeholder="Ex.: trocar com a noite de outro dia, ir para o interior, museu…" style="min-height:64px">${esc(di.planoB||'')}</textarea></label>${lightBar(k)}</div>
<div class="card"><div id="alist" data-d="${k}">${A.length?A.map(a=>`<div class="arow" data-id="${a.id}"><button class="grip" aria-label="Arrastar para reordenar"><svg viewBox="0 0 24 24"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg></button><span class="tm ${a.hora?'':'none'}">${esc(a.hora||'—')}</span><button class="abody" data-x="edit" data-c="atv" data-id="${a.id}"><b>${esc(a.titulo)}</b><span class="meta"><span class="pill ${AST[a.status]?AST[a.status][1]:''}">${AST[a.status]?AST[a.status][0]:''}</span><span class="pill">${CAT[a.cat]||''}</span>${a.custo?`<span class="pill">kr ${num(a.custo)}</span>`:''}${a.link?`<span class="pill pet">link</span>`:''}</span>${a.notas?`<span class="sub" style="display:block;margin-top:4px">${esc(a.notas)}</span>`:''}</button></div>`).join(''):'<p class="empty">Dia livre por enquanto.</p>'}</div><p class="sub" style="margin:8px 0 0">Arrastem pela alça para mudar a ordem; toquem numa atividade para editar, trocar de dia ou mudar o status.</p></div></div>
<div>${mapCard(A)}</div></div>`}

function hav(a,b){const R=6371,t=x=>x*Math.PI/180,dl=t(b[1]-a[1]),dn=t(b[2]-a[2]),h=Math.sin(dl/2)**2+Math.cos(t(a[1]))*Math.cos(t(b[1]))*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
function leg(km){if(km<2.5)return `~${Math.max(5,Math.round(km*1.3/4.5*60/5)*5)} min a pé`;const m=km*1.35/55*60+5;return m<60?`~${Math.round(m/5)*5} min de carro`:`~${Math.floor(m/60)}h${String(Math.round(m%60/5)*5).padStart(2,'0')} de carro`}
function mapCard(A){const pts=[];for(const a of A){if(PL[a.local]&&(!pts.length||pts[pts.length-1].k!==a.local))pts.push({k:a.local,p:PL[a.local]})}
if(!pts.length)return `<div class="card"><h3>Mapa do dia</h3><p class="empty">Escolham um local da lista nas atividades para vê-las no mapa.</p></div>`;
const lat0=pts.reduce((s,x)=>s+x.p[1],0)/pts.length,c=Math.cos(lat0*Math.PI/180);
const xy=pts.map(x=>[x.p[2]*c*111.32,-x.p[1]*110.57]);let x0=Math.min(...xy.map(p=>p[0])),x1=Math.max(...xy.map(p=>p[0])),y0=Math.min(...xy.map(p=>p[1])),y1=Math.max(...xy.map(p=>p[1]));
const w=Math.max(x1-x0,3),h=Math.max(y1-y0,2),cx=(x0+x1)/2,cy=(y0+y1)/2,W=Math.round(Math.min(560,Math.max(260,($('#view').clientWidth||400)-(innerWidth>=980?$('#view').clientWidth/2+40:66)))),H=220,s=Math.min((W-80)/w,(H-70)/h);
const P=xy.map(p=>[W/2+(p[0]-cx)*s,H/2+(p[1]-cy)*s]);const sk=[1,2,5,10,20,50,100].find(v=>v*s>60)||100;
const legs=pts.slice(1).map((x,i)=>{const km=hav(pts[i].p,x.p);return `<li><span class="n">${i+2}</span><span>${esc(pts[i].p[0])} → ${esc(x.p[0])}: ${km.toLocaleString('pt-BR',{maximumFractionDigits:1})} km · ${leg(km)}</span></li>`});
return `<div class="card"><h3>Mapa do dia</h3><div class="map"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-label="Pontos do dia" style="max-width:${W}px;margin:auto;right:0">
<path d="${P.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ')}" fill="none" stroke="var(--pet)" stroke-width="3" stroke-dasharray="7 6" stroke-linecap="round"/>
${(()=>{const u={};pts.forEach((x,i)=>{(u[x.k]=u[x.k]||{p:P[i],n:[]}).n.push(i+1)});return Object.values(u).map(o=>{const t=o.n.join(','),r=8+t.length*4;return `<circle cx="${o.p[0].toFixed(1)}" cy="${o.p[1].toFixed(1)}" r="${Math.max(13,r)}" fill="var(--pet)" stroke="var(--card)" stroke-width="3"/><text x="${o.p[0].toFixed(1)}" y="${(o.p[1]+5).toFixed(1)}" text-anchor="middle" font-size="14" font-weight="700" fill="var(--on)">${t}</text>`}).join('')})()}
<path d="M20 ${H-22} h${(sk*s).toFixed(1)}" stroke="var(--mut)" stroke-width="3"/><text x="20" y="${H-30}" font-size="13" fill="var(--mut)">${sk} km</text><text x="${W-20}" y="26" text-anchor="end" font-size="13" fill="var(--mut)">N ↑</text></svg></div>
<ul class="legs"><li><span class="n">1</span><span>${esc(pts[0].p[0])}</span></li>${legs.join('')}</ul><p class="sub" style="margin:6px 0 0">Tempos estimados pela distância em linha reta: a pé abaixo de 2,5 km (4,5 km/h), de carro acima disso (média de 55 km/h no inverno, estradas 35% mais longas). Coordenadas aproximadas.</p></div>`}

function vReservas(){const F={todas:null,voo:['voo'],hospedagem:['hospedagem'],passeio:['passeio'],transporte:['trem','onibus','balsa','carro']};
const all=list('res').sort((x,y)=>(x.ini||'9').localeCompare(y.ini||'9')),L=all.filter(r=>!F[resF]||F[resF].includes(r.tipo));
const ok=all.filter(r=>r.status==='confirmada').length,pe=all.filter(r=>r.status==='pendente').length;
return `<div class="hdr"><h2>Reservas</h2><button class="btn p" data-x="new" data-c="res">+ Reserva</button></div><div class="card"><div class="kv"><div><b>${ok}</b><span>confirmadas</span></div><div><b>${pe}</b><span>sem confirmação</span></div><div><b>${all.filter(r=>r.cancelAte&&new Date(r.cancelAte)>new Date()).length}</b><span>com cancelamento grátis aberto</span></div></div></div>
<div class="seg">${[['todas','Todas'],['voo','Voos'],['hospedagem','Hospedagem'],['passeio','Passeios'],['transporte','Transporte']].map(([k,v])=>`<button class="${resF===k?'on':''}" data-x="resf" data-f="${k}">${v}</button>`).join('')}</div>
${L.length?L.map(r=>{const cd=r.cancelAte?Math.ceil((new Date(r.cancelAte)-new Date())/864e5):null;
return `<button class="rc" data-x="edit" data-c="res" data-id="${r.id}"><div class="r1"><span class="k">${RT[r.tipo]||r.tipo}</span><span class="pill ${(RS[r.status]||['',''])[1]}">${(RS[r.status]||[r.status])[0]}</span></div><b>${esc(r.titulo)}</b>
<div class="ln"><strong>${fDT(r.ini)}</strong>${r.fim?`<span>→ ${fDT(r.fim)}</span>`:''}</div>
<div class="ln">${r.codigo?`<span>Código</span><span class="cp" data-x="copy" data-v="${esc(r.codigo)}">${esc(r.codigo)}</span>`:'<span>Sem código ainda</span>'}${r.busca?`<span>· Busca no hotel <strong>${esc(r.busca)}</strong></span>`:''}</div>
${r.end?`<div class="ln"><span>${esc(r.end)}</span></div>`:''}
${r.cancelAte?`<div class="ln"><span class="pill ${cd<0?'':cd<=3?'bad':cd<=14?'warn':'ok'}">${cd<0?'Prazo de cancelamento grátis encerrado':`Cancelamento grátis até ${fDT(r.cancelAte)}`}</span></div>`:r.cancel?`<div class="ln"><span>${esc(r.cancel)}</span></div>`:''}
${r.clima?`<div class="ln"><span>Clima: ${esc(r.clima)}</span></div>`:''}</button>`}).join(''):'<p class="empty">Nenhuma reserva nesta categoria.</p>'}`}

const idb=(()=>{let p;const open=()=>p||(p=new Promise((res,rej)=>{const r=indexedDB.open('tromsoapp',1);r.onupgradeneeded=()=>r.result.createObjectStore('files');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}));
const tx=(m,f)=>open().then(d=>new Promise((res,rej)=>{const t=d.transaction('files',m),q=f(t.objectStore('files'));t.oncomplete=()=>res(q&&q.result);t.onerror=()=>rej(t.error)}));
return{put:(k,v)=>tx('readwrite',s=>s.put(v,k)),get:k=>tx('readonly',s=>s.get(k)),del:k=>tx('readwrite',s=>s.delete(k))}})();
const URLS={};
function fileList(d){return (d.arquivos||[]).map(f=>`<span style="display:inline-flex;align-items:center;gap:2px"><a data-file="${esc(f.id)}" data-img="${/^image\//.test(f.tipo)?1:''}" target="_blank" rel="noopener">${/^image\//.test(f.tipo)?'<img alt="">':'<span class="pdf">PDF</span>'}<span>${esc(f.nome)}</span></a><button class="del-f" data-x="rmfile" data-id="${d.id}" data-f="${esc(f.id)}" aria-label="Remover ${esc(f.nome)}">×</button></span>`).join('')}
async function hydrate(){for(const a of document.querySelectorAll('[data-file]')){const id=a.dataset.file;try{if(!URLS[id]){const b=await idb.get(id);if(b)URLS[id]=URL.createObjectURL(b)}}catch(e){}
if(URLS[id]){a.href=URLS[id];const i=a.querySelector('img');if(i)i.src=URLS[id]}else{a.removeAttribute('href');a.title='Arquivo salvo em outro aparelho';a.querySelector('span:last-child').textContent+=' (em outro aparelho)';a.style.opacity=.6;const i=a.querySelector('img');if(i)i.replaceWith(Object.assign(document.createElement('span'),{className:'pdf',textContent:'IMG'}))}}}
function vDocs(){const c=CFG(),lim90=new Date(DD(c.fim).getTime()+90*864e5);
const tabs=[['a',c.a],['b',c.b],['casal','Casal'],['contatos','Contatos'],['entrada','Entrada']];
let body='';
if(docQ==='contatos'){const L=list('contatos');body=`<div class="card">${L.map(x=>`<div class="row"><button class="abody" style="flex:1" data-x="edit" data-c="contatos" data-id="${x.id}"><b>${esc(x.nome)}</b>${x.nota?`<span class="sub">${esc(x.nota)}</span>`:''}</button>${x.tel?`<a class="tel" href="tel:${esc(x.tel.replace(/\s/g,''))}">${esc(x.tel)}</a>`:'<span class="sub">sem número</span>'}</div>`).join('')||'<p class="empty">Nenhum contato.</p>'}</div><button class="btn" data-x="new" data-c="contatos">+ Contato</button>`}
else if(docQ==='entrada'){body=`<div class="card"><h3>Entrada na Noruega</h3><ul style="margin:0;padding-left:20px"><li>Brasileiros entram sem visto para turismo de até 90 dias a cada 180 no Espaço Schengen, do qual a Noruega faz parte.</li><li>Passaporte: emitido há menos de 10 anos e válido até 3 meses depois da saída do Schengen. Para esta viagem: até ${lim90.getDate()} ${MO[lim90.getMonth()]} ${lim90.getFullYear()}.</li><li>Na primeira entrada pelo sistema EES, a imigração coleta foto e digitais. Reservem tempo na conexão.</li><li>A imigração pode pedir passagem de volta, reserva de hospedagem, comprovante de meios financeiros e seguro viagem (a referência Schengen é cobertura médica de €30 mil).</li><li>ETIAS ainda não está em operação e não tinha data anunciada no início de novembro de 2026; a UE promete avisar com meses de antecedência. Conferir em <a href="https://travel-europe.europa.eu/">travel-europe.europa.eu</a> uns 10 dias antes.</li><li>Seguro: trenó de cães e snowmobile costumam exigir cobertura de esportes de inverno. Confirmem na apólice.</li></ul></div><div class="card"><h3>Acesso offline</h3><p class="sub" style="margin:0">Instalado na tela de início, o app abre sem internet e mostra os dados e anexos salvos no aparelho. Abram o app uma vez com internet antes de embarcar para garantir a cópia mais recente.</p></div>`}
else{const L=list('docs').filter(d=>d.quem===docQ);
body=`<div class="card" style="background:var(--soft);border:0"><p class="sub" style="margin:0">Arquivos anexados ficam só neste aparelho. Os títulos e notas sincronizam: não escrevam números de documentos nem senhas neles.</p></div>${L.map(d=>{let v='';if(d.validade){const x=DD(d.validade);v=x<DD(c.fim)?`<span class="pill bad">Vence ${fD(d.validade)}</span>`:d.tipo==='passaporte'&&x<lim90?`<span class="pill bad">Validade curta: ${fD(d.validade)}</span>`:`<span class="pill ok">Válido até ${fD(d.validade)}</span>`}
return `<div class="card"><button class="abody" data-x="edit" data-c="docs" data-id="${d.id}"><span class="sub" style="font-weight:700;color:var(--pet)">${DTY[d.tipo]||''}</span><b style="font-size:17px">${esc(d.titulo)}</b><span class="meta">${v}${d.tipo==='seguro'?`<span class="pill ${d.inverno==='sim'?'ok':'warn'}">${d.inverno==='sim'?'Cobre esportes de inverno':d.inverno==='nao'?'Não cobre esportes de inverno':'Cobertura de inverno: confirmar'}</span>`:''}</span>${d.tel?`<span class="sub" style="display:block;margin-top:4px">Telefone: <span class="tel">${esc(d.tel)}</span></span>`:''}${d.notas?`<span class="sub" style="display:block;margin-top:4px">${esc(d.notas)}</span>`:''}</button>
<div class="files">${fileList(d)}</div><div class="btns" style="margin-top:10px"><button class="btn" data-x="up" data-id="${d.id}" data-ok>Anexar PDF ou imagem</button></div></div>`}).join('')||'<p class="empty">Nenhum documento aqui ainda.</p>'}<button class="btn p" data-x="new" data-c="docs" data-quem="${docQ}">+ Documento</button><p class="sub">Os arquivos ficam guardados neste aparelho e abrem mesmo sem internet. Eles não vão para a nuvem: cada um anexa os seus no próprio celular.</p>`}
return `<div class="hdr"><h2>Documentos</h2></div><div class="seg">${tabs.map(([k,v])=>`<button class="${docQ===k?'on':''}" data-x="docq" data-q="${k}">${esc(v)}</button>`).join('')}</div>`+body}

function vMala(){const c=CFG(),q=malaQ,L=list('mala').filter(m=>m.quem===q),lim=(c.lim&&c.lim[q])||{};
const wd=bagW(q,'desp'),wm=bagW(q,'mao');
const wbar=(l,g,max)=>{const p=max?Math.min(100,g/10/max):0,over=max&&g/1000>max;return `<div class="meter"><div class="l">${l}<span>${kg(g)}${max?` de ${max} kg`:''}</span></div><div class="bar"><i class="${over?'x':'a'}" style="width:${p}%"></i></div></div>`};
const cats=Object.keys(MC);
return `<div class="hdr"><h2>Mala</h2><button class="btn p" data-x="new" data-c="mala" data-quem="${q}">+ Item</button></div><div class="seg">${[['a',c.a],['b',c.b],['casal','Compartilhado']].map(([k,v])=>`<button class="${q===k?'on':''}" data-x="malaq" data-q="${k}">${esc(v)}</button>`).join('')}</div>
<div class="card"><div class="kv"><div><b>${L.filter(m=>m.estado==2).length}</b><span>na mala</span></div><div><b>${L.filter(m=>m.estado==1).length}</b><span>separados</span></div><div><b>${L.filter(m=>!m.estado).length}</b><span>faltando</span></div></div>
${q==='casal'?wbar('Peso dos itens do casal',wd+wm,0)+'<p class="sub" style="margin:0">Somem estes itens à mala de quem for levar.</p>':wbar('Despachada',wd,lim.desp)+wbar('Mão',wm,lim.mao)+`<p class="sub" style="margin:0">Peso estimado pela soma dos itens (peso × quantidade), sem contar a mala vazia. <button class="btn" style="min-height:36px;margin-top:6px" data-x="lim">Limites da companhia</button></p>`}</div>
<div class="btns" style="margin-bottom:14px"><button class="btn" data-x="tpl">Aplicar modelo Ártico</button><label class="btn" style="cursor:pointer"><input type="checkbox" id="miss" ${onlyMiss?'checked':''} style="width:20px;height:20px;margin:0"> Só o que falta</label></div>
${cats.map(ct=>{let it=L.filter(m=>m.cat===ct);if(!it.length)return'';const done=it.filter(m=>m.estado==2).length;if(onlyMiss)it=it.filter(m=>m.estado!=2);
return `<div class="card"><div class="hdr" style="margin-bottom:4px"><h3 style="margin:0">${MC[ct]}</h3><span class="sub">${done} de ${L.filter(m=>m.cat===ct).length}</span></div>${it.map(m=>`<div class="mrow s${m.estado||0}"><button class="abody" data-x="edit" data-c="mala" data-id="${m.id}"><b>${esc(m.nome)}${m.qtd>1?` × ${m.qtd}`:''}</b><span class="sub">${m.peso?num(m.peso*(m.qtd||1))+' g · ':''}${m.onde==='mao'?'Mão':'Despachada'}</span></button><button class="stb s${m.estado||0}" data-x="cyc" data-id="${m.id}" aria-label="Mudar estado: ${MS[m.estado||0]}">${MS[m.estado||0]}</button></div>`).join('')||'<p class="empty">Tudo na mala.</p>'}</div>`}).join('')||'<p class="empty">Mala vazia. Toquem em "Aplicar modelo Ártico" para começar.</p>'}`}

function vMais(){const c=CFG();const M=[['Finanças','Orçamento por categoria, NOK e BRL, divisão 50/50 e previsto × gasto.'],['Transporte','Voos, Flybuss, ônibus locais, passes e direção no inverno.'],['Clima e aurora','Previsão por dia, Kp, painel de caça à aurora e registro das noites.'],['Comida','Restaurantes, pratos típicos, mercados e restrições alimentares.'],['Guia rápido','Frases em norueguês, gorjeta, tomadas, horários e fuso.'],['Diário e memórias','Notas por dia, fotos, notas de 1 a 5 e lembrar para a próxima.'],['Checklist pré-viagem','Linha do tempo de 3 meses, 1 mês, 1 semana e 1 dia antes.']];
return `<div class="hdr"><h2>Mais</h2></div><h3 style="margin-bottom:10px">Próximos módulos</h3><div class="mods" style="margin-bottom:18px">${M.map(m=>`<div class="mod"><b>${m[0]}</b><span class="sub">${m[1]}</span><div style="margin-top:8px"><span class="pill aur">Em breve</span></div></div>`).join('')}</div>
<div class="card"><h3>Viagem</h3><div class="set"><label class="f">Nome 1<input type="text" id="c-a" data-cfg="a" value="${esc(c.a)}"></label><label class="f">Nome 2<input type="text" id="c-b" data-cfg="b" value="${esc(c.b)}"></label><label class="f">Início<input type="date" id="c-ini" data-cfg="ini" value="${esc(c.ini)}"></label><label class="f">Fim<input type="date" id="c-fim" data-cfg="fim" value="${esc(c.fim)}"></label><label class="f">1 NOK em reais<input type="number" id="c-rate" data-cfg="rate" step="0.001" min="0" value="${esc(c.rate)}"></label></div><p class="sub" style="margin:10px 0 0">Câmbio padrão de R$ 0,53, média aproximada de 2026: atualizem antes de fechar contas.</p></div>
<div class="card"><h3>Aparência</h3><div class="seg" style="margin:0">${[['auto','Automático'],['light','Claro'],['dark','Escuro']].map(([k,v])=>`<button class="${themeMode===k?'on':''}" data-x="theme" data-t="${k}">${v}</button>`).join('')}</div></div>
<div class="card" id="clear"><h3>Dados de exemplo</h3><p class="sub" style="margin:0 0 10px">Apaga tudo o que veio de exemplo e ainda não foi editado. Itens que vocês alteraram ficam.</p><button class="btn d" data-x="clearex">Apagar exemplos</button></div>
<div class="card"><h3>Sincronização</h3>${mode==='fb'?`<p class="sub" style="margin:0 0 10px">Conectado como ${esc(user&&user.email||'')}. As mudanças de um aparecem para o outro em segundos e ficam guardadas para uso offline.</p><button class="btn" data-x="logout">Sair</button>`:`<p class="sub" style="margin:0">Os dados estão salvos só neste aparelho. Para dividir com ${esc(c.b)} em tempo real, configurem o Firebase seguindo o README.</p>`}</div>
<div class="card"><h3>Backup</h3><p class="sub" style="margin:0 0 10px">Baixe uma cópia de tudo (sem os anexos) ou restaure de um arquivo de backup.</p><div class="btns"><button class="btn" data-x="export">Exportar backup</button><button class="btn" data-x="import">Importar backup</button><button class="btn" data-x="seed">Carregar dados de exemplo</button></div></div></div>`}

/* sheet editor */
const opt=(o,v)=>Object.entries(o).map(([k,l])=>`<option value="${esc(k)}" ${String(v)===k?'selected':''}>${esc(l)}</option>`).join('');
function SCH(c){const ds={'':'Banco de ideias'};days().forEach(d=>ds[d]=fD(d));const pls={'':'Outro (digitar)'};for(const k in PL)pls[k]=PL[k][0];const Q={a:CFG().a,b:CFG().b,casal:'Casal'};
return{atv:[['titulo','Atividade','text',1],['dia','Dia','sel',0,ds],['hora','Horário','time'],['local','Local','sel',0,pls],['localTxt','Local (se outro)','text'],['cat','Categoria','sel',0,CAT],['status','Status','sel',0,Object.fromEntries(Object.entries(AST).map(([k,v])=>[k,v[0]]))],['custo','Custo para os dois (NOK)','num'],['link','Link','url'],['notas','Notas','area']],
res:[['tipo','Tipo','sel',0,RT],['titulo','Descrição','text',1],['status','Status','sel',0,Object.fromEntries(Object.entries(RS).map(([k,v])=>[k,v[0]]))],['codigo','Código da reserva','text'],['ini','Início / check-in','dt'],['fim','Fim / check-out','dt'],['end','Endereço ou ponto de encontro','text'],['busca','Busca no hotel','time'],['cancel','Política de cancelamento','text'],['cancelAte','Cancelamento grátis até','dt'],['clima','Remarcação por clima','text'],['valor','Valor','num'],['moeda','Moeda','sel',0,{NOK:'NOK',BRL:'BRL'}],['quem','De quem','sel',0,Q],['link','Link','url'],['notas','Notas','area']],
docs:[['quem','De quem','sel',0,Q],['tipo','Tipo','sel',0,DTY],['titulo','Título','text',1],['validade','Validade','date'],['inverno','Cobre esportes de inverno? (só para seguro)','sel',0,{'?':'Não sei ainda',sim:'Sim',nao:'Não'}],['tel','Telefone (seguro, operador…)','text'],['notas','Notas','area']],
contatos:[['nome','Nome','text',1],['tel','Telefone','text'],['tipo','Tipo','sel',0,{emergencia:'Emergência',saude:'Saúde',consulado:'Consulado',seguro:'Seguro',hospedagem:'Hospedagem',outro:'Outro'}],['nota','Nota','area']],
mala:[['nome','Item','text',1],['quem','De quem','sel',0,Q],['cat','Categoria','sel',0,MC],['qtd','Quantidade','num'],['peso','Peso por unidade (g)','num'],['onde','Vai na','sel',0,{desp:'Mala despachada',mao:'Mala de mão'}],['estado','Estado','sel',0,{0:'Pendente',1:'Separado',2:'Na mala'}]]}[c]}
const TITLE={atv:'atividade',res:'reserva',docs:'documento',contatos:'contato',mala:'item'};
let SH=null;
function openSheet(c,id,pre={}){const o=id?{...S[c][id]}:{...pre};SH={c,id};const F=SCH(c);
$('#shb').innerHTML=`<div class="sh"><h3>${id?'Editar':'Nova'} ${TITLE[c]}</h3><button class="ib" data-x="close" aria-label="Fechar">×</button></div><form id="shf">${F.map(([k,l,t,req,op])=>{const v=o[k]??'',idn='f-'+k;
const inp=t==='sel'?`<select id="${idn}" name="${k}">${opt(op,v)}</select>`:t==='area'?`<textarea id="${idn}" name="${k}">${esc(v)}</textarea>`:`<input id="${idn}" name="${k}" type="${t==='num'?'number':t==='dt'?'datetime-local':t}" ${t==='num'?'step="any" min="0"':''} value="${esc(v)}" ${req?'required':''}>`;
return `<label class="f">${l}${inp}</label>`}).join('')}<div class="btns" style="justify-content:space-between"><button class="btn p" type="submit">Salvar</button>${id?'<button class="btn d" type="button" data-x="delask">Apagar</button>':''}</div></form>`;
$('#sheet').hidden=false;setTimeout(()=>{const f=$('#shf [required]');if(f&&!id)f.focus()},50)}
function closeSheet(){$('#sheet').hidden=true;SH=null}
function saveSheet(){const {c,id}=SH,F=SCH(c),f=$('#shf'),o=id?{...S[c][id]}:{};for(const [k,,t] of F){const el=f.elements[k];if(!el)continue;o[k]=t==='num'?(el.value===''?'':+el.value):el.value}
if(c==='mala')o.estado=+o.estado||0;if(c==='docs'&&!o.arquivos)o.arquivos=[];o.ex=false;
const nid_=id||nid();
if(c==='atv'){const was=id?S.atv[id]:null;if(!was||was.dia!==o.dia||was.hora!==o.hora){const sib=dayAtv(o.dia).filter(a=>a.id!==nid_);let pos=sib.length;if(o.hora){pos=sib.findIndex(a=>a.hora&&a.hora>o.hora);if(pos<0)pos=sib.length}sib.splice(pos,0,{id:nid_});sib.forEach((a,i)=>{if(a.id===nid_)o.ord=i+1;else if(S.atv[a.id].ord!==i+1)put('atv',a.id,{...S.atv[a.id],ord:i+1})})}}
put(c,nid_,o);closeSheet();toast('Salvo')}

/* search */
function openSearch(){SH=null;$('#shb').innerHTML=`<div class="sh"><h3>Buscar</h3><button class="ib" data-x="close" aria-label="Fechar">×</button></div><input type="search" id="q" placeholder="Atividades, reservas, documentos, mala…" autocomplete="off"><div id="qr" style="margin-top:8px"></div>`;$('#sheet').hidden=false;setTimeout(()=>$('#q').focus(),50)}
function doSearch(q){q=q.trim().toLowerCase();if(!q){$('#qr').innerHTML='';return}const fields={atv:['titulo','notas','localTxt'],res:['titulo','codigo','end','notas'],docs:['titulo','notas'],contatos:['nome','nota','tel'],mala:['nome']},lab={atv:'Roteiro',res:'Reserva',docs:'Documento',contatos:'Contato',mala:'Mala'};const r=[];
for(const c in fields)for(const x of list(c)){if(fields[c].some(f=>String(x[f]||'').toLowerCase().includes(q)))r.push(`<button class="sr" data-x="edit" data-c="${c}" data-id="${x.id}"><span class="sub">${lab[c]}${c==='atv'&&x.dia?' · '+fD(x.dia):''}${c==='mala'?' · '+esc(NM(x.quem)):''}</span><b style="display:block">${esc(x.titulo||x.nome)}</b></button>`)}
$('#qr').innerHTML=r.slice(0,40).join('')||'<p class="empty">Nada encontrado.</p>'}

/* render + routing */
const VIEWS={inicio:vInicio,roteiro:vRoteiro,reservas:vReservas,documentos:vDocs,mala:vMala,mais:vMais};
let dragging=false,rq=0;
function render(){if(dragging)return;cancelAnimationFrame(rq);rq=requestAnimationFrame(()=>{if(needSetup()&&$('#setupf'))return;const a=document.activeElement,keep=a&&a.id&&$('#view').contains(a)?[a.id,a.selectionStart,a.value]:null;
$('#view').innerHTML=mode==='login'?vLogin():needSetup()?vSetup():VIEWS[V]();hydrate();document.querySelectorAll('.bn a').forEach(x=>x.classList.toggle('on',x.dataset.v===V));
const ch=$('.chips .on');if(ch){const p=ch.parentElement;p.scrollLeft=ch.offsetLeft-p.clientWidth/2+ch.offsetWidth/2}
if(keep){const e=document.getElementById(keep[0]);if(e){if(keep[2]!=null&&'value' in e)e.value=keep[2];e.focus();try{e.setSelectionRange(keep[1],keep[1])}catch(_){}}}})}
function route(){const h=location.hash.slice(1);V=VIEWS[h]?h:'inicio';render();scrollTo(0,0)}
addEventListener('hashchange',route);

/* events */
document.addEventListener('click',e=>{const b=e.target.closest('[data-x]');if(!b)return;const x=b.dataset.x;
if(x==='copy'){e.stopPropagation();navigator.clipboard?.writeText(b.dataset.v).then(()=>toast('Código copiado'),()=>toast(b.dataset.v));return}
if(x==='close')closeSheet();
else if(x==='edit'){if(S[b.dataset.c]&&S[b.dataset.c][b.dataset.id])openSheet(b.dataset.c,b.dataset.id)}
else if(x==='new'){const pre={};if(b.dataset.c==='atv'){pre.dia=b.dataset.dia??'';pre.status=pre.dia?'planejado':'ideia';pre.cat='passeio'}if(b.dataset.c==='res'){pre.status='pendente';pre.moeda='NOK';pre.quem='casal';pre.tipo='passeio'}if(b.dataset.c==='docs'){pre.quem=b.dataset.quem;pre.tipo='voucher'}if(b.dataset.c==='mala'){pre.quem=b.dataset.quem;pre.cat='roupas';pre.qtd=1;pre.onde='desp';pre.estado=0}if(b.dataset.c==='contatos')pre.tipo='outro';openSheet(b.dataset.c,null,pre)}
else if(x==='delask'){if(b.dataset.sure){del(SH.c,SH.id);closeSheet();toast('Apagado')}else{b.dataset.sure=1;b.textContent='Toque de novo para apagar'}}
else if(x==='rot'){rotMode=b.dataset.m;render()}
else if(x==='pickday'){selDay=b.dataset.d;rotMode='lista';render()}
else if(x==='dtype'){const k=selDay;put('dias',k,{...(S.dias[k]||{}),tipo:b.dataset.t,ex:false})}
else if(x==='resf'){resF=b.dataset.f;render()}
else if(x==='docq'){docQ=b.dataset.q;render()}
else if(x==='malaq'){malaQ=b.dataset.q;render()}
else if(x==='gomala'){malaQ=b.dataset.id;location.hash='mala'}
else if(x==='goclear'){location.hash='mais';setTimeout(()=>$('#clear')?.scrollIntoView({block:'center'}),120)}
else if(x==='cyc'){const m=S.mala[b.dataset.id];put('mala',b.dataset.id,{...m,estado:((+m.estado||0)+1)%3})}
else if(x==='tpl'){const q=malaQ,have=new Set(list('mala').filter(m=>m.quem===q).map(m=>m.nome.toLowerCase()));let n=0;for(const t of TPL){if(have.has(t[1].toLowerCase()))continue;put('mala',nid(),{quem:q,cat:t[0],nome:t[1],qtd:t[2],peso:t[3],onde:t[4],estado:0});n++}toast(n?`${n} itens adicionados`:'O modelo já está todo aqui')}
else if(x==='lim'){const c=CFG(),q=malaQ,l=(c.lim&&c.lim[q])||{};SH={c:'lim'};$('#shb').innerHTML=`<div class="sh"><h3>Limites de ${esc(NM(q))}</h3><button class="ib" data-x="close" aria-label="Fechar">×</button></div><form id="limf"><label class="f">Despachada (kg)<input type="number" id="l-d" name="desp" step="0.5" min="0" value="${esc(l.desp??23)}"></label><label class="f">Mão (kg)<input type="number" id="l-m" name="mao" step="0.5" min="0" value="${esc(l.mao??8)}"></label><p class="sub" style="margin:0">23 kg despachada e 8 kg de mão são valores comuns, mas variam por companhia e tarifa: confiram na reserva.</p><button class="btn p">Salvar</button></form>`;$('#sheet').hidden=false}
else if(x==='up'){upId=b.dataset.id;$('#file').click()}
else if(x==='theme'){themeMode=b.dataset.t;applyTheme();try{localStorage.setItem('tr-theme',themeMode)}catch(_){}render()}
else if(x==='clearex'){if(b.dataset.sure){let n=0;for(const c of COLS)for(const id of Object.keys(S[c]))if(S[c][id].ex){del(c,id);n++}if(S.cfg&&S.cfg.ex)put('cfg','trip',{...S.cfg,ex:false});toast(n+' itens de exemplo apagados')}else{b.dataset.sure=1;b.textContent='Toque de novo para confirmar'}}});
document.addEventListener('submit',e=>{e.preventDefault();if(e.target.id==='shf')saveSheet();else if(e.target.id==='limf'){const c=CFG(),f=e.target,lim={...(c.lim||{})};lim[malaQ]={desp:+f.desp.value||0,mao:+f.mao.value||0};put('cfg','trip',{...c,lim});closeSheet()}});
document.addEventListener('change',e=>{const t=e.target;
if(t.dataset.x==='sched'&&t.value){const a=S.atv[t.dataset.id];const n=dayAtv(t.value).length+1;put('atv',t.dataset.id,{...a,dia:t.value,ord:n,status:a.status==='ideia'?'planejado':a.status});toast('Agendado para '+fD(t.value))}
else if(t.dataset.cfg){const c=CFG(),k=t.dataset.cfg;put('cfg','trip',{...c,[k]:k==='rate'?(parseFloat(t.value)||0):t.value})}
else if(t.id==='miss'){onlyMiss=t.checked;render()}
else if(t.id==='file'&&t.files[0]){upload(t.files[0]);t.value=''}});
document.addEventListener('focusout',e=>{const t=e.target;if(t.id==='pb'){const k=t.dataset.d,v=t.value.trim();if(((S.dias[k]||{}).planoB||'')!==v)put('dias',k,{...(S.dias[k]||{}),planoB:v,ex:false})}});
document.addEventListener('input',e=>{if(e.target.id==='q')doSearch(e.target.value)});
$('#bsearch').addEventListener('click',openSearch);
addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#sheet').hidden)closeSheet()});

/* upload */
let upId=null;
async function upload(file){if(!upId)return;if(file.size>25*1024*1024){toast('Arquivo acima de 25 MB');return}
try{const id=nid();await idb.put(id,file);const d=S.docs[upId];put('docs',upId,{...d,arquivos:[...(d.arquivos||[]),{id,nome:file.name,tipo:file.type||''}]});toast('Arquivo anexado')}catch(e){toast('Não consegui guardar o arquivo neste aparelho')}}

/* drag to reorder */
document.addEventListener('pointerdown',e=>{const g=e.target.closest('.grip');if(!g)return;e.preventDefault();const row=g.closest('.arow'),box=row.parentElement;dragging=true;row.classList.add('drag');try{g.setPointerCapture(e.pointerId)}catch(_){}
const mv=ev=>{const rows=[...box.querySelectorAll('.arow')].filter(r=>r!==row);const nx=rows.find(r=>{const b=r.getBoundingClientRect();return ev.clientY<b.top+b.height/2});if(nx)box.insertBefore(row,nx);else box.appendChild(row)};
const up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);removeEventListener('pointercancel',up);row.classList.remove('drag');dragging=false;
[...box.querySelectorAll('.arow')].forEach((r,i)=>{const a=S.atv[r.dataset.id];if(a&&a.ord!==i+1)put('atv',r.dataset.id,{...a,ord:i+1})});render()};
addEventListener('pointermove',mv);addEventListener('pointerup',up);addEventListener('pointercancel',up)});

/* theme */
const theme0=document.documentElement.getAttribute('data-theme');
function applyTheme(){if(themeMode==='auto'){if(theme0)document.documentElement.setAttribute('data-theme',theme0);else document.documentElement.removeAttribute('data-theme')}else document.documentElement.setAttribute('data-theme',themeMode)}
try{themeMode=localStorage.getItem('tr-theme')||'auto'}catch(_){}applyTheme();

/* login, empty, backup */
function vLogin(){return `<div class="card" style="max-width:420px;margin:24px auto"><h2 style="margin-bottom:6px">Entrar</h2><p class="sub" style="margin:0 0 14px">Use o e-mail e a senha criados no Firebase.</p><form id="loginf" style="display:grid;gap:12px"><label class="f">E-mail<input type="email" id="lg-e" name="e" autocomplete="username" required></label><label class="f">Senha<input type="password" id="lg-p" name="p" autocomplete="current-password" required></label><button class="btn p">Entrar</button><p class="sub" id="lg-m" style="margin:0"></p></form></div>`}
const needSetup=()=>mode==='empty'||(mode==='local'&&!S.cfg);
function vSetup(){return `<div class="card" style="max-width:520px;margin:24px auto"><h2 style="margin-bottom:6px">Vamos começar</h2><p class="sub" style="margin:0 0 14px">Conte quem vai e quando. Essas informações ficam ${mode==='empty'?'na conta do Firebase de vocês':'só neste aparelho'}, nunca no código público do app.</p><form id="setupf" style="display:grid;gap:12px"><label class="f">Nome 1<input type="text" id="s-a" name="a" required maxlength="30" autocomplete="off"></label><label class="f">Nome 2<input type="text" id="s-b" name="b" required maxlength="30" autocomplete="off"></label><label class="f">Início da viagem<input type="date" id="s-ini" name="ini" required></label><label class="f">Fim da viagem<input type="date" id="s-fim" name="fim" required></label><label class="f" style="flex-direction:row;align-items:center;gap:10px;font-weight:500"><input type="checkbox" id="s-ex" name="ex" checked style="width:22px;height:22px;min-height:0;flex:none"> Começar com um roteiro de exemplo (dá para apagar depois)</label><button class="btn p">Continuar</button><p class="sub" id="s-m" style="margin:0"></p><button type="button" class="btn" data-x="import">Já tenho um backup</button></form></div>`}
document.addEventListener('submit',async e=>{if(e.target.id!=='setupf')return;const f=e.target,m=$('#s-m'),a=f.a.value.trim(),b=f.b.value.trim(),ini=f.ini.value,fim=f.fim.value;
if(!a||!b||!ini||!fim){m.textContent='Preencha todos os campos.';return}
if(fim<ini){m.textContent='O fim precisa ser no mesmo dia ou depois do início.';return}
if(Math.round((DD(fim)-DD(ini))/864e5)>39){m.textContent='O app aceita viagens de até 40 dias.';return}
const cfg={a,b,ini,fim,rate:0.53,lim:{a:{desp:23,mao:8},b:{desp:23,mao:8}},ex:f.ex.checked};
try{if(mode==='empty')mode='fb';put('cfg','trip',cfg);if(cfg.ex)await writeAll(seedOps(cfg))}catch(_){toast('Não consegui salvar. Tente de novo.')}});
async function writeAll(ops){if(mode==='fb'||mode==='empty'){for(let i=0;i<ops.length;i+=400){const b=db.batch();for(const o of ops.slice(i,i+400))b.set(db.doc(o.path),o.data);await b.commit()}}else{for(const o of ops){const [c,id]=o.path.split('/');if(c==='cfg')S.cfg=o.data;else if(S[c])S[c][id]=o.data}cache()}if(mode==='empty')mode='fb';render()}
function seedOps(c){c=c||CFG();const t0=DD(c.ini).getTime(),add=n=>new Date(t0+n*864e5),
fix=v=>typeof v==='string'?v.replace(/^@(-?\d+)(.*)$/,(_,n,r)=>isoL(add(+n))+r).replace(/\{d(\d+)\}/g,(_,n)=>add(+n).getDate()).replace(/\{a\}/g,c.a).replace(/\{b\}/g,c.b):Array.isArray(v)?v.map(fix):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,fix(x)])):v,
ok=d=>d>=c.ini&&d<=c.fim;
return (window.TROMSO_SEED||[]).map(o=>({path:o.path.replace(/\/@(-?\d+)$/,(_,n)=>'/'+isoL(add(+n))),data:fix(o.data)})).filter(o=>{const p=o.path.split('/');if(p[0]==='dias')return ok(p[1]);if(p[0]==='atv')return !o.data.dia||ok(o.data.dia);if(p[0]==='res')return !o.data.ini||ok(o.data.ini.slice(0,10));return true})}
function backupOps(){const o=[];if(S.cfg)o.push({path:'cfg/trip',data:S.cfg});for(const c of COLS)for(const id in S[c])o.push({path:c+'/'+id,data:S[c][id]});return o}
document.addEventListener('submit',async e=>{if(e.target.id!=='loginf')return;const f=e.target,m=$('#lg-m');m.textContent='Entrando…';
try{await fb.auth().signInWithEmailAndPassword(f.e.value.trim(),f.p.value)}catch(x){m.textContent=/wrong-password|invalid-credential|user-not-found|invalid-login/.test(x.code||'')?'E-mail ou senha incorretos.':x.code==='auth/too-many-requests'?'Muitas tentativas. Espere um pouco.':'Não consegui entrar. Verifiquem a internet.'}});
document.addEventListener('click',async e=>{const b=e.target.closest('[data-x]');if(!b)return;const x=b.dataset.x;
if(x==='logout'){await fb.auth().signOut();location.reload()}
else if(x==='seed'){if(!b.dataset.sure&&mode!=='empty'){b.dataset.sure=1;b.textContent='Toque de novo: mistura o exemplo com os dados atuais';return}try{await writeAll(seedOps(CFG()));toast('Exemplo carregado')}catch(_){toast('Não consegui carregar o exemplo')}}
else if(x==='blank'){put('cfg','trip',{...CFG()});mode='fb';render()}
else if(x==='export'){const blob=new Blob([JSON.stringify({app:'tromsoapp',em:new Date().toISOString(),ops:backupOps()},null,1)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='tromsoapp-backup-'+isoL(new Date())+'.json';document.body.appendChild(a);a.click();a.remove()}
else if(x==='import'){$('#bk').click()}
else if(x==='rmfile'){const d=S.docs[b.dataset.id];if(!d)return;if(!b.dataset.sure){b.dataset.sure=1;b.textContent='apagar?';return}put('docs',b.dataset.id,{...d,arquivos:(d.arquivos||[]).filter(f=>f.id!==b.dataset.f)});idb.del(b.dataset.f).catch(()=>{})}});
document.addEventListener('change',async e=>{if(e.target.id!=='bk'||!e.target.files[0])return;try{const j=JSON.parse(await e.target.files[0].text());if(j.app!=='tromsoapp'||!Array.isArray(j.ops))throw 0;await writeAll(j.ops);toast('Backup restaurado')}catch(_){toast('Arquivo de backup inválido')}e.target.value=''});

/* boot */
route();
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s)})}
async function bootFirebase(){const V='9.23.0',base='https://www.gstatic.com/firebasejs/'+V+'/';
await loadScript(base+'firebase-app-compat.js');await Promise.all([loadScript(base+'firebase-auth-compat.js'),loadScript(base+'firebase-firestore-compat.js')]);
fb=window.firebase;fb.initializeApp(CONF.firebase);db=fb.firestore();try{await db.enablePersistence({synchronizeTabs:true})}catch(_){}
let subs=[];
fb.auth().onAuthStateChanged(u=>{user=u;subs.forEach(f=>f());subs=[];if(!u){mode='login';sync('warn','Entre para sincronizar');render();return}
mode='fb';sync('','Conectando…');let got=false,seen={};const timer=setTimeout(()=>{if(!got)sync('warn','Offline: cópia salva')},10000);
const fresh=(k,m)=>{seen[k]=1;if(mode==='empty'&&(S.cfg||COLS.some(c=>Object.keys(S[c]).length)))mode='fb';if(!m.fromCache){got=true;clearTimeout(timer);if(!ro)sync('ok','Sincronizado')}else if(got)sync('warn','Offline: muda quando voltar a internet');
if(Object.keys(seen).length===COLS.length+1&&!m.fromCache&&!S.cfg&&COLS.every(c=>!Object.keys(S[c]).length)){mode='empty'}};
const fail=e=>{clearTimeout(timer);if(e&&e.code==='permission-denied'){sync('warn','Sem permissão');toast('Este e-mail não tem acesso. Confiram as regras do Firestore.')}else sync('warn','Offline: cópia salva')};
subs.push(db.doc('cfg/trip').onSnapshot({includeMetadataChanges:true},s=>{S.cfg=s.exists?s.data():null;fresh('cfg',s.metadata);cache();render()},fail));
for(const c of COLS)subs.push(db.collection(c).onSnapshot({includeMetadataChanges:true},s=>{const o={};for(const d of s.docs)o[d.id]=d.data();S[c]=o;fresh(c,s.metadata);cache();render()},fail))})}
if(CONF.firebase&&CONF.firebase.apiKey){bootFirebase().catch(()=>{mode='local';sync('warn','Sem conexão: cópia salva');render()})}
else{mode='local';db=null;sync('warn','Só neste aparelho');render()}
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
