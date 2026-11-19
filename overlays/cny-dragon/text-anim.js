// Every character gets its OWN animation: its own entrance, idle motion, pop-out and exit,
// with its own timing, strength and easing. Everything loops on a 20 s cycle (same as rat.webm).
(function(){
  const CYCLE=20;
  let seed=20261; const r=()=>(seed=(seed*16807)%2147483647)/2147483647, pick=a=>a[Math.floor(r()*a.length)], rng=(a,b)=>a+r()*(b-a);
  const ease=['cubic-bezier(.2,1.6,.4,1)','cubic-bezier(.3,1.3,.5,1)','cubic-bezier(.6,0,.2,1)','cubic-bezier(.25,.8,.25,1)','ease-in-out','cubic-bezier(.5,-0.4,.4,1.4)'];
  const IN=[ // entrance start states
    a=>`translateY(${-a*rng(2,3.2)}px) rotate(${rng(-35,35)}deg) scale(.4)`,      // drop
    a=>`translateY(${a*rng(1.6,2.6)}px) scale(.15)`,                                // rise
    a=>`rotateY(${rng(90,200)}deg) scale(.6)`,                                       // flip
    a=>`scale(${rng(2.2,3.2)}) rotate(${rng(-30,30)}deg)`,                           // slam zoom
    a=>`translateX(${(r()<.5?-1:1)*a*rng(2.5,4)}px) skewX(${rng(-35,35)}deg)`,       // slide
    a=>`rotateX(${rng(90,160)}deg) translateY(${-a*.8}px)`,                          // tumble
    a=>`rotate(${(r()<.5?-1:1)*rng(160,360)}deg) scale(.3)`,                         // spin
  ];
  const OUT=[a=>`translateY(${-a*2}px) scale(.5)`,a=>`translateY(${a*1.5}px) rotate(${rng(-40,40)}deg)`,a=>`rotateY(${rng(90,180)}deg)`,a=>`scale(${rng(1.6,2.2)})`,a=>`translateX(${(r()<.5?-1:1)*a*3}px)`];
  const IDLE=[ // idle poses (alternated)
    a=>`translateY(${-a*rng(.15,.35)}px)`, a=>`translateY(${a*rng(.05,.2)}px)`,
    a=>`rotate(${rng(-9,9)}deg)`, a=>`scale(${rng(1.04,1.12)})`, a=>`scale(${rng(.94,.98)})`,
    a=>`rotateY(${rng(-35,35)}deg)`, a=>`translateX(${rng(-.15,.15)*a}px) rotate(${rng(-5,5)}deg)`, a=>`skewX(${rng(-10,10)}deg)`];
  const POP=[a=>`translateY(${-a*rng(.35,.6)}px) scale(${rng(1.25,1.5)})`,a=>`scale(${rng(1.3,1.6)}) rotate(${rng(-12,12)}deg)`,a=>`rotateY(360deg) scale(1.2)`,a=>`translateY(${-a*.5}px) rotate(${(r()<.5?-1:1)*360}deg)`];
  const sheet=document.createElement('style'); document.head.appendChild(sheet); let css='', n=0;
  function split(el){ // split only text nodes, keep icons
    const out=[]; [...el.childNodes].forEach(nd=>{ if(nd.nodeType!==3) return;
      const f=document.createDocumentFragment(); [...nd.textContent].forEach(c=>{const b=document.createElement('b');b.className='ch';b.textContent=c;f.appendChild(b);if(c.trim())out.push(b)}); nd.replaceWith(f)});
    return out;
  }
  function animate(el,{start,stagger,size,popAt}){
    split(el).forEach((b,k)=>{
      const id='c'+(n++), a=size, P=v=>(v*100).toFixed(2)+'%';
      const t0=(start+k*stagger+rng(0,.15))/CYCLE, inDur=rng(.6,1.1)/CYCLE;
      const pop=(popAt+k*rng(.05,.12)+rng(0,.2))/CYCLE, out0=(CYCLE-1.3+k*.03+rng(0,.2))/CYCLE;
      const from=pick(IN)(a), to=pick(OUT)(a), e=pick(ease);
      let kf=`@keyframes ${id}{0%{opacity:0;transform:${from}}${P(t0)}{opacity:0;transform:${from};animation-timing-function:${e}}`+
        `${P(t0+inDur*.7)}{opacity:1;transform:scale(${rng(1.08,1.25)})}${P(t0+inDur)}{opacity:1;transform:none}`;
      // idle poses with this character's own rhythm
      const idle=()=>{const k2=pick(IDLE);return k2(a)}, gaps=[];
      for(let x=t0+inDur+rng(.03,.06);x<pop-.03;x+=rng(.04,.09)) gaps.push(x);
      for(let x=pop+.06;x<out0-.03;x+=rng(.04,.09)) gaps.push(x);
      gaps.forEach((x,i)=>kf+=`${P(x)}{opacity:1;transform:${i%2?'none':idle()};animation-timing-function:${pick(ease)}}`);
      kf+=`${P(pop-.012)}{opacity:1;transform:none}${P(pop)}{opacity:1;transform:${pick(POP)(a)};filter:brightness(1.6)}${P(pop+.03)}{opacity:1;transform:none;filter:none}`;
      kf+=`${P(out0)}{opacity:1;transform:none}${P(Math.min(.995,out0+.04))}{opacity:0;transform:${to}}100%{opacity:0;transform:${to}}}`;
      css+=kf+`.ch.${id}{animation:${id} ${CYCLE}s linear infinite}`; b.classList.add(id);
    });
  }
  const px=e=>parseFloat(getComputedStyle(e).fontSize);
  document.querySelectorAll('[data-name]').forEach(e=>animate(e,{start:.2,stagger:.22,size:px(e)*.6,popAt:9.6}));
  const rows=[...document.querySelectorAll('.row')];
  rows.forEach((row,i)=>{ const base=.9+i*.6;
    row.querySelectorAll('small').forEach(e=>animate(e,{start:base,stagger:.05,size:px(e)*1.4,popAt:10.4+i*.5}));
    row.querySelectorAll('span').forEach(e=>animate(e,{start:base+.3,stagger:.07,size:px(e)*.8,popAt:10.6+i*.5}));
  });
  sheet.textContent=css;
})();
