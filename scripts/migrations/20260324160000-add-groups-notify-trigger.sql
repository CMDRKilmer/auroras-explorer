CREATE OR REPLACE FUNCTION notify_groups_changed() RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('groups_changed', COALESCE(NEW.fio_group_id, OLD.fio_group_id));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER groups_changed_trigger
  AFTER INSERT OR UPDATE OR DELETE ON groups
  FOR EACH ROW EXECUTE FUNCTION notify_groups_changed();
