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
          __html: `<span class="k">CREATE TABLE</span> fc_api_access_logs (
    api_access_log_id <span class="k">SERIAL PRIMARY KEY</span>,
    client_id <span class="k">VARCHAR(32)</span>,
    user_id <span class="k">INTEGER</span>,
    method http_method,
    request_uri_raw <span class="k">VARCHAR(255)</span>,
    request_uri <span class="k">VARCHAR(255)</span>,
    client_ip <span class="k">VARCHAR(100)</span>,
    http_response_code <span class="k">INTEGER</span>,
    meta <span class="k">TEXT</span>,
    created_date <span class="k">TIMESTAMP NOT NULL</span>
);

<span class="c">-- Create indices</span>
<span class="k">CREATE INDEX</span> idx_api_client_id <span class="k">ON</span> fc_api_access_logs (client_id);
<span class="k">CREATE INDEX</span> idx_api_client_id_method <span class="k">ON</span> fc_api_access_logs (client_id, method);
<span class="k">CREATE INDEX</span> idx_api_method <span class="k">ON</span> fc_api_access_logs (method);`
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
          __html: `<span class="k">CREATE TABLE</span> fc_api_client (
    user_id <span class="k">INTEGER PRIMARY KEY</span>,
    client_id <span class="k">VARCHAR(32) UNIQUE NOT NULL</span>,
    site_id <span class="k">SMALLINT DEFAULT 100 NOT NULL</span>,
    client_secret <span class="k">VARCHAR(64) NOT NULL</span>,
    app_name <span class="k">VARCHAR(255) NOT NULL</span>,
    app_description <span class="k">TEXT</span>,
    redirect_uri <span class="k">VARCHAR(255)</span>,
    status client_status <span class="k">NOT NULL</span>,
    type client_type <span class="k">DEFAULT 'application' NOT NULL</span>,
    created <span class="k">TIMESTAMP NOT NULL</span>,
    last_modified <span class="k">TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL</span>
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
          __html: `<span class="k">CREATE TABLE</span> fc_users (
    id <span class="k">SERIAL PRIMARY KEY</span>,
    site_id <span class="k">SMALLINT DEFAULT 100 NOT NULL</span>,
    username <span class="k">VARCHAR(64)</span>,
    user_login <span class="k">VARCHAR(100)</span>,
    password <span class="k">VARCHAR(40)</span>,
    password_salt <span class="k">VARCHAR(40)</span>,
    email <span class="k">VARCHAR(100)</span>,
    user_type <span class="k">INTEGER</span>,
    status user_status <span class="k">DEFAULT 'active' NOT NULL</span>,
    date_joined <span class="k">TIMESTAMP</span>,
    meta <span class="k">TEXT</span>,
    updated <span class="k">TIMESTAMP</span>,
    last_login_date <span class="k">TIMESTAMP</span>,
    <span class="k">UNIQUE</span> (site_id, user_login, password, password_salt)
);

