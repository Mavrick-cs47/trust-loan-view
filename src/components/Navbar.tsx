import { Link } from "react-router-dom";
import { Shield, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const NavLinks = () => (
  <nav className="hidden items-center gap-6 md:flex">
    <Link to="/" className="text-sm text-foreground hover:text-primary">Home</Link>
    <Link to="/beneficiary" className="text-sm text-foreground hover:text-primary">Beneficiary</Link>
    <Link to="/officer" className="text-sm text-foreground hover:text-primary">Officer</Link>
  </nav>
);

const MobileMenu = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-5 w-5" />
      </Button>
    </SheetTrigger>
    <SheetContent side="right" className="w-full sm:max-w-sm">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" /> loanMitra
        </SheetTitle>
      </SheetHeader>
      <div className="mt-4 grid gap-2">
        <Link to="/" className="rounded-md px-3 py-2 text-foreground hover:bg-accent">Home</Link>
        <Link to="/beneficiary" className="rounded-md px-3 py-2 text-foreground hover:bg-accent">Beneficiary</Link>
        <Link to="/officer" className="rounded-md px-3 py-2 text-foreground hover:bg-accent">Officer</Link>
        <Link to="/login" className="rounded-md px-3 py-2 text-foreground hover:bg-accent">Login</Link>
      </div>
    </SheetContent>
  </Sheet>
);

const Navbar = () => {
  const location = useLocation();
  // Simple hide logic if needed in future based on route
  const hide = false;
  if (hide) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <span className="block text-base font-bold leading-tight text-foreground">loanMitra</span>
            <span className="block text-xs text-muted-foreground">Loan Utilization Tracker</span>
          </div>
        </Link>
        <NavLinks />
        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden md:block">
            <Button size="sm">Login</Button>
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
