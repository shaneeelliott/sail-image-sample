import { useEffect, useState, useRef } from 'react';
import SailImageV2 from './Sail/SailImageV2';

export function App() {
  const [img, setImg] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [curves, setCurves] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [centreline, setCentreline] = useState<any>(null);
  const [centrelineTwist, setCentrelineTwist] = useState(0);
  const [saved, setSaved] = useState(true);
  const [imageSRC, setImageSRC] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sailImageRef = useRef<any>(null);

  useEffect(() => {
    console.log('App component mounted');
    
    // Load sample image
    const imageUrl = '/sampleData/image.jpg';
    console.log('Setting image URL:', imageUrl);
    setImg(imageUrl);

    // Load sample data
    console.log('Fetching sample data...');
    fetch('/sampleData/data.json')
      .then(response => {
        console.log('Data response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(jsonData => {
        console.log('Sample data loaded successfully:', jsonData);
        setData(jsonData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading sample data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleNewCurveClick = () => {
    console.log('New curve clicked');
    sailImageRef.current?.newCurveClick({});
  };

  const handleNewLineClick = () => {
    console.log('New line clicked');
    sailImageRef.current?.newLineClick(false);
  };

  const handleFlipImage = () => {
    console.log('Flip image clicked');
    sailImageRef.current?.flipImage({});
  };

  // Show error state
  if (error) {
    return (
      <div style={{ 
        height: '95vh', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f5f5f5'
      }}>
        <h2 style={{ color: '#d32f2f' }}>Error Loading Application</h2>
        <p style={{ color: '#666', textAlign: 'center' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{ 
            marginTop: '20px', 
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Loading SailImage Component...</h2>
          <p>Please wait while we load the sample data.</p>
        </div>
      </div>
    );
  }

  // Show main application
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Control buttons */}
      <div style={{ padding: '10px', borderBottom: '1px solid #ccc', backgroundColor: '#f5f5f5' }}>
        <button onClick={handleNewCurveClick} style={{ margin: '0 5px', padding: '8px 16px' }}>
          New Curve
        </button>
        <button onClick={handleNewLineClick} style={{ margin: '0 5px', padding: '8px 16px' }}>
          New Line
        </button>
        <button onClick={handleFlipImage} style={{ margin: '0 5px', padding: '8px 16px' }}>
          Flip Image
        </button>
      </div>

      {/* Status display */}
      <div style={{ padding: '10px', borderBottom: '1px solid #ccc', fontSize: '12px', backgroundColor: '#f9f9f9' }}>
        <div>Curves: {curves.length}</div>
        <div>Lines: {lines.length}</div>
        <div>Centreline: {centreline ? 'Yes' : 'No'}</div>
        <div>Saved: {saved ? 'Yes' : 'No'}</div>
        <div>Image: {imageSRC || 'None'}</div>
      </div>

      {/* SailImage component */}
      <div style={{ flex: 1, position: 'relative' }}>
        <SailImageV2
          ref={sailImageRef}
          image={img}
          data={data}
        />
      </div>
    </div>
  );
}