<span class="c">-- Create indices</span>
<span class="k">CREATE INDEX</span> idx_users_email <span class="k">ON</span> fc_users (site_id, email);
<span class="k">CREATE INDEX</span> idx_users_username <span class="k">ON</span> fc_users (site_id, username);`
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
          __html: `<span class="k">CREATE TABLE</span> fc_payment_subscriptions (
    id <span class="k">SERIAL PRIMARY KEY</span>,
    subscription_id <span class="k">BIGINT UNIQUE</span>,
    external_id <span class="k">VARCHAR(64)</span>,
    site_id <span class="k">SMALLINT NOT NULL</span>,
    user_id <span class="k">BIGINT</span>,
    user_external_id <span class="k">VARCHAR(64)</span>,
    trans_id <span class="k">VARCHAR(64)</span>,
    email <span class="k">VARCHAR(128)</span>,
    username <span class="k">VARCHAR(64)</span>,
    plan <span class="k">VARCHAR(64)</span>,
    external_plan <span class="k">VARCHAR(64)</span>,
    coupon <span class="k">VARCHAR(64)</span>,
    amount <span class="k">INTEGER</span>,
    currency <span class="k">VARCHAR(3)</span>,
    quantity <span class="k">INTEGER</span>,
    billing_first_name <span class="k">VARCHAR(64)</span>,
    billing_last_name <span class="k">VARCHAR(64)</span>,
    billing_address1 <span class="k">VARCHAR(128)</span>,
    billing_address2 <span class="k">VARCHAR(128)</span>,
    billing_city <span class="k">VARCHAR(64)</span>,
    billing_state <span class="k">VARCHAR(64)</span>,
    billing_zip <span class="k">VARCHAR(16)</span>,
    billing_country <span class="k">VARCHAR(2)</span>,
    billing_phone <span class="k">VARCHAR(32)</span>,
    payment_type <span class="k">VARCHAR(32)</span>,
    payment_card_number <span class="k">VARCHAR(32)</span>,
    payment_card_month <span class="k">VARCHAR(2)</span>,
    payment_card_year <span class="k">VARCHAR(4)</span>,
    payment_paypal_agreement_id <span class="k">VARCHAR(64)</span>,
    activated <span class="k">TIMESTAMP</span>,
    current_period_started <span class="k">TIMESTAMP</span>,
    current_period_ends <span class="k">TIMESTAMP</span>,
    canceled <span class="k">TIMESTAMP</span>,
    expires <span class="k">TIMESTAMP</span>,
    gateway <span class="k">VARCHAR(32)</span>,
    status sub_status,
    created <span class="k">TIMESTAMP</span>,
    updated <span class="k">TIMESTAMP DEFAULT CURRENT_TIMESTAMP</span>
);

<span class="c">-- Create indices</span>
<span class="k">CREATE INDEX</span> idx_subscription_site_user <span class="k">ON</span> fc_payment_subscriptions (site_id, user_id);`
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
          __html: `<span class="k">CREATE TABLE</span> fc_payment_transaction_log (
    id <span class="k">BIGSERIAL PRIMARY KEY</span>,
    subscription_id <span class="k">BIGINT</span>,
    site_id <span class="k">BIGINT</span>,
    user_id <span class="k">BIGINT</span>,
    session_id <span class="k">VARCHAR(64)</span>,
    session_ip <span class="k">VARCHAR(48)</span>,
    session_trans_id <span class="k">VARCHAR(64)</span>,
    action <span class="k">VARCHAR(32) DEFAULT ''</span>,
    query_str <span class="k">VARCHAR(255)</span>,
    request <span class="k">TEXT</span>,
    response <span class="k">TEXT</span>,
    status <span class="k">INTEGER</span>,
    api_key <span class="k">VARCHAR(32)</span>,
    created <span class="k">TIMESTAMP</span>
);

