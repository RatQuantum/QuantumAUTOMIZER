// Makes the dragon body ripple like it is swimming through the air.
// The tail end (left) waves most; the head (right) stays almost still.
(function(){
  const holder=document.querySelector('.dragon'); const img=holder.querySelector('img');
  const cv=document.createElement('canvas'); holder.appendChild(cv); img.style.visibility='hidden';
  const ctx=cv.getContext('2d'); const rat=document.querySelector('.rat'); const SL=3;            // slice width in source pixels
  function start(){
    const W=img.naturalWidth, H=img.naturalHeight, pad=Math.round(H*0.08);
    cv.width=W; cv.height=H+pad*2; cv.style.cssText=`position:absolute;left:0;top:${-pad/H*100}%;width:100%;height:${(H+pad*2)/H*100}%`;
    const amp=H*0.045, wave=W*0.55, speed=1.6;
    (function frame(t){
      t/=1000; ctx.clearRect(0,0,cv.width,cv.height);
      for(let x=0;x<W;x+=SL){
        const u=x/W, w=u<0.6?1:Math.max(0.08,1-(u-0.6)/0.4);   // head damping
        const y=pad+Math.sin(2*Math.PI*x/wave - t*speed)*amp*w;
        ctx.drawImage(img,x,0,SL,H,x,y,SL+0.6,H);
      }
      // keep the Rat standing on the moving back (feet at ~28% of the width)
      if(rat){const fx=W*0.30, off=Math.sin(2*Math.PI*fx/wave - t*speed)*amp; rat.style.transform=`translateY(${off*holder.clientWidth/W}px)`;}
      // moving gold shine, only on the dragon itself
      const sx=((t*0.22)%1.6-0.3)*W, g=ctx.createLinearGradient(sx-W*0.08,0,sx+W*0.08,cv.height);
      g.addColorStop(0,'rgba(255,240,190,0)');g.addColorStop(.5,'rgba(255,240,190,.55)');g.addColorStop(1,'rgba(255,240,190,0)');
      ctx.globalCompositeOperation='source-atop';ctx.fillStyle=g;ctx.fillRect(0,0,cv.width,cv.height);ctx.globalCompositeOperation='source-over';
      requestAnimationFrame(frame);
    })(performance.now());
  }
  img.complete?start():img.onload=start;
})();
