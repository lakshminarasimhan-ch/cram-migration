import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'PostgreSQL Database Creation Queries - MySQL Migration',
    description: 'SQL queries for creating PostgreSQL database structure from MySQL tables',
}

export default function MySQLToPostgresMigration() {
    return (
        <main>
            <h1>MySQL → PostgreSQL: Database Creation Queries</h1>

            <div className="opt-note">
                <strong>Migration Guide:</strong>
                <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px' }}>
                    <li><strong>Execution Order:</strong> Create ENUM types first, then tables in dependency order, add constraints and foreign keys, finally create indices.</li>
                    <li><strong>Type Conversions:</strong> INT UNSIGNED → BIGINT, TINYINT(1) → BOOLEAN, DATETIME → TIMESTAMP, ENUM → PostgreSQL ENUM types.</li>
                    <li><strong>Triggers:</strong> ON UPDATE CURRENT_TIMESTAMP becomes BEFORE UPDATE trigger in PostgreSQL.</li>
                    <li><strong>Performance:</strong> Disable triggers during bulk inserts, reset sequences after data migration.</li>
                </ul>
            </div>
            <div className="opt-note" style={{ borderColor: '#ff6b6b', background: '#fff5f5', marginTop: '10px' }}>
                <strong>Note:</strong> This guide covers only the 8 actively used tables (including 2 consolidated gaming tables). 33 legacy tables have been excluded from migration:
                <ul style={{ margin: '5px 0 0 20px', paddingLeft: '0' }}>
                    <li>19 legacy tables (RBAC system, apps marketplace, migration artifacts)</li>
                    <li>6 deprecated API tables (fc_api_access_logs, fc_api_client, fc_api_client_map_user, fc_api_v1_nonce, fc_api_v1_vendor, fc_api_v1_request)</li>
                    <li>4 gaming tables (consolidated into gaming_scores and gaming_totals)</li>
                    <li>7 feature-specific exclusions (fc_user_email_notifications, fc_reports, fc_takedowns, fc_essay_link_support, translations, users_nta, user_subscriptions)</li>
                </ul>
                See the <a href="/docs/mysql-to-postgres-schema-mapping" style={{ color: '#1971c2', textDecoration: 'underline' }}>Schema Mapping page</a> for the complete exclusion list with detailed reasons.
            </div>


            <h2>Phase 1: Create PostgreSQL ENUM Types</h2>

            <div className="query-section">
                <div className="query-header">
                    <span>Step 1: All Enum Type Definitions</span>
                    <span className="badge badge-enum">Enum Types</span>
                </div>
                <div className="query-description">
                    Define all PostgreSQL ENUM types derived from MySQL ENUM columns.
                </div>
                <div className="code-container query" dangerouslySetInnerHTML={{
                    __html: `<span class="c">-- Media</span>
<span class="k">CREATE TYPE</span> img_ext <span class="k">AS ENUM</span> (<span class="s">'jpeg'</span>, <span class="s">'jpg'</span>, <span class="s">'png'</span>, <span class="s">'gif'</span>);
<span class="k">CREATE TYPE</span> img_access <span class="k">AS ENUM</span> (<span class="s">'private'</span>, <span class="s">'public'</span>, <span class="s">'inactive'</span>, <span class="s">'deleted'</span>);

<span class="c">-- Billing & User</span>
<span class="k">CREATE TYPE</span> sub_status <span class="k">AS ENUM</span> (<span class="s">'new'</span>, <span class="s">'active'</span>, <span class="s">'canceled'</span>, <span class="s">'expired'</span>);
<span class="k">CREATE TYPE</span> user_status <span class="k">AS ENUM</span> (<span class="s">'active'</span>, <span class="s">'inactive'</span>, <span class="s">'pending'</span>, <span class="s">'deleted'</span>);`
                }} />
            </div>

            <h2>Phase 2: Core Tables</h2>

            <div className="query-section">
                <div className="query-header">
                    <span>Step 2: Categories Table</span>
                    <span className="badge badge-table">Table</span>
                </div>
                <div className="query-description">
                    Content categories (from fc_categories).
                </div>
                <div className="code-container query" dangerouslySetInnerHTML={{
                    __html: `<span class="k">CREATE TABLE</span> categories (
    category_id <span class="k">SMALLSERIAL PRIMARY KEY</span>,
    site_id <span class="k">INTEGER</span>,
    parent <span class="k">VARCHAR(128)</span>,
    slug <span class="k">VARCHAR(128)</span>,
    title <span class="k">VARCHAR(128)</span>,
    count <span class="k">INTEGER</span>
);

<span class="k">CREATE INDEX</span> idx_categories_slug <span class="k">ON</span> categories (slug);`
                }} />
            </div>

            <div className="query-section">
                <div className="query-header">
                    <span>Step 3: Image Table</span>
                    <span className="badge badge-table">Table</span>
                </div>
                <div className="query-description">
                    Media storage (from fc_image).
                </div>
                <div className="code-container query" dangerouslySetInnerHTML={{
                    __html: `<span class="k">CREATE TABLE</span> image (
    image_id <span class="k">SERIAL PRIMARY KEY</span>,
    title <span class="k">VARCHAR(255)</span>,
    src <span class="k">VARCHAR(255)</span>,
    extension <span class="k">img_ext</span>,
    hash <span class="k">VARCHAR(32)</span>,
    provider <span class="k">VARCHAR(255)</span>,
    description <span class="k">TEXT</span>,
    access <span class="k">img_access</span>,
    meta <span class="k">TEXT</span>,
    creator_id <span class="k">INTEGER</span>,
    created <span class="k">TIMESTAMP</span>
);`
                }} />
            </div>

            <h2>Phase 3: Gaming Tables (Consolidated)</h2>

            <div className="query-section">
                <div className="query-header">
                    <span>Step 4: Gaming Totals Table</span>
                    <span className="badge badge-table">Table</span>
                </div>
                <div className="query-description">
                    Consolidated gaming totals from fc_jewel_score_totals and fc_stellarspeller_score_totals.
                </div>
                <div className="code-container query" dangerouslySetInnerHTML={{
                    __html: `<span class="k">CREATE TABLE</span> gaming_totals (
    id <span class="k">SERIAL PRIMARY KEY</span>,
    set_id <span class="k">INTEGER NOT NULL</span>,
    game_type <span class="k">VARCHAR(50) NOT NULL</span>, <span class="c">-- 'jewel' or 'stellarspeller'</span>
    num_scores <span class="k">INTEGER DEFAULT 0 NOT NULL</span>,
    sum_scores <span class="k">INTEGER DEFAULT 0 NOT NULL</span>,
    <span class="k">UNIQUE</span> (set_id, game_type)
);

<span class="k">CREATE INDEX</span> idx_gaming_totals_set <span class="k">ON</span> gaming_totals (set_id, game_type);`
                }} />
            </div>

            <div className="query-section">
                <div className="query-header">
                    <span>Step 5: Gaming Scores Table</span>
                    <span className="badge badge-table">Table</span>
                </div>
                <div className="query-description">
                    Consolidated gaming scores from fc_jewel_scores and fc_stellarspeller_scores.
                </div>
                <div className="code-container query" dangerouslySetInnerHTML={{
                    __html: `<span class="k">CREATE TABLE</span> gaming_scores (
    id <span class="k">SERIAL PRIMARY KEY</span>,
    game_type <span class="k">VARCHAR(50) NOT NULL</span>, <span class="c">-- 'jewel' or 'stellarspeller'</span>
    score <span class="k">INTEGER</span>,
    name <span class="k">VARCHAR(31)</span>,
    accuracy <span class="k">VARCHAR(31)</span>,
    user_id <span class="k">INTEGER DEFAULT 0</span>,
    created <span class="k">TIMESTAMP NOT NULL</span>,
    set_id <span class="k">INTEGER</span>,
    time <span class="k">INTEGER NOT NULL</span>, <span class="c">-- Milliseconds to finish set</span>
    <span class="k">UNIQUE</span> (set_id, user_id, game_type)
);

<span class="k">CREATE INDEX</span> idx_gaming_scores_user <span class="k">ON</span> gaming_scores (user_id, game_type);
<span class="k">CREATE INDEX</span> idx_gaming_scores_set <span class="k">ON</span> gaming_scores (set_id, game_type);
<span class="k">CREATE INDEX</span> idx_gaming_scores_created <span class="k">ON</span> gaming_scores (created);`
                }} />
            </div>
            <h2>Phase 4: Payment Tables</h2>

            <div className="query-section">
                <div className="query-header">
                    <span>Step 6: Payment Subscriptions Table</span>
                    <span className="badge badge-table">Table</span>
                </div>
                <div className="query-description">
                    Subscription and billing data (from fc_payment_subscriptions).
                </div>
                <div className="code-container query" dangerouslySetInnerHTML={{
                    __html: `<span class="k">CREATE TABLE</span> payment_subscriptions (
    subscription_id <span class="k">SERIAL PRIMARY KEY</span>,
    user_id <span class="k">INTEGER</span>,
    stripe_subscription_id <span class="k">VARCHAR(255)</span>,
    status <span class="k">sub_status</span>,
    plan_name <span class="k">VARCHAR(100)</span>,
    amount <span class="k">NUMERIC(10,2)</span>,
    currency <span class="k">VARCHAR(3)</span>,
    interval <span class="k">VARCHAR(20)</span>,
    current_period_start <span class="k">TIMESTAMP</span>,
    current_period_end <span class="k">TIMESTAMP</span>,
    trial_start <span class="k">TIMESTAMP</span>,
    trial_end <span class="k">TIMESTAMP</span>,
    canceled_at <span class="k">TIMESTAMP</span>,
    created_at <span class="k">TIMESTAMP</span>,
    updated_at <span class="k">TIMESTAMP</span>
);

<span class="k">CREATE INDEX</span> idx_subscription_user <span class="k">ON</span> payment_subscriptions (user_id);`
                }} />
            </div>

            <div className="query-section">
                <div className="query-header">
                    <span>Step 7: Payment Transaction Log Table</span>
                    <span className="badge badge-table">Table</span>
                </div>
                <div className="query-description">
                    Transaction audit trail for payments (from fc_payment_transaction_log).
                </div>
                <div className="code-container query" dangerouslySetInnerHTML={{
                    __html: `<span class="k">CREATE TABLE</span> payment_transaction_log (
    transaction_id <span class="k">SERIAL PRIMARY KEY</span>,
    user_id <span class="k">INTEGER</span>,
    stripe_charge_id <span class="k">VARCHAR(255)</span>,
    amount <span class="k">NUMERIC(10,2)</span>,
    currency <span class="k">VARCHAR(3)</span>,
    status <span class="k">VARCHAR(50)</span>,
    description <span class="k">TEXT</span>,
    metadata <span class="k">JSONB</span>,
    created_at <span class="k">TIMESTAMP</span>
);

<span class="k">CREATE INDEX</span> idx_transaction_user <span class="k">ON</span> payment_transaction_log (user_id);
<span class="k">CREATE INDEX</span> idx_transaction_status <span class="k">ON</span> payment_transaction_log (status);`
                }} />
            </div>

            <h2>Phase 5: User Tables</h2>

            <div className="query-section">
                <div className="query-header">
                    <span>Step 8: User Social Table</span>
                    <span className="badge badge-table">Table</span>
                </div>
                <div className="query-description">
                    Social login links (from fc_user_social).
                </div>
                <div className="code-container query" dangerouslySetInnerHTML={{
                    __html: `<span class="k">CREATE TABLE</span> user_social (
    user_id <span class="k">INTEGER NOT NULL</span>,
    social_type <span class="k">VARCHAR(16) NOT NULL</span>,
    social_id <span class="k">VARCHAR(32) NOT NULL</span>,
    converted <span class="k">BOOLEAN</span>,
    meta <span class="k">TEXT</span>,
    created <span class="k">TIMESTAMP</span>,
    updated <span class="k">TIMESTAMP</span>,
    site_id <span class="k">SMALLINT DEFAULT 100 NOT NULL</span>,
    <span class="k">PRIMARY KEY</span> (user_id, social_type, social_id)
);

<span class="k">CREATE INDEX</span> idx_user_social_site <span class="k">ON</span> user_social (site_id);`
                }} />
            </div>

            <div className="query-section">
                <div className="query-header">
                    <span>Step 9: Users Table</span>
                </div>
                <div className="query-description">
                    Main user account storage with authentication and profile data (from fc_users).
                </div>
                <div className="code-container query" dangerouslySetInnerHTML={{
                    __html: `<span class="k">CREATE TABLE</span> users (
    user_id <span class="k">SERIAL PRIMARY KEY</span>,
    username <span class="k">VARCHAR(100)</span>,
    email <span class="k">VARCHAR(255)</span>,
    password_hash <span class="k">TEXT</span>,
    status <span class="k">user_status</span>,
    first_name <span class="k">VARCHAR(100)</span>,
    last_name <span class="k">VARCHAR(100)</span>,
    display_name <span class="k">VARCHAR(200)</span>,
    bio <span class="k">TEXT</span>,
    avatar_url <span class="k">VARCHAR(500)</span>,
    website <span class="k">VARCHAR(255)</span>,
    timezone <span class="k">VARCHAR(50)</span>,
    language <span class="k">VARCHAR(5)</span>,
    email_verified <span class="k">BOOLEAN</span>,
    last_login <span class="k">TIMESTAMP</span>,
    created_at <span class="k">TIMESTAMP</span>,
    updated_at <span class="k">TIMESTAMP</span>
);

<span class="k">CREATE INDEX</span> idx_users_email <span class="k">ON</span> users (email);
<span class="k">CREATE INDEX</span> idx_users_username <span class="k">ON</span> users (username);`
                }} />
            </div>

            <div className="query-section">
                <div className="query-header">
                    <span>Step 9: User Cancellation Reason Log</span>
                    <span className="badge badge-table">Table</span>
                </div>
                <div className="query-description">
                    Tracks reasons for subscription cancellations (from user_cancellation_reason_log).
                </div>
                <div className="code-container query" dangerouslySetInnerHTML={{
                    __html: `<span class="k">CREATE TABLE</span> user_cancellation_reason_log (
    log_id <span class="k">SERIAL PRIMARY KEY</span>,
    user_id <span class="k">INTEGER</span>,
    reason <span class="k">VARCHAR(255)</span>,
    additional_feedback <span class="k">TEXT</span>,
    created_at <span class="k">TIMESTAMP</span>
);

<span class="k">CREATE INDEX</span> idx_cancellation_user <span class="k">ON</span> user_cancellation_reason_log (user_id);`
                }} />
            </div>

            <h2>Phase 6: Data Migration</h2>

            <div className="query-section">
                <div className="query-header">
                    <span>Step 10: Gaming Data Migration</span>
                    <span className="badge badge-table">Migration</span>
                </div>
                <div className="query-description">
                    Migrate gaming data from separate tables into consolidated tables.
                </div>
                <div className="code-container query" dangerouslySetInnerHTML={{
                    __html: `<span class="c">-- Migrate jewel scores</span>
<span class="k">INSERT INTO</span> gaming_scores (game_type, score, name, accuracy, user_id, created, set_id, time)
<span class="k">SELECT</span> <span class="s">'jewel'</span>, score, name, accuracy, user_id, created, set_id, time
<span class="k">FROM</span> fc_jewel_scores;

<span class="c">-- Migrate stellarspeller scores</span>
<span class="k">INSERT INTO</span> gaming_scores (game_type, score, name, accuracy, user_id, created, set_id, time)
<span class="k">SELECT</span> <span class="s">'stellarspeller'</span>, score, name, accuracy, user_id, created, set_id, time
<span class="k">FROM</span> fc_stellarspeller_scores;

<span class="c">-- Migrate jewel totals</span>
<span class="k">INSERT INTO</span> gaming_totals (set_id, game_type, num_scores, sum_scores)
<span class="k">SELECT</span> set_id, <span class="s">'jewel'</span>, num_scores, sum_scores
<span class="k">FROM</span> fc_jewel_score_totals;

<span class="c">-- Migrate stellarspeller totals</span>
<span class="k">INSERT INTO</span> gaming_totals (set_id, game_type, num_scores, sum_scores)
<span class="k">SELECT</span> set_id, <span class="s">'stellarspeller'</span>, num_scores, sum_scores
<span class="k">FROM</span> fc_stellarspeller_score_totals;`
                }} />
            </div>

            <div className="query-section">
                <div className="query-header">
                    <span>Step 11: Reset Sequences</span>
                    <span className="badge badge-table">Migration</span>
                </div>
                <div className="query-description">
                    Reset sequences to max ID + 1 after data migration.
                </div>
                <div className="code-container query" dangerouslySetInnerHTML={{
                    __html: `<span class="c">-- Reset sequences</span>
<span class="k">SELECT</span> setval(<span class="s">'users_user_id_seq'</span>, (SELECT MAX(user_id) FROM users) + <span class="n">1</span>);
<span class="k">SELECT</span> setval(<span class="s">'gaming_scores_id_seq'</span>, (SELECT MAX(id) FROM gaming_scores) + <span class="n">1</span>);
<span class="k">SELECT</span> setval(<span class="s">'gaming_totals_id_seq'</span>, (SELECT MAX(id) FROM gaming_totals) + <span class="n">1</span>);
<span class="k">SELECT</span> setval(<span class="s">'payment_subscriptions_subscription_id_seq'</span>, (SELECT MAX(subscription_id) FROM payment_subscriptions) + <span class="n">1</span>);`
                }} />
            </div>

        </main>
    )
}
