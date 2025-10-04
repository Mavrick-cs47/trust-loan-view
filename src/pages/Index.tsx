import { useState } from "react";
import { Shield, Upload, CheckCircle2, FileText, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

const Index = () => {
  const [onboardOpen, setOnboardOpen] = useState(false);
  const features = [
    { icon: Upload, title: "Geo-Tagged Uploads", description: "Upload photos and videos with automatic location and timestamp validation", color: "text-primary" },
    { icon: CheckCircle2, title: "AI Validation", description: "Intelligent verification of assets with real-time discrepancy detection", color: "text-success" },
    { icon: FileText, title: "Progress Tracking", description: "Complete audit trail and history logs for all loan assets", color: "text-info" },
    { icon: Lock, title: "Blockchain Security", description: "Tamper-proof records ensuring data integrity and transparency", color: "text-warning" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">loanMitra</h1>
              <p className="text-xs text-muted-foreground">Your Trusted Loan Companion</p>
            </div>
          </div>
          <Link to="/login"><Button>Login</Button></Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">Track Loan Asset Utilization with Transparency</h2>
            <p className="mb-8 text-lg text-muted-foreground">AI-powered verification system for beneficiaries and state agency officers. Secure, transparent, and tamper-proof asset tracking with geo-tagged uploads.</p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/login"><Button size="lg" className="w-full sm:w-auto">Get Started</Button></Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => setOnboardOpen(true)}>Learn More</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h3 className="mb-3 text-3xl font-bold text-foreground">Key Features</h3>
            <p className="text-muted-foreground">Built for trust, transparency, and efficiency</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-border transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <feature.icon className={`mb-4 h-10 w-10 ${feature.color}`} />
                  <h4 className="mb-2 text-lg font-semibold text-card-foreground">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h3 className="mb-3 text-3xl font-bold text-foreground">Who Uses This System?</h3>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-border">
              <CardContent className="p-8">
                <h4 className="mb-4 text-2xl font-bold text-card-foreground">Beneficiaries</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3"><CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-success" /><span className="text-muted-foreground">Upload geo-tagged photos and videos of assets</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-success" /><span className="text-muted-foreground">Track utilization progress in real-time</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-success" /><span className="text-muted-foreground">Receive notifications on approval status</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-success" /><span className="text-muted-foreground">Offline support with automatic sync</span></li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-8">
                <h4 className="mb-4 text-2xl font-bold text-card-foreground">State Agency Officers</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3"><CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-info" /><span className="text-muted-foreground">Review and approve submissions remotely</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-info" /><span className="text-muted-foreground">Access comprehensive analytics dashboard</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-info" /><span className="text-muted-foreground">Manage beneficiary data efficiently</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-info" /><span className="text-muted-foreground">Generate detailed audit reports</span></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">loanMitra</span>
          </div>
          <p className="mb-1 text-xs text-muted-foreground">Your Trusted Loan Companion</p>
          <p className="text-xs text-muted-foreground">© 2025 loanMitra. Powered by AI and Blockchain Technology.</p>
        </div>
      </footer>

      {/* Onboarding Modal */}
      <Dialog open={onboardOpen} onOpenChange={setOnboardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How the Demo Works</DialogTitle>
            <DialogDescription>Explore key flows without any backend connections.</DialogDescription>
          </DialogHeader>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Login with mobile number and OTP simulation.</li>
            <li>Choose Beneficiary or Officer to view role-based dashboards.</li>
            <li>Capture photo/video, offline queueing, and sync indicators are simulated.</li>
            <li>AI validation, approvals, analytics, and blockchain indicators are UI-only.</li>
            <li>Export buttons generate sample CSV files for reports/logs.</li>
          </ul>
          <div className="flex justify-end"><Button onClick={() => setOnboardOpen(false)}>Got it</Button></div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
