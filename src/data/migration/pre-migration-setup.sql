-- ============================================================================
-- PRE-MIGRATION SETUP: Prepare PostgreSQL for DMS Migration
-- ============================================================================
-- Run this BEFORE starting AWS DMS migration
--
-- USAGE:
--   psql -h your-postgres-host -U postgres -d flashcards -f pre-migration-setup.sql
-- ============================================================================

-- Create mysql_dump schema for DMS to load data into
CREATE SCHEMA IF NOT EXISTS mysql_dump;

-- Grant permissions to DMS user (replace 'dms_user' with your actual DMS user)
GRANT ALL ON SCHEMA mysql_dump TO dms_user;
GRANT ALL ON ALL TABLES IN SCHEMA mysql_dump TO dms_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA mysql_dump TO dms_user;

-- Confirmation message
SELECT '
╔════════════════════════════════════════════════════════════════════════╗
║                                                                        ║
║  ✓ PRE-MIGRATION SETUP COMPLETE                                       ║
║                                                                        ║
║  Created:                                                             ║
║  - mysql_dump schema                                                  ║
║  - DMS user permissions                                               ║
║                                                                        ║
║  Next Steps:                                                          ║
║  1. Configure AWS DMS task with dms-mysql-to-postgres-mysql-dump.json║
║  2. Run DMS migration (MySQL → PostgreSQL mysql_dump schema)          ║
║  3. Validate mysql_dump data                                          ║
║  4. Run post-migration-transform.sql                                  ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝
' AS status;
