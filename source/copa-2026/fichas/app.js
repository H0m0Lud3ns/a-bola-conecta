/* Stories carousel - Selecoes Gondwana
   Visual identity: Gondwana FC brand manual
   Archivo Black (display) + IBM Plex Serif (editorial) + Manrope (UI)
   Palette: grafite/areia/ouro/verde/barro/azul
*/

var R = typeof research !== 'undefined' ? research : {};
function getR(n){return R[n]||{}}
function esc(v){return String(v||'').replace(/[&<>'"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]})}

function sourceUrl(label){
  if(typeof researchSources==='undefined')return '';
  var found=researchSources.find(function(s){return s[0]===label});
  return found?found[1]:'';
}

function renderReferences(refs,title){
  refs=(refs||[]).filter(function(r){return r&&r.label&&r.url});
  if(!refs.length)return '';
  return '<div class="references-box"><div class="block-label">'+esc(title||'Referências e consultas')+'</div><ul>'+refs.map(function(r){
    return '<li><a href="'+esc(r.url)+'" target="_blank" rel="noopener">'+esc(r.label)+'</a></li>';
  }).join('')+'</ul></div>';
}

function metodologiaABCRef(){
  return {label:'Metodologia ABC - Audiovisual, Bola e Câmera (Gondwana FC - Time da Educação)',url:'https://oregional.com.br/noticias/detalhes/dupla-latina-realiza-atividade-pedagogica-abc-audiovisual-bola-e-camera'};
}

function generalRefs(){
  return [
    metodologiaABCRef(),
    {label:'FIFA - seleções classificadas para a Copa 2026',url:sourceUrl('FIFA - seleções classificadas para a Copa 2026')},
    {label:'Banco Mundial - população e alfabetização',url:sourceUrl('Banco Mundial - população e alfabetização')},
    {label:'UNESCO Patrimônio Cultural Imaterial',url:sourceUrl('UNESCO Patrimônio Cultural Imaterial')},
    {label:'UNESCO Patrimônio Mundial',url:sourceUrl('UNESCO Patrimônio Mundial')},
    {label:'Encyclopaedia Britannica - geografia, história e geologia introdutória',url:sourceUrl('Encyclopaedia Britannica - geografia, história e geologia introdutória')}
  ];
}

function countryReferences(c,r){
  var refs=[];
  if(r.institute&&r.instituteUrl)refs.push({label:r.institute,url:r.instituteUrl});
  generalRefs().forEach(function(ref){refs.push(ref)});
  return refs;
}

function specialReferences(s){
  var pick=function(label){return{label:label,url:sourceUrl(label)}};
  if(s.id==='02-mapa-gondwana'||s.id==='04-gondwana')return [
    pick('Centro Digital Gondwana de Geoprocessamento - UFRJ'),
    pick('UFRJ - Gondwana, a Terra em movimento'),
    pick('PALEOMAP Project - Christopher Scotese'),
    pick('Britannica - Gondwana supercontinent'),
    pick('USGS - This Dynamic Earth: perspectiva histórica')
  ];
  if(s.id==='03-mapa-atual')return [
    pick('IBGE Brasil'),
    {label:'IBGE - mapa-múndi com continentes em proporções reais',url:'https://atlasescolar.ibge.gov.br/mapas-atlas/mapas-do-mundo'}
  ];
  if(s.id==='05-abya-yala')return [
    pick('Abiayala / Abya Yala - genealogias Gunadule e usos contemporâneos'),
    pick('Aiban Wagua - En defensa de la vida y su armonía'),
    pick('Takir Mamani - proposta de uso de Abya Yala em declarações indígenas'),
    pick('Ailton Krenak - Ideias para adiar o fim do mundo'),
    pick('Daniel Munduruku - obras e educação indígena'),
    pick('Davi Kopenawa e Bruce Albert - A queda do céu'),
    {label:'Eliane Potiguara - Metade cara, metade máscara',url:'https://grupoeditorialglobal.com.br/catalogos/livro/?id=4682'},
    {label:'Célia Xakriabá - educação, território e protagonismo indígena',url:'https://www.celiaxakriaba.com.br/'},
    {label:'Sônia Guajajara - movimento indígena e defesa dos territórios',url:'https://www.gov.br/povosindigenas/pt-br/composicao/ministerio-dos-povos-indigenas'},
    {label:'Rigoberta Menchú Tum - memória indígena, direitos humanos e Nobel da Paz',url:'https://www.nobelprize.org/prizes/peace/1992/tum/biographical/'}
  ];
  if(s.id==='06-bola-conecta')return [
    {label:'Em Todo Lugar - Conheça o Gondwana FC, projeto que une o poder da bola e a magia da câmera',url:'https://emtodolugar.facha.edu.br/2025/10/27/conheca-o-gondwana-fc-projeto-que-une-o-poder-da-bola-e-a-magia-da-camera-com-a-arte-de-contar-historias/'},
    {label:'Rede Kino - Projeto pedagógico Gondwana ABC - Audiovisual, Bola e Câmera',url:'https://www.redekino.com.br/projeto/projeto-pedagogico-gondwana-abc-audiovisual-bola-e-camera/'},
    {label:'O Regional - Dupla latina realiza atividade pedagógica ABC',url:'https://oregional.com.br/noticias/detalhes/dupla-latina-realiza-atividade-pedagogica-abc-audiovisual-bola-e-camera'},
    {label:'Gondwana FC - Documentário e ficha técnica',url:'https://www.gondwanafc.com/documentario'}
  ];
  return [pick('FIFA - seleções classificadas para a Copa 2026')];
}

var specialCards=[
  {id:'01-capa',type:'cover',title:'SELEÇÕES GONDWANA',lede:'Um carrossel para olhar a Copa pelo mapa profundo da Terra, dos povos, das culturas e do futebol.'},
  {id:'02-mapa-gondwana',type:'special',tag:'Mapa antigo',title:'MAPA DO GONDWANA',lede:'Um mapa geológico para ver Gondwana antes das fronteiras modernas.',mapImg:'/gondwana-time-educacao/copa-de-gondwana/fichas-paises/assets/mapa-gondwana-gdcg-ufrj-184ma-5200-full.jpg',mapAlt:'Mapa geológico do Gondwana reconstruído para 184 Ma',mapCaption:'Mapa geológico do Gondwana reconstruído para 184 Ma, produzido no Centro Digital de Geoprocessamento do Gondwana (GDCG) da UFRJ, Brasil.',sections:[{t:'Como ler',p:'Os países atuais não existiam naquele tempo. O mapa mostra blocos continentais e memória geológica.'},{t:'Crédito',p:'GDCG/UFRJ, Brasil.'}]},
  {id:'03-mapa-atual',type:'special',tag:'Mapa atual',title:'MAPA-MÚNDI ATUAL',lede:'O mundo atual como contraponto visual ao supercontinente antigo.',mapImg:'/gondwana-time-educacao/copa-de-gondwana/fichas-paises/assets/mapa-mundi-atual-ibge-proporcoes-reais.jpg',mapAlt:'Mapa-múndi atual do IBGE com continentes em proporções reais',mapCaption:'Fonte: IBGE - mapa-múndi com continentes em proporções reais.',sections:[{t:'Leitura',p:'O mapa atual ajuda a ver onde estão os países que disputam a Copa.'},{t:'Fonte',p:'IBGE - mapa-múndi com continentes em proporções reais.'}]},
  {id:'04-gondwana',type:'special',tag:'Recorte',title:'RECORTE GONDWANA',lede:'Gondwana foi o supercontinente que reuniu, há mais de 180 milhões de anos, terras hoje espalhadas pelo Sul.',pills:countries.slice(0,21).map(function(c){return c.name}),sections:[{t:'Significado',p:'O recorte Gondwana propõe ler o mapa pela memória do supercontinente.'},{t:'Critério',p:'Entra quem tem vínculo forte por território gondwânico.'},{t:'Pedagogia',p:'Deslocar a Copa para o Sul ajuda estudantes a perguntar quem narra o mundo.'}]},
  {id:'05-abya-yala',type:'special',tag:'Nome originário',title:'ABYA YALA',lede:'Nome de origem Guna/Dule usado por movimentos indígenas para afirmar as Américas como terra viva, madura e habitada por muitos povos, antes e além da colonização.',pills:countries.filter(function(c){return c.abyaYala}).map(function(c){return c.name}),sections:[{t:'Origem',p:'A expressão vem de povos Guna/Dule, da região hoje entre Panamá e Colômbia, e costuma ser traduzida como terra madura, terra viva ou terra em florescimento.'},{t:'Sentido político',p:'Movimentos indígenas passaram a usar Abya Yala como alternativa a América, nome ligado à história colonial europeia.'},{t:'Pedagogia',p:'Na Copa, o termo ajuda a perguntar quais povos, línguas, territórios e memórias aparecem quando olhamos as seleções do continente.'},{t:'Fontes',p:'Aiban Wagua, Takir Mamani, Ailton Krenak, Daniel Munduruku, Davi Kopenawa, Eliane Potiguara, Célia Xakriabá, Sônia Guajajara e Rigoberta Menchú Tum.'}]},
  {id:'06-bola-conecta',type:'special',tag:'Documentário',title:'A BOLA CONECTA',lede:'O documentário que abriu esta pergunta: o que a bola carrega quando atravessa África, Brasil, memória e território?',mapImg:'/a-bola-conecta/assets/cartaz-digital-gondwana-a-bola-conecta.jpg',mapAlt:'Cartaz do documentário A Bola Conecta',mapCaption:'Cartaz do documentário Gondwana: A Bola Conecta.',sections:[{t:'Lei 10.639',p:'O filme ajuda escolas a trabalhar história e cultura afro-brasileira.'},{t:'Lei 11.645',p:'As fichas ampliam, conectando povos indígenas e Abya Yala.'}]},
  {id:'07-outras',type:'special',tag:'Ampliação',title:'OUTRAS SELEÇÕES',lede:'Para entender a Copa inteira, também entram seleções fora do recorte principal de Gondwana.',sections:[
    {t:'CONMEBOL',p:countries.filter(function(c){return(confederations[c.name]||[])[0]==='CONMEBOL'}).map(function(c){return c.name}).join(', ')},
    {t:'CONCACAF',p:countries.filter(function(c){return(confederations[c.name]||[])[0]==='CONCACAF'}).map(function(c){return c.name}).join(', ')},
    {t:'UEFA',p:countries.filter(function(c){return(confederations[c.name]||[])[0]==='UEFA'}).map(function(c){return c.name}).join(', ')},
    {t:'AFC',p:countries.filter(function(c){return(confederations[c.name]||[])[0]==='AFC'}).map(function(c){return c.name}).join(', ')},
    {t:'CAF',p:countries.filter(function(c){return(confederations[c.name]||[])[0]==='CAF'}).map(function(c){return c.name}).join(', ')},
    {t:'OFC',p:countries.filter(function(c){return(confederations[c.name]||[])[0]==='OFC'}).map(function(c){return c.name}).join(', ')}
  ]}
];

function buildAllSlides(){
  var slides=[];
  specialCards.forEach(function(s,i){
    s.num=String(i+1).padStart(2,'0');
    s.totalNum=countries.length+7;
    slides.push(s);
  });
  countries.forEach(function(c,i){
    var num=String(i+8).padStart(2,'0');
    var slug=c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-');
    slides.push({id:num+'-'+slug,num:num,totalNum:countries.length+7,type:'country',country:c});
  });
  return slides;
}

function renderSlide(s){
  if(s.type==='cover')return '<div class="slide slide-cover"><div class="brand-band"><span></span><span></span><span></span></div>'+renderCover(s)+'</div>';
  if(s.type==='special')return '<div class="slide slide-special"><div class="brand-band"><span></span><span></span><span></span></div>'+renderSpecial(s)+'</div>';
  return '<div class="slide slide-country"><div class="brand-band"><span></span><span></span><span></span></div>'+renderCountry(s)+'</div>';
}

function renderCover(s){
  return '<div class="content">'+
    '<div class="cover-tag">Fichas por pais</div>'+
    '<h1 class="cover-title">'+esc(s.title)+'</h1>'+
    '<p class="cover-lede">'+esc(s.lede)+'</p>'+
    '<div class="cover-logo"><img src="/gondwana-fc-logo/svg/oficiais/logo-gondwana-fc-fundo-escuro.svg" alt="Gondwana FC"></div>'+
    '<div class="cover-stats.*território</span><span><strong>02</strong>cultura</span><span><strong>03</strong>memória</span><span><strong>04</strong>futebol</span></div>'+
    '</div>';
}

function renderSpecial(s){
  var html='<div class="content">'+
    '<div class="special-header-row">'+
    '<img class="special-logo" src="/gondwana-fc-logo/svg/oficiais/logo-gondwana-fc-fundo-escuro.svg" alt="Gondwana FC">'+
    '<div class="special-tag">'+esc(s.tag||'Contexto')+'</div>'+
    '</div>'+
    '<h2 class="special-title">'+esc(s.title)+'</h2>'+
    '<p class="special-lede">'+esc(s.lede)+'</p>';
  if(s.mapImg){
    html+='<figure class="special-map"><img src="'+esc(s.mapImg)+'" alt="'+esc(s.mapAlt||'')+'" loading="lazy">'+(s.mapCaption?'<figcaption>'+esc(s.mapCaption)+'</figcaption>':'')+'</figure>';
  }
  if(s.id==='02-mapa-gondwana'){
    html+='<div class="lab-credit"><span class="lab-logo lab-logo-text">GDCG</span><span>Centro Digital de Geoprocessamento do Gondwana · UFRJ</span></div>';
  }
  if(s.pills&&s.pills.length){
    html+='<div class="special-pills">'+s.pills.map(function(p){return'<span>'+esc(p)+'</span>'}).join('')+'</div>';
  }
  if(s.sections&&s.sections.length){
    html+='<div class="special-grid">';
    s.sections.forEach(function(sec){html+='<section><small>'+esc(sec.t)+'</small><p>'+esc(sec.p)+'</p></section>'});
    html+='</div>';
  }
  html+=renderReferences(specialReferences(s),s.id==='06-bola-conecta'?'Notícias sobre o documentário':null);
  html+='<div class="card-footer"><span>Gondwana FC | Copa 2026</span><span>'+esc(s.num)+'/'+s.totalNum+'</span></div></div>';
  return html;
}

function renderCountry(slide){
  var c=slide.country,r=getR(c.name);
  var conf=confederations[c.name]||[];
  var html='<div class="content">'+
    '<div class="country-header">'+
      '<div class="country-emblems">'+
        '<img class="country-flag" src="https://flagcdn.com/w320/'+c.code+'.png" alt="'+esc(c.name)+'" loading="lazy">'+
        '<img class="country-gondwana-logo" src="/gondwana-fc-logo/svg/oficiais/logo-gondwana-fc-fundo-escuro.svg" alt="Gondwana FC">'+
      '</div>'+
      '<div class="country-header-text">'+
        '<div class="country-name">'+esc(c.name)+'</div>'+
        '<div class="country-tags">'+
          (c.relation==='forte'?'<span class="tag tag-gondwana">Gondwana</span>':'<span class="tag tag-other">Outras</span>')+
          (c.abyaYala?'<span class="tag tag-abya">Abya Yala</span>':'')+
          '<span class="tag tag-region">'+esc(c.region)+'</span>'+
          (conf[0]?'<span class="tag tag-confed">'+esc(conf[0])+'</span>':'')+
          (c.group?'<span class="tag tag-group">Grupo '+esc(c.group)+'</span>':'')+
        '</div>'+
      '</div>'+
    '</div>'+

    '<div class="block"><div class="block-label">Territorio gondwânico</div><p class="block-text">'+esc(c.gondwana)+'</p></div>'+

    '<div class="stats-grid">'+
      '<div class="stat-cell"><div class="block-label">Populacao</div><div class="stat-val">'+esc(r.pop||'—')+'</div></div>'+
      '<div class="stat-cell"><div class="block-label">Linguas</div><div class="stat-val">'+esc(r.languages||'—')+'</div></div>'+
      '<div class="stat-cell"><div class="block-label">Alfabetizacao</div><div class="stat-val">'+esc(r.lit||'—')+'</div></div>'+
      '<div class="stat-cell"><div class="block-label">Instituto</div><div class="stat-val">'+esc(r.institute||'—')+'</div></div>'+
    '</div>'+

    '<div class="block"><div class="block-label">Primeiros habitantes</div><p class="block-text">'+esc(r.first||'—')+'</p></div>'+
    '<div class="block"><div class="block-label">Povos e território</div><p class="block-text">'+esc(c.peoples)+'</p></div>'+

    '<div class="block formation-block"><div class="block-label">Formacao nacional</div><p class="block-text">'+esc(c.formation)+'</p></div>'+

    '<div class="block freedom-block"><div class="block-label">Liberdade e memória</div><p class="block-text">'+esc(c.abolition)+'</p></div>'+

    '<div class="block"><div class="block-label">Cultura viva</div><p class="block-text">'+esc(c.culture)+'</p></div>'+
    (r.curiosity?'<div class="block"><div class="block-label">Curiosidade</div><p class="block-text">'+esc(r.curiosity)+'</p></div>':'')+
    (r.nobel?'<div class="block"><div class="block-label">Saberes, artes e ciencia</div><p class="block-text">'+esc(r.nobel)+'</p></div>':'')+

    '<div class="wc-box"><div class="block-label" style="margin-bottom:4px">Copa do Mundo</div><div class="wc-val">'+esc(c.cups)+'</div></div>'+

    (r.geology?'<div class="block"><div class="block-label">Geologia</div><p class="block-text">'+esc(r.geology)+'</p></div>':'')+

    (r.brazil?'<div class="block brazil-block"><img class="brazil-logo" src="/gondwana-fc-logo/svg/oficiais/logo-gondwana-fc-fundo-escuro.svg" alt=""><div><div class="block-label">Conexao com o Brasil</div><p class="block-text">'+esc(r.brazil)+'</p></div></div>':'')+

    '<div class="question-box"><div class="block-label" style="color:var(--ouro);margin-bottom:6px">Pergunta educativa</div><p class="question-text">'+esc(c.question)+'</p></div>'+

    renderReferences(countryReferences(c,r))+

    '<div class="card-footer"><span>Gondwana FC | '+esc(c.name)+'</span><span>'+esc(slide.num)+'/'+slide.totalNum+'</span></div>'+

    '</div>';
  return html;
}

// ===== App state =====
var allSlides=buildAllSlides();
var filtered=allSlides.slice();
var curIdx=0;
var autoTimer=null;
var autoActive=false;
var currentSlideEl=null;
var currentSlideStart=0;
var pausedRemaining=0;
var progressRAF=null;
var isPaused=false;
var AUTO_MS=8000;

// DOM
var stage=document.getElementById('stage');
var pbars=document.getElementById('pbars');
var counter=document.getElementById('counter');
var loading=document.getElementById('loading');
var btnPlay=document.getElementById('btn-play');
var btnFilter=document.getElementById('btn-filter');
var navLeft=document.getElementById('nav-left');
var navRight=document.getElementById('nav-right');
var arrowPrev=document.getElementById('arrow-prev');
var arrowNext=document.getElementById('arrow-next');
var fp=document.getElementById('fp');
var fpClose=document.getElementById('fp-close');
var fpSearch=document.getElementById('fp-search');
var fpResults=document.getElementById('fp-results');
var fpCount=document.getElementById('fp-count');
var fpClear=document.getElementById('fp-clear');
var shOverlay=document.getElementById('sh-overlay');
var shMenu=document.getElementById('sh-menu');
var shCancel=document.getElementById('sh-cancel');
var shCopy=document.getElementById('sh-copy');
var shNative=document.getElementById('sh-native');

function getRequestedSlideId(){
  var hash=(window.location.hash||'').replace(/^#/,'').replace(/\/$/,'');
  if(hash)return hash;
  var match=window.location.pathname.match(/\/fichas\/([^/]+)\/?$/);
  return match?match[1]:'';
}

function getInitialIdx(){
  var id=getRequestedSlideId();
  if(!id)return 0;
  var idx=filtered.findIndex(function(s){return s.id===id});
  return idx>=0?idx:0;
}

function getSlideUrl(slide){
  return getBaseFichasUrl()+(slide&&slide.id?'#'+slide.id:'');
}

function syncUrl(slide){
  if(!slide)return;
  var next=getSlideUrl(slide);
  if(window.location.href===next)return;
  try{history.replaceState(null,'',next);}catch(e){window.location.hash=slide.id;}
}

function init(){
  renderProgressBars();
  showSlide(getInitialIdx(),true);
  setTimeout(function(){loading.classList.add('hidden')},300);
  setupInteractions();
  setupFilters();
  setupShare();
  if(navigator.share){shNative.style.display='flex';}
}

function renderProgressBars(){
  pbars.innerHTML=filtered.map(function(_,i){
    return '<div class="pb'+(i<curIdx?' seen':'')+(i===curIdx?' current':'')+'" data-idx="'+i+'"><div class="pb-fill"></div></div>';
  }).join('');
  pbars.querySelectorAll('.pb').forEach(function(el){
    el.addEventListener('click',function(){
      var idx=parseInt(this.dataset.idx);
      if(idx<=curIdx)goTo(idx);
    });
  });
}

function showSlide(idx,instant){
  if(idx<0||idx>=filtered.length)return;
  curIdx=idx;
  var slide=filtered[idx];
  if(currentSlideEl){
    var old=currentSlideEl;
    if(!instant){
      var dir=idx>parseInt(old.dataset.idx||0)?'left':'right';
      old.classList.add(dir==='left'?'left-out':'right-out');
      setTimeout(function(){if(old&&old.parentNode)old.remove()},400);
    }else{old.remove();}
  }
  var el=document.createElement('div');
  el.className='slide';
  el.dataset.idx=idx;
  if(slide.type==='cover')el.classList.add('slide-cover');
  else if(slide.type==='special')el.classList.add('slide-special');
  else el.classList.add('slide-country');
  el.innerHTML=renderSlide(slide)+
    '<div class="scroll-fade scroll-fade-top" aria-hidden="true"></div>'+ 
    '<button class="scroll-hint" type="button" aria-label="Descer para continuar lendo esta ficha"><span>Descer na ficha</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button>'+ 
    '<div class="scroll-fade scroll-fade-bottom" aria-hidden="true"></div>';
  setupScrollHint(el);
  if(!instant){el.classList.add(idx>0?'right-out':'left-out');}
  stage.appendChild(el);
  void el.offsetHeight;
  if(!instant){
    requestAnimationFrame(function(){
      el.classList.remove('right-out','left-out');
    });
  }
  currentSlideEl=el;
  counter.textContent=String(idx+1).padStart(2,'0')+'/'+String(filtered.length).padStart(2,'0');
  updateProgressBars();
  syncUrl(slide);
  startAutoTimer();
}

function setupScrollHint(el){
  var hint=el.querySelector('.scroll-hint');
  var topFade=el.querySelector('.scroll-fade-top');
  var bottomFade=el.querySelector('.scroll-fade-bottom');
  var sections=Array.prototype.slice.call(el.querySelectorAll('.content > .block, .content > .stats-grid, .content > .wc-box, .content > .question-box, .content > .references-box, .content > .special-grid, .content > .special-map, .content > .lab-credit'));
  if(!sections.length){sections=Array.prototype.slice.call(el.querySelectorAll('.content > *')).filter(function(node){return !node.classList.contains('card-footer')});}
  sections.forEach(function(section,i){section.classList.add('read-section');section.dataset.readStep=String(i+1);});
  function sync(){
    var hasMore=el.scrollHeight>el.clientHeight+28;
    var nearTop=el.scrollTop<16;
    var nearEnd=el.scrollTop+el.clientHeight>=el.scrollHeight-42;
    if(hint)hint.classList.toggle('is-visible',hasMore&&!nearEnd);
    if(topFade)topFade.classList.toggle('is-visible',hasMore&&!nearTop);
    if(bottomFade)bottomFade.classList.toggle('is-visible',hasMore&&!nearEnd);
  }
  if(hint){
    hint.addEventListener('click',function(){
      var next=sections.find(function(section){return section.offsetTop>el.scrollTop+el.clientHeight*.34;});
      el.scrollTo({top:next?Math.max(0,next.offsetTop-18):el.scrollTop+Math.round(el.clientHeight*.72),behavior:'smooth'});
    });
  }
  el.addEventListener('scroll',sync,{passive:true});
  requestAnimationFrame(sync);
  setTimeout(sync,350);
}

function updateProgressBars(){
  pbars.querySelectorAll('.pb').forEach(function(el,i){
    el.classList.remove('seen','current');
    if(i<curIdx)el.classList.add('seen');
    if(i===curIdx)el.classList.add('current');
    if(i>curIdx){var f=el.querySelector('.pb-fill');if(f)f.style.width='0%';}
  });
}

function next(){
  if(curIdx>=filtered.length-1)return;
  var curBar=pbars.querySelector('.pb.current .pb-fill');
  if(curBar)curBar.style.width='100%';
  showSlide(curIdx+1);
}
function prev(){
  if(curIdx<=0)return;
  showSlide(curIdx-1);
}
function goTo(idx){if(idx!==curIdx)showSlide(idx);}

// Autoplay
function startAutoTimer(){
  stopAutoTimer();
  if(!autoActive)return;
  currentSlideStart=Date.now();
  pausedRemaining=AUTO_MS;
  isPaused=false;
  tickProgress();
}
function tickProgress(){
  if(!autoActive||isPaused)return;
  var elapsed=Date.now()-currentSlideStart;
  var pct=Math.min(100,(elapsed/AUTO_MS)*100);
  var curBar=pbars.querySelector('.pb.current .pb-fill');
  if(curBar)curBar.style.width=pct+'%';
  if(pct>=100){
    if(curIdx<filtered.length-1)next();else stopAutoplay();
    return;
  }
  progressRAF=requestAnimationFrame(tickProgress);
}
function stopAutoTimer(){if(progressRAF)cancelAnimationFrame(progressRAF);progressRAF=null;}
function toggleAutoplay(){
  autoActive=!autoActive;
  btnPlay.classList.toggle('playing',autoActive);
  if(autoActive)startAutoTimer();else stopAutoTimer();
}
function pauseAutoplay(){
  if(!autoActive||isPaused)return;
  isPaused=true;
  pausedRemaining-=Date.now()-currentSlideStart;
  if(progressRAF)cancelAnimationFrame(progressRAF);
}
function resumeAutoplay(){
  if(!autoActive||!isPaused)return;
  isPaused=false;
  currentSlideStart=Date.now()-(AUTO_MS-pausedRemaining);
  tickProgress();
}
function stopAutoplay(){
  autoActive=false;
  btnPlay.classList.remove('playing');
  stopAutoTimer();
}

// Interactions
function setupInteractions(){
  navLeft.addEventListener('click',prev);
  navRight.addEventListener('click',next);
  arrowPrev.addEventListener('click',prev);
  arrowNext.addEventListener('click',next);
  btnPlay.addEventListener('click',toggleAutoplay);

  var tx=0,ty=0,sx=0,sy=0;
  stage.addEventListener('touchstart',function(e){
    sx=e.touches[0].clientX;sy=e.touches[0].clientY;tx=0;ty=0;
    pauseAutoplay();
  },{passive:true});
  stage.addEventListener('touchmove',function(e){
    tx=e.touches[0].clientX-sx;ty=e.touches[0].clientY-sy;
  },{passive:true});
  stage.addEventListener('touchend',function(){
    resumeAutoplay();
    var ax=Math.abs(tx),ay=Math.abs(ty);
    if(ax>50&&ax>ay){if(tx>0)prev();else next();}
  },{passive:true});

  document.addEventListener('keydown',function(e){
    if(e.key==='ArrowLeft'||e.key==='ArrowUp'){prev();}
    if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key===' '){e.preventDefault();next();}
    if(e.key==='Escape'){fp.classList.remove('open');closeShareMenu();}
  });

  btnFilter.addEventListener('click',function(){fp.classList.add('open');pauseAutoplay();});
  fpClose.addEventListener('click',function(){fp.classList.remove('open');resumeAutoplay();});

  document.addEventListener('visibilitychange',function(){
    if(document.hidden)pauseAutoplay();else resumeAutoplay();
  });

  window.addEventListener('hashchange',function(){
    var id=getRequestedSlideId();
    if(!id)return;
    var idx=filtered.findIndex(function(s){return s.id===id});
    if(idx>=0&&idx!==curIdx)showSlide(idx,true);
  });
}

// Filters
function normText(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
}

function displayRegionName(r){
  return {'America do Sul':'América do Sul','America do Norte':'América do Norte','Africa':'África','Asia':'Ásia','Oceania':'Oceania','Europa':'Europa'}[r]||r;
}

function setupFilters(){
  var regionMap={
    'America do Sul':'America do Sul','America do Norte':'America do Norte','America Central':'America do Norte','Caribe':'America do Norte',
    'Africa':'Africa','Africa Atlantica':'Africa',
    'Europa':'Europa','Europa Atlantica':'Europa','Europa Balcanica':'Europa','Europa Alpina':'Europa','Europa Central':'Europa','Europa Nordica':'Europa','Balcas':'Europa',
    'Asia Ocidental':'Asia','Asia Central':'Asia','Leste Asiatico':'Asia','Peninsula Arabica':'Asia','Levante / margem arabica':'Asia','Mesopotamia / margem arabica':'Asia','Anatolia / Europa-Asia':'Asia',
    'Oceania':'Oceania'
  };
  var regions=[];
  countries.forEach(function(c){
    var norm=c.region.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z ]/g,'');
    var mapped=regionMap[norm]||c.region;
    if(mapped&&regions.indexOf(mapped)===-1)regions.push(mapped);
  });
  document.getElementById('fp-regions').innerHTML=regions.sort().map(function(r){
    return '<button type="button" class="fp-chip" data-f="region-'+esc(r)+'">'+esc(displayRegionName(r))+'</button>';
  }).join('');

  var gl=[];
  countries.forEach(function(c){if(c.group&&gl.indexOf(c.group)===-1)gl.push(c.group)});
  gl.sort();
  document.getElementById('fp-groups').innerHTML=gl.map(function(g){
    return '<button type="button" class="fp-chip" data-f="group-'+g+'">Grupo '+g+'</button>';
  }).join('');

  var cl=[];
  countries.forEach(function(c){var cf=(confederations[c.name]||[])[0];if(cf&&cl.indexOf(cf)===-1)cl.push(cf)});
  cl.sort();
  document.getElementById('fp-confed').innerHTML=cl.map(function(cf){
    return '<button type="button" class="fp-chip" data-f="confed-'+cf+'">'+cf+'</button>';
  }).join('');

  document.querySelectorAll('.fp-chip').forEach(function(chip){
    chip.setAttribute('aria-pressed','false');
    chip.addEventListener('click',function(){
      if(this.classList.contains('active')){this.classList.remove('active');this.setAttribute('aria-pressed','false');}
      else{
        this.parentElement.querySelectorAll('.fp-chip').forEach(function(s){s.classList.remove('active');s.setAttribute('aria-pressed','false')});
        this.classList.add('active');this.setAttribute('aria-pressed','true');
      }
      applyFilters();
    });
  });

  fpSearch.addEventListener('input',function(){activeFilters.search=normText(this.value);renderSuggestions(this.value);applyFilters();});
  fpClear.addEventListener('click',function(){
    document.querySelectorAll('.fp-chip.active').forEach(function(c){c.classList.remove('active');c.setAttribute('aria-pressed','false')});
    fpSearch.value='';
    activeFilters={search:'',group:null,region:null,gondwana:null,abya:null,confed:null};
    renderSuggestions('');
    applyFilters();
  });
  applyFilters();
}

function getSearchHaystack(c){
  return normText([c.name,c.region,c.group,(confederations[c.name]||[])[0],c.relation==='forte'?'Gondwana':'Outras seleções',c.abyaYala?'Abya Yala':'fora de Abya Yala'].filter(Boolean).join(' '));
}

function renderSuggestions(raw){
  var box=document.getElementById('fp-suggestions');
  if(!box)return;
  var q=normText(raw);
  if(q.length<2){box.classList.remove('open');box.innerHTML='';return;}
  var matches=countries.filter(function(c){return getSearchHaystack(c).indexOf(q)>=0}).slice(0,6);
  if(!matches.length){box.classList.add('open');box.innerHTML='<div class="fp-suggestion empty">Nenhuma seleção encontrada</div>';return;}
  box.classList.add('open');
  box.innerHTML=matches.map(function(c){
    var meta=[displayRegionName(c.region),(confederations[c.name]||[])[0],c.group?'Grupo '+c.group:''].filter(Boolean).join(' · ');
    return '<button type="button" class="fp-suggestion" data-country="'+esc(c.name)+'"><strong>'+esc(c.name)+'</strong><span>'+esc(meta)+'</span></button>';
  }).join('');
  box.querySelectorAll('.fp-suggestion[data-country]').forEach(function(btn){
    btn.addEventListener('click',function(){fpSearch.value=this.dataset.country;activeFilters.search=normText(this.dataset.country);renderSuggestions('');applyFilters();});
  });
}

function activeFilterLabels(){
  var labels=[];
  if(activeFilters.search)labels.push('Busca: '+fpSearch.value.trim());
  document.querySelectorAll('.fp-chip.active').forEach(function(chip){labels.push(chip.textContent.trim())});
  return labels;
}

function renderFilterFeedback(countrySlides){
  var active=document.getElementById('fp-active');
  var list=document.getElementById('fp-result-list');
  var labels=activeFilterLabels();
  if(active){active.innerHTML=labels.length?labels.map(function(l){return'<span>'+esc(l)+'</span>'}).join(''):'<span class="muted">Sem filtros ativos · vendo todas as seleções</span>';}
  if(!list)return;
  if(!labels.length){list.innerHTML='';return;}
  if(!countrySlides.length){list.innerHTML='<div class="fp-empty"><strong>Nada encontrado.</strong><p>Tente remover um filtro ou buscar por país, região, grupo ou confederação.</p></div>';return;}
  list.innerHTML=countrySlides.slice(0,8).map(function(slide){
    var c=slide.country;
    var meta=[displayRegionName(c.region),(confederations[c.name]||[])[0],c.group?'Grupo '+c.group:''].filter(Boolean).join(' · ');
    return '<button type="button" class="fp-result-item" data-slide="'+esc(slide.id)+'"><strong>'+esc(c.name)+'</strong><span>'+esc(meta)+'</span></button>';
  }).join('')+(countrySlides.length>8?'<div class="fp-result-more">+'+(countrySlides.length-8)+' seleções no filtro</div>':'');
  list.querySelectorAll('.fp-result-item').forEach(function(btn){
    btn.addEventListener('click',function(){var idx=filtered.findIndex(function(s){return s.id===btn.dataset.slide});if(idx>=0){fp.classList.remove('open');resumeAutoplay();showSlide(idx,true);}});
  });
}

var activeFilters={search:'',group:null,region:null,gondwana:null,abya:null,confed:null};

function applyFilters(){
  activeFilters.group=null;activeFilters.region=null;activeFilters.gondwana=null;activeFilters.abya=null;activeFilters.confed=null;
  document.querySelectorAll('.fp-chip.active').forEach(function(chip){
    var f=chip.dataset.f;
    if(f.indexOf('group-')===0)activeFilters.group=f.replace('group-','');
    else if(f.indexOf('region-')===0)activeFilters.region=f.replace('region-','');
    else if(f.indexOf('confed-')===0)activeFilters.confed=f.replace('confed-','');
    else if(f==='g-forte')activeFilters.gondwana='forte';
    else if(f==='g-outros')activeFilters.gondwana='outros';
    else if(f==='a-yes')activeFilters.abya='yes';
    else if(f==='a-no')activeFilters.abya='no';
  });

  filtered=allSlides.filter(function(slide){
    if(slide.type!=='country')return true;
    var c=slide.country;
    if(activeFilters.search&&getSearchHaystack(c).indexOf(activeFilters.search)===-1)return false;
    if(activeFilters.group&&c.group!==activeFilters.group)return false;
    if(activeFilters.region){
      var regionMap2={'America do Sul':'America do Sul','America do Norte':'America do Norte','America Central':'America do Norte','Caribe':'America do Norte','Africa':'Africa','Africa Atlantica':'Africa','Europa':'Europa','Europa Atlantica':'Europa','Europa Balcanica':'Europa','Europa Alpina':'Europa','Europa Central':'Europa','Europa Nordica':'Europa','Balcas':'Europa','Asia Ocidental':'Asia','Asia Central':'Asia','Leste Asiatico':'Asia','Peninsula Arabica':'Asia','Levante / margem arabica':'Asia','Mesopotamia / margem arabica':'Asia','Anatolia / Europa-Asia':'Asia','Oceania':'Oceania'};
      var cnorm=c.region.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z ]/g,'');
      var cmapped=regionMap2[cnorm]||c.region;
      if(cmapped!==activeFilters.region)return false;
    }
    if(activeFilters.confed&&(confederations[c.name]||[])[0]!==activeFilters.confed)return false;
    if(activeFilters.gondwana==='forte'&&c.relation!=='forte')return false;
    if(activeFilters.gondwana==='outros'&&c.relation==='forte')return false;
    if(activeFilters.abya==='yes'&&!c.abyaYala)return false;
    if(activeFilters.abya==='no'&&c.abyaYala)return false;
    return true;
  });

  var countrySlides=filtered.filter(function(s){return s.type==='country'});
  var cc=countrySlides.length;
  fpResults.style.display='flex';
  fpCount.textContent=(cc===1?'1 seleção':cc+' seleções')+' de '+countries.length;
  document.getElementById('fp-mode').textContent=activeFilterLabels().length?'Filtros combinados por inteligência de interseção.':'Toque em uma sugestão ou siga navegando pelas fichas.';
  renderFilterFeedback(countrySlides);

  if(curIdx>=filtered.length)curIdx=0;
  renderProgressBars();
  showSlide(curIdx,true);
}

