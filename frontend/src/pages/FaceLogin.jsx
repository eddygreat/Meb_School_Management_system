import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function FaceLogin() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  // Start the camera when component mounts
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user' 
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  const captureAndLogin = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video stream
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob and send to server
    canvas.toBlob(async (blob) => {
      if (!blob) {
        setError('Failed to capture image');
        return;
      }

      const formData = new FormData();
      formData.append('image', blob, 'face-login.jpg');

      try {
        setIsLoading(true);
        setError('');
        
        const { data } = await client.post('/api/biometric/login', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (data?.access_token) {
          const success = loginWithToken(data.access_token);
          if (success) {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            navigate(`/${currentUser?.role || 'student'}/dashboard`);
          } else {
            setError('Login failed. Please try again.');
          }
        }
      } catch (err) {
        console.error('Face login error:', err);
        setError(err.response?.data?.detail || 'Face recognition failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">Face Recognition Login</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ paddingBottom: '56.25%' }}>
          {isCameraActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-4 border-white rounded-full w-48 h-48 md:w-64 md:h-64 opacity-50 pointer-events-none"></div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <p className="text-gray-500">Camera not available</p>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={captureAndLogin}
            disabled={!isCameraActive || isLoading}
            className={`w-full py-3 px-4 rounded-md font-medium text-white ${
              isCameraActive && !isLoading
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            } transition-colors`}
          >
            {isLoading ? 'Verifying...' : 'Sign In with Face'}
          </button>
          
          <button
            type="button"
            onClick={isCameraActive ? stopCamera : startCamera}
            className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-md font-medium text-gray-800 transition-colors"
          >
            {isCameraActive ? 'Turn Off Camera' : 'Turn On Camera'}
          </button>
          
          <div className="text-center mt-4">
            <a 
              href="/login" 
              className="text-blue-600 hover:underline text-sm"
            >
              Or sign in with email and password
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
