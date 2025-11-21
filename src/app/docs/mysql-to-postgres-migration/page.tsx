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
        <strong>Note:</strong> This guide covers only the 24 actively used tables. 19 legacy tables (RBAC system, apps marketplace, migration artifacts) have been excluded from migration. See the <a href="/docs/mysql-to-postgres-schema-mapping" style={{ color: '#1971c2', textDecoration: 'underline' }}>Schema Mapping page</a> for the complete exclusion list.
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
          __html: `<span class="c">-- HTTP Methods</span>
<span class="k">CREATE TYPE</span> http_method <span class="k">AS ENUM</span> (<span class="s">'get'</span>, <span class="s">'post'</span>, <span class="s">'put'</span>, <span class="s">'delete'</span>);

<span class="c">-- Client Management</span>
<span class="k">CREATE TYPE</span> client_status <span class="k">AS ENUM</span> (<span class="s">'active'</span>, <span class="s">'inactive'</span>, <span class="s">'deleted'</span>, <span class="s">''</span>);
<span class="k">CREATE TYPE</span> client_type <span class="k">AS ENUM</span> (<span class="s">'admin'</span>, <span class="s">'application'</span>);

<span class="c">-- Mapping & Token</span>
<span class="k">CREATE TYPE</span> map_status <span class="k">AS ENUM</span> (<span class="s">'active'</span>, <span class="s">'deleted'</span>);
<span class="k">CREATE TYPE</span> token_type <span class="k">AS ENUM</span> (<span class="s">'request'</span>, <span class="s">'access'</span>);

<span class="c">-- Media</span>
<span class="k">CREATE TYPE</span> img_ext <span class="k">AS ENUM</span> (<span class="s">'jpeg'</span>, <span class="s">'jpg'</span>, <span class="s">'png'</span>, <span class="s">'gif'</span>);
<span class="k">CREATE TYPE</span> img_access <span class="k">AS ENUM</span> (<span class="s">'private'</span>, <span class="s">'public'</span>, <span class="s">'inactive'</span>, <span class="s">'deleted'</span>);

<span class="c">-- Billing & User</span>
<span class="k">CREATE TYPE</span> sub_status <span class="k">AS ENUM</span> (<span class="s">'new'</span>, <span class="s">'active'</span>, <span class="s">'canceled'</span>, <span class="s">'expired'</span>);
<span class="k">CREATE TYPE</span> user_status <span class="k">AS ENUM</span> (<span class="s">'active'</span>, <span class="s">'inactive'</span>, <span class="s">'pending'</span>, <span class="s">'deleted'</span>);`
        }} />
      </div>

      <h2>Phase 2: Core API & User Tables</h2>

      <div className="query-section">
        <div className="query-header">
          <span>Step 2: API Access Logs Table</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="query-description">
          Stores API request logs with client and method tracking (from fc_api_access_logs).
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> api_access_logs (
    api_access_log_id <span class="k">SERIAL</span>,
    client_id <span class="k">VARCHAR(32)</span>,
    user_id <span class="k">INTEGER</span>,
    method <span class="k">http_method</span>,
    request_uri_raw <span class="k">VARCHAR(255)</span>,
    request_uri <span class="k">VARCHAR(255)</span>,
    client_ip <span class="k">VARCHAR(100)</span>,
    http_response_code <span class="k">INTEGER</span>,
    meta <span class="k">TEXT</span>,
    created_date <span class="k">TIMESTAMP</span>
);

