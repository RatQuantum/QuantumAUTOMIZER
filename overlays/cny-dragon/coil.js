// Coiled dragon: the body slithers around the ring while the head/top stay steady.
(function(){
  const box=document.querySelector('.coil .body'); if(!box) return;
  const img=box.querySelector('img'); const cv=document.createElement('canvas'); box.appendChild(cv);
  const go=()=>{
    const S=Math.min(2,window.devicePixelRatio||1), W=Math.round(box.clientWidth*S), H=Math.round(box.clientHeight*S);
    cv.width=W; cv.height=H; cv.style.cssText='position:absolute;inset:0;width:100%;height:100%';
    const t0=document.createElement('canvas'); t0.width=W; t0.height=H; const c0=t0.getContext('2d'); c0.drawImage(img,0,0,W,H);
    const src=c0.getImageData(0,0,W,H).data, ctx=cv.getContext('2d'), out=ctx.createImageData(W,H), o=out.data;
    const cx=W*0.50, cy=H*0.64, R=Math.min(W,H)*0.5;
    img.style.visibility='hidden'; box.querySelector('.shine')?.remove();
    // precompute polar coords + damping (top 28% and the head on the upper right stay still)
    const N=W*H, rad=new Float32Array(N), ang=new Float32Array(N), damp=new Float32Array(N);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,dx=x-cx,dy=y-cy;rad[i]=Math.hypot(dx,dy);ang[i]=Math.atan2(dy,dx);
      const v=y/H,u=x/W; let d=Math.min(1,Math.max(0,(v-0.28)/0.22)); if(u>0.52&&v<0.55)d*=Math.max(0,(v-0.40)/0.15); damp[i]=Math.max(0,d);}
    function frame(ms){
      const t=ms/1000;
      for(let i=0;i<N;i++){
        const r=rad[i], a=ang[i], d=damp[i];
        const a2=a+d*0.14*Math.sin(3*a-t*2.4), r2=r*(1+d*0.04*Math.sin(2*a+t*1.7));
        const sx=(cx+r2*Math.cos(a2))|0, sy=(cy+r2*Math.sin(a2))|0, j=i*4;
        if(sx<0||sy<0||sx>=W||sy>=H){o[j+3]=0;continue}
        const k=(sy*W+sx)*4; o[j]=src[k];o[j+1]=src[k+1];o[j+2]=src[k+2];o[j+3]=src[k+3];
      }
      ctx.putImageData(out,0,0);
      // gold shine travelling around the coil
      const g=ctx.createLinearGradient(0,0,W,H), p=(t*0.18)%1.6-0.3;
      g.addColorStop(Math.max(0,Math.min(1,p-0.08)),'rgba(255,246,214,0)');g.addColorStop(Math.max(0,Math.min(1,p)),'rgba(255,246,214,.5)');g.addColorStop(Math.max(0,Math.min(1,p+0.08)),'rgba(255,246,214,0)');
      ctx.globalCompositeOperation='source-atop';ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='source-over';
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };
  img.complete?go():img.onload=go;
})();
