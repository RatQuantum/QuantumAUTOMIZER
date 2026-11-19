// ===== EDIT THESE (Notepad is fine) =====
const UPI_ID     = "yourname@okhdfcbank";  // your GPay UPI ID
const YT_HANDLE  = "@FrostRatG";           // your YouTube handle
const BIG_NAME   = "RAT";
// ========================================
document.querySelectorAll('[data-upi]').forEach(e=>e.textContent=UPI_ID);
document.querySelectorAll('[data-yt]').forEach(e=>e.textContent=YT_HANDLE);
document.querySelectorAll('[data-name]').forEach(e=>e.textContent=BIG_NAME);
