@echo off
REM Setup script for RoamMentor AI Backend (Windows)

echo 🚀 Setting up RoamMentor AI Backend...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is required but not installed.
    pause
    exit /b 1
)

echo ✅ Python found

REM Create virtual environment
echo 📦 Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo ⬆️ Upgrading pip...
python -m pip install --upgrade pip

REM Install requirements
echo 📚 Installing dependencies...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📄 Creating .env file from template...
    copy .env.example .env
    echo ⚠️ Please edit .env file with your actual API keys
)

REM Test knowledge processor
echo 🧠 Testing knowledge processor...
python knowledge_processor.py

echo ✅ Setup complete!
echo.
echo 📋 Next steps:
echo 1. Edit .env file with your API keys
echo 2. Run: python main.py
echo 3. Open http://localhost:8000 in your browser
echo.
echo 🔗 API Documentation: http://localhost:8000/docs

pause
