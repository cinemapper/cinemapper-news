@echo off
echo Firebase App Hosting Deployment Guide
echo =======================================
echo.
echo Firebase App Hosting deploys automatically from GitHub!
echo.
echo To deploy:
echo 1. Commit your changes: git add . && git commit -m "Update"
echo 2. Push to GitHub: git push
echo 3. Firebase will auto-deploy from your main branch
echo.
echo Manual build test (optional):
call npm run build

echo.
echo Your news site will be available at your App Hosting URL
echo Check Firebase Console > App Hosting for deployment status
pause 