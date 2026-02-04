@echo off
echo Starting GitHub deployment...

:: Check for Git
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Git is not found. Please restart Trae or install Git.
    pause
    exit /b
)

:: Configure Git Identity (Required for first run)
echo Configuring Git identity...
git config user.email "ubeeps@gmail.com"
git config user.name "Ubeeps Admin"

:: Initialize if needed
if not exist .git (
    echo Initializing new Git repository...
    git init
)

:: Add all files
echo Adding files to staging...
git add .

:: Commit
echo Committing files...
git commit -m "Initial commit for Ubeeps project"

:: Rename branch
git branch -M main

:: Setup remote
echo Setting up remote origin...
git remote remove origin 2>nul
git remote add origin https://github.com/ubeeps-spec/ubeeps.git

:: Push
echo Pushing code to GitHub...
echo.
echo NOTE: If a popup appears, please sign in with your GitHub account.
echo.
git push -u origin main

echo.
echo ==========================================
echo Deployment process finished.
echo If you saw errors above, please copy them to the chat.
echo ==========================================
pause