<span class="c">-- Create indices</span>
<span class="k">CREATE INDEX</span> idx_api_client_id <span class="k">ON</span> api_access_logs (client_id);
<span class="k">CREATE INDEX</span> idx_api_client_id_method <span class="k">ON</span> api_access_logs (client_id, method);
<span class="k">CREATE INDEX</span> idx_api_method <span class="k">ON</span> api_access_logs (method);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>Step 3: API Client Table</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="query-description">
          OAuth and API client configuration (from fc_api_client).
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> api_client (
    client_id <span class="k">VARCHAR(32)</span>,
    status <span class="k">client_status</span>,
    client_type <span class="k">client_type</span>,
    api_key_hash <span class="k">TEXT</span>,
    created_at <span class="k">TIMESTAMP</span>,
    updated_at <span class="k">TIMESTAMP</span>
);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>Step 4: Users Table</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="query-description">
          Main user account storage with authentication and profile data (from fc_users).
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> users (
    user_id <span class="k">SERIAL</span>,
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

<span class="c">-- Create indices</span>
<span class="k">CREATE INDEX</span> idx_users_email <span class="k">ON</span> users (site_id, email);
<span class="k">CREATE INDEX</span> idx_users_username <span class="k">ON</span> users (site_id, username);`
        }} />
      </div>

            <div className="query-section">
        <div className="query-header">
          <span>Table: api_v1_nonce</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> api_v1_nonce (
    nonce <span class="k">VARCHAR(32)</span>,
    client_id <span class="k">VARCHAR(32)</span>,
    created_at <span class="k">TIMESTAMP</span>
);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>Table: api_v1_vendor</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> api_v1_vendor (
    vendor_id <span class="k">SERIAL</span>,
    client_id <span class="k">VARCHAR(32)</span>,
    vendor_name <span class="k">VARCHAR(255)</span>,
    created_at <span class="k">TIMESTAMP</span>
);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>Table: api_v1_request</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> api_v1_request (
    request_id <span class="k">SERIAL</span>,
    vendor_id <span class="k">INTEGER</span>,
    client_id <span class="k">VARCHAR(32)</span>,
    request_type <span class="k">VARCHAR(50)</span>,
    request_data <span class="k">JSONB</span>,
    response_data <span class="k">JSONB</span>,
    status <span class="k">VARCHAR(20)</span>,
    created_at <span class="k">TIMESTAMP</span>,
    processed_at <span class="k">TIMESTAMP</span>
);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>Table: user_social</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> user_social (
    social_id <span class="k">SERIAL</span>,
    user_id <span class="k">INTEGER</span>,
    provider <span class="k">VARCHAR(50)</span>,
    provider_id <span class="k">VARCHAR(255)</span>,
    profile_data <span class="k">JSONB</span>,
    created_at <span class="k">TIMESTAMP</span>
);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>Table: user_email_notifications</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> user_email_notifications (
    notification_id <span class="k">SERIAL</span>,
    user_id <span class="k">INTEGER</span>,
    notification_type <span class="k">VARCHAR(100)</span>,
    email_sent <span class="k">BOOLEAN</span>,
    sent_at <span class="k">TIMESTAMP</span>,
    created_at <span class="k">TIMESTAMP</span>
);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>Table: users_nta</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> users_nta (
    user_id <span class="k">INTEGER</span>,
    username <span class="k">VARCHAR(100)</span>,
    email <span class="k">VARCHAR(255)</span>,
    status <span class="k">user_status</span>,
    created_at <span class="k">TIMESTAMP</span>
);`
        }} />
      </div>

<h2>Phase 3: Billing & Payment Tables</h2>

      <div className="query-section">
        <div className="query-header">
          <span>Step 5: Payment Subscriptions Table</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="query-description">
          Subscription and billing data (from fc_payment_subscriptions). Note: INT UNSIGNED fields become BIGINT.
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> payment_subscriptions (
    subscription_id <span class="k">SERIAL</span>,
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

<span class="c">-- Create indices</span>
<span class="k">CREATE INDEX</span> idx_subscription_site_user <span class="k">ON</span> payment_subscriptions (site_id, user_id);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>Step 6: Payment Transaction Log Table</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="query-description">
          Transaction audit trail for payments (from fc_payment_transaction_log).
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> payment_transaction_log (
    transaction_id <span class="k">SERIAL</span>,
    user_id <span class="k">INTEGER</span>,
    stripe_charge_id <span class="k">VARCHAR(255)</span>,
    amount <span class="k">NUMERIC(10,2)</span>,
    currency <span class="k">VARCHAR(3)</span>,
    status <span class="k">VARCHAR(50)</span>,
    description <span class="k">TEXT</span>,
    metadata <span class="k">JSONB</span>,
    created_at <span class="k">TIMESTAMP</span>
);

<span class="c">-- Create indices</span>
<span class="k">CREATE INDEX</span> idx_transaction_site_user <span class="k">ON</span> payment_transaction_log (site_id, user_id);
<span class="k">CREATE INDEX</span> idx_transaction_status <span class="k">ON</span> payment_transaction_log (status);
<span class="k">CREATE INDEX</span> idx_transaction_subscription <span class="k">ON</span> payment_transaction_log (subscription_id);`
        }} />
      </div>

            <div className="query-section">
        <div className="query-header">
          <span>Table: user_subscriptions</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> user_subscriptions (
    subscription_id <span class="k">SERIAL</span>,
    user_id <span class="k">INTEGER</span>,
    plan_id <span class="k">VARCHAR(100)</span>,
    status <span class="k">sub_status</span>,
    started_at <span class="k">TIMESTAMP</span>,
    expires_at <span class="k">TIMESTAMP</span>,
    auto_renew <span class="k">BOOLEAN</span>,
    created_at <span class="k">TIMESTAMP</span>,
    updated_at <span class="k">TIMESTAMP</span>
);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>Table: user_cancellation_reason_log</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> user_cancellation_reason_log (
    log_id <span class="k">SERIAL</span>,
    user_id <span class="k">INTEGER</span>,
    reason <span class="k">VARCHAR(255)</span>,
    additional_feedback <span class="k">TEXT</span>,
    created_at <span class="k">TIMESTAMP</span>
);`
        }} />
      </div>

