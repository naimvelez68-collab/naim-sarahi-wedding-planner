-- =========================================================
-- WEDDING PLANNER - Naim & Sarahí 2026
-- Ejecuta este SQL en Supabase → SQL Editor → New Query
-- =========================================================

-- Tabla principal (un solo registro con todos los datos en JSON)
CREATE TABLE IF NOT EXISTS wedding_data (
  id             TEXT        PRIMARY KEY DEFAULT 'main',
  config         JSONB       DEFAULT '{}',
  guests         JSONB       DEFAULT '[]',
  tables         JSONB       DEFAULT '[]',
  budget_items   JSONB       DEFAULT '[]',
  vendors        JSONB       DEFAULT '[]',
  tasks          JSONB       DEFAULT '[]',
  day_schedule   JSONB       DEFAULT '[]',
  ceremony       JSONB       DEFAULT '[]',
  games          JSONB       DEFAULT '[]',
  music          JSONB       DEFAULT '[]',
  mc_script      JSONB       DEFAULT '[]',
  photos         JSONB       DEFAULT '[]',
  plan_b         JSONB       DEFAULT '[]',
  responsibles   JSONB       DEFAULT '[]',
  shopping       JSONB       DEFAULT '[]',
  emergency_kit  JSONB       DEFAULT '[]',
  quotes         JSONB       DEFAULT '[]',
  bocaditos      JSONB       DEFAULT '[]',
  beverages      JSONB       DEFAULT '[]',
  savings        JSONB       DEFAULT '[]',
  is_initialized BOOLEAN     DEFAULT false,
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE wedding_data ENABLE ROW LEVEL SECURITY;

-- Política: acceso libre (la URL es el "secreto")
-- Si quieres proteger con contraseña, cambia esto después.
CREATE POLICY "wedding_open_access"
  ON wedding_data
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Habilitar Realtime (para que los cambios se sincronicen en vivo)
ALTER PUBLICATION supabase_realtime ADD TABLE wedding_data;

-- Confirmar que quedó bien
SELECT 'Tabla wedding_data creada correctamente ✅' AS resultado;
