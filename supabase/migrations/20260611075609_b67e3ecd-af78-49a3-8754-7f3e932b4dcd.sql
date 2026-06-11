-- Fix 1: Restrict patient updates on appointments to only status/notes columns
-- and only allow cancelling (not arbitrary status changes)
REVOKE UPDATE ON public.appointments FROM authenticated;
GRANT UPDATE (status, notes) ON public.appointments TO authenticated;

CREATE OR REPLACE FUNCTION public.enforce_patient_appointment_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  -- Only allow status to remain the same or transition to 'cancelled'
  IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status <> 'cancelled' THEN
    RAISE EXCEPTION 'Patients may only cancel appointments';
  END IF;
  -- Immutable fields safeguard (defense in depth alongside column grants)
  IF NEW.fee IS DISTINCT FROM OLD.fee
     OR NEW.doctor_id IS DISTINCT FROM OLD.doctor_id
     OR NEW.service_id IS DISTINCT FROM OLD.service_id
     OR NEW.patient_id IS DISTINCT FROM OLD.patient_id
     OR NEW.slot_id IS DISTINCT FROM OLD.slot_id
     OR NEW.slot_start IS DISTINCT FROM OLD.slot_start
     OR NEW.slot_end IS DISTINCT FROM OLD.slot_end THEN
    RAISE EXCEPTION 'Field not allowed to be modified by patient';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_patient_appointment_update_trg ON public.appointments;
CREATE TRIGGER enforce_patient_appointment_update_trg
BEFORE UPDATE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION public.enforce_patient_appointment_update();

-- Fix 2: Hide booked slots from public reads to avoid leaking scheduling patterns
DROP POLICY IF EXISTS "slots public read" ON public.availability_slots;
CREATE POLICY "slots public read unbooked"
ON public.availability_slots
FOR SELECT
TO public
USING (is_booked = false);