<h2>Phase 4: Content & Reference Tables</h2>

      <div className="query-section">
        <div className="query-header">
          <span>Step 10: Categories Table</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="query-description">
          Content categories (from fc_categories).
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> categories (
    category_id <span class="k">SMALLSERIAL</span>,
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
          <span>Step 12: Image & Language Tables</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="query-description">
          Media and internationalization support (from fc_image and fc_langs).
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> image (
    image_id <span class="k">SERIAL</span>,
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
);

`
        }} />
      </div>

            <div className="query-section">
        <div className="query-header">
          <span>Table: essay_link_support</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> essay_link_support (
    id <span class="k">SERIAL</span>,
    target_url <span class="k">TEXT</span>,
    url1 <span class="k">TEXT</span>,
    anchor1 <span class="k">VARCHAR(255)</span>,
    url2 <span class="k">TEXT</span>,
    anchor2 <span class="k">VARCHAR(255)</span>,
    url3 <span class="k">TEXT</span>,
    anchor3 <span class="k">VARCHAR(255)</span>
);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>Table: reports</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> reports (
    report_id <span class="k">SERIAL</span>,
    user_id <span class="k">INTEGER</span>,
    report_type <span class="k">VARCHAR(50)</span>,
    status <span class="k">report_status</span>,
    title <span class="k">VARCHAR(255)</span>,
    content <span class="k">TEXT</span>,
    metadata <span class="k">JSONB</span>,
    created_at <span class="k">TIMESTAMP</span>,
    resolved_at <span class="k">TIMESTAMP</span>
);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>Table: takedowns</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> takedowns (
    takedown_id <span class="k">SERIAL</span>,
    user_id <span class="k">INTEGER</span>,
    moderator_id <span class="k">INTEGER</span>,
    content_type <span class="k">VARCHAR(50)</span>,
    content_id <span class="k">INTEGER</span>,
    reason <span class="k">TEXT</span>,
    status <span class="k">VARCHAR(20)</span>,
    created_at <span class="k">TIMESTAMP</span>,
    resolved_at <span class="k">TIMESTAMP</span>
);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>Table: translations</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> translations (
    translation_id <span class="k">SERIAL</span>,
    key_name <span class="k">VARCHAR(255)</span>,
    language_code <span class="k">VARCHAR(5)</span>,
    translation_text <span class="k">TEXT</span>,
    context <span class="k">VARCHAR(100)</span>,
    created_at <span class="k">TIMESTAMP</span>,
    updated_at <span class="k">TIMESTAMP</span>
);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>Table: jewel_score_totals</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> jewel_score_totals (
    id <span class="k">SERIAL</span>,
    user_id <span class="k">INTEGER</span>,
    total_score <span class="k">INTEGER</span>,
    games_played <span class="k">INTEGER</span>,
    updated_at <span class="k">TIMESTAMP</span>
);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>Table: jewel_scores</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> jewel_scores (
    score_id <span class="k">SERIAL</span>,
    user_id <span class="k">INTEGER</span>,
    score <span class="k">INTEGER</span>,
    level <span class="k">INTEGER</span>,
    game_duration <span class="k">INTEGER</span>,
    created_at <span class="k">TIMESTAMP</span>
);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>Table: stellarspeller_score_totals</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> stellarspeller_score_totals (
    id <span class="k">SERIAL</span>,
    user_id <span class="k">INTEGER</span>,
    total_score <span class="k">INTEGER</span>,
    games_played <span class="k">INTEGER</span>,
    updated_at <span class="k">TIMESTAMP</span>
);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>Table: stellarspeller_scores</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> stellarspeller_scores (
    score_id <span class="k">SERIAL</span>,
    user_id <span class="k">INTEGER</span>,
    score <span class="k">INTEGER</span>,
    level <span class="k">INTEGER</span>,
    words_found <span class="k">INTEGER</span>,
    time_bonus <span class="k">INTEGER</span>,
    created_at <span class="k">TIMESTAMP</span>
);`
        }} />
      </div>

