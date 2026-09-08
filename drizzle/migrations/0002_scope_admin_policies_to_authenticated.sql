-- Policies that call private.has_role must only be evaluated for the
-- authenticated role; anon has no EXECUTE on it, which raised
-- "permission denied for function has_role" on anonymous requests.
DROP POLICY IF EXISTS "Admins gerem alojamentos" ON public.alojamentos;
CREATE POLICY "Admins gerem alojamentos" ON public.alojamentos
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins gerem convidados" ON public.convidados;
CREATE POLICY "Admins gerem convidados" ON public.convidados
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins gerem despesas" ON public.despesas;
CREATE POLICY "Admins gerem despesas" ON public.despesas
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins gerem entradas" ON public.entradas;
CREATE POLICY "Admins gerem entradas" ON public.entradas
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins gerem fornecedores" ON public.fornecedores;
CREATE POLICY "Admins gerem fornecedores" ON public.fornecedores
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins gerem menu" ON public.menu;
CREATE POLICY "Admins gerem menu" ON public.menu
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins gerem mesas" ON public.mesas;
CREATE POLICY "Admins gerem mesas" ON public.mesas
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins gerem prendas" ON public.prendas;
CREATE POLICY "Admins gerem prendas" ON public.prendas
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins gerem tarefas" ON public.tarefas;
CREATE POLICY "Admins gerem tarefas" ON public.tarefas
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
