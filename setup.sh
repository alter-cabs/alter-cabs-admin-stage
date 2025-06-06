#!/bin/bash

# Alter Cabs Admin Dashboard Setup Script

echo "🚗 Setting up Alter Cabs Admin Dashboard..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v14 or higher) and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "❌ Node.js version 14 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Create project directory structure
echo "📁 Creating project structure..."

# Create directories
mkdir -p public/data
mkdir -p src/components
mkdir -p src/hooks
mkdir -p src/utils

echo "✅ Directory structure created"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Tailwind CSS
echo "🎨 Setting up Tailwind CSS..."
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

echo "✅ Dependencies installed"

# Create data directory and sample CSV files
echo "📄 Creating sample CSV files..."

# Create sample users CSV
cat > public/data/UsersGrid\ view.csv << 'EOF'
User ID,Name,Email,Phone,Rating,Total Coins,Past Rides,Gender
1,John Doe,john@email.com,+1234567890,4.8,150,25,Male
2,Jane Smith,jane@email.com,+1234567891,4.9,200,35,Female
3,Bob Johnson,bob@email.com,+1234567892,4.7,100,20,Male
EOF

# Create sample drivers CSV
cat > public/data/DriversGrid\ view.csv << 'EOF'
Driver ID,Name,Phone,Online Status,Ratings,Email,Gender,Vehicle Type
1,Mike Driver,+1987654321,Online,4.7,mike@email.com,Male,Sedan
2,Sarah Wilson,+1987654322,Offline,4.8,sarah@email.com,Female,SUV
3,Tom Brown,+1987654323,Online,4.6,tom@email.com,Male,Hatchback
EOF

echo "✅ Sample CSV files created"

# Create .env file
echo "⚙️ Creating environment configuration..."
cat > .env << 'EOF'
REACT_APP_NAME=Alter Cabs Admin
REACT_APP_VERSION=1.0.0
EOF

echo "✅ Environment configuration created"

# Git initialization
if [ ! -d ".git" ]; then
    echo "🔧 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Alter Cabs Admin Dashboard setup"
    echo "✅ Git repository initialized"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm start"
echo ""
echo "To build for production:"
echo "  npm run build"
echo ""
echo "📚 Documentation: Check README.md for more details"
echo "🐛 Issues: Create an issue on GitHub"
echo ""
echo "Happy coding! 🚗💨"