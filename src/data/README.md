# MySQL to PostgreSQL Migration - Complete Package

## 📁 Directory Structure

```
/src/data/
├── dms/
│   └── dms-mysql-to-postgres-mysql-dump.json    # AWS DMS table mapping rules
├── migration/
│   ├── pre-migration-setup.sql               # Run BEFORE DMS migration
│   └── post-migration-transform.sql          # Run AFTER DMS migration
├── docs/
│   └── schema-mapping.json                   # Complete schema reference
├── cram-mysql.sql                            # Original MySQL DDL (reference)
└── README.md                                 # This file
```

## 🚀 Quick Start

### Step 1: Pre-Migration Setup (2 minutes)

```bash
psql -h postgres-host -U postgres -d flashcards \
  -f migration/pre-migration-setup.sql
```

Creates `mysql_dump` schema and sets permissions.

### Step 2: AWS DMS Migration (1-2 hours)

**AWS Console:**
1. DMS → Database migration tasks → Create task
2. Task identifier: `flashcards-mysql-to-mysql-dump`
3. Migration type: **Migrate existing data**
4. Table mappings → JSON editor → Paste contents of `dms/dms-mysql-to-postgres-mysql-dump.json`
5. Start task

**AWS CLI:**
```bash
aws dms create-replication-task \
  --replication-task-identifier flashcards-mysql-to-mysql-dump \
  --source-endpoint-arn arn:aws:dms:...:endpoint:mysql-source \
  --target-endpoint-arn arn:aws:dms:...:endpoint:postgres-target \
  --replication-instance-arn arn:aws:dms:...:rep:instance \
  --migration-type full-load \
  --table-mappings file://dms/dms-mysql-to-postgres-mysql-dump.json
```

### Step 3: Validate mysql_dump (5 minutes)

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'mysql_dump' ORDER BY table_name;

-- Check row counts
SELECT 'fc_categories' AS table, COUNT(*) FROM mysql_dump.fc_categories
UNION ALL SELECT 'fc_image', COUNT(*) FROM mysql_dump.fc_image
UNION ALL SELECT 'fc_jewel_scores', COUNT(*) FROM mysql_dump.fc_jewel_scores
UNION ALL SELECT 'fc_jewel_score_totals', COUNT(*) FROM mysql_dump.fc_jewel_score_totals
UNION ALL SELECT 'fc_stellarspeller_scores', COUNT(*) FROM mysql_dump.fc_stellarspeller_scores
UNION ALL SELECT 'fc_stellarspeller_score_totals', COUNT(*) FROM mysql_dump.fc_stellarspeller_score_totals
UNION ALL SELECT 'fc_payment_subscriptions', COUNT(*) FROM mysql_dump.fc_payment_subscriptions
UNION ALL SELECT 'fc_payment_transaction_log', COUNT(*) FROM mysql_dump.fc_payment_transaction_log
UNION ALL SELECT 'fc_user_social', COUNT(*) FROM mysql_dump.fc_user_social
UNION ALL SELECT 'fc_users', COUNT(*) FROM mysql_dump.fc_users
UNION ALL SELECT 'user_cancellation_reason_log', COUNT(*) FROM mysql_dump.user_cancellation_reason_log;
```

### Step 4: Transform to Production (15-30 minutes)

```bash
psql -h postgres-host -U postgres -d flashcards \
  -f migration/post-migration-transform.sql
