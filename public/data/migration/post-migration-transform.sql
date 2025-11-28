-- ============================================================================
-- POST-MIGRATION TRANSFORMATION: mysql_dump → public (or cram)
-- ============================================================================
-- Run this AFTER AWS DMS migration completes
--
-- This script:
-- 1. Creates ENUM types
-- 2. Creates final table schemas (9 tables)
-- 3. Transforms and loads data from mysql_dump
-- 4. Consolidates gaming tables (4 → 2)
-- 5. Creates indexes, foreign keys, triggers
-- 6. Resets sequences
-- 7. Validates data
--
-- USAGE:
--   psql -h your-postgres-host -U postgres -d flashcards -f post-migration-transform.sql
-- ============================================================================

-- Set target schema (change to 'cram' if needed)
\set target_schema 'public'

SET search_path TO :target_schema;

-- ============================================================================
-- PHASE 1: Create ENUM Types
-- ============================================================================

CREATE TYPE img_ext AS ENUM ('jpeg', 'jpg', 'png', 'gif');
CREATE TYPE img_access AS ENUM ('private', 'public', 'inactive', 'deleted');
CREATE TYPE sub_status AS ENUM ('new', 'active', 'canceled', 'expired');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'pending', 'deleted');

-- ============================================================================
-- PHASE 2: Create Target Tables
-- ============================================================================

-- Table 1: Categories
CREATE TABLE categories (
    category_id SMALLSERIAL PRIMARY KEY,
    site_id INTEGER,
    parent VARCHAR(128),
    slug VARCHAR(128),
    title VARCHAR(128),
    count INTEGER
);

-- Table 2: Image
CREATE TABLE image (
    image_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    src VARCHAR(255),
    extension img_ext,
    hash VARCHAR(32),
    provider VARCHAR(255),
    description TEXT,
    access img_access,
    meta TEXT,
    creator_id INTEGER,
    created TIMESTAMP
);

-- Table 3: Gaming Totals (Consolidated)
CREATE TABLE gaming_totals (
    id SERIAL PRIMARY KEY,
    set_id INTEGER NOT NULL,
    game_type VARCHAR(50) NOT NULL,
    num_scores INTEGER DEFAULT 0 NOT NULL,
    sum_scores INTEGER DEFAULT 0 NOT NULL,
    UNIQUE (set_id, game_type)
);

-- Table 4: Gaming Scores (Consolidated)
CREATE TABLE gaming_scores (
    id SERIAL PRIMARY KEY,
    game_type VARCHAR(50) NOT NULL,
    score INTEGER,
    name VARCHAR(31),
    accuracy VARCHAR(31),
    user_id INTEGER DEFAULT 0,
    created TIMESTAMP NOT NULL,
    set_id INTEGER,
    time INTEGER NOT NULL,
    UNIQUE (set_id, user_id, game_type)
);

