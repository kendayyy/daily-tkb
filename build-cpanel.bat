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

echo Dang build static cho cPanel...
call npm run build
if errorlevel 1 (
  echo Build that bai.
  pause
  exit /b 1
)

if not exist "out\index.html" (
  echo Khong thay out\index.html. Build chua ra file tinh.
  pause
  exit /b 1
)

if exist "cpanel" rmdir /s /q "cpanel"
mkdir "cpanel"
robocopy "out" "cpanel" /E /NFL /NDL /NJH /NJS /nc /ns /np
copy /Y "public\.htaccess" "cpanel\.htaccess" >nul

if exist "cpanel-upload.zip" del /f /q "cpanel-upload.zip"
tar -C cpanel -acf cpanel-upload.zip .

echo.
echo Xong.
echo  - Thu muc: cpanel\
echo  - File zip: cpanel-upload.zip
echo.
echo cPanel File Manager: upload cpanel-upload.zip vao public_html roi Extract.
echo Bat Show Hidden Files de kiem tra .htaccess.
echo.
explorer "%~dp0"
pause
