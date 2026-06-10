import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarCheck, ShieldCheck, Star, Stethoscope, Sparkles, Video, CreditCard, UserCheck, ListChecks } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ServiceIcon } from "@/lib/icon";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { servicesQuery, doctorsQuery, testimonialsQuery, faqsQuery } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wellness360 — Expert Care, Anywhere" },
      { name: "description", content: "Book secure online consultations with certified healthcare experts across cancer, neurology, cardio, nutrition, diabetes, women's health and more." },
      { property: "og:title", content: "Wellness360 — Expert Care, Anywhere" },
      { property: "og:description", content: "Premium telemedicine across 11+ supportive care specialties." },
    ],
  }),
  loader: ({ context }) => Promise.all([
    context.queryClient.ensureQueryData(servicesQuery),
    context.queryClient.ensureQueryData(doctorsQuery),
    context.queryClient.ensureQueryData(testimonialsQuery),
    context.queryClient.ensureQueryData(faqsQuery),
  ]),
  component: Landing,
  errorComponent: ({ error }) => <div className="p-10 text-center text-sm text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="p-10 text-center">Not found</div>,
});

function Landing() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <Doctors />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-surface/70 backdrop-blur px-3 py-1.5 text-xs font-medium text-primary border border-primary/15">
            <ShieldCheck className="h-3.5 w-3.5" /> HIPAA-grade secure consultations
          </div>
          <h1 className="mt-5 font-display text-5xl lg:text-7xl font-extrabold leading-[1.02]">
            Expert Care,<br />
            <span className="text-gradient-primary">Anywhere.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            Connect with certified healthcare experts through secure online consultations tailored to your wellness journey — across 11+ supportive care specialties.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-95 shadow-soft h-12 px-6">
              <Link to="/book">Book Consultation <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6">
              <a href="#services">Explore Services</a>
            </Button>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            {[
              { k: "11+", v: "Specialties" },
              { k: "200+", v: "Certified experts" },
              { k: "4.9★", v: "Patient rating" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="font-display text-2xl font-extrabold">{s.k}</dt>
                <dd className="text-xs text-muted-foreground mt-0.5">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="relative aspect-square max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-primary rounded-[2.5rem] rotate-3 opacity-20 blur-2xl" />
            <div className="relative h-full rounded-[2rem] bg-surface shadow-elevated p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Dr. Anika Verma</div>
                    <div className="text-xs text-muted-foreground">Oncology · 14 yrs</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-success"><Star className="h-3.5 w-3.5 fill-current" /> 4.9</div>
              </div>
              <div className="space-y-3">
                <div className="rounded-xl border border-border p-3 flex items-center gap-3">
                  <CalendarCheck className="h-4 w-4 text-primary" />
                  <div className="text-xs"><span className="font-semibold">Tomorrow · 10:30 AM</span><br /><span className="text-muted-foreground">Video consultation</span></div>
                </div>
                <div className="rounded-xl bg-gradient-primary text-primary-foreground p-3 flex items-center gap-3">
                  <Video className="h-4 w-4" />
                  <div className="text-xs"><span className="font-semibold">Secure HD video</span><br /><span className="opacity-90">End-to-end encrypted</span></div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-surface rounded-2xl p-4 shadow-elevated border border-border/60 animate-fade-in">
              <div className="flex items-center gap-2 text-xs">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="font-medium">12 specialists available now</span>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-surface rounded-2xl p-3 shadow-elevated border border-border/60">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const { data } = useSuspenseQuery(servicesQuery);
  return (
    <section id="services" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Our Services"
          title="Specialized supportive care, end to end"
          subtitle="From oncology to ergonomics — every consult is led by a verified expert and tailored to you."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((s) => (
            <div key={s.id} className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated">
              <div className="h-12 w-12 rounded-xl bg-secondary text-secondary-foreground grid place-items-center group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-colors">
                <ServiceIcon name={s.icon} className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold">{s.name}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.tagline}</p>
              <p className="mt-3 text-sm text-muted-foreground/90 leading-relaxed">{s.description}</p>
              <div className="mt-5 flex items-center gap-3">
                <Link to="/book" search={{ service: s.slug } as never} className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
                  Book appointment <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { i: ListChecks, t: "Choose a service", d: "Pick from 11+ supportive care specialties." },
    { i: UserCheck, t: "Select an expert", d: "Browse verified specialists with ratings & fees." },
    { i: CalendarCheck, t: "Book an appointment", d: "Pick a slot that fits your schedule." },
    { i: CreditCard, t: "Secure payment", d: "Pay safely with Razorpay, UPI or cards." },
    { i: Video, t: "Consult online", d: "Join the encrypted video call and get care." },
  ];
  return (
    <section id="how" className="py-24 lg:py-32 bg-surface-muted">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading eyebrow="How it works" title="Care in five simple steps" subtitle="A frictionless path from first click to expert consultation." />
        <ol className="mt-14 grid gap-5 md:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.t} className="relative rounded-2xl bg-surface border border-border p-6 shadow-soft">
              <div className="text-xs font-bold text-primary">STEP {String(i + 1).padStart(2, "0")}</div>
              <s.i className="mt-4 h-6 w-6 text-primary" />
              <h3 className="mt-3 font-display font-bold">{s.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Doctors() {
  const { data } = useSuspenseQuery(doctorsQuery);
  return (
    <section id="doctors" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading eyebrow="Expert Doctors" title="Meet our certified specialists" subtitle="Hand-picked, credential-verified, patient-loved." />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.slice(0, 6).map((d) => (
            <article key={d.id} className="group rounded-2xl border border-border bg-surface p-6 shadow-soft hover:shadow-elevated transition-all">
              <div className="flex items-start gap-4">
                <img src={d.avatar_url ?? ""} alt={d.full_name} className="h-16 w-16 rounded-2xl object-cover" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display font-bold truncate">{d.full_name}</h3>
                    <div className="flex items-center gap-1 text-xs font-semibold text-foreground"><Star className="h-3.5 w-3.5 text-amber-500 fill-current" />{d.rating}</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{d.qualification}</p>
                  <p className="text-xs text-primary mt-1 font-medium">{d.specialty}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{d.experience_years}+ yrs</span> · {d.reviews_count} reviews
                </div>
                <div className="font-display font-bold">₹{Number(d.consultation_fee).toFixed(0)}</div>
              </div>
              <Button asChild className="mt-5 w-full bg-gradient-primary text-primary-foreground hover:opacity-95">
                <Link to="/book" search={{ doctor: d.id } as never}>Book consultation</Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const { data } = useSuspenseQuery(testimonialsQuery);
  return (
    <section className="py-24 lg:py-32 bg-surface-muted">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading eyebrow="Testimonials" title="Loved by patients everywhere" />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((t) => (
            <figure key={t.id} className="rounded-2xl bg-surface p-6 border border-border shadow-soft">
              <div className="flex gap-0.5 text-amber-500">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed">"{t.quote}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <img src={t.avatar_url ?? ""} alt={t.patient_name} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
                <div>
                  <div className="text-sm font-semibold">{t.patient_name}</div>
                  <div className="text-xs text-muted-foreground">{t.patient_role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const { data } = useSuspenseQuery(faqsQuery);
  return (
    <section id="faq" className="py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <Accordion type="single" collapsible className="mt-10">
          {data.map((f) => (
            <AccordionItem key={f.id} value={f.id} className="border-border">
              <AccordionTrigger className="text-left font-display font-semibold">{f.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <div className="rounded-3xl bg-gradient-primary p-10 lg:p-14 text-primary-foreground shadow-glow flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold">Your wellness journey starts today.</h2>
            <p className="mt-2 opacity-90 max-w-xl">Book a consultation with a verified expert in under 60 seconds.</p>
          </div>
          <Button asChild size="lg" variant="secondary" className="h-12 px-6 text-primary">
            <Link to="/book">Book consultation <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</div>
      <h2 className="mt-3 font-display text-3xl lg:text-5xl font-extrabold">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground text-lg">{subtitle}</p>}
    </div>
  );
}