-- Table 5: Payment Subscriptions
CREATE TABLE payment_subscriptions (
    subscription_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    external_id VARCHAR(255), -- Keep generic, not stripe_subscription_id
    status sub_status,
    plan VARCHAR(100),        -- Keep as plan, not plan_name
    amount INTEGER,
    currency VARCHAR(3),
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    canceled_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Table 6: Payment Transaction Log
CREATE TABLE payment_transaction_log (
    transaction_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    session_trans_id VARCHAR(255), -- Keep original name
    status INTEGER,
    request TEXT,  -- Keep original name
    response TEXT, -- Keep original name
    created_at TIMESTAMP
);

-- Table 7: User Social
CREATE TABLE user_social (
    user_id INTEGER NOT NULL,
    social_type VARCHAR(16) NOT NULL,
    social_id VARCHAR(32) NOT NULL,
    converted BOOLEAN,
    meta TEXT,
    created TIMESTAMP,
    updated TIMESTAMP,
    site_id SMALLINT DEFAULT 100 NOT NULL,
    PRIMARY KEY (user_id, social_type, social_id)
);

-- Table 8: Users
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    email VARCHAR(255),
    password_hash VARCHAR(255), -- Source was 40 (SHA1), 255 allows for Bcrypt/Argon2 upgrades
    status user_status,
    last_login TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Table 9: User Cancellation Reason Log
CREATE TABLE user_cancellation_reason_log (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    reason_id SMALLINT,   -- Maps to reasonId (tinyint) from MySQL
    reason_text TEXT,     -- Maps to reasonText from MySQL
    created_at TIMESTAMP
);

-- ============================================================================
-- PHASE 3: Transform and Load Data from Staging
-- ============================================================================

-- Categories (simple copy)
INSERT INTO categories (category_id, site_id, parent, slug, title, count)
SELECT category_id, site_id, parent, slug, title, count
FROM mysql_dump.fc_categories;

-- Image (with ENUM casting)
INSERT INTO image (image_id, title, src, extension, hash, provider, description, access, meta, creator_id, created)
SELECT 
    image_id, title, src, extension::img_ext, hash, provider, 
    description, access::img_access, meta, creator_id, created
FROM mysql_dump.fc_image;

-- Gaming Totals (consolidate jewel + stellarspeller)
INSERT INTO gaming_totals (set_id, game_type, num_scores, sum_scores)
SELECT set_id, 'jewel', num_scores, sum_scores FROM mysql_dump.fc_jewel_score_totals
UNION ALL
SELECT set_id, 'stellarspeller', num_scores, sum_scores FROM mysql_dump.fc_stellarspeller_score_totals;

-- Gaming Scores (consolidate jewel + stellarspeller)
INSERT INTO gaming_scores (game_type, score, name, accuracy, user_id, created, set_id, time)
SELECT 'jewel', score, name, accuracy, user_id, created, set_id, time FROM mysql_dump.fc_jewel_scores
UNION ALL
SELECT 'stellarspeller', score, name, accuracy, user_id, created, set_id, time FROM mysql_dump.fc_stellarspeller_scores;

-- Payment Subscriptions (transform - only use fields that exist in MySQL)
INSERT INTO payment_subscriptions (
    subscription_id, user_id, external_id, status, plan,
    amount, currency, current_period_start, current_period_end,
    canceled_at, created_at, updated_at
)
SELECT 
    id, user_id, external_id, status::sub_status, plan,
    amount, currency, current_period_started, current_period_ends,
    canceled, activated, updated
FROM mysql_dump.fc_payment_subscriptions;

-- Payment Transaction Log (only use fields that exist in MySQL)
INSERT INTO payment_transaction_log (
    transaction_id, user_id, session_trans_id, status, request, response, created_at
)
SELECT 
    id, user_id, session_trans_id, status, request, response, created
FROM mysql_dump.fc_payment_transaction_log;

-- User Social (simple copy with boolean conversion)
INSERT INTO user_social (user_id, social_type, social_id, converted, meta, created, updated, site_id)
SELECT 
    user_id, social_type, social_id, 
    CASE WHEN converted = 1 THEN true ELSE false END,
    meta, created, updated, site_id
FROM mysql_dump.fc_user_social;

-- Users (only use fields that exist in MySQL)
INSERT INTO users (
    user_id, username, email, password_hash, status,
    last_login, created_at, updated_at
)
SELECT 
    id, username, email, password, status::user_status,
    last_login_date, date_joined, updated
FROM mysql_dump.fc_users;

-- User Cancellation Reason Log (camelCase to snake_case)
INSERT INTO user_cancellation_reason_log (log_id, user_id, reason_id, reason_text, created_at)
SELECT 
    "logId", 
    "userId",
    "reasonId"::smallint, -- Keep as numeric (tinyint -> smallint)
    "reasonText",         -- Maps to reason_text
    to_timestamp("createdAt")
FROM mysql_dump.user_cancellation_reason_log;

-- ============================================================================
-- PHASE 4: Create Indexes
-- ============================================================================

CREATE INDEX idx_categories_slug ON categories (slug);
CREATE INDEX idx_gaming_totals_set ON gaming_totals (set_id, game_type);
CREATE INDEX idx_gaming_scores_user ON gaming_scores (user_id, game_type);
CREATE INDEX idx_gaming_scores_set ON gaming_scores (set_id, game_type);
CREATE INDEX idx_gaming_scores_created ON gaming_scores (created);
CREATE INDEX idx_subscription_user ON payment_subscriptions (user_id);
CREATE INDEX idx_transaction_user ON payment_transaction_log (user_id);
CREATE INDEX idx_transaction_status ON payment_transaction_log (status);
CREATE INDEX idx_user_social_site ON user_social (site_id);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_username ON users (username);
CREATE INDEX idx_cancellation_user ON user_cancellation_reason_log (user_id);

-- ============================================================================
-- PHASE 5: Add Foreign Key Constraints
-- ============================================================================

ALTER TABLE payment_subscriptions 
  ADD CONSTRAINT fk_subscription_user 
  FOREIGN KEY (user_id) REFERENCES users(user_id);

ALTER TABLE payment_transaction_log 
  ADD CONSTRAINT fk_transaction_user 
  FOREIGN KEY (user_id) REFERENCES users(user_id);

ALTER TABLE user_social 
  ADD CONSTRAINT fk_user_social_user 
  FOREIGN KEY (user_id) REFERENCES users(user_id);

ALTER TABLE user_cancellation_reason_log 
  ADD CONSTRAINT fk_cancellation_user 
  FOREIGN KEY (user_id) REFERENCES users(user_id);

-- ============================================================================
-- PHASE 6: Create Triggers
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payment_subscriptions_updated_at 
  BEFORE UPDATE ON payment_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PHASE 7: Reset Sequences
-- ============================================================================

SELECT setval('categories_category_id_seq', (SELECT MAX(category_id) FROM categories));
SELECT setval('image_image_id_seq', (SELECT MAX(image_id) FROM image));
SELECT setval('gaming_totals_id_seq', (SELECT MAX(id) FROM gaming_totals));
SELECT setval('gaming_scores_id_seq', (SELECT MAX(id) FROM gaming_scores));
SELECT setval('payment_subscriptions_subscription_id_seq', (SELECT MAX(subscription_id) FROM payment_subscriptions));
SELECT setval('payment_transaction_log_transaction_id_seq', (SELECT MAX(transaction_id) FROM payment_transaction_log));
SELECT setval('users_user_id_seq', (SELECT MAX(user_id) FROM users));
SELECT setval('user_cancellation_reason_log_log_id_seq', (SELECT MAX(log_id) FROM user_cancellation_reason_log));

-- ============================================================================
-- PHASE 8: Validation
-- ============================================================================

\echo '==================== VALIDATION RESULTS ===================='

\echo 'Row Count Validation:'
SELECT 'categories' AS table_name, 
       (SELECT COUNT(*) FROM mysql_dump.fc_categories) AS mysql_dump,
       (SELECT COUNT(*) FROM categories) AS production,
       CASE WHEN (SELECT COUNT(*) FROM mysql_dump.fc_categories) = (SELECT COUNT(*) FROM categories) 
            THEN '✓' ELSE '✗' END AS match;

SELECT 'image' AS table_name,
       (SELECT COUNT(*) FROM mysql_dump.fc_image) AS mysql_dump,
       (SELECT COUNT(*) FROM image) AS production,
       CASE WHEN (SELECT COUNT(*) FROM mysql_dump.fc_image) = (SELECT COUNT(*) FROM image) 
            THEN '✓' ELSE '✗' END AS match;

SELECT 'gaming_scores' AS table_name,
       (SELECT COUNT(*) FROM mysql_dump.fc_jewel_scores) + (SELECT COUNT(*) FROM mysql_dump.fc_stellarspeller_scores) AS mysql_dump,
       (SELECT COUNT(*) FROM gaming_scores) AS production,
       CASE WHEN (SELECT COUNT(*) FROM mysql_dump.fc_jewel_scores) + (SELECT COUNT(*) FROM mysql_dump.fc_stellarspeller_scores) = (SELECT COUNT(*) FROM gaming_scores) 
            THEN '✓' ELSE '✗' END AS match;

SELECT 'gaming_totals' AS table_name,
       (SELECT COUNT(*) FROM mysql_dump.fc_jewel_score_totals) + (SELECT COUNT(*) FROM mysql_dump.fc_stellarspeller_score_totals) AS mysql_dump,
       (SELECT COUNT(*) FROM gaming_totals) AS production,
       CASE WHEN (SELECT COUNT(*) FROM mysql_dump.fc_jewel_score_totals) + (SELECT COUNT(*) FROM mysql_dump.fc_stellarspeller_score_totals) = (SELECT COUNT(*) FROM gaming_totals) 
            THEN '✓' ELSE '✗' END AS match;

SELECT 'payment_subscriptions' AS table_name,
       (SELECT COUNT(*) FROM mysql_dump.fc_payment_subscriptions) AS mysql_dump,
       (SELECT COUNT(*) FROM payment_subscriptions) AS production,
       CASE WHEN (SELECT COUNT(*) FROM mysql_dump.fc_payment_subscriptions) = (SELECT COUNT(*) FROM payment_subscriptions) 
            THEN '✓' ELSE '✗' END AS match;

SELECT 'payment_transaction_log' AS table_name,
       (SELECT COUNT(*) FROM mysql_dump.fc_payment_transaction_log) AS mysql_dump,
       (SELECT COUNT(*) FROM payment_transaction_log) AS production,
       CASE WHEN (SELECT COUNT(*) FROM mysql_dump.fc_payment_transaction_log) = (SELECT COUNT(*) FROM payment_transaction_log) 
            THEN '✓' ELSE '✗' END AS match;

SELECT 'user_social' AS table_name,
       (SELECT COUNT(*) FROM mysql_dump.fc_user_social) AS mysql_dump,
       (SELECT COUNT(*) FROM user_social) AS production,
       CASE WHEN (SELECT COUNT(*) FROM mysql_dump.fc_user_social) = (SELECT COUNT(*) FROM user_social) 
            THEN '✓' ELSE '✗' END AS match;

SELECT 'users' AS table_name,
       (SELECT COUNT(*) FROM mysql_dump.fc_users) AS mysql_dump,
       (SELECT COUNT(*) FROM users) AS production,
       CASE WHEN (SELECT COUNT(*) FROM mysql_dump.fc_users) = (SELECT COUNT(*) FROM users) 
            THEN '✓' ELSE '✗' END AS match;

SELECT 'user_cancellation_reason_log' AS table_name,
       (SELECT COUNT(*) FROM mysql_dump.user_cancellation_reason_log) AS mysql_dump,
       (SELECT COUNT(*) FROM user_cancellation_reason_log) AS production,
       CASE WHEN (SELECT COUNT(*) FROM mysql_dump.user_cancellation_reason_log) = (SELECT COUNT(*) FROM user_cancellation_reason_log) 
            THEN '✓' ELSE '✗' END AS match;

\echo ''
\echo 'Gaming Scores Distribution:'
SELECT game_type, COUNT(*) AS count FROM gaming_scores GROUP BY game_type ORDER BY game_type;

\echo ''
\echo 'Gaming Totals Distribution:'
SELECT game_type, COUNT(*) AS count FROM gaming_totals GROUP BY game_type ORDER BY game_type;

-- ============================================================================
-- COMPLETION
-- ============================================================================

SELECT '
╔════════════════════════════════════════════════════════════════════════╗
║                                                                        ║
║  ✓ TRANSFORMATION COMPLETE: mysql_dump → ' || :'target_schema' || '                      ║
║                                                                        ║
║  Created:        9 tables                                             ║
║  Migrated:       11 mysql_dump tables → 9 production tables           ║
║  Indexes:        12                                                   ║
║  Foreign Keys:   4                                                    ║
║  Triggers:       2                                                    ║
║                                                                        ║
║  Review validation results above.                                     ║
║  If all checks pass (✓), migration is successful!                     ║
║                                                                        ║
║  Optional: DROP SCHEMA mysql_dump CASCADE; (after thorough testing)   ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝
' AS status;
