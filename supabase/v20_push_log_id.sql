-- Link announcement notifications to their push log entry for read tracking
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS push_log_id UUID REFERENCES push_notifications_log(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS notifications_push_log_id_idx ON notifications(push_log_id);
