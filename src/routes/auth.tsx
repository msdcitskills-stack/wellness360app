import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · Wellness360" },
      { name: "description", content: "Sign in or create your Wellness360 patient account." },
    ],
  }),
  component: AuthPage,
  errorComponent: ({ error }) => <div className="p-10 text-center text-destructive">{error.message}</div>,
  notFoundComponent: () => <div>Not found</div>,
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")), password: String(fd.get("password")),
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    navigate({ to: "/dashboard" });
  }

  async function signUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: String(fd.get("name")) },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — you're in!");
    navigate({ to: "/dashboard" });
  }

  async function google() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (result.error) { setLoading(false); return toast.error(result.error.message); }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-dvh grid lg:grid-cols-2 bg-background">
      <aside className="hidden lg:flex flex-col justify-between p-12 bg-gradient-primary text-primary-foreground relative overflow-hidden">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid place-items-center h-9 w-9 rounded-xl bg-white/15 backdrop-blur">
            <Stethoscope className="h-5 w-5" />
          </span>
          <span className="font-display font-extrabold text-lg">Wellness360</span>
        </Link>
        <div>
          <h1 className="font-display text-5xl font-extrabold leading-tight">Expert care,<br />anywhere you are.</h1>
          <p className="mt-4 opacity-90 max-w-md">Join thousands of patients consulting verified specialists across 11+ care specialties.</p>
        </div>
        <p className="text-xs opacity-75">© Wellness360</p>
      </aside>

      <main className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <span className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-primary text-primary-foreground">
              <Stethoscope className="h-5 w-5" />
            </span>
            <span className="font-display font-extrabold text-lg">Wellness360</span>
          </Link>

          <h2 className="font-display text-3xl font-extrabold">Welcome</h2>
          <p className="text-sm text-muted-foreground mt-1">Sign in or create your patient account.</p>

          <Button onClick={google} variant="outline" className="w-full mt-6 h-11" disabled={loading}>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />OR<div className="h-px flex-1 bg-border" /></div>

          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={signIn} className="space-y-4 mt-4">
                <Field label="Email" name="email" type="email" required />
                <Field label="Password" name="password" type="password" required />
                <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-primary text-primary-foreground">Sign in</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={signUp} className="space-y-4 mt-4">
                <Field label="Full name" name="name" required />
                <Field label="Email" name="email" type="email" required />
                <Field label="Password" name="password" type="password" minLength={6} required />
                <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-primary text-primary-foreground">Create account</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, name, ...rest } = props;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...rest} />
    </div>
  );
}
