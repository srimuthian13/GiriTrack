import { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle, SwitchCamera, Upload, Image as ImageIcon } from 'lucide-react';

export default function CameraCaptureModal({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Camera state: 'environment' (belakang) atau 'user' (depan)
  const [facingMode, setFacingMode] = useState('environment');

  const [retryCount, setRetryCount] = useState(0);

  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Membuka stream kamera saat modal dibuka atau mode kamera berganti
  useEffect(() => {
    if (!isOpen || capturedImage) {
      stopCameraStream();
      return;
    }

    let isCancelled = false;

    const setupCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (!isCancelled) {
          setErrorMsg('Browser Anda belum mengizinkan atau tidak mendukung akses kamera langsung.');
        }
        return;
      }

      try {
        const constraints = {
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (isCancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.warn('Gagal dengan constraint facingMode, mencoba kamera default...', err);
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          if (isCancelled) {
            fallbackStream.getTracks().forEach((track) => track.stop());
            return;
          }

          streamRef.current = fallbackStream;
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            videoRef.current.play().catch(() => {});
          }
        } catch (fallbackErr) {
          console.error('Kamera tidak dapat diakses:', fallbackErr);
          if (!isCancelled) {
            setErrorMsg('Tidak dapat mengakses kamera. Pastikan izin kamera telah diaktifkan pada browser.');
          }
        }
      }
    };

    setupCamera();

    return () => {
      isCancelled = true;
      stopCameraStream();
    };
  }, [isOpen, facingMode, capturedImage, retryCount, stopCameraStream]);

  const handleSwitchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    
    // Scale to max 1080px for high quality yet fast storage
    const maxDim = 1080;
    let w = video.videoWidth || 640;
    let h = video.videoHeight || 480;

    if (w > h && w > maxDim) {
      h = Math.round((h * maxDim) / w);
      w = maxDim;
    } else if (h > maxDim) {
      w = Math.round((w * maxDim) / h);
      h = maxDim;
    }

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    // Jika kamera depan, balik secara horizontal agar seperti cermin
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, w, h);

    const base64 = canvas.toDataURL('image/jpeg', 0.82);
    setCapturedImage(base64);
    stopCameraStream();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setErrorMsg('Ukuran foto maksimal 8 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target.result);
        stopCameraStream();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setErrorMsg('');
  };

  const handleRetry = () => {
    setErrorMsg('');
    setRetryCount((prev) => prev + 1);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      handleClose();
    }
  };

  const handleClose = () => {
    stopCameraStream();
    setCapturedImage(null);
    setErrorMsg('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#1C2129] border border-[#2C3440] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2C3440] bg-[#252C36]/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#DA7F8F]/20 text-[#DA7F8F]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Ambil Foto Langsung</h3>
              <p className="text-[11px] text-[#A7BBC7]">Jepret foto langsung dari kamera atau unggah file</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-white/10 text-[#A7BBC7] hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Body */}
        <div className="relative aspect-video sm:aspect-4/3 w-full bg-black flex items-center justify-center overflow-hidden">
          {errorMsg ? (
            <div className="p-6 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
              <p className="text-sm font-semibold text-rose-300">{errorMsg}</p>
              
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="px-4 py-2 rounded-xl bg-[#DA7F8F] text-white text-xs font-bold hover:bg-[#c96c7d] transition cursor-pointer"
                >
                  Coba Lagi
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-[#252C36] border border-[#2C3440] text-white text-xs font-bold hover:bg-white/10 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pilih dari Galeri</span>
                </button>
              </div>
            </div>
          ) : capturedImage ? (
            <img 
              src={capturedImage} 
              alt="Hasil Jepretan" 
              className="w-full h-full object-contain"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
              />
              
              {/* Viewfinder Grid Overlay */}
              <div className="absolute inset-0 pointer-events-none border border-white/20 grid grid-cols-3 grid-rows-3 opacity-30">
                <div className="border-r border-b border-white/20"></div>
                <div className="border-r border-b border-white/20"></div>
                <div className="border-b border-white/20"></div>
                <div className="border-r border-b border-white/20"></div>
                <div className="border-r border-b border-white/20"></div>
                <div className="border-b border-white/20"></div>
                <div className="border-r border-b border-white/20"></div>
                <div className="border-r border-b border-white/20"></div>
                <div></div>
              </div>

              {/* Tombol Balik Kamera (Depan / Belakang) */}
              <button
                type="button"
                onClick={handleSwitchCamera}
                className="absolute top-3 right-3 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition cursor-pointer active:scale-95 shadow-lg flex items-center gap-1.5 text-xs font-semibold"
                title="Balik Kamera (Depan/Belakang)"
              >
                <SwitchCamera className="w-4 h-4" />
                <span className="hidden sm:inline">{facingMode === 'environment' ? 'Kamera Depan' : 'Kamera Belakang'}</span>
              </button>
            </>
          )}
        </div>

        {/* Hidden File Input for Gallery / Upload Fallback */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="image/*" 
          className="hidden" 
        />

        {/* Footer Action Controls */}
        <div className="p-4 bg-[#252C36]/50 border-t border-[#2C3440] flex items-center justify-between gap-3">
          {capturedImage ? (
            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-[#1C2129] border border-[#2C3440] text-[#FAF3F3] hover:bg-white/5 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Foto Ulang</span>
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-[#DA7F8F] hover:bg-[#c96c7d] text-white transition flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Gunakan Foto Ini</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full px-2">
              {/* Tombol Ambil dari File / Galeri */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-2xl bg-[#1C2129] border border-[#2C3440] text-[#A7BBC7] hover:text-white hover:bg-white/5 transition flex items-center gap-2 text-xs font-semibold cursor-pointer active:scale-95"
                title="Pilih foto dari Galeri / File"
              >
                <ImageIcon className="w-4 h-4 text-[#DA7F8F]" />
                <span className="hidden sm:inline">Pilih File</span>
              </button>

              {/* Shutter Button (Capture) */}
              <button
                type="button"
                onClick={takeSnapshot}
                disabled={!!errorMsg}
                className="w-16 h-16 rounded-full border-4 border-white bg-[#DA7F8F] hover:bg-[#c96c7d] text-white flex items-center justify-center transition active:scale-95 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                title="Jepret Foto"
              >
                <div className="w-12 h-12 rounded-full border-2 border-white/60 flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </div>
              </button>

              {/* Switch Camera Button on Footer */}
              <button
                type="button"
                onClick={handleSwitchCamera}
                className="p-3 rounded-2xl bg-[#1C2129] border border-[#2C3440] text-[#A7BBC7] hover:text-white hover:bg-white/5 transition flex items-center gap-2 text-xs font-semibold cursor-pointer active:scale-95"
                title="Balik Kamera"
              >
                <SwitchCamera className="w-4 h-4 text-[#DA7F8F]" />
                <span className="hidden sm:inline">Balik Kamera</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
