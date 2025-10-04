import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Camera, Video, StopCircle } from "lucide-react";

export type CameraMode = "photo" | "video";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: CameraMode;
  onCapture: (result: { type: CameraMode; blob: Blob; url: string }) => void;
};

const constraints: MediaStreamConstraints = {
  video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
  audio: false,
};

const CameraModal = ({ open, onOpenChange, mode, onCapture }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    let stopped = false;
    async function start() {
      setError(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (stopped) return;
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (e) {
        setError("Camera access denied or unavailable");
      }
    }
    if (open) start();
    return () => {
      stopped = true;
      // stop stream tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
      setRecording(false);
    };
  }, [open]);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      onCapture({ type: "photo", blob, url });
      onOpenChange(false);
    }, "image/jpeg", 0.9);
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    try {
      const rec = new MediaRecorder(streamRef.current, { mimeType: "video/webm;codecs=vp9" });
      mediaRecorderRef.current = rec;
      rec.ondataavailable = (e) => e.data && chunksRef.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        onCapture({ type: "video", blob, url });
        onOpenChange(false);
      };
      rec.start();
      setRecording(true);
    } catch (e) {
      setError("Video recording not supported by this browser");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "photo" ? <Camera className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            {mode === "photo" ? "Capture Photo" : "Record Video"}
          </DialogTitle>
          <DialogDescription>Grant camera permission. Uses back camera when available.</DialogDescription>
        </DialogHeader>
        <div className="overflow-hidden rounded-md border border-border">
          <video ref={videoRef} playsInline muted className="h-full w-full bg-black" />
        </div>
        {error && (
          <div className="flex items-center gap-2 rounded-md border border-warning/30 bg-warning/10 p-2 text-sm text-warning-foreground">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}
        <div className="flex justify-end gap-2">
          {mode === "photo" ? (
            <Button onClick={capturePhoto} disabled={!!error}>Capture</Button>
          ) : !recording ? (
            <Button onClick={startRecording} disabled={!!error}>Start Recording</Button>
          ) : (
            <Button variant="destructive" onClick={stopRecording}><StopCircle className="mr-2 h-4 w-4" /> Stop</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CameraModal;
