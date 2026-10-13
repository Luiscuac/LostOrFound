/*
# Create lost_items table for Lost or Found campus catalog

1. New Tables
- `lost_items`: stores all lost/found objects in the campus catalog.
  - `id` (uuid, primary key, auto-generated)
  - `name` (text, not null) — object name
  - `description` (text, not null) — detailed description
  - `category` (text, not null) — one of: Electronicos, Ropa, Documentos, Mochilas/Bolsos, Llaves, Otros
  - `status` (text, not null, default 'Disponible') — one of: Disponible, Reclamado, Entregado
  - `image_url` (text, not null) — main image URL
  - `gallery` (jsonb, default '[]') — array of additional image URLs
  - `location` (text, not null) — where the object was found
  - `found_date` (date, not null) — date the object was found
  - `claimant_ci` (text, nullable) — CI of person who claimed the object
  - `claimant_full_name` (text, nullable) — full name of claimer
  - `claimant_carrera` (text, nullable) — career/major of claimer
  - `claimant_phone` (text, nullable) — phone of claimer
  - `claimant_returned_at` (timestamptz, nullable) — date/time the object was returned
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `lost_items`.
- Public can read all items (catalog is open without login) — `TO anon, authenticated`.
- Only authenticated staff can insert, update, and delete items.
- This matches the app design: students browse without login, staff manages with login.

3. Indexes
- Index on `status` for filtering by availability.
- Index on `category` for category filter queries.
*/

CREATE TABLE IF NOT EXISTS lost_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('Electronicos', 'Ropa', 'Documentos', 'Mochilas/Bolsos', 'Llaves', 'Otros')),
  status text NOT NULL DEFAULT 'Disponible' CHECK (status IN ('Disponible', 'Reclamado', 'Entregado')),
  image_url text NOT NULL,
  gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  location text NOT NULL,
  found_date date NOT NULL,
  claimant_ci text,
  claimant_full_name text,
  claimant_carrera text,
  claimant_phone text,
  claimant_returned_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE lost_items ENABLE ROW LEVEL SECURITY;

-- Public read: anyone can browse the catalog (no login required)
DROP POLICY IF EXISTS "public_read_items" ON lost_items;
CREATE POLICY "public_read_items"
ON lost_items FOR SELECT
TO anon, authenticated
USING (true);

-- Staff insert: only authenticated users can register new items
DROP POLICY IF EXISTS "staff_insert_items" ON lost_items;
CREATE POLICY "staff_insert_items"
ON lost_items FOR INSERT
TO authenticated
WITH CHECK (true);

-- Staff update: only authenticated users can edit items
DROP POLICY IF EXISTS "staff_update_items" ON lost_items;
CREATE POLICY "staff_update_items"
ON lost_items FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

-- Staff delete: only authenticated users can delete items
DROP POLICY IF EXISTS "staff_delete_items" ON lost_items;
CREATE POLICY "staff_delete_items"
ON lost_items FOR DELETE
TO authenticated
USING (true);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_lost_items_status ON lost_items(status);
CREATE INDEX IF NOT EXISTS idx_lost_items_category ON lost_items(category);
