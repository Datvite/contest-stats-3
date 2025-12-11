#!/bin/bash
# Quick setup script for development

echo "🚀 PREHSG Contest Hub - Quick Setup"
echo "===================================="
echo ""

# Backend setup
echo "📦 Setting up Backend..."
cd backend
python -m venv venv

if [ "$OSTYPE" = "msys" ] || [ "$OSTYPE" = "win32" ]; then
    . venv/Scripts/activate
else
    . venv/bin/activate
fi

pip install -r requirements.txt
python init_db.py

echo "✅ Backend setup complete!"
echo ""

# Frontend setup
echo "📦 Setting up Frontend..."
cd ../frontend
npm install
echo "✅ Frontend setup complete!"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "To start development:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  python -m venv venv"
echo "  # Windows: venv\Scripts\activate"
echo "  # Linux/Mac: source venv/bin/activate"
echo "  python -m uvicorn main:app --reload"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
