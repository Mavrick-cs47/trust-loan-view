import { useEffect, useMemo, useState } from "react";
import {
  Upload,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Camera,
  Video,
  FileText,
  Bell,
  Menu,
  WifiOff,
  Wifi,
  MessageCircle,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { track } from "@/lib/tracking";

 type UploadItem = {
  id: number;
  type: "photo" | "video";
  date: string;
  status: "approved" | "pending" | "verified";
  asset: string;
  location?: string;
};

const BeneficiaryDashboard = () => {
  const { toast } = useToast();
  const [showMenu, setShowMenu] = useState(false);
  const [offline, setOffline] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncQueue, setSyncQueue] = useState<UploadItem[]>([]);
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [captureType, setCaptureType] = useState<"photo" | "video">("photo");
  const [language, setLanguage] = useState("en");
  const [useBiometric, setUseBiometric] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Hi! Need help with uploading your asset proof?" },
  ]);

  const [uploads, setUploads] = useState<UploadItem[]>([
    { id: 1, type: "photo", date: "2025-01-10", status: "approved", asset: "Agricultural Equipment", location: "19.07, 72.87" },
    { id: 2, type: "video", date: "2025-01-08", status: "pending", asset: "Livestock", location: "19.10, 72.85" },
    { id: 3, type: "photo", date: "2025-01-05", status: "verified", asset: "Building Construction", location: "19.02, 72.90" },
  ]);

  const overallProgress = useMemo(() => 65, []);

  useEffect(() => {
    if (!offline && syncQueue.length > 0) {
      setSyncing(true);
      toast({ title: "Syncing queued uploads", description: `${syncQueue.length} item(s) syncing...` });
      // Simulate background sync
      const timer = setTimeout(() => {
        setUploads((prev) => [
          ...syncQueue.map((q, idx) => ({ ...q, id: prev.length + idx + 1, status: "pending" })),
          ...prev,
        ]);
        setSyncQueue([]);
        setSyncing(false);
        track("sync_complete", { count: syncQueue.length });
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [offline, syncQueue, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "verified":
        return "bg-info text-info-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const randomLocation = () => {
    const lat = (19 + Math.random()).toFixed(2);
    const lng = (72.8 + Math.random()).toFixed(2);
    return `${lat}, ${lng}`;
  };

  const handleCapture = (type: "photo" | "video") => {
    setCaptureType(type);
    setIsCaptureOpen(true);
  };

  const handleSaveCapture = () => {
    const item: UploadItem = {
      id: Date.now(),
      type: captureType,
      date: new Date().toISOString().slice(0, 10),
      status: offline ? "pending" : "verified",
      asset: captureType === "photo" ? "New Photo Evidence" : "New Video Evidence",
      location: randomLocation(),
    };
    if (offline) {
      setSyncQueue((q) => [item, ...q]);
      track("capture_queued", { type: captureType });
      toast({ title: "Queued Offline", description: "Will sync when back online" });
    } else {
      setUploads((u) => [item, ...u]);
      track("capture_saved", { type: captureType });
      toast({ title: "Upload Added", description: `${captureType === "photo" ? "Photo" : "Video"} saved` });
    }
    setIsCaptureOpen(false);
  };

  const triggerReminder = () => {
    track("reminder_sent", { type: "submission" });
  };

  const exportCsv = () => {
    const header = ["id", "type", "date", "status", "asset", "location"]; 
    const rows = uploads.map((u) => [u.id, u.type, u.date, u.status, u.asset, u.location ?? ""].join(","));
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uploads_demo.csv";
    a.click();
    URL.revokeObjectURL(url);
    track("export_csv", { rows: uploads.length });
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: "Thanks! We'll review and assist shortly." }]);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold text-foreground">Beneficiary Dashboard</h1>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" onClick={() => triggerReminder()}>
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive"></span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Check notifications</TooltipContent>
            </Tooltip>
            <Button variant="ghost" size="icon" onClick={() => setShowMenu(!showMenu)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {offline && (
          <div className="bg-warning/10 text-warning-foreground">
            <div className="container mx-auto flex items-center justify-between px-4 py-2 text-sm">
              <div className="flex items-center gap-2"><WifiOff className="h-4 w-4" /> Offline mode: uploads will be queued</div>
              {syncQueue.length > 0 && <div>Queue: {syncQueue.length}</div>}
            </div>
          </div>
        )}
        {syncing && (
          <div className="bg-info/10 text-info-foreground">
            <div className="container mx-auto flex items-center justify-between px-4 py-2 text-sm">
              <div className="flex items-center gap-2"><Wifi className="h-4 w-4" /> Syncing...</div>
            </div>
          </div>
        )}
      </header>

      <div className="container mx-auto p-4">
        {/* Controls */}
        <div className="mb-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Language</p>
                <div className="mt-1 w-40">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger><SelectValue placeholder="Language" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिन्दी</SelectItem>
                      <SelectItem value="mr">मराठी</SelectItem>
                      <SelectItem value="ta">தமிழ்</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <GlobeIcon />
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Biometric Login</p>
                <p className="text-xs text-muted-foreground">Face/Touch ID (demo)</p>
              </div>
              <Switch checked={useBiometric} onCheckedChange={setUseBiometric} />
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Connectivity</p>
                <p className="text-xs text-muted-foreground">Toggle offline</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={offline}
                  onCheckedChange={(v) => {
                    setOffline(v);
                    if (!v && syncQueue.length > 0) {
                      // will auto-sync via effect
                    }
                  }}
                />
                {offline ? <WifiOff className="h-4 w-4 text-warning" /> : <Wifi className="h-4 w-4 text-success" />}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Exports</p>
                <p className="text-xs text-muted-foreground">Download CSV</p>
              </div>
              <Button size="sm" variant="outline" onClick={exportCsv}><FileText className="mr-2 h-4 w-4" /> Export</Button>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-foreground">Welcome, Rajesh Kumar</h2>
          <p className="text-muted-foreground">Loan ID: LN2025001234</p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle>Loan Utilization Progress</CardTitle>
            <CardDescription>Track your asset verification status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-semibold text-foreground">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">3</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">2</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-info">1</p>
                <p className="text-xs text-muted-foreground">In Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Section */}
        <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload New Asset
            </CardTitle>
            <CardDescription>Add geo-tagged photos or videos of your loan assets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button className="h-24 flex-col gap-2" onClick={() => handleCapture("photo")}>
                <Camera className="h-6 w-6" />
                <span>Take Photo</span>
              </Button>
              <Button variant="secondary" className="h-24 flex-col gap-2" onClick={() => handleCapture("video")}>
                <Video className="h-6 w-6" />
                <span>Record Video</span>
              </Button>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-info/10 p-3 text-sm">
              <MapPin className="h-4 w-4 flex-shrink-0 text-info" />
              <span className="text-info-foreground">Location services simulated. GPS coordinates will be added.</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Uploads */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Uploads</h3>
          {uploads.map((upload) => (
            <Card key={upload.id} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      {upload.type === "photo" ? (
                        <Camera className="h-6 w-6 text-muted-foreground" />
                      ) : (
                        <Video className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-card-foreground">{upload.asset}</h4>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {upload.date}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {upload.location ?? "GPS"}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(upload.status)}>
                    {upload.status === "approved" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                    {upload.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                    {upload.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Validation Notice & Blockchain */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="flex items-start gap-3 p-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-warning" />
              <div className="flex-1">
                <h4 className="font-semibold text-warning-foreground">AI Validation Active</h4>
                <p className="mt-1 text-sm text-muted-foreground">All uploads are automatically verified using AI to ensure accuracy and compliance.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-success/30 bg-success/5">
            <CardContent className="flex items-center gap-3 p-4">
              <ShieldCheck className="h-6 w-6 text-success" />
              <div className="flex-1">
                <h4 className="font-semibold text-success-foreground">Tamper-proof Records</h4>
                <p className="text-sm text-muted-foreground">Records are notarized on a blockchain (UI-only).</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-success" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Capture Dialog */}
      <Dialog open={isCaptureOpen} onOpenChange={setIsCaptureOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{captureType === "photo" ? "Capture Photo" : "Record Video"}</DialogTitle>
            <DialogDescription>Camera preview simulated. Geo-tag and timestamp will be attached.</DialogDescription>
          </DialogHeader>
          <div className="aspect-video w-full rounded-md border border-border bg-muted" />
          <div className="grid gap-2 text-sm text-muted-foreground">
            <div>Timestamp: {new Date().toLocaleString()}</div>
            <div>GPS: {randomLocation()}</div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCaptureOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCapture}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Widget */}
      <Sheet open={chatOpen} onOpenChange={setChatOpen}>
        <SheetTrigger asChild>
          <Button className="fixed bottom-6 right-6 h-12 gap-2 shadow-lg" size="lg">
            <MessageCircle className="h-5 w-5" /> Help
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Support</SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex h-[75vh] flex-col">
            <div className="flex-1 space-y-2 overflow-y-auto rounded-md border border-border p-3">
              {messages.map((m, i) => (
                <div key={i} className={`max-w-[80%] rounded-md p-2 text-sm ${m.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {m.text}
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Input id="chat-input" placeholder="Type your message" onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const target = e.target as HTMLInputElement;
                  const val = target.value;
                  target.value = "";
                  sendMessage(val);
                }
              }} />
              <Button onClick={() => {
                const el = document.getElementById("chat-input") as HTMLInputElement | null;
                if (el) { const val = el.value; el.value = ""; sendMessage(val); }
              }}><Send className="h-4 w-4" /></Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8 text-muted-foreground opacity-30"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2m6.93 6h-3.64a15.842 15.842 0 0 0-1.29-3.36A8.045 8.045 0 0 1 18.93 8M12 4a13.876 13.876 0 0 1 1.81 4H10.2A13.876 13.876 0 0 1 12 4M4.26 14a7.958 7.958 0 0 1 0-4h3.48a17.34 17.34 0 0 0 0 4Zm.81 2h3.64a15.842 15.842 0 0 0 1.29 3.36A8.045 8.045 0 0 1 5.07 16M8.71 8H5.07a8.045 8.045 0 0 1 5.93-3.36A15.842 15.842 0 0 0 8.71 8M10.2 16h3.61A13.876 13.876 0 0 1 12 20a13.876 13.876 0 0 1-1.8-4m6.09 0h3.64a8.045 8.045 0 0 1-5.93 3.36A15.842 15.842 0 0 0 14.29 16m.42-2a17.34 17.34 0 0 0 0-4h3.48a7.958 7.958 0 0 1 0 4z"/></svg>
);

export default BeneficiaryDashboard;
