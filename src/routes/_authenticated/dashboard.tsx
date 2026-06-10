import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarCheck, Clock, Video, FileText, Plus } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { myAppointmentsQuery } from "@/lib/queries";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · Wellness360" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = Route.useRouteContext();
  const { data: appts } = useSuspenseQuery(myAppointmentsQuery);
  const qc = useQueryClient();

  const upcoming = appts.filter((a) => a.status === "upcoming");
  const past = appts.filter((a) => a.status !== "upcoming");

  async function cancel(id: string, slotId: string) {
    const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", id);
    if (error) return toast.error(error.message);
    await supabase.from("availability_slots").update({ is_booked: false }).eq("id", slotId);
    toast.success("Appointment cancelled");
    qc.invalidateQueries({ queryKey: ["my-appointments"] });
  }

  return (
    <div className="min-h-dvh flex flex-col bg-surface-muted">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Welcome back</p>
              <h1 className="font-display text-3xl lg:text-4xl font-extrabold mt-1">
                {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
              </h1>
            </div>
            <Button asChild className="bg-gradient-primary text-primary-foreground">
              <Link to="/book"><Plus className="h-4 w-4 mr-1.5" />New consultation</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Stat icon={CalendarCheck} label="Upcoming" value={upcoming.length} />
            <Stat icon={Video} label="Completed" value={appts.filter(a => a.status === "completed").length} />
            <Stat icon={FileText} label="Total visits" value={appts.length} />
          </div>

          <section className="mt-10">
            <h2 className="font-display text-xl font-bold mb-4">Upcoming appointments</h2>
            {upcoming.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-4">
                {upcoming.map((a) => (
                  <article key={a.id} className="bg-surface border border-border rounded-2xl p-5 flex flex-wrap items-center gap-5 shadow-soft">
                    <img src={a.doctor?.avatar_url ?? ""} alt="" className="h-14 w-14 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold">{a.doctor?.full_name}</div>
                      <div className="text-xs text-muted-foreground">{a.doctor?.specialty} · {a.service?.name}</div>
                    </div>
                    <div className="text-sm">
                      <div className="flex items-center gap-1.5 font-semibold"><CalendarCheck className="h-4 w-4 text-primary" />{format(new Date(a.slot_start), "PP")}</div>
                      <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5"><Clock className="h-3.5 w-3.5" />{format(new Date(a.slot_start), "p")}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-gradient-primary text-primary-foreground"><Video className="h-4 w-4 mr-1.5" />Join</Button>
                      <Button size="sm" variant="outline" onClick={() => cancel(a.id, a.slot_id)}>Cancel</Button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {past.length > 0 && (
            <section className="mt-12">
              <h2 className="font-display text-xl font-bold mb-4">History</h2>
              <div className="grid gap-3">
                {past.map((a) => (
                  <div key={a.id} className="bg-surface border border-border rounded-xl px-5 py-3 flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium">{a.doctor?.full_name}</div>
                      <div className="text-xs text-muted-foreground">{format(new Date(a.slot_start), "PPp")}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${a.status === "completed" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{a.status}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof CalendarCheck; label: string; value: number }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-secondary text-secondary-foreground grid place-items-center"><Icon className="h-5 w-5" /></div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="font-display text-2xl font-extrabold">{value}</div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-surface border border-dashed border-border rounded-2xl p-10 text-center">
      <CalendarCheck className="h-10 w-10 mx-auto text-muted-foreground" />
      <p className="mt-3 text-sm text-muted-foreground">No upcoming consultations yet.</p>
      <Button asChild className="mt-4 bg-gradient-primary text-primary-foreground">
        <Link to="/book">Book your first consultation</Link>
      </Button>
    </div>
  );
}
