import { useState } from "react";
import { Shield, Phone, ArrowRight, UserCheck, Globe, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { track } from "@/lib/tracking";
import Navbar from "@/components/Navbar";

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [role, setRole] = useState<"beneficiary" | "officer">("beneficiary");
  const [language, setLanguage] = useState("en");
  const [useBiometric, setUseBiometric] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendOTP = () => {
    if (mobileNumber.length === 10) {
      track("otp_sent", { mobileNumber: `+91${mobileNumber}` });
      setStep("otp");
      toast({ title: "OTP Sent", description: `Code sent to +91 ${mobileNumber}` });
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) return;
    track("login_verify", { role, language, biometric: useBiometric });
    toast({ title: "Login Successful", description: `Signed in as ${role}` });
    navigate(role === "beneficiary" ? "/beneficiary" : "/officer");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-primary/5 to-secondary/5">
      <Navbar />
      <div className="flex w-full flex-1 flex-col items-center justify-center p-4">
        {/* Logo and Title */}
        <div className="mb-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <Shield className="h-10 w-10 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">loanMitra</h1>
          </div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">Your Trusted Loan Companion</p>
          <p className="text-sm text-muted-foreground">Secure Login with Mobile Number Authentication</p>
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-md border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">{step === "mobile" ? "Enter Mobile Number" : "Verify OTP"}</CardTitle>
            <CardDescription className="text-center">
              {step === "mobile"
                ? "We'll send you a one-time password to verify your identity"
                : `Enter the OTP sent to +91 ${mobileNumber}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === "mobile" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <div className="flex gap-2">
                    <div className="flex h-10 w-16 items-center justify-center rounded-md border border-input bg-muted px-3 text-sm">+91</div>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="9876543210"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                      maxLength={10}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><UserCheck className="h-4 w-4" /> Select Role</Label>
                  <RadioGroup value={role} onValueChange={(v) => setRole(v as typeof role)} className="grid grid-cols-2">
                    <label className="flex items-center gap-2 rounded-md border border-input p-3">
                      <RadioGroupItem value="beneficiary" />
                      <span>Beneficiary</span>
                    </label>
                    <label className="flex items-center gap-2 rounded-md border border-input p-3">
                      <RadioGroupItem value="officer" />
                      <span>State Officer</span>
                    </label>
                  </RadioGroup>
                </div>

                <Button onClick={handleSendOTP} className="w-full" disabled={mobileNumber.length !== 10}>
                  Send OTP
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp">One-Time Password</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button onClick={handleVerifyOTP} className="w-full" disabled={otp.length !== 6}>
                    Verify & Login
                  </Button>
                  <Button variant="ghost" onClick={() => setStep("mobile")} className="w-full">
                    Change Mobile Number
                  </Button>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Didn't receive OTP?{" "}
                  <button onClick={handleSendOTP} className="font-medium text-primary hover:underline">
                    Resend
                  </button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Demo Settings */}
        <Card className="mt-4 w-full max-w-md border-border">
          <CardHeader>
            <CardTitle className="text-base">Preferences</CardTitle>
            <CardDescription>Language and biometric settings (demo only)</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Globe className="h-4 w-4" /> Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिन्दी</SelectItem>
                  <SelectItem value="mr">मराठी</SelectItem>
                  <SelectItem value="ta">தமிழ்</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-md border border-input p-3">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Biometric Login</p>
                  <p className="text-xs text-muted-foreground">Enable Face/Touch ID (demo)</p>
                </div>
              </div>
              <Switch checked={useBiometric} onCheckedChange={setUseBiometric} />
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="mt-6 flex items-start gap-2 rounded-lg bg-info/10 p-4 text-sm text-info-foreground">
          <Phone className="h-5 w-5 flex-shrink-0" />
          <p>
            Your mobile number is used for secure authentication. No real SMS is sent in this demo.
          </p>
        </div>

        {/* Home Button */}
        <Link to="/" className="mt-4">
          <Button variant="outline">Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