<h2>Phase 5: API Client Mapping</h2>

      <div className="query-section">
        <div className="query-header">
          <span>Step 13: API Client Map User (Junction Table)</span>
          <span className="badge badge-fk">Junction Table</span>
        </div>
        <div className="query-description">
          Maps API clients to users with OAuth tokens (from fc_api_client_map_user).
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> api_client_map_user (
    client_id <span class="k">VARCHAR(32)</span>,
    user_id <span class="k">INTEGER</span>,
    created_at <span class="k">TIMESTAMP</span>
);`
        }} />
      </div>

      <h2>Phase 6: Triggers & Constraints</h2>

      <div className="query-section">
        <div className="query-header">
          <span>Step 14: Timestamp Update Trigger Function</span>
          <span className="badge badge-table">Trigger</span>
        </div>
        <div className="query-description">
          Auto-update last_modified timestamp on record changes.
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE OR REPLACE FUNCTION</span> update_last_modified()
<span class="k">RETURNS TRIGGER AS</span> <span class="s">$$
BEGIN</span>
    NEW.last_modified = CURRENT_TIMESTAMP;
    <span class="k">RETURN</span> NEW;
<span class="k">END</span>;
<span class="s">$$</span> <span class="k">LANGUAGE</span> plpgsql;

<span class="c">-- Apply trigger to api_client</span>
<span class="k">CREATE TRIGGER</span> update_api_client_timestamp
<span class="k">BEFORE UPDATE ON</span> api_client
<span class="k">FOR EACH ROW</span>
<span class="k">EXECUTE FUNCTION</span> update_last_modified();`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>Step 15: Add Foreign Key Constraints</span>
          <span className="badge badge-fk">Foreign Keys</span>
        </div>
        <div className="query-description">
          Add referential integrity constraints for data relationships.
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">ALTER TABLE</span> api_client_map_user
<span class="k">ADD CONSTRAINT</span> fk_client_map_user_client
<span class="k">FOREIGN KEY</span> (client_id) <span class="k">REFERENCES</span> api_client(client_id)
<span class="k">ON DELETE CASCADE ON UPDATE CASCADE</span>;

<span class="k">ALTER TABLE</span> api_client_map_user
<span class="k">ADD CONSTRAINT</span> fk_client_map_user_user
<span class="k">FOREIGN KEY</span> (user_id) <span class="k">REFERENCES</span> users(id)
<span class="k">ON DELETE CASCADE ON UPDATE CASCADE</span>;

