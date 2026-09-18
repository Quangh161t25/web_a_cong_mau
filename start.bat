@echo off
cd /d "%~dp0"
title 5F ERP Template Server
cls
echo ==================================================================
echo         HE THONG QUAN LY 5F ERP TEMPLATE
echo ==================================================================
echo.
echo  * Dang khoi dong may chu va mo trinh duyet web...
echo  * Tai khoan dang nhap: admin@5fedu.com
echo  * Mat khau:           123456
echo.
echo ==================================================================
echo.
start http://localhost:3000/dang-nhap
node serve.js
pause