// Share
function setupShare(){
  var sb=document.createElement('div');
  sb.className='share-bar';
  sb.innerHTML='<button class="share-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v13"/></svg>Compartilhar</button>';
  sb.querySelector('button').addEventListener('click',openShareMenu);
  document.querySelector('.viewport').appendChild(sb);

  document.getElementById('sh-wa').addEventListener('click',function(e){shareTo('wa',e)});
  document.getElementById('sh-tg').addEventListener('click',function(e){shareTo('tg',e)});
  shCopy.addEventListener('click',copyLink);
  shNative.addEventListener('click',nativeShare);
  shCancel.addEventListener('click',closeShareMenu);
  shOverlay.addEventListener('click',closeShareMenu);
}

function openShareMenu(){shMenu.classList.add('open');shOverlay.classList.add('open');}
function closeShareMenu(){shMenu.classList.remove('open');shOverlay.classList.remove('open');}

function getBaseFichasUrl(){
  return window.location.origin+'/a-bola-conecta/copa-2026/fichas/';
}

function getFlagEmoji(code){
  if(!code||code.length!==2)return '';
  return code.toUpperCase().replace(/./g,function(char){return String.fromCodePoint(127397+char.charCodeAt(0));});
}

function getShareLabel(slide){
  if(slide&&slide.country){
    var flag=getFlagEmoji(slide.country.code);
    return (flag?flag+' ':'')+slide.country.name+' - Seleções Gondwana';
  }
  return 'Seleções Gondwana - Copa 2026';
}

