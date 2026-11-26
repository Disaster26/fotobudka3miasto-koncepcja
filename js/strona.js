(function(){
var C=window.F3M||{tryb:'podglad',base:'/'};
var d=document;
// menu
var top=d.getElementById('top'),h=top.querySelector('.hamb');
h.addEventListener('click',function(){var o=top.classList.toggle('otwm');h.setAttribute('aria-expanded',o);d.body.style.overflow=o?'hidden':''});
var grupy=top.querySelectorAll('.gr');
top.querySelectorAll('.grb').forEach(function(b){b.addEventListener('click',function(e){e.stopPropagation();var li=b.parentNode,o=!li.classList.contains('otw');grupy.forEach(function(g){if(g!==li&&!matchMedia('(max-width:1100px)').matches){g.classList.remove('otw');var x=g.querySelector('.grb');x&&x.setAttribute('aria-expanded',false)}});li.classList.toggle('otw',o);b.setAttribute('aria-expanded',o)})});
d.addEventListener('click',function(e){if(!matchMedia('(max-width:1100px)').matches&&!top.contains(e.target))grupy.forEach(function(g){g.classList.remove('otw')})});
d.addEventListener('keydown',function(e){if(e.key==='Escape'){grupy.forEach(function(g){g.classList.remove('otw')});if(top.classList.contains('otwm')){top.classList.remove('otwm');h.setAttribute('aria-expanded',false);d.body.style.overflow=''}}});
// w menu mobilnym grupa z biezaca podstrona od razu rozwinieta
if(matchMedia('(max-width:1100px)').matches){var ak=top.querySelector('.gr.akt');if(ak&&ak.querySelector('.grb')){ak.classList.add('otw');ak.querySelector('.grb').setAttribute('aria-expanded',true)}}
top.querySelectorAll('.menu a').forEach(function(a){a.addEventListener('click',function(){top.classList.remove('otwm');d.body.style.overflow=''})});

// tasmy: strzalki + przeciaganie myszą
d.querySelectorAll('.tasma,.tasma-s').forEach(function(t){
  var sek=t.closest('section'),st=sek&&sek.querySelectorAll('.strzalki button');
  st&&st.forEach(function(b){b.addEventListener('click',function(){var k=t.firstElementChild;t.scrollBy({left:(k.offsetWidth+20)*+b.dataset.kier,behavior:'smooth'})})});
  var dn=false,x0,s0,ruch=0;
  t.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;dn=true;ruch=0;x0=e.clientX;s0=t.scrollLeft;t.classList.add('ciag')});
  window.addEventListener('pointermove',function(e){if(!dn)return;ruch=Math.abs(e.clientX-x0);t.scrollLeft=s0-(e.clientX-x0)});
  window.addEventListener('pointerup',function(){if(!dn)return;dn=false;t.classList.remove('ciag')});
  t.addEventListener('click',function(e){if(ruch>6){e.preventDefault();e.stopPropagation();ruch=0}},true);
  t.addEventListener('dragstart',function(e){e.preventDefault()});
});

// lightbox
var lb=d.getElementById('lb'),lbi=lb.querySelector('img'),lista=[],nr=0;
function pokaz(i){nr=(i+lista.length)%lista.length;lb.querySelector('.lb-p').hidden=lb.querySelector('.lb-n').hidden=lista.length<2;lbi.src=lista[nr].href;lbi.alt=(lista[nr].querySelector('img')||{}).alt||''}
function zamknij(){lb.hidden=true;lbi.removeAttribute('src');d.body.style.overflow=''}
d.addEventListener('click',function(e){var a=e.target.closest('a[data-lb]');if(!a)return;e.preventDefault();var g=a.closest('.gal');lista=g?[].slice.call(g.querySelectorAll('a[data-lb]')):[a];pokaz(lista.indexOf(a));lb.hidden=false;d.body.style.overflow='hidden';lb.querySelector('.lb-x').focus()});
lb.querySelector('.lb-x').addEventListener('click',zamknij);
lb.querySelector('.lb-p').addEventListener('click',function(){pokaz(nr-1)});
lb.querySelector('.lb-n').addEventListener('click',function(){pokaz(nr+1)});
lb.addEventListener('click',function(e){if(e.target===lb)zamknij()});
d.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')zamknij();if(e.key==='ArrowLeft')pokaz(nr-1);if(e.key==='ArrowRight')pokaz(nr+1)});
var tx=null;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
lb.addEventListener('touchend',function(e){if(tx===null)return;var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)pokaz(nr+(dx<0?1:-1));tx=null});

// przyciski pakietow -> formularz
d.querySelectorAll('[data-pakiet]').forEach(function(b){b.addEventListener('click',function(){var f=d.querySelector('.form');if(!f)return;var s=f.querySelector('[name=pakiet]'),p=b.dataset.pakiet;[].forEach.call(s.options,function(o){if(o.text.indexOf(p)===0)s.value=o.value});if(!/^(Mini|Big|Premium)/.test(p)){var w=f.querySelector('[name=wiad]');if(w&&!w.value)w.value='Interesuje mnie: '+p+'. '}})});

