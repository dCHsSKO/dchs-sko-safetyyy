const items=['Окна защищены блокираторами','Дети не остаются без присмотра','Дымоход очищен','Печь без повреждений','На печи нет вещей','Провода без повреждений','Розетки не перегружены','Дымовой извещатель работает','Батарея извещателя проверена','Все знают 101 и 112'];
const itemsKz=['Терезелер блокиратормен қорғалған','Балалар қараусыз қалмайды','Мұржа тазартылған','Пеште ақау жоқ','Пештің үстінде киім жоқ','Сымдар зақымдалмаған','Розеткалар артық жүктелмеген','Өрт хабарлағышы жұмыс істейді','Хабарлағыш батареясы тексерілген','Барлығы 101 және 112 нөмірлерін біледі'];
const list=document.querySelector('.checklist');
const saved=JSON.parse(localStorage.getItem('safeHomeV2')||'[]');
items.forEach((x,i)=>{const l=document.createElement('label');const c=document.createElement('input');c.type='checkbox';c.checked=!!saved[i];c.setAttribute('aria-label',x);l.append(c,document.createTextNode(x));list.append(l)});
const boxes=[...list.querySelectorAll('input')],bar=document.querySelector('.meter span'),pct=document.getElementById('pct');
function up(){const n=boxes.filter(x=>x.checked).length;bar.style.width=n*10+'%';pct.textContent=n*10+'%';boxes.forEach(x=>x.parentElement.classList.toggle('done',x.checked));localStorage.setItem('safeHomeV2',JSON.stringify(boxes.map(x=>x.checked)))}
boxes.forEach(x=>x.addEventListener('change',up));up();
document.getElementById('reset').addEventListener('click',()=>{boxes.forEach(x=>x.checked=false);up()});
const u=location.href.split('#')[0],url=document.getElementById('url'),qr=document.getElementById('qrimg');
if(u.startsWith('file:')){url.textContent='Адрес появится после публикации';qr.src='https://api.qrserver.com/v1/create-qr-code/?size=700x700&margin=12&data=https%3A%2F%2Fexample.com%2F'}else{url.textContent=u;qr.src='https://api.qrserver.com/v1/create-qr-code/?size=700x700&margin=12&data='+encodeURIComponent(u)}
document.getElementById('copyUrl').addEventListener('click',async()=>{const text=u.startsWith('file:')?'Ссылка появится после публикации':u;try{await navigator.clipboard.writeText(text);document.getElementById('copyUrl').textContent='СКОПИРОВАНО ✓';setTimeout(()=>document.getElementById('copyUrl').textContent='СКОПИРОВАТЬ ССЫЛКУ',1400)}catch(e){}});
const topBtn=document.getElementById('topBtn');window.addEventListener('scroll',()=>topBtn.classList.toggle('show',scrollY>500),{passive:true});topBtn.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
const links=[...document.querySelectorAll('nav a')], sections=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-35% 0px -55%'});sections.forEach(s=>io.observe(s));

// Installable PWA: one app, same safety memo.
let deferredInstall = null;
const installApp = document.getElementById('installApp');
const installMini = document.getElementById('installMini');
const installToast = document.getElementById('installToast');
const toastInstall = document.getElementById('toastInstall');
const toastClose = document.getElementById('toastClose');
const installHint = document.getElementById('installHint');
function isStandalone(){return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true}
function showInstallUI(){
  if (isStandalone()) return;
  if (installMini) installMini.hidden=false;
  if (installToast) installToast.hidden=false;
}
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); deferredInstall=e; showInstallUI();
  if (installHint) installHint.textContent='Нажмите «Установить» — приложение добавится на экран телефона.';
});
async function installPWA(){
  if (deferredInstall){
    deferredInstall.prompt();
    const result=await deferredInstall.userChoice;
    deferredInstall=null;
    if(result.outcome==='accepted') hideInstallUI();
    return;
  }
  // iOS/Safari does not expose beforeinstallprompt: give the native install path.
  if (installHint) installHint.textContent='В Safari: «Поделиться» → «На экран Домой». В Chrome: меню ⋮ → «Установить приложение». ';
  if (installToast) installToast.hidden=false;
}
function hideInstallUI(){
  if(installMini) installMini.hidden=true;
  if(installToast) installToast.hidden=true;
}
[installApp,installMini,toastInstall].filter(Boolean).forEach(b=>b.addEventListener('click',installPWA));
if(toastClose) toastClose.addEventListener('click',()=>installToast.hidden=true);
window.addEventListener('appinstalled',hideInstallUI);
if(isStandalone()) hideInstallUI();