<span class="k">ALTER TABLE</span> payment_subscriptions
<span class="k">ADD CONSTRAINT</span> fk_subscription_user
<span class="k">FOREIGN KEY</span> (user_id) <span class="k">REFERENCES</span> users(id)
<span class="k">ON DELETE CASCADE</span>;`
        }} />
      </div>

      <h2>Appendix: Schema Summary</h2>

      <h3>All Tables Created (24)</h3>
      <table>
        <thead>
          <tr>
            <th className="col-name">Table Name</th>
            <th className="col-type">Primary Key</th>
            <th className="col-constraint">Key Type</th>
            <th className="col-notes">Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>api_access_logs</td>
            <td>api_access_log_id</td>
            <td>SERIAL</td>
            <td>API request logging</td>
          </tr>
          <tr>
            <td>api_client</td>
            <td>client_id</td>
            <td>VARCHAR(32)</td>
            <td>OAuth clients</td>
          </tr>
          <tr>
            <td>api_client_map_user</td>
            <td>client_id, user_id</td>
            <td>Composite PK</td>
            <td>Client-user mapping</td>
          </tr>
          <tr>
            <td>api_v1_nonce</td>
            <td>nonce</td>
            <td>VARCHAR(32)</td>
            <td>OAuth nonce tracking</td>
          </tr>
          <tr>
            <td>api_v1_request</td>
            <td>request_id</td>
            <td>SERIAL</td>
            <td>API request tracking</td>
          </tr>
          <tr>
            <td>api_v1_vendor</td>
            <td>vendor_id</td>
            <td>SERIAL</td>
            <td>API vendor management</td>
          </tr>
          <tr>
            <td>categories</td>
            <td>category_id</td>
            <td>SMALLSERIAL</td>
            <td>Content categories</td>
          </tr>
          <tr>
            <td>essay_link_support</td>
            <td>id</td>
            <td>SERIAL</td>
            <td>Essay link management</td>
          </tr>
          <tr>
            <td>image</td>
            <td>image_id</td>
            <td>SERIAL</td>
            <td>Media storage</td>
          </tr>
          <tr>
            <td>jewel_score_totals</td>
            <td>id</td>
            <td>SERIAL</td>
            <td>Jewel game totals</td>
          </tr>
          <tr>
            <td>jewel_scores</td>
            <td>score_id</td>
            <td>SERIAL</td>
            <td>Jewel game scores</td>
          </tr>
          <tr>
            <td>payment_subscriptions</td>
            <td>subscription_id</td>
            <td>SERIAL</td>
            <td>Stripe subscriptions</td>
          </tr>
          <tr>
            <td>payment_transaction_log</td>
            <td>transaction_id</td>
            <td>SERIAL</td>
            <td>Payment transactions</td>
          </tr>
          <tr>
            <td>reports</td>
            <td>report_id</td>
            <td>SERIAL</td>
            <td>User reports</td>
          </tr>
          <tr>
            <td>stellarspeller_score_totals</td>
            <td>id</td>
            <td>SERIAL</td>
            <td>Speller game totals</td>
          </tr>
          <tr>
            <td>stellarspeller_scores</td>
            <td>score_id</td>
            <td>SERIAL</td>
            <td>Speller game scores</td>
          </tr>
          <tr>
            <td>takedowns</td>
            <td>takedown_id</td>
            <td>SERIAL</td>
            <td>Content moderation</td>
          </tr>
          <tr>
            <td>user_email_notifications</td>
            <td>notification_id</td>
            <td>SERIAL</td>
            <td>Email notifications</td>
          </tr>
          <tr>
            <td>user_social</td>
            <td>social_id</td>
            <td>SERIAL</td>
            <td>Social auth</td>
          </tr>
          <tr>
            <td>users</td>
            <td>user_id</td>
            <td>SERIAL</td>
            <td>User accounts</td>
          </tr>
          <tr>
            <td>translations</td>
            <td>translation_id</td>
            <td>SERIAL</td>
            <td>I18n translations</td>
          </tr>
          <tr>
            <td>user_cancellation_reason_log</td>
            <td>log_id</td>
            <td>SERIAL</td>
            <td>Cancellation tracking</td>
          </tr>
          <tr>
            <td>user_subscriptions</td>
            <td>subscription_id</td>
            <td>SERIAL</td>
            <td>User subscriptions</td>
          </tr>
          <tr>
            <td>users_nta</td>
            <td>user_id</td>
            <td>INTEGER</td>
            <td>Users (no triggers)</td>
          </tr>
        </tbody>
      </table>

      <h3>ENUM Types Summary</h3>
      <table>
        <thead>
          <tr>
            <th className="col-name">ENUM Type Name</th>
            <th className="col-type">Values</th>
            <th className="col-constraint">Used By</th>
            <th className="col-notes">Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>http_method</td>
            <td>get, post, put, delete</td>
            <td>api_access_logs</td>
            <td>HTTP verb tracking</td>
          </tr>
          <tr>
            <td>client_status</td>
            <td>active, inactive, deleted, ''</td>
            <td>api_client</td>
            <td>Client state</td>
          </tr>
          <tr>
            <td>client_type</td>
            <td>admin, application</td>
            <td>api_client</td>
            <td>Client classification</td>
          </tr>
          <tr>
            <td>map_status</td>
            <td>active, deleted</td>
            <td>api_client_map_user</td>
            <td>Mapping status</td>
          </tr>
          <tr>
            <td>user_status</td>
            <td>active, inactive, pending, deleted</td>
            <td>users</td>
            <td>User account status</td>
          </tr>
          <tr>
            <td>sub_status</td>
            <td>new, active, canceled, expired</td>
            <td>payment_subscriptions</td>
            <td>Subscription status</td>
          </tr>
          <tr>
            <td>img_ext</td>
            <td>jpeg, jpg, png, gif</td>
            <td>image</td>
            <td>Image file types</td>
          </tr>
          <tr>
            <td>img_access</td>
            <td>private, public, inactive, deleted</td>
            <td>image</td>
            <td>Image access level</td>
          </tr>
        </tbody>
      </table>


      
      <h2>Additional Guides</h2>

      <h3>Data Migration</h3>

<div className="query-section">
        <div className="query-header">
          <span>Step 16: Data Migration & Sequence Reset</span>
          <span className="badge badge-table">Migration</span>
        </div>
        <div className="query-description">
          Import data from MySQL and reset sequences for proper auto-increment.
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="c">-- 1. Disable triggers temporarily for faster bulk insert</span>
<span class="k">ALTER TABLE</span> api_client <span class="k">DISABLE TRIGGER ALL</span>;

<span class="c">-- 2. Import data via COPY (from exported CSV)</span>
<span class="k">COPY</span> users (id, site_id, username, user_login, password, password_salt, email, user_type, status, date_joined, meta, updated, last_login_date)
<span class="k">FROM</span> <span class="s">'/tmp/users.csv'</span>
<span class="k">WITH</span> (FORMAT csv, HEADER true, DELIMITER <span class="s">','</span>);

<span class="c">-- 3. Reset sequences to max ID + 1</span>
<span class="k">SELECT</span> setval(<span class="s">'users_id_seq'</span>, (SELECT MAX(id) FROM users) + <span class="n">1</span>);
<span class="k">SELECT</span> setval(<span class="s">'api_access_logs_api_access_log_id_seq'</span>, (SELECT MAX(api_access_log_id) FROM api_access_logs) + <span class="n">1</span>);
<span class="k">SELECT</span> setval(<span class="s">'payment_subscriptions_id_seq'</span>, (SELECT MAX(id) FROM payment_subscriptions) + <span class="n">1</span>);

<span class="c">-- 4. Re-enable triggers</span>
<span class="k">ALTER TABLE</span> api_client <span class="k">ENABLE TRIGGER ALL</span>;`
        }} />
      </div>

      <h3>Post-Migration Verification</h3>