<span class="c">-- Create indices</span>
<span class="k">CREATE INDEX</span> idx_transaction_site_user <span class="k">ON</span> fc_payment_transaction_log (site_id, user_id);
<span class="k">CREATE INDEX</span> idx_transaction_status <span class="k">ON</span> fc_payment_transaction_log (status);
<span class="k">CREATE INDEX</span> idx_transaction_subscription <span class="k">ON</span> fc_payment_transaction_log (subscription_id);`
        }} />
      </div>

      <h2>Phase 4: Authorization & Access Control</h2>

      <div className="query-section">
        <div className="query-header">
          <span>Step 7: Roles Table</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="query-description">
          Role definitions for RBAC system (from fc_roles).
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> fc_roles (
    id <span class="k">SERIAL PRIMARY KEY</span>,
    role <span class="k">VARCHAR(255) NOT NULL</span>,
    is_default <span class="k">BOOLEAN</span>,
    created <span class="k">TIMESTAMP NOT NULL</span>,
    modified <span class="k">TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL</span>
);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>Step 8: Privileges Table</span>
          <span className="badge badge-fk">Foreign Keys</span>
        </div>
        <div className="query-description">
          Permission matrix linking roles to resources (from fc_privileges).
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> fc_privileges (
    privilege_id <span class="k">SERIAL PRIMARY KEY</span>,
    role_id <span class="k">INTEGER NOT NULL</span>,
    resource_id <span class="k">INTEGER NOT NULL</span>,
    access <span class="k">BOOLEAN</span>,
    created <span class="k">TIMESTAMP NOT NULL</span>,
    modified <span class="k">TIMESTAMP NOT NULL</span>,
    <span class="k">FOREIGN KEY</span> (role_id) <span class="k">REFERENCES</span> fc_roles(id)
);

<span class="c">-- Create indices</span>
<span class="k">CREATE INDEX</span> idx_privileges_role_id <span class="k">ON</span> fc_privileges (role_id);
<span class="k">CREATE INDEX</span> idx_privileges_resource_id <span class="k">ON</span> fc_privileges (resource_id);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>Step 9: User Role Mapping Table</span>
          <span className="badge badge-fk">Junction Table</span>
        </div>
        <div className="query-description">
          Maps users to roles (from fc_user_role). Composite primary key.
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> fc_user_role (
    user_id <span class="k">INTEGER NOT NULL</span>,
    role_id <span class="k">INTEGER NOT NULL</span>,
    <span class="k">PRIMARY KEY</span> (user_id, role_id),
    <span class="k">FOREIGN KEY</span> (user_id) <span class="k">REFERENCES</span> fc_users(id) <span class="k">ON DELETE CASCADE</span>,
    <span class="k">FOREIGN KEY</span> (role_id) <span class="k">REFERENCES</span> fc_roles(id) <span class="k">ON DELETE CASCADE</span>
);`
        }} />
      </div>

      <h2>Phase 5: Content & Reference Tables</h2>

      <div className="query-section">
        <div className="query-header">
          <span>Step 10: Categories Table</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="query-description">
          Content categories (from fc_categories).
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> fc_categories (
    category_id <span class="k">SMALLSERIAL PRIMARY KEY</span>,
    site_id <span class="k">INTEGER NOT NULL</span>,
    parent <span class="k">VARCHAR(128) DEFAULT ''</span>,
    slug <span class="k">VARCHAR(128) NOT NULL</span>,
    title <span class="k">VARCHAR(128)</span>,
    count <span class="k">INTEGER DEFAULT 0</span>
);

<span class="k">CREATE INDEX</span> idx_categories_slug <span class="k">ON</span> fc_categories (slug);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>Step 11: Resources Table</span>
          <span className="badge badge-table">Table</span>
        </div>
        <div className="query-description">
          Access control resources (from fc_resources).
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> fc_resources (
    resource_id <span class="k">SERIAL PRIMARY KEY</span>,
    name <span class="k">VARCHAR(255) NOT NULL</span>,
    key <span class="k">VARCHAR(255) UNIQUE</span>,
    multiple_assert <span class="k">BOOLEAN</span>,
    assert <span class="k">VARCHAR(32)</span>,
    created <span class="k">TIMESTAMP NOT NULL</span>,
    modified <span class="k">TIMESTAMP NOT NULL</span>
);`
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
          __html: `<span class="k">CREATE TABLE</span> fc_image (
    image_id <span class="k">SERIAL PRIMARY KEY</span>,
    title <span class="k">VARCHAR(255)</span>,
    src <span class="k">VARCHAR(255) NOT NULL</span>,
    extension img_ext <span class="k">NOT NULL</span>,
    hash <span class="k">VARCHAR(32)</span>,
    provider <span class="k">VARCHAR(255)</span>,
    description <span class="k">TEXT</span>,
    access img_access <span class="k">DEFAULT 'public'</span>,
    meta <span class="k">TEXT</span>,
    creator_id <span class="k">INTEGER NOT NULL</span>,
    created <span class="k">TIMESTAMP NOT NULL</span>
);

