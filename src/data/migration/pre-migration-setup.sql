-- ============================================================================
-- PRE-MIGRATION SETUP: Prepare PostgreSQL for DMS Migration
-- ============================================================================
-- Run this BEFORE starting AWS DMS migration
--
-- USAGE:
--   psql -h your-postgres-host -U postgres -d flashcards -f pre-migration-setup.sql
-- ============================================================================

-- Create staging schema for DMS to load data into
CREATE SCHEMA IF NOT EXISTS staging;

-- Grant permissions to DMS user (replace 'dms_user' with your actual DMS user)
GRANT ALL ON SCHEMA staging TO dms_user;
GRANT ALL ON ALL TABLES IN SCHEMA staging TO dms_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA staging TO dms_user;

-- Confirmation message
SELECT '
╔════════════════════════════════════════════════════════════════════════╗
║                                                                        ║
║  ✓ PRE-MIGRATION SETUP COMPLETE                                       ║
║                                                                        ║
║  Created:                                                             ║
║  - staging schema                                                     ║
║  - DMS user permissions                                               ║
║                                                                        ║
║  Next Steps:                                                          ║
║  1. Configure AWS DMS task with dms-mysql-to-postgres-staging.json   ║
║  2. Run DMS migration (MySQL → PostgreSQL staging schema)             ║
║  3. Validate staging data                                             ║
║  4. Run post-migration-transform.sql                                  ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝
' AS status;
