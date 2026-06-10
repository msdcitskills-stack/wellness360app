import { Stethoscope } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface-muted">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-12 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-primary text-primary-foreground">
              <Stethoscope className="h-4.5 w-4.5" />
            </span>
            <span className="font-display font-extrabold text-lg">Wellness360</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">
            Expert care, anywhere. Secure online consultations with verified healthcare specialists across supportive care.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#services" className="hover:text-foreground">Services</a></li>
            <li><a href="#doctors" className="hover:text-foreground">Doctors</a></li>
            <li><a href="#faq" className="hover:text-foreground">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>care@wellness360.health</li>
            <li>+1 (800) 360-WELL</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Wellness360. All rights reserved.
      </div>
    </footer>
  );
}
