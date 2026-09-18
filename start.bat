@echo off
cd /d "%~dp0"
title 5F ERP Template Server
cls
echo ==================================================================
echo         HE THONG QUAN LY 5F ERP TEMPLATE
echo ==================================================================
echo.
echo  * Dang khoi dong may chu noi bo va mo trinh duyet web...
echo  * Tai khoan dang nhap: admin@5fedu.com
echo  * Mat khau:           123456
echo.
echo ==================================================================
echo.
node serve.js
pause