/* ===== DChS SKO V2 enhancements ===== */
(function(){
  const root=document.documentElement;
  const themeBtn=document.getElementById('themeBtn');
  const themes=['light','dark','contrast'];
  let themeNames={light:'СВЕТЛАЯ',dark:'ТЁМНАЯ',contrast:'КОНТРАСТ'};
  let theme=localStorage.getItem('dchsTheme')||'light';
  if(!themes.includes(theme)) theme='light';
  function applyTheme(){
    root.dataset.theme=theme;
    root.style.colorScheme=theme==='dark'?'dark':'light';
    if(themeBtn){themeBtn.querySelector('span').textContent=themeNames[theme]; themeBtn.setAttribute('aria-label','Тема: '+themeNames[theme]);}
    localStorage.setItem('dchsTheme',theme);
  }
  applyTheme();
  themeBtn?.addEventListener('click',()=>{theme=themes[(themes.indexOf(theme)+1)%themes.length];applyTheme();});

  // Reveal sections on scroll.
  const revealSelectors='.quickGrid a,.sCard,.manifesto,.section,.fire,.alarm,.check,.emergency,.bot,.appPromo,.qr,.gameSection';
  document.querySelectorAll(revealSelectors).forEach(el=>el.classList.add('reveal'));
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.12});
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  }else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));

  // Mini game: 5 hazards, 45 seconds, local best score.
  const start=document.getElementById('gameStart'), room=document.getElementById('gameRoom');
  const scoreEl=document.getElementById('gameScore'), timerEl=document.getElementById('gameTimer'), foundEl=document.getElementById('gameFound'), msg=document.getElementById('gameMessage');
  if(!start||!room)return;
  const gameText={
ru:{hazards:{window:'Ашық терезе — оны жауып, баланы терезе жанында қалдырмаңыз.'},start:'НАЧАТЬ ИГРУ →',message:'Нажмите «Начать игру»',find:'Найдите 5 опасностей',running:'ИГРА ИДЁТ',again:'ИГРАТЬ ЕЩЁ →',saved:'ДОМ СПАСЁН! Отличная работа',time:'Время вышло. Попробуйте ещё раз.'},
kz:{hazards:{window:'Ашық терезе — оны жауып, баланы терезе жанында қалдырмаңыз.'},start:'ОЙЫНДЫ БАСТАУ →',message:'«Ойынды бастау» түймесін басыңыз',find:'5 қауіпті жағдайды табыңыз',running:'ОЙЫН ЖҮРІП ЖАТЫР',again:'ҚАЙТА ОЙНАУ →',saved:'ҮЙ ҚАУІПСІЗ! Жақсы жұмыс',time:'Уақыт аяқталды. Қайта көріңіз.'}},
gameLang='ru';
const hazards={window:'Ашық терезе — оны жауып, баланы терезе жанында қалдырмаңыз.',stove:'Плита — қыздыруды өшіріп, оны қараусыз қалдырмаңыз.',wire:'Артық жүктелген розетка — қажет емес құралды ажыратыңыз.',candle:'Майшам — оны өшіріп, матадан алыс қойыңыз.',door:'Шығу жолы бұғатталған — есікке апаратын жолды босатыңыз.'};
let running=false,score=0,found=0,time=45,timer=null;
  const spots=[...room.querySelectorAll('.hotspot')];
  function reset(){score=0;found=0;time=45;running=false;clearInterval(timer);scoreEl.textContent='0';timerEl.textContent='45';foundEl.textContent='0/5';room.classList.add('locked');room.classList.remove('success');spots.forEach(s=>s.classList.remove('found','wrong'));msg.textContent=gameText[gameLang].message;start.textContent=gameText[gameLang].start;}
  function finish(success){running=false;clearInterval(timer);room.classList.remove('locked');if(success){score+=time*2;room.classList.add('success');msg.textContent=gameText[gameLang].saved+' — +'+score+(gameLang==='kz'?' ұпай':' очков');}else msg.textContent=gameText[gameLang].time;scoreEl.textContent=score;localStorage.setItem('dchsGameBest',String(Math.max(score,Number(localStorage.getItem('dchsGameBest')||0))));start.textContent=gameText[gameLang].again;}
  function begin(){score=0;found=0;time=45;running=true;room.classList.remove('success');room.classList.add('locked');spots.forEach(s=>s.classList.remove('found','wrong'));scoreEl.textContent='0';timerEl.textContent='45';foundEl.textContent='0/5';msg.textContent=gameText[gameLang].find;start.textContent=gameText[gameLang].running;clearInterval(timer);timer=setInterval(()=>{time--;timerEl.textContent=time;if(time<=0)finish(false)},1000);}
  spots.forEach(s=>s.addEventListener('click',()=>{if(!running||s.classList.contains('found'))return;s.classList.add('found');found++;score+=100;foundEl.textContent=found+'/5';scoreEl.textContent=score;msg.textContent=(gameLang==='kz'?hazards[s.dataset.hazard]:({window:'Открытое окно — закройте его и не оставляйте ребёнка рядом.',stove:'Плита — выключите нагрев и не оставляйте её без присмотра.',wire:'Перегруженная розетка — отключите лишний прибор.',candle:'Свеча — погасите её и уберите от ткани.',door:'Выход заблокирован — освободите путь к двери.'}[s.dataset.hazard]));if(found===5)finish(true);}));
  start.addEventListener('click',begin); reset();
})();

/* Fast images: prefer local WebP when supported; lazy-load below-the-fold posters. */
(function(){
  try {
    const webp = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
    if (!webp) return;
    document.querySelectorAll('img[src]').forEach(function(img){
      const src = img.getAttribute('src');
      if (!src || !/\.(jpe?g|png)$/i.test(src) || img.dataset.noWebp === 'true') return;
      const w = src.replace(/\.(jpe?g|png)$/i, '.webp');
      img.setAttribute('data-webp', w);
      const picture = document.createElement('picture');
      const source = document.createElement('source');
      source.type = 'image/webp';
      source.srcset = w;
      img.parentNode.insertBefore(picture, img);
      picture.appendChild(source);
      picture.appendChild(img);
    });
  } catch(e) {}
})();

document.addEventListener('safeLangChanged',e=>{gameLang=e.detail.lang==='kz'?'kz':'ru'; const arr=gameLang==='kz'?itemsKz:items; document.querySelectorAll('.checklist label').forEach((l,i)=>{if(l.lastChild)l.lastChild.textContent=arr[i]||''}); themeNames={light:e.detail.translations.themeLabels[0],dark:e.detail.translations.themeLabels[1],contrast:e.detail.translations.themeLabels[2]}; if(typeof applyTheme==='function')applyTheme(); if(typeof running!=='undefined'&&!running){msg.textContent=gameText[gameLang].message;start.textContent=gameText[gameLang].start;}});
