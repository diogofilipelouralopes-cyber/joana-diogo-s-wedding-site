ALTER TABLE public.guest_communications DROP CONSTRAINT IF EXISTS guest_communications_type_check;
ALTER TABLE public.guest_communications ADD CONSTRAINT guest_communications_type_check
  CHECK (type = ANY (ARRAY['email_1_month'::text, 'email_1_week'::text, 'whatsapp_1_week'::text, 'post_wedding'::text]));