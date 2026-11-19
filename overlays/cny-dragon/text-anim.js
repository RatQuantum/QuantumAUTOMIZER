// Text motion: RAT letters pop out, rows slide in, the handle waves; everything re-pops every 9 s.
(function(){
  const split=el=>{const s=el.textContent;el.textContent='';[...s].forEach((c,i)=>{const b=document.createElement('b');b.textContent=c===' '?' ':c;b.style.setProperty('--i',i);el.appendChild(b)});};
  document.querySelectorAll('[data-name]').forEach(split);
  document.querySelectorAll('[data-yt]').forEach(e=>{e.classList.add('wave');split(e)});
  const body=document.body; body.classList.add('intro');
  setTimeout(()=>body.classList.remove('intro'),2600);
  setInterval(()=>{body.classList.remove('repop');void body.offsetWidth;body.classList.add('repop')},9000);
})();
