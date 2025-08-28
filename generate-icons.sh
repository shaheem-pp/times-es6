#!/bin/bash

# PWA Icon Generator Script
# This script generates all required PWA icons from your cover.png image

echo "🎨 PWA Icon Generator for World Clocks"
echo "======================================"

# Check if cover.png exists
if [ ! -f "cover.png" ]; then
    echo "❌ Error: cover.png not found in current directory"
    echo "Please make sure you're in the project root directory"
    exit 1
fi

# Check if we have image conversion tools available
if command -v sips &> /dev/null; then
    echo "✅ Using macOS sips for image conversion"
    USE_SIPS=true
elif command -v convert &> /dev/null; then
    echo "✅ Using ImageMagick for image conversion"
    USE_SIPS=false
else
    echo "⚠️  No image conversion tool found. Please install ImageMagick or use online tools:"
    echo ""
    echo "macOS: brew install imagemagick"
    echo "Ubuntu: sudo apt-get install imagemagick"
    echo "Windows: Download from https://imagemagick.org/script/download.php#windows"
    echo ""
    echo "Or use online tools instead:"
    echo "- https://www.pwabuilder.com/imageGenerator"
    echo "- https://realfavicongenerator.net/"
    exit 1
fi

# Create icons directory if it doesn't exist
mkdir -p icons

echo "📱 Generating PWA icons..."

# Generate all required icon sizes
sizes=(72 96 128 144 152 192 384 512)

for size in "${sizes[@]}"; do
    echo "Creating ${size}x${size} icon..."
    
    if [ "$USE_SIPS" = true ]; then
        sips -z ${size} ${size} cover.png --out icons/icon-${size}x${size}.png > /dev/null 2>&1
    else
        convert cover.png -resize ${size}x${size} icons/icon-${size}x${size}.png
    fi
    
    if [ $? -eq 0 ]; then
        echo "✅ icons/icon-${size}x${size}.png created"
    else
        echo "❌ Failed to create icons/icon-${size}x${size}.png"
    fi
done

echo ""
echo "🎉 Icon generation complete!"
echo ""
echo "Generated icons:"
ls -la icons/

echo ""
echo "📋 Next steps:"
echo "1. Review the generated icons in the /icons/ directory"
echo "2. Test your PWA by serving it locally and opening in a browser"
echo "3. Try installing the PWA on different devices"
echo ""
echo "🚀 To test locally:"
echo "python -m http.server 8000"
echo "# or"
echo "npx serve"
echo ""
echo "Then visit: http://localhost:8000"
