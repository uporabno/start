@echo off
chcp 65001 > nul
echo Gradim plugins.js...

(
  echo // AUTO-GENERIRANO - ne urejati rocno^^!
  echo // Pozeni _plugins_\_build.cmd za obnovo
  echo.
  echo var pluginList = [
) > ..\plugins.js

for /f "delims=" %%f in ('dir /b /on *.js 2^>nul') do (
  type "%%f" >> ..\plugins.js
  echo , >> ..\plugins.js
)

echo ]; >> ..\plugins.js

echo.
echo Konec. plugins.js je posodobljen.
echo Done. Press Ctrl+C to exit.

pause
