import { useState } from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Download,
  BarChart3,
  Users,
  Shield,
  Bell,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OfficerDashboard = () => {
  const [showMenu, setShowMenu] = useState(false);

  const pendingApprovals = [
    {
      id: 1,
      beneficiary: "Rajesh Kumar",
      loanId: "LN2025001234",
      asset: "Agricultural Equipment",
      date: "2025-01-10",
      aiScore: 95,
    },
    {
      id: 2,
      beneficiary: "Priya Sharma",
      loanId: "LN2025001235",
      asset: "Livestock",
      date: "2025-01-09",
      aiScore: 88,
    },
    {
      id: 3,
      beneficiary: "Amit Patel",
      loanId: "LN2025001236",
      asset: "Building Materials",
      date: "2025-01-09",
      aiScore: 72,
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 75) return "text-info";
    return "text-warning";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold text-foreground">Officer Dashboard</h1>
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
          <h2 className="mb-2 text-2xl font-bold text-foreground">Welcome, Officer Meena Singh</h2>
          <p className="text-muted-foreground">District: Maharashtra | Employee ID: OFF2025089</p>
        </div>

        {/* Stats Overview */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Reviews</p>
                  <p className="text-2xl font-bold text-warning">12</p>
                </div>
                <Clock className="h-10 w-10 text-warning opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved Today</p>
                  <p className="text-2xl font-bold text-success">8</p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-success opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Beneficiaries</p>
                  <p className="text-2xl font-bold text-info">245</p>
                </div>
                <Users className="h-10 w-10 text-info opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI Validations</p>
                  <p className="text-2xl font-bold text-primary">156</p>
                </div>
                <Shield className="h-10 w-10 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>
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
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
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
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/30 p-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Asset Type</p>
                          <p className="font-medium text-card-foreground">{item.asset}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Upload Date</p>
                          <p className="font-medium text-card-foreground">{item.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">AI Validation Score</p>
                            <p className={`text-lg font-bold ${getScoreColor(item.aiScore)}`}>
                              {item.aiScore}%
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                          <Button variant="success" size="sm">
                            Approve
                          </Button>
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
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Analytics Dashboard
                </CardTitle>
                <CardDescription>Visual insights and reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-border bg-gradient-to-br from-primary/5 to-transparent p-8 text-center">
                  <BarChart3 className="mx-auto mb-4 h-16 w-16 text-primary opacity-50" />
                  <p className="text-muted-foreground">
                    Analytics charts and visualizations will be displayed here
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button variant="outline" className="justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Download Monthly Report
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Audit Trail
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="beneficiaries" className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Beneficiary Management
                </CardTitle>
                <CardDescription>Add and manage beneficiary data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Add New Beneficiary
                </Button>
                <div className="rounded-lg border border-border bg-muted/30 p-8 text-center">
                  <Users className="mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    Beneficiary list and management tools will be displayed here
                  </p>
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
              <p className="text-sm text-muted-foreground">
                All records are cryptographically secured and tamper-proof
              </p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-success" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfficerDashboard;