```

**What it does:**
- Creates ENUM types (4 types)
- Creates production tables (9 tables)
- Transforms and loads data from mysql_dump
- Consolidates gaming tables (4 → 2)
- Creates indexes (12 indexes)
- Adds foreign keys (4 constraints)
- Creates triggers (2 triggers)
- Resets sequences (8 sequences)
- **Validates data automatically** ✓

### Step 5: Review Validation Results

The script outputs validation results automatically. Look for ✓ or ✗ for each table.

---

## 📊 Migration Overview

### Tables Migrated

| MySQL Table | PostgreSQL Table | Method | Notes |
|-------------|------------------|--------|-------|
| fc_categories | categories | Transform | Renamed |
| fc_image | image | Transform | Renamed, ENUM types |
| fc_jewel_scores | gaming_scores | **Consolidate** | Added game_type='jewel' |
| fc_stellarspeller_scores | gaming_scores | **Consolidate** | Added game_type='stellarspeller' |
| fc_jewel_score_totals | gaming_totals | **Consolidate** | Added game_type='jewel' |
| fc_stellarspeller_score_totals | gaming_totals | **Consolidate** | Added game_type='stellarspeller' |
| fc_payment_subscriptions | payment_subscriptions | Transform | Renamed, 26 columns removed |
| fc_payment_transaction_log | payment_transaction_log | Transform | Renamed, 7 columns removed |
| fc_user_social | user_social | Transform | Renamed |
| fc_users | users | Transform | Renamed, 5 columns removed |
| user_cancellation_reason_log | user_cancellation_reason_log | Transform | Column renaming |

**Result**: 11 MySQL tables → 9 PostgreSQL tables

### Key Transformations

1. **Gaming Table Consolidation**: 4 tables → 2 tables with `game_type` discriminator
2. **Column Renaming**: camelCase → snake_case, descriptive names
3. **Data Type Conversions**: INT → INTEGER, DATETIME → TIMESTAMP, TINYINT(1) → BOOLEAN
4. **ENUM Types**: MySQL ENUMs → PostgreSQL custom ENUM types
5. **Column Cleanup**: Removed 33 unused/redundant fields

---

## 📁 File Details

### `/dms/dms-mysql-to-postgres-staging.json`

**Purpose**: AWS DMS table mapping rules  
**Size**: 4KB  
**Rules**: 13 rules (11 table selections + 1 schema transformation + 1 exclusion)

**What it does:**
- Selects 11 tables for migration
- Moves all tables to `mysql_dump` schema
- Excludes 33 legacy tables

### `/migration/pre-migration-setup.sql`

**Purpose**: Prepare PostgreSQL before DMS migration  
**Size**: 2KB  
**Run**: BEFORE DMS migration

**What it does:**
- Creates `mysql_dump` schema
- Grants DMS user permissions

### `/migration/post-migration-transform.sql`

**Purpose**: Transform staging → production schema  
**Size**: 17KB  
**Run**: AFTER DMS migration completes

**What it does:**
- Phase 1: Creates ENUM types (4 types)
- Phase 2: Creates target tables (9 tables)
- Phase 3: Transforms and loads data from mysql_dump
- Phase 4: Creates indexes (12 indexes)
- Phase 5: Adds foreign keys (4 constraints)
- Phase 6: Creates triggers (2 triggers)
- Phase 7: Resets sequences (8 sequences)
- Phase 8: Validates data (automatic checks)

### `/docs/schema-mapping.json`

**Purpose**: Complete schema reference (source of truth)  
**Size**: ~10KB  
**Format**: JSON

**Contents:**
- Complete field-by-field mapping for all 9 tables
- ENUM type definitions
- MySQL → PostgreSQL type conversions
- Column rename mappings
- Summary statistics

**Usage:**
```typescript
import schemaMapping from '../../../data/docs/schema-mapping.json';
const tables = schemaMapping.tables;
const enumTypes = schemaMapping.enumTypes;
```

### `/cram-mysql.sql`

**Purpose**: Original MySQL DDL (reference only)  
**Size**: 24KB  
**Note**: Do not modify - this is the source schema

---

## ⏱️ Timeline & Cost

### Timeline
- Pre-migration setup: **2 minutes**
- DMS migration: **1-2 hours** (depends on data volume)
- Validation: **5 minutes**
- Transformation: **15-30 minutes**
- Testing: **30 minutes**
- **Total: 2-3 hours**

### Cost (AWS DMS)
- Instance: `dms.t3.medium` @ $0.146/hour
- Duration: ~2 hours
- **Total: ~$0.30**

💡 **Tip**: Delete DMS instance after migration to avoid ongoing charges.

---

## ✅ Validation

The transformation script automatically validates:

- ✓ Row counts match (mysql_dump vs production)
- ✓ Gaming scores consolidated correctly
- ✓ Gaming totals consolidated correctly
- ✓ Game type distribution (jewel vs stellarspeller)

**Example output:**
```
table_name                  staging  production  match
--------------------------  -------  ----------  -----
categories                  150      150         ✓
image                       5000     5000        ✓
gaming_scores               10000    10000       ✓
...
```

---

## 🐛 Troubleshooting

### DMS Migration Fails

**Error**: Cannot connect to endpoint

**Solution**:
```sql
CREATE SCHEMA IF NOT EXISTS mysql_dump;
GRANT ALL ON SCHEMA mysql_dump TO dms_user;
```

### Transformation Fails

**Error**: Type "img_ext" does not exist

**Solution**: Check ENUM values in mysql_dump match PostgreSQL definitions:
```sql
SELECT DISTINCT extension FROM mysql_dump.fc_image;
SELECT DISTINCT access FROM mysql_dump.fc_image;
SELECT DISTINCT status FROM mysql_dump.fc_payment_subscriptions;
SELECT DISTINCT status FROM mysql_dump.fc_users;
```

### Row Count Mismatch

**Solution**: Check for duplicates or NULL values:
```sql
-- Check for duplicates
SELECT set_id, user_id, COUNT(*) 
FROM mysql_dump.fc_jewel_scores 
GROUP BY set_id, user_id 
HAVING COUNT(*) > 1;

