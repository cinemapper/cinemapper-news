@echo off
echo Building CineMapper News App for Firebase Functions + Hosting...
call npm run build -- --preset=firebase

echo Checking generated files...
dir .output\public
dir .output\server

echo Deploying to Firebase News Site...
call firebase deploy --only functions:server,hosting:cinemapper-news --project cinemapper-44cff

echo Deployment complete!
echo.
echo Your news site will be available at: https://cinemapper-news.web.app
pause 