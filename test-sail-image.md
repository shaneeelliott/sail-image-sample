# Testing SailImage Component

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd sail-image-sample
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Expected Behavior

The application should display:

1. **Control Buttons** at the top:
   - New Curve
   - New Line  
   - Flip Image

2. **Status Display** showing:
   - Number of curves
   - Number of lines
   - Centreline status
   - Saved status
   - Current image source

3. **SailImage Component** displaying the sample image with:
   - Interactive canvas for drawing curves and lines
   - Zoom and pan functionality
   - Curve editing capabilities

## Sample Data

The application loads:
- **Image**: `/sampleData/image.jpg` - A sail image for testing
- **Data**: `/sampleData/data.json` - Pre-existing curves, lines, and sail data

## Testing Features

1. **Load Sample Data**: The component should automatically load the sample image and data
2. **View Curves**: Existing curves should be visible on the image
3. **View Lines**: Existing lines should be visible on the image
4. **View Centreline**: The centreline should be displayed if present
5. **Interactive Controls**: Click the buttons to test different functions
6. **Console Logs**: Check browser console for detailed state change logs

## Troubleshooting

If the component doesn't load:

1. Check browser console for errors
2. Verify all dependencies are installed
3. Ensure the sample data files exist in `/public/sampleData/`
4. Check that the import path is correct for your project structure

## Expected Console Output

You should see console logs for:
- Image loaded
- Data loaded
- State changes
- Curve changes
- Line changes
- Centreline changes
- And other state updates