<span class="k">CREATE TABLE</span> fc_langs (
    lang_id <span class="k">SERIAL PRIMARY KEY</span>,
    code <span class="k">VARCHAR(10) NOT NULL</span>,
    slug <span class="k">VARCHAR(15)</span>,
    title <span class="k">VARCHAR(100) NOT NULL</span>
);`
        }} />
      </div>

      <h2>Phase 6: API Client Mapping</h2>

      <div className="query-section">
        <div className="query-header">
          <span>Step 13: API Client Map User (Junction Table)</span>
          <span className="badge badge-fk">Junction Table</span>
        </div>
        <div className="query-description">
          Maps API clients to users with OAuth tokens (from fc_api_client_map_user).
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> fc_api_client_map_user (
    client_id <span class="k">VARCHAR(32) NOT NULL</span>,
    user_id <span class="k">INTEGER NOT NULL</span>,
    oauth_token <span class="k">VARCHAR(64)</span>,
    refresh_token <span class="k">VARCHAR(64)</span>,
    created_date <span class="k">TIMESTAMP NOT NULL</span>,
    status map_status <span class="k">DEFAULT 'active'</span>,
    last_modified <span class="k">TIMESTAMP</span>,
    <span class="k">PRIMARY KEY</span> (client_id, user_id)
);`
        }} />
      </div>

      <h2>Phase 7: Triggers & Constraints</h2>

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

<span class="c">-- Apply trigger to fc_api_client</span>
<span class="k">CREATE TRIGGER</span> update_fc_api_client_timestamp
<span class="k">BEFORE UPDATE ON</span> fc_api_client
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
          __html: `<span class="k">ALTER TABLE</span> fc_api_client_map_user
<span class="k">ADD CONSTRAINT</span> fk_client_map_user_client
<span class="k">FOREIGN KEY</span> (client_id) <span class="k">REFERENCES</span> fc_api_client(client_id)
<span class="k">ON DELETE CASCADE ON UPDATE CASCADE</span>;

<span class="k">ALTER TABLE</span> fc_api_client_map_user
<span class="k">ADD CONSTRAINT</span> fk_client_map_user_user
<span class="k">FOREIGN KEY</span> (user_id) <span class="k">REFERENCES</span> fc_users(id)
<span class="k">ON DELETE CASCADE ON UPDATE CASCADE</span>;

<span class="k">ALTER TABLE</span> fc_payment_subscriptions
<span class="k">ADD CONSTRAINT</span> fk_subscription_user
<span class="k">FOREIGN KEY</span> (user_id) <span class="k">REFERENCES</span> fc_users(id)
<span class="k">ON DELETE CASCADE</span>;`
        }} />
      </div>

      <h2>Phase 8: Data Migration</h2>

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
<span class="k">ALTER TABLE</span> fc_api_client <span class="k">DISABLE TRIGGER ALL</span>;

<span class="c">-- 2. Import data via COPY (from exported CSV)</span>
<span class="k">COPY</span> fc_users (id, site_id, username, user_login, password, password_salt, email, user_type, status, date_joined, meta, updated, last_login_date)
<span class="k">FROM</span> <span class="s">'/tmp/fc_users.csv'</span>
<span class="k">WITH</span> (FORMAT csv, HEADER true, DELIMITER <span class="s">','</span>);

<span class="c">-- 3. Reset sequences to max ID + 1</span>
<span class="k">SELECT</span> setval(<span class="s">'fc_users_id_seq'</span>, (SELECT MAX(id) FROM fc_users) + <span class="n">1</span>);
<span class="k">SELECT</span> setval(<span class="s">'fc_api_access_logs_api_access_log_id_seq'</span>, (SELECT MAX(api_access_log_id) FROM fc_api_access_logs) + <span class="n">1</span>);
<span class="k">SELECT</span> setval(<span class="s">'fc_payment_subscriptions_id_seq'</span>, (SELECT MAX(id) FROM fc_payment_subscriptions) + <span class="n">1</span>);

