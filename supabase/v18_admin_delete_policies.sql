-- Allow admin/pastor to delete groups, prayer rooms, prayer requests, and contact messages

CREATE POLICY "admin_delete_groups" ON groups
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'pastor'))
  );

CREATE POLICY "admin_delete_rooms" ON rooms
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'pastor'))
    OR created_by = auth.uid()
  );

CREATE POLICY "admin_delete_prayer_requests" ON prayer_requests
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'pastor'))
    OR user_id = auth.uid()
  );

CREATE POLICY "admin_delete_prayer_participants" ON prayer_participants
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'pastor'))
    OR user_id = auth.uid()
  );

CREATE POLICY "admin_delete_contact_messages" ON contact_messages
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'pastor'))
  );
