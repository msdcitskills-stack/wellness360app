import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("services").select("*").eq("is_active", true).order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const doctorsQuery = queryOptions({
  queryKey: ["doctors"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("doctors")
      .select("*, service:services(name, slug)")
      .order("rating", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const testimonialsQuery = queryOptions({
  queryKey: ["testimonials"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("testimonials").select("*").eq("is_active", true).order("sort_order");
    if (error) throw error;
    return data;
  },
});

export const faqsQuery = queryOptions({
  queryKey: ["faqs"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("faqs").select("*").eq("is_active", true).order("sort_order");
    if (error) throw error;
    return data;
  },
});

export function doctorSlotsQuery(doctorId: string | null) {
  return queryOptions({
    queryKey: ["slots", doctorId],
    enabled: !!doctorId,
    queryFn: async () => {
      if (!doctorId) return [];
      const { data, error } = await supabase
        .from("availability_slots")
        .select("*")
        .eq("doctor_id", doctorId)
        .eq("is_booked", false)
        .gt("slot_start", new Date().toISOString())
        .order("slot_start");
      if (error) throw error;
      return data;
    },
  });
}

export const myAppointmentsQuery = queryOptions({
  queryKey: ["my-appointments"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("appointments")
      .select("*, doctor:doctors(full_name, specialty, avatar_url), service:services(name)")
      .order("slot_start", { ascending: false });
    if (error) throw error;
    return data;
  },
});
