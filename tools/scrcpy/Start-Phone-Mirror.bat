@echo off
title Phone Mirror (scrcpy) - Rat
setlocal

rem ===== Your options (edit here if you want) =====
set "OPTIONS=--audio-source=playback --audio-dup"
rem ================================================

rem ---- 1. Find scrcpy.exe anywhere it usually lives ----
set "SCRCPY="
if exist "%~dp0scrcpy.exe" set "SCRCPY=%~dp0scrcpy.exe"
if not defined SCRCPY for /f "delims=" %%F in ('where scrcpy 2^>nul') do if not defined SCRCPY set "SCRCPY=%%F"
if not defined SCRCPY for /d %%D in ("%USERPROFILE%\Downloads\scrcpy*" "%USERPROFILE%\Desktop\scrcpy*" "%USERPROFILE%\Documents\scrcpy*" "%USERPROFILE%\scrcpy*" "C:\scrcpy*" "D:\scrcpy*" "D:\Tools\scrcpy*" "C:\Program Files\scrcpy*") do (
  if not defined SCRCPY if exist "%%~D\scrcpy.exe" set "SCRCPY=%%~D\scrcpy.exe"
  if not defined SCRCPY if exist "%%~D\%%~nxD\scrcpy.exe" set "SCRCPY=%%~D\%%~nxD\scrcpy.exe"
)

if not defined SCRCPY (
  echo.
  echo  [X] Could not find scrcpy.exe on this PC.
  echo.
  echo  Fix: download scrcpy for Windows from
  echo       https://github.com/Genymobile/scrcpy/releases
  echo  unzip it, and put THIS file inside the unzipped folder
  echo  next to scrcpy.exe. Then double-click this file again.
  echo.
  pause
  exit /b 1
)

for %%A in ("%SCRCPY%") do set "SDIR=%%~dpA"
cd /d "%SDIR%"
echo  scrcpy found: %SCRCPY%
echo.

rem ---- 2. Check the phone is connected ----
set "ADB=%SDIR%adb.exe"
if not exist "%ADB%" set "ADB=adb"
"%ADB%" start-server >nul 2>&1
set "PHONE="
for /f "skip=1 tokens=1,2" %%a in ('"%ADB%" devices') do if "%%b"=="device" set "PHONE=%%a"
if not defined PHONE (
  echo  [X] No phone found. Check:
  echo      - USB cable plugged in ^(a data cable, not charge-only^)
  echo      - Developer options ^> USB debugging is ON
  echo      - Tap "Allow" on the phone's USB debugging pop-up
  echo.
  "%ADB%" devices
  pause
  exit /b 1
)
echo  Phone connected: %PHONE%
echo.

rem ---- 3. Start mirroring ----
"%SCRCPY%" %OPTIONS% %*
if errorlevel 1 (
  echo.
  echo  [!] scrcpy stopped with an error ^(see the lines above^).
  echo      --audio-dup needs Android 13 or newer. Trying again with normal audio...
  echo.
  "%SCRCPY%" --audio-source=playback %*
  if errorlevel 1 pause
)
endlocal
