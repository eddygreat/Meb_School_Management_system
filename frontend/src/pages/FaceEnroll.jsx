import React, { useState, useRef, useEffect } from 'react';
import apiClient from '../components/api';

export default function FaceEnroll() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    console.log(msg);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    addLog("FaceEnroll mounted. Starting camera...");
    startCamera();
    return () => {
      addLog("FaceEnroll unmounting. Stopping camera...");
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
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
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

  const capturePhoto = () => {
    addLog("Capturing photo...");
    if (!videoRef.current || !canvasRef.current) {
      addLog("Refs missing!");
      return;
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      addLog("Video dimensions are 0. Video might not be ready.");
      setError("Camera not ready yet. Please wait a moment.");
      return;
    }

    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    addLog(`Drawing image: ${canvas.width}x${canvas.height}`);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) {
        addLog("Canvas toBlob failed");
        setError("Failed to capture image.");
        return;
      }
      addLog(`Image captured, size: ${blob.size}`);
      setCapturedImage(blob);
      stopCamera();
    }, 'image/jpeg', 0.9);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setStatus('');
    setError('');
    startCamera();
  };

  const submit = async () => {
    if (!capturedImage) return;
    setStatus('');
    setError('');
    setIsLoading(true);

    try {
      const form = new FormData();
      form.append('image', capturedImage, 'enrollment.jpg');

      addLog("Submitting enrollment...");
      const { data } = await apiClient.post('/biometric/enroll', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      addLog("Enrollment success");

      setStatus(`Successfully enrolled! User ID: ${data.user_id}`);
      setCapturedImage(null);
    } catch (e) {
      console.error("Enrollment error:", e);
      const errorMsg = e?.response?.data?.detail || 'Enrollment failed. Please try again.';
      setError(errorMsg);
      addLog(`Enrollment error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Face Enrollment</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        {status && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded">{status}</div>}
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>}

        <div className="relative bg-black rounded-lg overflow-hidden mb-4 aspect-video">
          {!capturedImage ? (
            isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white p-4 text-center">
                <p className="mb-4">Camera inactive</p>
                <button
                  onClick={startCamera}
                  className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                >
                  Start Camera Manually
                </button>
              </div>
            )
          ) : (
            <img src={URL.createObjectURL(capturedImage)} alt="Captured" className="w-full h-full object-cover" />
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex gap-4 justify-center mb-6">
          {!capturedImage ? (
            <button
              onClick={capturePhoto}
              disabled={!isCameraActive}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              Capture Photo
            </button>
          ) : (
            <>
              <button
                onClick={retakePhoto}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Retake
              </button>
              <button
                onClick={submit}
                disabled={isLoading}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-green-400"
              >
                {isLoading ? 'Uploading...' : 'Save Enrollment'}
              </button>
            </>
          )}
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
