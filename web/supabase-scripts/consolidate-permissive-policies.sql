-- Resolves "Multiple Permissive Policies" by consolidating them into singular OR-based policies per role/command.
-- Resolves "Unindexed foreign keys" by recreating index idx_lesson_views_lesson_id

-- 1. Combine overlapping policies on course_materials
DROP POLICY IF EXISTS "Anyone can view published course materials" ON course_materials;
DROP POLICY IF EXISTS "Course owners can manage materials" ON course_materials;

CREATE POLICY "Course materials are viewable by everyone" ON course_materials FOR SELECT USING (true);
CREATE POLICY "Course owners can insert materials" ON course_materials FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM courses c JOIN tenants t ON c.tenant_id = t.id WHERE c.id = course_id AND t.owner_id = (select auth.uid())));
CREATE POLICY "Course owners can update materials" ON course_materials FOR UPDATE USING (EXISTS (SELECT 1 FROM courses c JOIN tenants t ON c.tenant_id = t.id WHERE c.id = course_id AND t.owner_id = (select auth.uid())));
CREATE POLICY "Course owners can delete materials" ON course_materials FOR DELETE USING (EXISTS (SELECT 1 FROM courses c JOIN tenants t ON c.tenant_id = t.id WHERE c.id = course_id AND t.owner_id = (select auth.uid())));

-- 2. Combine on courses
DROP POLICY IF EXISTS "Published courses are viewable by everyone" ON courses;
DROP POLICY IF EXISTS "Tenant owners can manage their courses" ON courses;

CREATE POLICY "Users and Owners can view courses" ON courses FOR SELECT USING ( (is_published = true) OR (EXISTS ( SELECT 1 FROM tenants t WHERE ((t.id = courses.tenant_id) AND (t.owner_id = (select auth.uid()))))) );
CREATE POLICY "Tenant owners can insert courses" ON courses FOR INSERT WITH CHECK ( EXISTS (SELECT 1 FROM tenants t WHERE ((t.id = courses.tenant_id) AND (t.owner_id = (select auth.uid())))) );
CREATE POLICY "Tenant owners can update courses" ON courses FOR UPDATE USING ( EXISTS (SELECT 1 FROM tenants t WHERE ((t.id = courses.tenant_id) AND (t.owner_id = (select auth.uid())))) );
CREATE POLICY "Tenant owners can delete courses" ON courses FOR DELETE USING ( EXISTS (SELECT 1 FROM tenants t WHERE ((t.id = courses.tenant_id) AND (t.owner_id = (select auth.uid())))) );

-- 3. Combine on enrollments
DROP POLICY IF EXISTS "Tenant owners can view student enrollments" ON enrollments;
DROP POLICY IF EXISTS "Users can view own enrollments" ON enrollments;

CREATE POLICY "Users and Owners can view enrollments" ON enrollments FOR SELECT USING ( (user_id = (select auth.uid())) OR (EXISTS ( SELECT 1 FROM courses c JOIN tenants t ON t.id = c.tenant_id WHERE c.id = course_id AND t.owner_id = (select auth.uid()))) );

-- 4. Combine on lessons
DROP POLICY IF EXISTS "Enrolled students can read lessons" ON lessons;
DROP POLICY IF EXISTS "Tenant owners can manage lessons" ON lessons;

CREATE POLICY "Enrolled students and Owners can view lessons" ON lessons FOR SELECT USING ( (EXISTS ( SELECT 1 FROM enrollments e WHERE ((e.course_id = lessons.course_id) AND (e.user_id = (select auth.uid())) AND (e.status = 'active'::text)))) OR (EXISTS (SELECT 1 FROM courses c JOIN tenants t ON t.id = c.tenant_id WHERE c.id = course_id AND t.owner_id = (select auth.uid()))) );
CREATE POLICY "Tenant owners can insert lessons" ON lessons FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM courses c JOIN tenants t ON t.id = c.tenant_id WHERE c.id = course_id AND t.owner_id = (select auth.uid())));
CREATE POLICY "Tenant owners can update lessons" ON lessons FOR UPDATE USING (EXISTS (SELECT 1 FROM courses c JOIN tenants t ON t.id = c.tenant_id WHERE c.id = course_id AND t.owner_id = (select auth.uid())));
CREATE POLICY "Tenant owners can delete lessons" ON lessons FOR DELETE USING (EXISTS (SELECT 1 FROM courses c JOIN tenants t ON t.id = c.tenant_id WHERE c.id = course_id AND t.owner_id = (select auth.uid())));

