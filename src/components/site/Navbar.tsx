import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Stethoscope, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const links = [
  { to: "/", label: "Home" },
  { to: "/#services", label: "Services" },
  { to: "/#how", label: "How it works" },
  { to: "/#doctors", label: "Doctors" },
  { to: "/#faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/75 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
            <Stethoscope className="h-4.5 w-4.5" strokeWidth={2.25} />
          </span>
          <span className="font-display font-extrabold text-lg tracking-tight">Wellness360</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm">
          {links.map((l) => (
            <a key={l.to} href={l.to} className="text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="ghost"><Link to="/dashboard">Dashboard</Link></Button>
              <Button onClick={signOut} variant="outline">Sign out</Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost"><Link to="/auth">Sign in</Link></Button>
              <Button asChild className="bg-gradient-primary text-primary-foreground hover:opacity-95 shadow-soft">
                <Link to="/book">Book consultation</Link>
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden p-2 -mr-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="px-5 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.to} href={l.to} onClick={() => setOpen(false)} className="text-sm text-muted-foreground">
                {l.label}
              </a>
            ))}
            <div className="pt-3 flex gap-2">
              {user ? (
                <>
                  <Button asChild className="flex-1"><Link to="/dashboard">Dashboard</Link></Button>
                  <Button onClick={signOut} variant="outline" className="flex-1">Sign out</Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="flex-1"><Link to="/auth">Sign in</Link></Button>
                  <Button asChild className="flex-1 bg-gradient-primary text-primary-foreground"><Link to="/book">Book</Link></Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
