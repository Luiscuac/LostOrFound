/*
# Revoke write privileges from anon role on lost_items

The RLS policies already block anon from inserting/updating/deleting,
but the table grants still allow it. Revoke those grants so anon can
only SELECT (read the public catalog). Authenticated staff keep full CRUD.
*/

REVOKE INSERT, UPDATE, DELETE ON lost_items FROM anon;
