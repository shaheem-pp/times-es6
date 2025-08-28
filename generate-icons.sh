#!/bin/bash

# PWA Icon Generator Script
# This script generates all required PWA icons from your cover.png image

echo "🎨 PWA Icon Generator for World Clocks"
echo "======================================"

# Check if app-icon.svg exists
if [ ! -f "app-icon.svg" ]; then
    echo "❌ Error: app-icon.svg not found in current directory"
    echo "Please make sure you're in the project root directory"
    exit 1
fi

# Check if we have image conversion tools available
if command -v qlmanage &> /dev/null && command -v sips &> /dev/null; then
    echo "✅ Using macOS tools (qlmanage + sips) for SVG conversion"
    USE_MACOS=true
elif command -v sips &> /dev/null; then
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

# First convert SVG to high-res PNG if using macOS tools
if [ "$USE_MACOS" = true ]; then
    echo "Converting SVG to base PNG..."
    qlmanage -t -s 1024 -o . app-icon.svg > /dev/null 2>&1
    mv app-icon.svg.png app-icon-base.png 2>/dev/null || echo "Base PNG already exists"
fi

# Generate all required icon sizes
sizes=(72 96 128 144 152 192 384 512)

for size in "${sizes[@]}"; do
    echo "Creating ${size}x${size} icon..."
    
    if [ "$USE_MACOS" = true ]; then
        sips -z ${size} ${size} app-icon-base.png --out icons/icon-${size}x${size}.png > /dev/null 2>&1
    elif [ "$USE_SIPS" = true ]; then
        sips -z ${size} ${size} app-icon.svg --out icons/icon-${size}x${size}.png > /dev/null 2>&1
    else
        convert app-icon.svg -resize ${size}x${size} icons/icon-${size}x${size}.png
    fi
    
    if [ $? -eq 0 ]; then
        echo "✅ icons/icon-${size}x${size}.png created"
    else
        echo "❌ Failed to create icons/icon-${size}x${size}.png"
    fi
done

echo ""
echo "🌐 Generating favicon files..."

# Generate favicon files
if [ "$USE_MACOS" = true ]; then
    sips -z 180 180 app-icon-base.png --out apple-touch-icon.png > /dev/null 2>&1 && echo "✅ apple-touch-icon.png created"
    sips -z 32 32 app-icon-base.png --out favicon-32x32.png > /dev/null 2>&1 && echo "✅ favicon-32x32.png created"
    sips -z 16 16 app-icon-base.png --out favicon-16x16.png > /dev/null 2>&1 && echo "✅ favicon-16x16.png created"
    sips -z 16 16 app-icon-base.png --out favicon.ico > /dev/null 2>&1 && echo "✅ favicon.ico created"
elif [ "$USE_SIPS" = true ]; then
    sips -z 180 180 app-icon.svg --out apple-touch-icon.png > /dev/null 2>&1 && echo "✅ apple-touch-icon.png created"
    sips -z 32 32 app-icon.svg --out favicon-32x32.png > /dev/null 2>&1 && echo "✅ favicon-32x32.png created"
    sips -z 16 16 app-icon.svg --out favicon-16x16.png > /dev/null 2>&1 && echo "✅ favicon-16x16.png created"
    sips -z 16 16 app-icon.svg --out favicon.ico > /dev/null 2>&1 && echo "✅ favicon.ico created"
else
    convert app-icon.svg -resize 180x180 apple-touch-icon.png && echo "✅ apple-touch-icon.png created"
    convert app-icon.svg -resize 32x32 favicon-32x32.png && echo "✅ favicon-32x32.png created"
    convert app-icon.svg -resize 16x16 favicon-16x16.png && echo "✅ favicon-16x16.png created"
    convert app-icon.svg -resize 16x16 favicon.ico && echo "✅ favicon.ico created"
fi

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
