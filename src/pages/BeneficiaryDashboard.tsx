import { useState } from "react";
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
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const BeneficiaryDashboard = () => {
  const [showMenu, setShowMenu] = useState(false);

  const uploads = [
    {
      id: 1,
      type: "photo",
      date: "2025-01-10",
      status: "approved",
      asset: "Agricultural Equipment",
    },
    {
      id: 2,
      type: "video",
      date: "2025-01-08",
      status: "pending",
      asset: "Livestock",
    },
    {
      id: 3,
      type: "photo",
      date: "2025-01-05",
      status: "verified",
      asset: "Building Construction",
    },
  ];

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold text-foreground">Beneficiary Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive"></span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowMenu(!showMenu)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
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
                <span className="font-semibold text-foreground">65%</span>
              </div>
              <Progress value={65} className="h-2" />
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
            <CardDescription>
              Add geo-tagged photos or videos of your loan assets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button className="h-24 flex-col gap-2">
                <Camera className="h-6 w-6" />
                <span>Take Photo</span>
              </Button>
              <Button variant="secondary" className="h-24 flex-col gap-2">
                <Video className="h-6 w-6" />
                <span>Record Video</span>
              </Button>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-info/10 p-3 text-sm">
              <MapPin className="h-4 w-4 flex-shrink-0 text-info" />
              <span className="text-info-foreground">
                Location services are enabled. GPS coordinates will be automatically added.
              </span>
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
                      <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {upload.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          Verified
                        </span>
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

        {/* AI Validation Notice */}
        <Card className="mt-6 border-warning/30 bg-warning/5">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-warning" />
            <div className="flex-1">
              <h4 className="font-semibold text-warning-foreground">AI Validation Active</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                All uploads are automatically verified using AI to ensure accuracy and compliance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BeneficiaryDashboard;