-- 5. Combine on progress
DROP POLICY IF EXISTS "Tenant owners can view student progress" ON progress;
DROP POLICY IF EXISTS "Users can manage own progress" ON progress;

CREATE POLICY "Users and Owners can view progress" ON progress FOR SELECT USING ( (user_id = (select auth.uid())) OR (EXISTS ( SELECT 1 FROM lessons l JOIN courses c ON c.id = l.course_id JOIN tenants t ON t.id = c.tenant_id WHERE l.id = lesson_id AND t.owner_id = (select auth.uid()))) );
CREATE POLICY "Users can insert progress" ON progress FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update progress" ON progress FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can delete progress" ON progress FOR DELETE USING (user_id = (select auth.uid()));

-- 6. Combine on subscriptions
DROP POLICY IF EXISTS "Users can read own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON subscriptions;

CREATE POLICY "Users and Admins can view subscriptions" ON subscriptions FOR SELECT USING ( ((select auth.uid()) = user_id) OR (get_user_role((select auth.uid())) = 'admin') );
CREATE POLICY "Admins can insert subscriptions" ON subscriptions FOR INSERT WITH CHECK (get_user_role((select auth.uid())) = 'admin');
CREATE POLICY "Admins can update subscriptions" ON subscriptions FOR UPDATE USING (get_user_role((select auth.uid())) = 'admin');
CREATE POLICY "Admins can delete subscriptions" ON subscriptions FOR DELETE USING (get_user_role((select auth.uid())) = 'admin');

-- 7. Combine on tenants
DROP POLICY IF EXISTS "Tenants are viewable by everyone" ON tenants;
DROP POLICY IF EXISTS "Admins can manage all tenants" ON tenants;
DROP POLICY IF EXISTS "Owners can manage their tenants" ON tenants;
DROP POLICY IF EXISTS "Admins can delete tenants" ON tenants;
DROP POLICY IF EXISTS "Users can create their own tenant application" ON tenants;

CREATE POLICY "Tenants are viewable by everyone" ON tenants FOR SELECT USING (true);
CREATE POLICY "Users and Admins can insert tenants" ON tenants FOR INSERT WITH CHECK ( ((select auth.uid()) = owner_id) OR (get_user_role((select auth.uid())) = 'admin') );
CREATE POLICY "Owners and Admins can update tenants" ON tenants FOR UPDATE USING ( ((select auth.uid()) = owner_id) OR (get_user_role((select auth.uid())) = 'admin') );
CREATE POLICY "Owners and Admins can delete tenants" ON tenants FOR DELETE USING ( ((select auth.uid()) = owner_id) OR (get_user_role((select auth.uid())) = 'admin') );

-- 8. Combine on transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Tenant owners can view course transactions" ON transactions;

CREATE POLICY "Users and Owners can view transactions" ON transactions FOR SELECT USING ( (user_id = (select auth.uid())) OR (EXISTS (SELECT 1 FROM courses c JOIN tenants t ON t.id = c.tenant_id WHERE c.id = transactions.course_id AND t.owner_id = (select auth.uid()))) );

-- 9. Combine on users
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;

CREATE POLICY "Users and Admins can view users" ON users FOR SELECT USING ( (id = (select auth.uid())) OR (get_user_role((select auth.uid())) = 'admin') );

-- 10. Fix lesson views index
CREATE INDEX IF NOT EXISTS idx_lesson_views_lesson_id ON lesson_views(lesson_id);
