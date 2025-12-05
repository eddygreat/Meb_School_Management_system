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
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    console.log(msg);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  // Start the camera when component mounts
  useEffect(() => {
    addLog("FaceLogin mounted. Starting camera...");
    startCamera();
    return () => {
      addLog("FaceLogin unmounting. Stopping camera...");
      stopCamera();
    };
  }, []);

  // New effect to attach stream to video element when it becomes available
  useEffect(() => {
    if (isCameraActive && stream && videoRef.current) {
      addLog("Attaching stream to video element");
      videoRef.current.srcObject = stream;
      videoRef.current.play()
        .then(() => addLog("Video playing successfully"))
        .catch(e => {
          console.error("Error playing video:", e);
          addLog(`Error playing video: ${e.message}`);
        });
    }
  }, [isCameraActive, stream]);

  const startCamera = async () => {
    try {
      setError('');
      addLog("Requesting camera access...");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });
      addLog(`Camera access granted. Stream ID: ${mediaStream.id}`);

      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      const errorMsg = `Could not access camera: ${err.message}. Name: ${err.name}`;
      setError(errorMsg);
      addLog(errorMsg);
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
    addLog("Capturing photo for login...");
    if (!videoRef.current || !canvasRef.current) {
      addLog("Refs missing!");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      addLog("Video dimensions are 0. Video might not be ready.");
      setError("Camera not ready yet. Please wait a moment.");
      return;
    }

    // Set canvas dimensions to match video stream
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    addLog(`Drawing image: ${canvas.width}x${canvas.height}`);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob and send to server
    canvas.toBlob(async (blob) => {
      if (!blob) {
        addLog("Canvas toBlob failed");
        setError('Failed to capture image');
        return;
      }

      addLog(`Image captured, size: ${blob.size}`);
      const formData = new FormData();
      formData.append('image', blob, 'face-login.jpg');

      try {
        setIsLoading(true);
        setError('');
        addLog("Sending image to server...");

        const { data } = await client.post('/biometric/login', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        addLog("Server response received");

        if (data?.access_token) {
          addLog("Login successful! Redirecting...");
          const success = loginWithToken(data.access_token);
          if (success) {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            navigate(`/${currentUser?.role || 'student'}/dashboard`);
          } else {
            setError('Login failed. Please try again.');
            addLog("Login failed: loginWithToken returned false");
          }
        }
      } catch (err) {
        console.error('Face login error:', err);
        const errorMsg = err.response?.data?.detail || 'Face recognition failed. Please try again.';
        setError(errorMsg);
        addLog(`Face login error: ${errorMsg}`);
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
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200">
              <p className="text-gray-500 mb-4">Camera not available</p>
              <button
                onClick={startCamera}
                className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
              >
                Start Camera Manually
              </button>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={captureAndLogin}
            disabled={!isCameraActive || isLoading}
            className={`w-full py-3 px-4 rounded-md font-medium text-white ${isCameraActive && !isLoading
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

        {/* Debug Logs Section */}
        <div className="mt-4 p-4 bg-gray-100 rounded text-xs font-mono h-32 overflow-y-auto border border-gray-300">
          <h3 className="font-bold mb-2">Debug Logs:</h3>
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