// formularz
d.querySelectorAll('.form').forEach(function(f){
  var zr=f.querySelector('[name=zrodlo]');if(zr)zr.value=location.pathname;
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var w=f.querySelector('.wynik'),im=f.querySelector('[name=imie]'),te=f.querySelector('[name=tel]'),ma=f.querySelector('[name=mail]');
    [im,te,ma].forEach(function(x){x.classList.remove('blad')});
    w.className='wynik cala';
    if(!im.value.trim()){im.classList.add('blad');w.textContent='Podaj imię i nazwisko.';w.classList.add('zle');im.focus();return}
    if(te.value.replace(/\D/g,'').length<9&&!/^\S+@\S+\.\S+$/.test(ma.value)){te.classList.add('blad');w.textContent='Podaj numer telefonu (min. 9 cyfr) albo poprawny e-mail.';w.classList.add('zle');te.focus();return}
    if(ma.value&&!/^\S+@\S+\.\S+$/.test(ma.value)){ma.classList.add('blad');w.textContent='Sprawdź adres e-mail.';w.classList.add('zle');ma.focus();return}
    if(C.tryb!=='produkcja'){w.textContent='To wersja do akceptacji: po uruchomieniu na fotobudka3miasto.pl zapytanie trafi od razu na kontakt@fotobudka3miasto.pl, a nadawca dostanie potwierdzenie.';w.classList.add('ok');return}
    var b=f.querySelector('button[type=submit]');b.disabled=true;w.textContent='Wysyłam...';
    fetch(f.action,{method:'POST',body:new FormData(f),headers:{'Accept':'application/json'}}).then(function(r){return r.json()}).then(function(j){
      if(j&&j.ok){var mz=f.mail&&f.mail.value;f.reset();if(zr)zr.value=location.pathname;w.textContent='Dziękujemy! Zapytanie zostało wysłane, odpiszemy najszybciej, jak to możliwe.'+(mz?' Potwierdzenie wysłaliśmy na podany e-mail - jeśli go nie widać, zajrzyj do folderu Spam.':'');w.classList.add('ok');
        if(window.gtag)gtag('event','generate_lead',{form_location:location.pathname})}
      else{w.textContent=(j&&j.blad)||'Nie udało się wysłać. Zadzwoń: 604 841 511.';w.classList.add('zle')}
    }).catch(function(){w.textContent='Nie udało się wysłać. Zadzwoń: 604 841 511 albo napisz: kontakt@fotobudka3miasto.pl.';w.classList.add('zle')}).then(function(){b.disabled=false});
  });
});

// zgody cookies
// wersja do akceptacji nie ma banera: wtedy brak zgod = mapa od razu
var ck=d.getElementById('cookies')||d.createElement('div'),ust=ck.querySelector('.ck-ust'),zap=ck.querySelector('[data-ck=zapisz]'),Z=null;
try{Z=JSON.parse(localStorage.getItem('f3m_zgody')||'null');if(Z&&Z.t<Date.now()-31536000000)Z=null}catch(e){}
if(C.tryb!=='produkcja')Z=null;
function zapisz(z){z.t=Date.now();Z=z;try{localStorage.setItem('f3m_zgody',JSON.stringify(z))}catch(e){}ck.hidden=true;zastosuj()}
ck.addEventListener('click',function(e){var b=e.target.closest('[data-ck]');if(!b)return;var k=b.dataset.ck;
  if(k==='wszystkie')zapisz({a:1,m:1,mp:1});
  if(k==='niezbedne')zapisz({a:0,m:0,mp:0});
  if(k==='ustawienia'){ust.hidden=false;zap.hidden=false;b.hidden=true;if(Z){ust.querySelector('[name=a]').checked=!!Z.a;ust.querySelector('[name=m]').checked=!!Z.m;ust.querySelector('[name=mp]').checked=Z.mp!==0}}
  if(k==='zapisz')zapisz({a:ust.querySelector('[name=a]').checked?1:0,m:ust.querySelector('[name=m]').checked?1:0,mp:ust.querySelector('[name=mp]').checked?1:0});
});
d.querySelectorAll('[data-cookies]').forEach(function(b){if(!ust){b.hidden=true;return}b.addEventListener('click',function(){ck.hidden=false;ck.querySelector('[data-ck=ustawienia]').click()})});
var tagiWczytane=false;
function zastosuj(){
  if(C.tryb==='produkcja'&&Z&&window.gtag){
    gtag('consent','update',{analytics_storage:Z.a?'granted':'denied',ad_storage:Z.m?'granted':'denied',ad_user_data:Z.m?'granted':'denied',ad_personalization:Z.m?'granted':'denied'});
    if((Z.a||Z.m)&&!tagiWczytane&&window.F3M_TAGI){tagiWczytane=true;var T=window.F3M_TAGI;
      var s=d.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+T.ga;d.head.appendChild(s);
      gtag('js',new Date());gtag('config',T.ga,{anonymize_ip:true});gtag('config',T.ads);
      dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});var g=d.createElement('script');g.async=true;g.src='https://www.googletagmanager.com/gtm.js?id='+T.gtm;d.head.appendChild(g);}
  }
  mapy();
}
// mapa Google: ladowana przy przewinieciu, chyba ze odrzucono zgode
var mp=d.getElementById('mapa');
function wstawMape(){if(!mp||mp.querySelector('iframe'))return;var z=mp.querySelector('.mapa-z');z.hidden=true;var i=d.createElement('iframe');i.src=mp.dataset.src;i.loading='lazy';i.title='Mapa dojazdu: Fotobudka3miasto, Pogórze';i.referrerPolicy='no-referrer-when-downgrade';mp.appendChild(i)}
var obs=null;
function mapy(){if(!mp)return;if(Z&&Z.mp===0){var i=mp.querySelector('iframe');if(i)i.remove();mp.querySelector('.mapa-z').hidden=false;return}
  if('IntersectionObserver' in window){if(obs)return;obs=new IntersectionObserver(function(en,o){if(en[0].isIntersecting){wstawMape();o.disconnect();obs=null}},{rootMargin:'300px'});obs.observe(mp)}else wstawMape()}
if(mp){var pm=mp.querySelector('[data-mapa]');pm&&pm.addEventListener('click',function(){var z=Z||{a:0,m:0};z.mp=1;zapisz(z);wstawMape()})}
zastosuj();
})();
