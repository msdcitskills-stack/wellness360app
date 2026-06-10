import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Check, ChevronRight, Star, Clock, CalendarCheck, ArrowLeft } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { z } from "zod";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { ServiceIcon } from "@/lib/icon";
import { servicesQuery, doctorsQuery, doctorSlotsQuery } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const search = z.object({
  service: z.string().optional(),
  doctor: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/book")({
  head: () => ({ meta: [{ title: "Book consultation · Wellness360" }] }),
  validateSearch: search,
  component: Book,
});

type Step = 1 | 2 | 3 | 4;

function Book() {
  const sp = Route.useSearch();
  const qc = useQueryClient();
  const { data: services } = useSuspenseQuery(servicesQuery);
  const { data: doctors } = useSuspenseQuery(doctorsQuery);

  const initialService = sp.service ? services.find((s) => s.slug === sp.service)?.id ?? null : null;
  const initialDoctor = sp.doctor ?? null;
  const initialDoctorObj = initialDoctor ? doctors.find((d) => d.id === initialDoctor) : null;

  const [step, setStep] = useState<Step>(initialDoctor ? 3 : initialService ? 2 : 1);
  const [serviceId, setServiceId] = useState<string | null>(initialDoctorObj?.service_id ?? initialService);
  const [doctorId, setDoctorId] = useState<string | null>(initialDoctor);
  const [slotId, setSlotId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: slots } = useQuery(doctorSlotsQuery(doctorId));
  const filteredDoctors = useMemo(() => doctors.filter((d) => !serviceId || d.service_id === serviceId), [doctors, serviceId]);

  const selectedDoctor = doctors.find((d) => d.id === doctorId);
  const selectedSlot = slots?.find((s) => s.id === slotId);

  const days = useMemo(() => {
    if (!slots) return [];
    const map = new Map<string, typeof slots>();
    for (const s of slots) {
      const key = format(new Date(s.slot_start), "yyyy-MM-dd");
      const arr = map.get(key) ?? [];
      arr.push(s);
      map.set(key, arr);
    }
    return Array.from(map.entries());
  }, [slots]);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  async function confirm() {
    if (!selectedDoctor || !selectedSlot || !serviceId) return;
    setSubmitting(true);
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) { setSubmitting(false); return toast.error("Please sign in"); }
    const { error } = await supabase.from("appointments").insert({
      patient_id: user.user.id,
      doctor_id: selectedDoctor.id,
      service_id: serviceId,
      slot_id: selectedSlot.id,
      slot_start: selectedSlot.slot_start,
      slot_end: selectedSlot.slot_end,
      fee: selectedDoctor.consultation_fee,
    });
    if (error) { setSubmitting(false); return toast.error(error.message); }
    await supabase.from("availability_slots").update({ is_booked: true }).eq("id", selectedSlot.id);
    qc.invalidateQueries({ queryKey: ["my-appointments"] });
    qc.invalidateQueries({ queryKey: ["slots"] });
    toast.success("Appointment confirmed!");
    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-dvh flex flex-col bg-surface-muted">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-5 lg:px-8 py-12">
          <Stepper step={step} />

          <div className="mt-10 bg-surface border border-border rounded-3xl p-6 lg:p-10 shadow-soft">
            {step === 1 && (
              <Section title="Choose a service" subtitle="Pick the area of care you need.">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((s) => (
                    <button key={s.id} onClick={() => { setServiceId(s.id); setStep(2); }}
                      className={`text-left rounded-2xl border p-5 transition-all hover:border-primary hover:shadow-soft ${serviceId === s.id ? "border-primary bg-secondary" : "border-border bg-surface"}`}>
                      <ServiceIcon name={s.icon} className="h-5 w-5 text-primary" />
                      <div className="mt-3 font-display font-bold">{s.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{s.tagline}</div>
                    </button>
                  ))}
                </div>
              </Section>
            )}

            {step === 2 && (
              <Section title="Select an expert" subtitle="Verified specialists, sorted by rating." onBack={() => setStep(1)}>
                <div className="grid gap-3 md:grid-cols-2">
                  {filteredDoctors.map((d) => (
                    <button key={d.id} onClick={() => { setDoctorId(d.id); setStep(3); }}
                      className={`text-left rounded-2xl border p-5 flex gap-4 transition-all hover:border-primary hover:shadow-soft ${doctorId === d.id ? "border-primary bg-secondary" : "border-border bg-surface"}`}>
                      <img src={d.avatar_url ?? ""} alt="" className="h-14 w-14 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-display font-bold truncate">{d.full_name}</div>
                          <div className="text-xs flex items-center gap-1"><Star className="h-3 w-3 text-amber-500 fill-current" />{d.rating}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">{d.specialty} · {d.experience_years} yrs</div>
                        <div className="text-sm font-bold mt-1">₹{Number(d.consultation_fee).toFixed(0)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </Section>
            )}

            {step === 3 && (
              <Section title="Pick a date & time" subtitle="Real-time availability from your expert's calendar." onBack={() => setStep(2)}>
                {!slots ? <div className="text-sm text-muted-foreground">Loading slots…</div> : days.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No slots available — try another doctor.</div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {days.map(([key, ss]) => {
                        const d = new Date(ss[0].slot_start);
                        const active = selectedDay === key;
                        return (
                          <button key={key} onClick={() => setSelectedDay(key)}
                            className={`shrink-0 rounded-xl border px-4 py-3 text-center min-w-20 transition ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface hover:border-primary"}`}>
                            <div className="text-xs opacity-80">{format(d, "EEE")}</div>
                            <div className="font-display font-bold text-lg">{format(d, "d")}</div>
                            <div className="text-[10px] opacity-80">{format(d, "MMM")}</div>
                          </button>
                        );
                      })}
                    </div>
                    {selectedDay && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {days.find(([k]) => k === selectedDay)?.[1].map((s) => (
                          <button key={s.id} onClick={() => { setSlotId(s.id); setStep(4); }}
                            className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${slotId === s.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface hover:border-primary"}`}>
                            {format(new Date(s.slot_start), "p")}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Section>
            )}

            {step === 4 && selectedDoctor && selectedSlot && (
              <Section title="Confirm & pay" subtitle="Review your appointment details." onBack={() => setStep(3)}>
                <div className="rounded-2xl bg-surface-muted p-5 space-y-3">
                  <Row k="Doctor" v={selectedDoctor.full_name} />
                  <Row k="Specialty" v={selectedDoctor.specialty} />
                  <Row k="Date" v={format(new Date(selectedSlot.slot_start), "PPPP")} />
                  <Row k="Time" v={format(new Date(selectedSlot.slot_start), "p")} />
                  <div className="border-t border-border pt-3 flex justify-between font-display font-extrabold text-lg">
                    <span>Total</span><span>₹{Number(selectedDoctor.consultation_fee).toFixed(0)}</span>
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">Razorpay checkout coming soon. For now your appointment will be confirmed instantly — you can pay at the consultation.</p>
                <Button onClick={confirm} disabled={submitting} className="mt-6 w-full h-12 bg-gradient-primary text-primary-foreground text-base">
                  {submitting ? "Confirming…" : "Confirm appointment"}
                </Button>
              </Section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const items = ["Service", "Doctor", "Slot", "Confirm"];
  return (
    <ol className="flex items-center gap-3 text-sm">
      {items.map((label, i) => {
        const n = (i + 1) as Step;
        const done = step > n; const active = step === n;
        return (
          <li key={label} className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-full grid place-items-center text-xs font-bold ${done ? "bg-success text-success-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {done ? <Check className="h-4 w-4" /> : n}
            </div>
            <span className={`hidden sm:inline ${active ? "font-semibold" : "text-muted-foreground"}`}>{label}</span>
            {i < items.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </li>
        );
      })}
    </ol>
  );
}

function Section({ title, subtitle, children, onBack }: { title: string; subtitle?: string; children: React.ReactNode; onBack?: () => void }) {
  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl font-extrabold">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {onBack && <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-1" />Back</Button>}
      </div>
      {children}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between text-sm"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}
