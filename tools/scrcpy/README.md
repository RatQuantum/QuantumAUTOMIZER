# Start-Phone-Mirror.bat

Double-click to mirror your Android phone with its sound (`--audio-source=playback --audio-dup`).

- Finds `scrcpy.exe` by itself: next to this file, on PATH, or in a `scrcpy*` folder in Downloads, Desktop, Documents, your user folder, `C:\`, `D:\` or Program Files.
- Checks the phone is connected over USB and tells you what to fix if not.
- If `--audio-dup` fails (it needs Android 13+), it retries with normal phone audio.

Best place for it: inside your unzipped scrcpy folder, then right-click → Send to → Desktop (create shortcut).
Change the options on the `set "OPTIONS=..."` line.
