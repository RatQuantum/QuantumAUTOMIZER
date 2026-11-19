// ===== EDIT THESE (Notepad is fine) =====
const UPI_ID     = "FrostRatG@upi";        // your GPay UPI ID
const YT_HANDLE  = "@FrostRatG";           // your YouTube handle
const BIG_NAME   = "RAT";
const GREEN_SCREEN = false;              // true = solid green background for chroma key (or add ?green=1 to the file address)
// ========================================
document.querySelectorAll('[data-upi]').forEach(e=>e.textContent=UPI_ID);
document.querySelectorAll('[data-yt]').forEach(e=>e.textContent=YT_HANDLE);
document.querySelectorAll('[data-name]').forEach(e=>e.textContent=BIG_NAME);
if (GREEN_SCREEN || /green=1/.test(location.search)) { document.documentElement.style.background='#00FF00'; document.body.style.background='#00FF00'; }
window.__manual=/manual=1/.test(location.search);