function getCurrentUrl(){
  return getSlideUrl(filtered[curIdx]);
}

function shareTo(type,e){
  var url=getCurrentUrl(),slide=filtered[curIdx];
  var txt=getShareLabel(slide);
  if(type==='wa'){e.currentTarget.href='https://wa.me/?text='+encodeURIComponent(txt+' '+url);}
  else if(type==='tg'){e.currentTarget.href='https://t.me/share/url?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(txt);}
}

function copyLink(){
  var url=getCurrentUrl();
  if(navigator.clipboard){navigator.clipboard.writeText(url).then(function(){closeShareMenu()});}
  else{
    var ta=document.createElement('textarea');ta.value=url;document.body.appendChild(ta);
    ta.select();document.execCommand('copy');document.body.removeChild(ta);closeShareMenu();
  }
}

function nativeShare(){
  var s=filtered[curIdx],url=getCurrentUrl();
  var txt=getShareLabel(s);
  navigator.share({title:txt,text:txt,url:url}).then(function(){closeShareMenu()}).catch(function(){});
}

// === Instagram Stories: generar imagen 1080x1920 ===
function shareToInstagram(){
  var slide=filtered[curIdx];
  if(!slide){return;}
  var c=slide.country, special=slide.special;
  var W=1080,H=1920;
  var PAD=80; // padding lateral seguro
  var SAFE_TOP=260; // zona segura top de Instagram
  var SAFE_BOT=380; // zona segura bottom de Instagram
  var usableH=H-SAFE_TOP-SAFE_BOT;

  var canvas=document.createElement('canvas');
  canvas.width=W;canvas.height=H;
  var ctx=canvas.getContext('2d');

  // Background gradient
  var bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'#17243A');bg.addColorStop(.62,'#11130F');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);

  // Radial glow
  var glow=ctx.createRadialGradient(W*.84,H*.12,0,W*.84,H*.12,600);
  glow.addColorStop(0,'rgba(242,194,48,0.1)');glow.addColorStop(1,'rgba(242,194,48,0)');
  ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);

  // Decorative orbit circle
  ctx.strokeStyle='rgba(246,237,215,0.06)';ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(W+100,H*.35,380,0,Math.PI*2);ctx.stroke();

  // Brand band (top)
  ctx.fillStyle='#17243A';ctx.fillRect(0,0,W/3,8);
  ctx.fillStyle='#2E6F46';ctx.fillRect(W/3,0,W/3,8);
  ctx.fillStyle='#F2C230';ctx.fillRect(2*W/3,0,W/3,8);

  var y=SAFE_TOP;

  if(special){
    // Special card
    ctx.textAlign='center';
    ctx.fillStyle='#F2C230';
    ctx.font='900 30px Manrope,sans-serif';
    y=drawCenter(ctx,(special.tag||'GONDWANA').toUpperCase(),W/2,y,W-PAD*2,36);
    y+=30;

    ctx.fillStyle='#F6EDD7';
    ctx.font='900 68px Arial,sans-serif';
    y=drawCenter(ctx,special.title||'',W/2,y,W-PAD*2,76)+20;

    if(special.lede){
      ctx.fillStyle='rgba(246,237,215,0.7)';
      ctx.font='600 30px Georgia,serif';
      y=drawCenter(ctx,special.lede,W/2,y,W-PAD*2-40,42);
    }

    // Call to action
    y=H-SAFE_BOT-80;
    ctx.fillStyle='rgba(242,194,48,0.15)';
    roundRect(ctx,PAD,y-50,W-PAD*2,80,16);ctx.fill();
    ctx.fillStyle='#F2C230';ctx.font='900 24px Manrope,sans-serif';
    ctx.fillText('Deslize para ver todas as 55 fichas',W/2,y-5);

  }else if(c){
    // Country card
    ctx.textAlign='center';

    // Header zone: overline + country name + tags
    ctx.fillStyle='#F2C230';
    ctx.font='900 22px Manrope,sans-serif';
    y=drawCenter(ctx,'FICHAS POR PAIS',W/2,y,W-PAD*2,28);
    y+=30; // <-- mas espacio entre overline y nombre

    // Country name (big)
    ctx.fillStyle='#F6EDD7';
    ctx.font='900 74px Arial,sans-serif';
    y=drawCenter(ctx,(c.name||'').toUpperCase(),W/2,y,W-PAD*2,78)+16;

    // Tags line
    var tags=[];
    if(c.region)tags.push(c.region);
    if(c.confederation)tags.push(c.confederation);
    if(c.group)tags.push('Grupo '+c.group);
    if(tags.length){
      ctx.fillStyle='rgba(246,237,215,0.55)';
      ctx.font='700 24px Manrope,sans-serif';
      y=drawCenter(ctx,tags.join('  ·  '),W/2,y,W-PAD*2,30)+24;
    }else{y+=24;}

    // Blocks - distribute evenly to fill vertical space
    var blocks=[
      {label:'TERRITORIO',text:c.territory,color:'#F2C230'},
      {label:'CULTURA',text:c.culture,color:'#2E6F46'},
      {label:'FUTEBOL',text:c.football,color:'#9E4A2F'},
      {label:'MEMORIA',text:c.memory,color:'#4A6FA5'}
    ];

    var hasQuestion=c.question&&c.question.length>0;
    var blocksAvail=blocks.filter(function(b){return b.text&&b.text.length>5;});
    var footerZoneY=H-SAFE_BOT-60;
    var questionH=hasQuestion?130:0;
    var gap=14;
    var remainingH=footerZoneY-y-questionH-(blocksAvail.length-1)*gap;
    // Each block takes equal share, minimum 140, maximum 400
    var blockH=Math.max(140,Math.min(remainingH/blocksAvail.length,400));

    blocksAvail.forEach(function(b){
      if(y+blockH>footerZoneY-questionH)return;
      // Block background
      ctx.fillStyle='rgba(17,19,15,0.55)';
      roundRect(ctx,PAD,y,W-PAD*2,blockH,12);ctx.fill();
      // Left border accent
      ctx.fillStyle=b.color;ctx.fillRect(PAD,y,6,blockH);
      // Label
      ctx.textAlign='left';
      ctx.fillStyle=b.color;ctx.font='900 18px Manrope,sans-serif';
      ctx.fillText(b.label,PAD+28,y+34);
      // Text
      ctx.fillStyle='#F6EDD7';
      ctx.font='600 23px Manrope,sans-serif';
      var lines=wrapLines(ctx,b.text,W-PAD*2-70,31);
      var textStartY=y+70;
      var maxLines=Math.floor((blockH-80)/31);
      for(var i=0;i<Math.min(lines.length,maxLines);i++){
        ctx.fillText(lines[i],PAD+28,textStartY+i*31);
      }
      ctx.textAlign='center';
      y+=blockH+gap;
    });

    // Question box (always near bottom)
    if(hasQuestion){
      if(y<footerZoneY-questionH-10)y=footerZoneY-questionH-10;
      var qH=Math.min(questionH,footerZoneY-y);
      ctx.fillStyle='rgba(242,194,48,0.1)';
      roundRect(ctx,PAD,y,W-PAD*2,qH,12);ctx.fill();
      ctx.fillStyle='#F2C230';ctx.fillRect(PAD,y,6,qH);
      ctx.textAlign='left';
      ctx.fillStyle='#F6EDD7';ctx.font='italic 600 25px Georgia,serif';
      var qLines=wrapLines(ctx,'"'+c.question+'"',W-PAD*2-70,33);
      var qMaxLines=Math.floor((qH-50)/33);
      for(var i=0;i<Math.min(qLines.length,qMaxLines);i++){
        ctx.fillText(qLines[i],PAD+28,y+42+i*33);
      }
      ctx.textAlign='center';
    }
  }

  // Footer (in safe zone)
  ctx.textAlign='center';
  ctx.fillStyle='#F2C230';
  ctx.font='900 28px Manrope,sans-serif';
  ctx.fillText('SELEÇÕES GONDWANA',W/2,H-250);
  ctx.fillStyle='rgba(246,237,215,0.5)';
  ctx.font='700 22px Manrope,sans-serif';
  ctx.fillText('Copa 2026 · @gondwana.fc',W/2,H-215);
  ctx.fillStyle='rgba(242,194,48,0.6)';
  ctx.font='700 18px Manrope,sans-serif';
  ctx.fillText('sebas-ai.infraqualia.com/a-bola-conecta/copa-2026/',W/2,H-180);

  // Convert to image
  canvas.toBlob(function(blob){
    if(!blob){return;}
    var file=new File([blob],'gondwana-'+((c&&c.name)||'ficha')+'-story.png',{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){
      navigator.share({files:[file],title:'Selecoes Gondwana',text:'@gondwana.fc'}).then(function(){closeShareMenu()}).catch(function(){});
    }else{
      var dlUrl=URL.createObjectURL(blob);
      var a=document.createElement('a');a.href=dlUrl;a.download=file.name;a.click();
      URL.revokeObjectURL(dlUrl);closeShareMenu();
    }
  },'image/png');
}

// Helper: wrap text into lines
function wrapLines(ctx,text,maxW,lineH){
  var words=String(text||'').split(/\s+/);var lines=[];var line='';
  for(var i=0;i<words.length;i++){
    var test=line+words[i]+' ';
    if(ctx.measureText(test).width>maxW&&line){lines.push(line.trim());line=words[i]+' ';}
    else{line=test;}
  }
  if(line.trim())lines.push(line.trim());
  return lines;
}

// Helper: draw centered text with wrapping, returns new Y
function drawCenter(ctx,text,cx,cy,maxW,lineH){
  var lines=wrapLines(ctx,text,maxW,lineH);
  for(var i=0;i<lines.length;i++){ctx.fillText(lines[i],cx,cy+i*lineH);}
  return cy+lines.length*lineH;
}

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
}

init();