<div className="query-section">
        <div className="query-header">
          <span>Step 17: Post-Migration Verification</span>
          <span className="badge badge-index">Verification</span>
        </div>
        <div className="query-description">
          Validate successful migration with integrity checks.
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="c">-- Verify table row counts</span>
<span class="k">SELECT</span> 
    <span class="s">'users'</span> <span class="k">AS</span> table_name, 
    COUNT(*) <span class="k">AS</span> row_count 
<span class="k">FROM</span> users
<span class="k">UNION ALL</span>
<span class="k">SELECT</span> <span class="s">'api_access_logs'</span>, COUNT(*) <span class="k">FROM</span> api_access_logs
<span class="k">UNION ALL</span>
<span class="k">SELECT</span> <span class="s">'payment_subscriptions'</span>, COUNT(*) <span class="k">FROM</span> payment_subscriptions;

<span class="c">-- Check for NULL violations</span>
<span class="k">SELECT</span> COUNT(*) <span class="k">AS</span> null_statuses
<span class="k">FROM</span> users 
<span class="k">WHERE</span> status <span class="k">IS NULL</span>;

<span class="c">-- Verify indices are created</span>
<span class="k">SELECT</span> tablename, indexname 
<span class="k">FROM</span> pg_indexes 
<span class="k">WHERE</span> schemaname = <span class="s">'public'</span> 
<span class="k">AND</span> tablename LIKE <span class="s">'%'</span>
<span class="k">ORDER BY</span> tablename;`
        }} />
      </div>


    </main>
  )
}