-- Check for NULLs
SELECT COUNT(*) FROM mysql_dump.fc_users WHERE email IS NULL;
```

---

## 🧹 Cleanup

After successful migration and thorough testing:

### Option 1: Keep mysql_dump (Recommended)
Keep mysql_dump schema as backup/reference. Minimal storage cost.

### Option 2: Drop mysql_dump
```sql
-- Only after extensive testing!
DROP SCHEMA mysql_dump CASCADE;
VACUUM FULL;
```

---

## 📝 Notes

### Two-Stage Migration Benefits

1. ✅ **Safer**: Original MySQL data preserved in mysql_dump
2. ✅ **Simpler DMS**: Just copy tables (13 rules vs 64 rules)
3. ✅ **All tables via DMS**: Including gaming tables (no manual migration)
4. ✅ **Flexible**: PostgreSQL transformations more powerful than DMS
5. ✅ **Testable**: Validate mysql_dump before production
6. ✅ **Rollback**: Easy - just re-run transformation script

### What's in mysql_dump Schema

Exact copy of MySQL tables:
- `mysql_dump.fc_categories`
- `mysql_dump.fc_image`
- `mysql_dump.fc_jewel_scores`
- `mysql_dump.fc_jewel_score_totals`
- `mysql_dump.fc_stellarspeller_scores`
- `mysql_dump.fc_stellarspeller_score_totals`
- `mysql_dump.fc_payment_subscriptions`
- `mysql_dump.fc_payment_transaction_log`
- `mysql_dump.fc_user_social`
- `mysql_dump.fc_users`
- `mysql_dump.user_cancellation_reason_log`

### What's in Production Schema

Transformed tables:
- `public.categories` (or `cram.categories`)
- `public.image`
- `public.gaming_scores` (consolidated)
- `public.gaming_totals` (consolidated)
- `public.payment_subscriptions`
- `public.payment_transaction_log`
- `public.user_social`
- `public.users`
- `public.user_cancellation_reason_log`

### Changing Target Schema

To use `cram` schema instead of `public`:

Edit `migration/post-migration-transform.sql`:
```sql
-- Change this line:
\set target_schema 'public'

-- To:
\set target_schema 'cram'
```

---

## 📚 Additional Resources

- [AWS DMS User Guide](https://docs.aws.amazon.com/dms/latest/userguide/)
- [Table Mapping Rules](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Tasks.CustomizingTasks.TableMapping.html)
- Your documentation:
  - `/docs/mysql-to-postgres-migration/page.tsx`
  - `/docs/mysql-to-postgres-schema-mapping/page.tsx`

---

## 🎯 Summary

**This package provides:**
1. ✅ Simplified DMS migration (all tables to mysql_dump)
2. ✅ Powerful PostgreSQL transformations (mysql_dump to production)
3. ✅ Complete automation (2 SQL scripts + 1 DMS task)
4. ✅ Built-in validation (automatic checks)
5. ✅ Safe rollback (mysql_dump preserved)

**Total effort**: 2-3 hours, mostly automated  
**Total cost**: ~$0.30 (DMS instance)  
**Risk level**: Very low (two-stage with validation)

---

**Ready to migrate?** Start with Step 1 above! 🚀
