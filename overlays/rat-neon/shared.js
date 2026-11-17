// ===== EDIT THESE =====
const UPI_ID   = "yourname@okhdfcbank";   // <- your GPay UPI ID
const PAY_NAME = "Rat";                   // name shown in the payer's app
const SHOW_GUIDES = false;                // true = show box labels while you line up sources
// ======================
function renderPay(upi){
  document.querySelectorAll('[data-upi]').forEach(e=>e.textContent = upi || 'SET UPI_ID IN shared.js');
  document.querySelectorAll('[data-qr]').forEach(el=>{
    const size = +el.dataset.qr; el.innerHTML='';
    if (!upi){ el.style.width=el.style.height=(size+16)+'px'; return; }
    const q = qrcode(0,'M');
    q.addData(`upi://pay?pa=${upi.trim()}&pn=${encodeURIComponent(PAY_NAME)}&cu=INR`); q.make();
    const n = q.getModuleCount()+8, cell = Math.max(1, Math.floor(size/n));
    el.innerHTML = q.createSvgTag(cell, cell*4);   // 4-module white quiet zone so phones scan it
    const svg = el.querySelector('svg'); svg.setAttribute('width',size); svg.setAttribute('height',size);
  });
}
if (SHOW_GUIDES || /guides=1/.test(location.search)) document.body.classList.add('guides');
renderPay(UPI_ID && !UPI_ID.startsWith('yourname@') ? UPI_ID : '');
