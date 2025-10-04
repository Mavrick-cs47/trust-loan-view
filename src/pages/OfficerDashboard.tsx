import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Download,
  BarChart3,
  Users,
  Shield,
  Bell,
  Menu,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  WifiOff,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { track } from "@/lib/tracking";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Area, AreaChart, ResponsiveContainer } from "recharts";

 type PendingItem = {
  id: number;
  beneficiary: string;
  loanId: string;
  asset: string;
  date: string;
  aiScore: number;
};

const OfficerDashboard = () => {
  const { toast } = useToast();
  const [showMenu, setShowMenu] = useState(false);
  const [offline, setOffline] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState<PendingItem[]>([
    { id: 1, beneficiary: "Rajesh Kumar", loanId: "LN2025001234", asset: "Agricultural Equipment", date: "2025-01-10", aiScore: 95 },
    { id: 2, beneficiary: "Priya Sharma", loanId: "LN2025001235", asset: "Livestock", date: "2025-01-09", aiScore: 88 },
    { id: 3, beneficiary: "Amit Patel", loanId: "LN2025001236", asset: "Building Materials", date: "2025-01-09", aiScore: 72 },
  ]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selected, setSelected] = useState<PendingItem | null>(null);
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const [comment, setComment] = useState("");
  const analyticsData = useMemo(() => (
    Array.from({ length: 12 }).map((_, i) => ({
      month: new Date(2024, i).toLocaleString("en", { month: "short" }),
      approvals: Math.round(20 + Math.random() * 30),
      rejections: Math.round(3 + Math.random() * 10),
    }))
  ), []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 75) return "text-info";
    return "text-warning";
  };

  const openReview = (item: PendingItem) => {
    setSelected(item);
    setDecision(null);
    setComment("");
    setReviewOpen(true);
    track("open_review", { loanId: item.loanId });
  };

  const applyDecision = () => {
    if (!selected || !decision) return;
    setPendingApprovals((list) => list.filter((x) => x.id !== selected.id));
    toast({ title: decision === "approve" ? "Approved" : "Rejected", description: selected.loanId });
    track("review_decision", { loanId: selected.loanId, decision, comment });
    setReviewOpen(false);
  };

  const exportCsv = () => {
    const header = ["id", "beneficiary", "loanId", "asset", "date", "aiScore"]; 
    const rows = pendingApprovals.map((u) => [u.id, u.beneficiary, u.loanId, u.asset, u.date, u.aiScore].join(","));
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pending_approvals_demo.csv";
    a.click();
    URL.revokeObjectURL(url);
    track("export_csv_officer", { rows: pendingApprovals.length });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold text-foreground">Officer Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 md:flex">
              <span className="text-xs text-muted-foreground">Offline</span>
              <Switch checked={offline} onCheckedChange={setOffline} />
              {offline ? <WifiOff className="h-4 w-4 text-warning" /> : <Wifi className="h-4 w-4 text-success" />}
            </div>
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
          <h2 className="mb-2 text-2xl font-bold text-foreground">Welcome, Officer Meena Singh</h2>
          <p className="text-muted-foreground">District: Maharashtra | Employee ID: OFF2025089</p>
        </div>

        {/* Stats Overview */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card className="border-border"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Pending Reviews</p><p className="text-2xl font-bold text-warning">{pendingApprovals.length}</p></div><Clock className="h-10 w-10 text-warning opacity-20" /></div></CardContent></Card>
          <Card className="border-border"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Approved Today</p><p className="text-2xl font-bold text-success">8</p></div><CheckCircle2 className="h-10 w-10 text-success opacity-20" /></div></CardContent></Card>
          <Card className="border-border"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Beneficiaries</p><p className="text-2xl font-bold text-info">245</p></div><Users className="h-10 w-10 text-info opacity-20" /></div></CardContent></Card>
          <Card className="border-border"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">AI Validations</p><p className="text-2xl font-bold text-primary">156</p></div><Shield className="h-10 w-10 text-primary opacity-20" /></div></CardContent></Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {/* Search and Filter */}
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search by loan ID or beneficiary name" className="pl-9" />
                  </div>
                  <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
                  <Button variant="outline" onClick={exportCsv}><Download className="mr-2 h-4 w-4" /> Export</Button>
                </div>
              </CardContent>
            </Card>

            {/* Pending Approvals List */}
            <div className="space-y-4">
              {pendingApprovals.map((item) => (
                <Card key={item.id} className="border-border hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-card-foreground">{item.beneficiary}</h4>
                          <p className="text-sm text-muted-foreground">Loan ID: {item.loanId}</p>
                        </div>
                        <Badge variant="outline" className="border-warning text-warning">
                          <Clock className="mr-1 h-3 w-3" /> Pending
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/30 p-3">
                        <div><p className="text-xs text-muted-foreground">Asset Type</p><p className="font-medium text-card-foreground">{item.asset}</p></div>
                        <div><p className="text-xs text-muted-foreground">Upload Date</p><p className="font-medium text-card-foreground">{item.date}</p></div>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">AI Validation Score</p>
                            <p className={`text-lg font-bold ${getScoreColor(item.aiScore)}`}>{item.aiScore}%</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openReview(item)}>Review</Button>
                          <Button variant="success" size="sm" onClick={() => { setSelected(item); setDecision("approve"); applyDecision(); }}>Approve</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Analytics Dashboard</CardTitle>
                <CardDescription>Visual insights and reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ChartContainer
                  config={{ approvals: { label: "Approvals", color: "hsl(var(--success))" }, rejections: { label: "Rejections", color: "hsl(var(--destructive))" } }}
                  className="w-full"
                >
                  <LineChart data={analyticsData} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="approvals" stroke="var(--color-approvals)" strokeWidth={2} />
                    <Line type="monotone" dataKey="rejections" stroke="var(--color-rejections)" strokeWidth={2} />
                  </LineChart>
                </ChartContainer>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button variant="outline" className="justify-start"><Download className="mr-2 h-4 w-4" /> Download Monthly Report</Button>
                  <Button variant="outline" className="justify-start"><FileText className="mr-2 h-4 w-4" /> Generate Audit Trail</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="beneficiaries" className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Beneficiary Management</CardTitle>
                <CardDescription>Add and manage beneficiary data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AddBeneficiaryDialog />
                <div className="rounded-lg border border-border bg-muted/30 p-8 text-center">
                  <Users className="mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Beneficiary list and management tools will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Blockchain Security Indicator */}
        <Card className="mt-6 border-success/30 bg-success/5">
          <CardContent className="flex items-center gap-3 p-4">
            <Shield className="h-6 w-6 text-success" />
            <div className="flex-1">
              <h4 className="font-semibold text-success-foreground">Blockchain Security Active</h4>
              <p className="text-sm text-muted-foreground">All records are cryptographically secured and tamper-proof</p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-success" />
          </CardContent>
        </Card>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Submission</DialogTitle>
            <DialogDescription>AI validation results and discrepancy flags</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-md border border-border p-3">
                  <p className="text-sm text-muted-foreground">Beneficiary</p>
                  <p className="font-medium">{selected.beneficiary}</p>
                </div>
                <div className="rounded-md border border-border p-3">
                  <p className="text-sm text-muted-foreground">Loan ID</p>
                  <p className="font-medium">{selected.loanId}</p>
                </div>
              </div>
              <div className="rounded-md border border-border p-3">
                <p className="mb-2 text-sm font-medium">AI Categories</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center justify-between rounded-md bg-muted/30 p-2">
                    <span>Asset Match</span>
                    <Badge className="bg-success text-success-foreground">Pass</Badge>
                  </li>
                  <li className="flex items-center justify-between rounded-md bg-muted/30 p-2">
                    <span>Geo Consistency</span>
                    <Badge className="bg-success text-success-foreground">Pass</Badge>
                  </li>
                  <li className="flex items-center justify-between rounded-md bg-muted/30 p-2">
                    <span>Timestamp Integrity</span>
                    <Badge className="bg-success text-success-foreground">Pass</Badge>
                  </li>
                  <li className="flex items-center justify-between rounded-md bg-muted/30 p-2">
                    <span>Fraud Signals</span>
                    <Badge className="bg-warning text-warning-foreground">Review</Badge>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Officer Comment</p>
                <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add remarks (optional)" />
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" onClick={() => setReviewOpen(false)}>Close</Button>
                <Button variant="destructive" onClick={() => { setDecision("reject"); applyDecision(); }}><ThumbsDown className="mr-2 h-4 w-4" /> Reject</Button>
                <Button variant="success" onClick={() => { setDecision("approve"); applyDecision(); }}><ThumbsUp className="mr-2 h-4 w-4" /> Approve</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AddBeneficiaryDialog = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loanId, setLoanId] = useState("");
  const [asset, setAsset] = useState("Agricultural Equipment");
  const { toast } = useToast();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)} className="w-full"><FileText className="mr-2 h-4 w-4" /> Add New Beneficiary</Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Beneficiary Loan Details</DialogTitle>
          <DialogDescription>Form submission is demo-only; no data is persisted.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Full Name</p>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Meena Kumari" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mobile Number</p>
            <Input value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))} maxLength={10} placeholder="9876543210" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Loan ID</p>
            <Input value={loanId} onChange={(e) => setLoanId(e.target.value)} placeholder="LN2025XXXX" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Asset Type</p>
            <Select value={asset} onValueChange={setAsset}>
              <SelectTrigger><SelectValue placeholder="Asset" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Agricultural Equipment">Agricultural Equipment</SelectItem>
                <SelectItem value="Livestock">Livestock</SelectItem>
                <SelectItem value="Building Materials">Building Materials</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">Notes</p>
          <Textarea placeholder="Optional notes" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => { toast({ title: "Beneficiary Added", description: `${name || "New"} (${loanId || "ID"})` }); setOpen(false); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OfficerDashboard;
