@echo off
setlocal
cd /d "%~dp0"

where npm >nul 2>&1
if errorlevel 1 (
  echo Chua cai Node.js / npm. Tai tai https://nodejs.org
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Dang cai dat dependencies...
  call npm install
  if errorlevel 1 (
    echo Cai dat that bai.
    pause
    exit /b 1
  )
)

echo Dang khoi dong http://localhost:3000 ...
echo Mo trinh duyet khi server san sang. Dong cua so nay de tat server.
start "" /b powershell -NoProfile -WindowStyle Hidden -Command "for ($i=0; $i -lt 90; $i++) { try { Invoke-WebRequest -UseBasicParsing http://localhost:3000 -TimeoutSec 1 | Out-Null; Start-Process 'http://localhost:3000'; break } catch { Start-Sleep -Seconds 1 } }"
call npm run dev
pause
