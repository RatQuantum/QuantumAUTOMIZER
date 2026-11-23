# One-shot laptop setup for QuantumAUTOMIZER reels (Windows, everything on D:).
# Run in PowerShell:  irm https://raw.githubusercontent.com/RatQuantum/QuantumAUTOMIZER/claude/quirky-euler-qhw92g/tools/laptop-setup.ps1 | iex
$ErrorActionPreference = "Continue"
$Root = "D:\QuantumReels"
$Tools = "D:\Tools"
function Step($m) { Write-Host "`n=== $m" -ForegroundColor Yellow }
function Refresh-Path { $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User") }

Step "Folders on D:"
foreach ($d in "$Root", "$Root\models\kokoro", "$Root\refs", "$Root\.cache\temp", "$Root\.cache\npm", "$Root\.cache\hf", "$Root\.cache\blender", $Tools) { New-Item -ItemType Directory -Force -Path $d | Out-Null }

Step "Caches and temp files go to D:"
setx TEMP "$Root\.cache\temp" | Out-Null; setx TMP "$Root\.cache\temp" | Out-Null
setx HF_HOME "$Root\.cache\hf" | Out-Null; setx KOKORO_DIR "$Root\models\kokoro" | Out-Null
$env:TEMP = "$Root\.cache\temp"; $env:TMP = $env:TEMP; $env:HF_HOME = "$Root\.cache\hf"; $env:KOKORO_DIR = "$Root\models\kokoro"

Step "Installing Git, Node.js, Python 3.12, FFmpeg, uv, Blender (winget)"
$apps = @(
  @("Git.Git", "$Tools\Git"), @("OpenJS.NodeJS.LTS", "$Tools\nodejs"), @("Python.Python.3.12", "$Tools\Python312"),
  @("Gyan.FFmpeg", "$Tools\ffmpeg"), @("astral-sh.uv", ""), @("BlenderFoundation.Blender", "$Tools\Blender")
)
foreach ($a in $apps) {
  $wa = @("install", "--id", $a[0], "-e", "--accept-package-agreements", "--accept-source-agreements", "--silent")
  if ($a[1]) { $wa += @("--location", $a[1]) }
  winget @wa
}
Refresh-Path

Step "npm cache on D:"
npm config set cache "$Root\.cache\npm"

Step "Getting the project"
Set-Location $Root
if (Test-Path "$Root\QuantumAUTOMIZER\.git") { git -C "$Root\QuantumAUTOMIZER" pull } else { git clone -b claude/quirky-euler-qhw92g https://github.com/RatQuantum/QuantumAUTOMIZER.git }

Step "Python voice tools (free Kokoro + faster-whisper)"
if (-not (Test-Path "$Root\venv")) { py -3.12 -m venv "$Root\venv" }
& "$Root\venv\Scripts\python.exe" -m pip install --upgrade pip
& "$Root\venv\Scripts\pip.exe" install kokoro-onnx soundfile faster-whisper librosa numpy
$K = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0"
foreach ($f in "kokoro-v1.0.onnx", "voices-v1.0.bin") { if (-not (Test-Path "$Root\models\kokoro\$f")) { curl.exe -L -o "$Root\models\kokoro\$f" "$K/$f" } }

Step "Blender MCP addon"
$addon = "$Root\.cache\blender_mcp_addon.py"
curl.exe -L -o $addon "https://raw.githubusercontent.com/ahujasid/blender-mcp/main/addon.py"
$blender = Get-ChildItem -Path "$Tools\Blender", "C:\Program Files\Blender Foundation" -Filter blender.exe -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
if ($blender) {
  $py = "import bpy; bpy.ops.preferences.addon_install(filepath=r'$addon', overwrite=True); import addon_utils; [addon_utils.enable(m.__name__, default_set=True) for m in addon_utils.modules() if 'mcp' in m.__name__.lower()]; bpy.context.preferences.filepaths.temporary_directory=r'$Root\.cache\blender'; bpy.ops.wm.save_userpref()"
  & $blender.FullName --background --python-expr $py
  Write-Host "Blender addon installed: $($blender.FullName)"
} else { Write-Host "Blender not found. Install it, then: Edit > Preferences > Add-ons > Install from Disk > $addon" -ForegroundColor Red }

Step "Claude Code + Blender connection"
npm install -g @anthropic-ai/claude-code
Refresh-Path
Set-Location "$Root\QuantumAUTOMIZER"
claude mcp add blender -- uvx blender-mcp

Step "DONE"
Write-Host @"
Next:
 1. Open Blender, press N in the 3D view, BlenderMCP tab, click Connect.
 2. Copy your reference videos and the song into $Root\refs (never committed).
 3. In this window run:  claude
    then type:  Read HANDOFF-LAPTOP.md and continue: build Days 91-95 with Blender.
"@ -ForegroundColor Green