<span class="c">-- 4. Re-enable triggers</span>
<span class="k">ALTER TABLE</span> fc_api_client <span class="k">ENABLE TRIGGER ALL</span>;`
        }} />
      </div>

      <h2>Phase 9: Verification Queries</h2>

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
    <span class="s">'fc_users'</span> <span class="k">AS</span> table_name, 
    COUNT(*) <span class="k">AS</span> row_count 
<span class="k">FROM</span> fc_users
<span class="k">UNION ALL</span>
<span class="k">SELECT</span> <span class="s">'fc_api_access_logs'</span>, COUNT(*) <span class="k">FROM</span> fc_api_access_logs
<span class="k">UNION ALL</span>
<span class="k">SELECT</span> <span class="s">'fc_payment_subscriptions'</span>, COUNT(*) <span class="k">FROM</span> fc_payment_subscriptions;

<span class="c">-- Check for NULL violations</span>
<span class="k">SELECT</span> COUNT(*) <span class="k">AS</span> null_statuses
<span class="k">FROM</span> fc_users 
<span class="k">WHERE</span> status <span class="k">IS NULL</span>;

<span class="c">-- Verify indices are created</span>
<span class="k">SELECT</span> tablename, indexname 
<span class="k">FROM</span> pg_indexes 
<span class="k">WHERE</span> schemaname = <span class="s">'public'</span> 
<span class="k">AND</span> tablename LIKE <span class="s">'fc_%'</span>
<span class="k">ORDER BY</span> tablename;`
        }} />
      </div>

      <h2>Appendix: Schema Summary</h2>

      <h3>All Tables Created</h3>
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
            <td>fc_api_access_logs</td>
            <td>api_access_log_id</td>
            <td>SERIAL</td>
            <td>API request logging</td>
          </tr>
          <tr>
            <td>fc_api_client</td>
            <td>user_id</td>
            <td>INTEGER</td>
            <td>OAuth client config</td>
          </tr>
          <tr>
            <td>fc_users</td>
            <td>id</td>
            <td>SERIAL</td>
            <td>User accounts</td>
          </tr>
          <tr>
            <td>fc_payment_subscriptions</td>
            <td>id</td>
            <td>SERIAL</td>
            <td>Billing subscriptions</td>
          </tr>
          <tr>
            <td>fc_payment_transaction_log</td>
            <td>id</td>
            <td>BIGSERIAL</td>
            <td>Transaction history</td>
          </tr>
          <tr>
            <td>fc_roles</td>
            <td>id</td>
            <td>SERIAL</td>
            <td>Role definitions</td>
          </tr>
          <tr>
            <td>fc_privileges</td>
            <td>privilege_id</td>
            <td>SERIAL</td>
            <td>Permission matrix</td>
          </tr>
          <tr>
            <td>fc_user_role</td>
            <td>(user_id, role_id)</td>
            <td>Composite</td>
            <td>User-role mapping</td>
          </tr>
          <tr>
            <td>fc_categories</td>
            <td>category_id</td>
            <td>SMALLSERIAL</td>
            <td>Content categories</td>
          </tr>
          <tr>
            <td>fc_resources</td>
            <td>resource_id</td>
            <td>SERIAL</td>
            <td>Access resources</td>
          </tr>
          <tr>
            <td>fc_image</td>
            <td>image_id</td>
            <td>SERIAL</td>
            <td>Media management</td>
          </tr>
          <tr>
            <td>fc_langs</td>
            <td>lang_id</td>
            <td>SERIAL</td>
            <td>Language support</td>
          </tr>
          <tr>
            <td>fc_api_client_map_user</td>
            <td>(client_id, user_id)</td>
            <td>Composite</td>
            <td>Client-user mapping</td>
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
            <td>fc_api_access_logs</td>
            <td>HTTP verb tracking</td>
          </tr>
          <tr>
            <td>client_status</td>
            <td>active, inactive, deleted, ''</td>
            <td>fc_api_client</td>
            <td>Client state</td>
          </tr>
          <tr>
            <td>client_type</td>
            <td>admin, application</td>
            <td>fc_api_client</td>
            <td>Client classification</td>
          </tr>
          <tr>
            <td>map_status</td>
            <td>active, deleted</td>
            <td>fc_api_client_map_user</td>
            <td>Mapping status</td>
          </tr>
          <tr>
            <td>user_status</td>
            <td>active, inactive, pending, deleted</td>
            <td>fc_users</td>
            <td>User account status</td>
          </tr>
          <tr>
            <td>sub_status</td>
            <td>new, active, canceled, expired</td>
            <td>fc_payment_subscriptions</td>
            <td>Subscription status</td>
          </tr>
          <tr>
            <td>img_ext</td>
            <td>jpeg, jpg, png, gif</td>
            <td>fc_image</td>
            <td>Image file types</td>
          </tr>
          <tr>
            <td>img_access</td>
            <td>private, public, inactive, deleted</td>
            <td>fc_image</td>
            <td>Image access level</td>
          </tr>
        </tbody>
      </table>
    </main>
  )
}