import type { Metadata } from 'next'
import FlashcardsTableUsageModal from '../../../components/FlashcardsTableUsageModal'

export const metadata: Metadata = {
  title: 'MySQL to PostgreSQL Schema Mapping',
  description: 'Complete schema mapping guide from MySQL to PostgreSQL with enum types',
}

export default function MySQLToPostgresSchemaMapping() {
  const enumTypes = [
    { name: 'http_method', values: ['get', 'post', 'put', 'delete'] },
    { name: 'client_status', values: ['active', 'inactive', 'deleted', ''] },
    { name: 'client_type', values: ['admin', 'application'] },
    { name: 'map_status', values: ['active', 'deleted'] },
    { name: 'token_type', values: ['request', 'access'] },
    { name: 'img_ext', values: ['jpeg', 'jpg', 'png', 'gif'] },
    { name: 'img_access', values: ['private', 'public', 'inactive', 'deleted'] },
    { name: 'sub_status', values: ['new', 'active', 'canceled', 'expired'] },
    { name: 'report_status', values: ['In progress', 'Deleted', 'Processed'] },
    { name: 'user_status', values: ['active', 'inactive', 'pending', 'deleted'] },
  ];


  const tables = [
    {
      number: 1,
      name: 'categories',
      mysqlName: 'fc_categories',
      columns: [
        { pg: 'category_id', type: 'SMALLSERIAL', mysql: 'smallint auto_inc', notes: 'SmallSerial' },
        { pg: 'site_id', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'parent', type: 'VARCHAR(128)', mysql: 'varchar(128)', notes: '' },
        { pg: 'slug', type: 'VARCHAR(128)', mysql: 'varchar(128)', notes: '' },
        { pg: 'title', type: 'VARCHAR(128)', mysql: 'varchar(128)', notes: '' },
        { pg: 'count', type: 'INTEGER', mysql: 'int', notes: '' },
      ]
    },
    {
      number: 2,
      name: 'image',
      mysqlName: 'fc_image',
      columns: [
        { pg: 'image_id', type: 'SERIAL', mysql: 'int auto_inc', notes: '' },
        { pg: 'title', type: 'VARCHAR(255)', mysql: 'varchar(255)', notes: '' },
        { pg: 'src', type: 'VARCHAR(255)', mysql: 'varchar(255)', notes: '' },
        { pg: 'extension', type: 'img_ext', mysql: 'enum(...)', notes: '' },
        { pg: 'hash', type: 'VARCHAR(32)', mysql: 'varchar(32)', notes: '' },
        { pg: 'provider', type: 'VARCHAR(255)', mysql: 'varchar(255)', notes: '' },
        { pg: 'description', type: 'TEXT', mysql: 'text', notes: '' },
        { pg: 'access', type: 'img_access', mysql: 'enum(...)', notes: '' },
        { pg: 'meta', type: 'TEXT', mysql: 'text', notes: '' },
        { pg: 'creator_id', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'created', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
      ]
    },
    {
      number: 3,
      name: 'gaming_totals',
      mysqlName: 'fc_jewel_score_totals + fc_stellarspeller_score_totals',
      columns: [
        { pg: 'id', type: 'SERIAL', mysql: 'N/A', notes: 'New PG primary key' },
        { pg: 'set_id', type: 'INTEGER', mysql: 'int pk', notes: 'From MySQL PK' },
        { pg: 'game_type', type: 'VARCHAR(50)', mysql: 'N/A', notes: "'jewel' or 'stellarspeller'" },
        { pg: 'num_scores', type: 'INTEGER', mysql: 'int', notes: 'Default 0' },
        { pg: 'sum_scores', type: 'INTEGER', mysql: 'int', notes: 'Default 0' },
      ]
    },
    {
      number: 4,
      name: 'gaming_scores',
      mysqlName: 'fc_jewel_scores + fc_stellarspeller_scores',
      columns: [
        { pg: 'id', type: 'SERIAL', mysql: 'int auto_inc', notes: 'Primary Key' },
        { pg: 'game_type', type: 'VARCHAR(50)', mysql: 'N/A', notes: "'jewel' or 'stellarspeller'" },
        { pg: 'score', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'name', type: 'VARCHAR(31)', mysql: 'varchar(31)', notes: '' },
        { pg: 'accuracy', type: 'VARCHAR(31)', mysql: 'varchar(31)', notes: '' },
        { pg: 'user_id', type: 'INTEGER', mysql: 'int', notes: 'Default 0' },
        { pg: 'created', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
        { pg: 'set_id', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'time', type: 'INTEGER', mysql: 'int', notes: 'Milliseconds to finish set' },
      ]
    },
    {
      number: 5,
      name: 'payment_subscriptions',
      mysqlName: 'fc_payment_subscriptions',
      columns: [
        { pg: 'subscription_id', type: 'SERIAL', mysql: 'int auto_inc (id)', notes: 'Renamed from id' },
        { pg: 'user_id', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'external_id', type: 'VARCHAR(255)', mysql: 'varchar(64)', notes: 'Kept generic' },
        { pg: 'status', type: 'sub_status', mysql: 'enum(...)', notes: '' },
        { pg: 'plan', type: 'VARCHAR(100)', mysql: 'varchar(64)', notes: 'Kept original name' },
        { pg: 'amount', type: 'INTEGER', mysql: 'int', notes: 'MySQL has INT, not DECIMAL' },
        { pg: 'currency', type: 'VARCHAR(3)', mysql: 'varchar(3)', notes: '' },
        { pg: 'current_period_start', type: 'TIMESTAMP', mysql: 'datetime (current_period_started)', notes: 'Renamed' },
        { pg: 'current_period_end', type: 'TIMESTAMP', mysql: 'datetime (current_period_ends)', notes: 'Renamed' },
        { pg: 'canceled_at', type: 'TIMESTAMP', mysql: 'datetime (canceled)', notes: 'Renamed' },
        { pg: 'created_at', type: 'TIMESTAMP', mysql: 'datetime (activated)', notes: 'Renamed from activated' },
        { pg: 'updated_at', type: 'TIMESTAMP', mysql: 'timestamp (updated)', notes: '' },
      ]
    },
    {
      number: 6,
      name: 'payment_transaction_log',
      mysqlName: 'fc_payment_transaction_log',
      columns: [
        { pg: 'transaction_id', type: 'SERIAL', mysql: 'int auto_inc (id)', notes: 'Renamed from id' },
        { pg: 'user_id', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'session_trans_id', type: 'VARCHAR(255)', mysql: 'varchar(64)', notes: 'Kept original name' },
        { pg: 'status', type: 'INTEGER', mysql: 'int', notes: 'MySQL has INT status' },
        { pg: 'request', type: 'TEXT', mysql: 'text', notes: 'Kept original name' },
        { pg: 'response', type: 'TEXT', mysql: 'text', notes: 'Kept original name' },
        { pg: 'created_at', type: 'TIMESTAMP', mysql: 'datetime (created)', notes: 'Renamed' },
      ]
    },
    {
      number: 7,
      name: 'user_social',
      mysqlName: 'fc_user_social',
      columns: [
        { pg: 'user_id', type: 'INTEGER', mysql: 'int pk', notes: 'Part of Composite PK' },
        { pg: 'social_type', type: 'VARCHAR(16)', mysql: 'varchar(16) pk', notes: 'Part of Composite PK' },
        { pg: 'social_id', type: 'VARCHAR(32)', mysql: 'varchar(32) pk', notes: 'Part of Composite PK' },
        { pg: 'converted', type: 'BOOLEAN', mysql: 'tinyint(1)', notes: '' },
        { pg: 'meta', type: 'TEXT', mysql: 'text', notes: '' },
        { pg: 'created', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
        { pg: 'updated', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
        { pg: 'site_id', type: 'SMALLINT', mysql: 'smallint', notes: 'Default 100' },
      ]
    },
    {
      number: 8,
      name: 'users',
      mysqlName: 'fc_users',
      columns: [
        { pg: 'user_id', type: 'SERIAL', mysql: 'int auto_inc (id)', notes: 'Renamed from id' },
        { pg: 'username', type: 'VARCHAR(100)', mysql: 'varchar(64)', notes: '' },
        { pg: 'email', type: 'VARCHAR(255)', mysql: 'varchar(100)', notes: '' },
        { pg: 'password_hash', type: 'VARCHAR(255)', mysql: 'varchar(40) (password)', notes: 'Renamed from password' },
        { pg: 'status', type: 'user_status', mysql: 'enum(...)', notes: '' },
        { pg: 'last_login', type: 'TIMESTAMP', mysql: 'datetime (last_login_date)', notes: 'Renamed' },
        { pg: 'created_at', type: 'TIMESTAMP', mysql: 'datetime (date_joined)', notes: 'Renamed from date_joined' },
        { pg: 'updated_at', type: 'TIMESTAMP', mysql: 'datetime (updated)', notes: '' },
      ]
    },
    {
      number: 9,
      name: 'user_cancellation_reason_log',
      mysqlName: 'user_cancellation_reason_log',
      columns: [
        { pg: 'log_id', type: 'SERIAL', mysql: 'int auto_inc (logId)', notes: 'camelCase → snake_case' },
        { pg: 'user_id', type: 'INTEGER', mysql: 'int (userId)', notes: 'camelCase → snake_case' },
        { pg: 'reason_id', type: 'SMALLINT', mysql: 'tinyint (reasonId)', notes: 'Preserved numeric ID, camelCase → snake_case' },
        { pg: 'reason_text', type: 'TEXT', mysql: 'text (reasonText)', notes: 'User feedback, camelCase → snake_case' },
        { pg: 'created_at', type: 'TIMESTAMP', mysql: 'int (createdAt)', notes: 'Unix timestamp → TIMESTAMP, camelCase → snake_case' },
      ]
    }
  ];

  const getBadgeClass = (type: string) => {
    if (type === 'SERIAL') return 't-pk';
    if (type.includes('VARCHAR') || type === 'TEXT') return 't-text';
    if (type === 'INTEGER') return 't-int';
    if (type === 'BOOLEAN') return 't-bool';
    if (type === 'TIMESTAMP') return 't-ts';
    if (type === 'JSONB') return 't-json';
    if (['http_method', 'client_status', 'client_type', 'map_status', 'token_type',
      'img_ext', 'img_access', 'sub_status', 'report_status', 'user_status'].includes(type)) {
      return 't-enum';
    }
    return 't-text';
  };

  return (
    <main>
      <h1>MySQL → PostgreSQL: Schema Mapping</h1>

      <div className="mb-6" style={{ marginBottom: '20px' }}>
        <FlashcardsTableUsageModal />
      </div>

      <div className="enum-section">
        <div className="enum-title">PostgreSQL Enum Types (Derived from MySQL definitions)</div>
        <div className="enum-grid">
          <div className="enum-item"><span className="enum-name">http_method</span>: 'get', 'post', 'put', 'delete'</div>
          <div className="enum-item"><span className="enum-name">client_status</span>: 'active', 'inactive', 'deleted', ''</div>
          <div className="enum-item"><span className="enum-name">client_type</span>: 'admin', 'application'</div>
          <div className="enum-item"><span className="enum-name">map_status</span>: 'active', 'deleted'</div>
          <div className="enum-item"><span className="enum-name">token_type</span>: 'request', 'access'</div>
          <div className="enum-item"><span className="enum-name">img_ext</span>: 'jpeg', 'jpg', 'png', 'gif'</div>
          <div className="enum-item"><span className="enum-name">img_access</span>: 'private', 'public', 'inactive', 'deleted'</div>
          <div className="enum-item"><span className="enum-name">sub_status</span>: 'new', 'active', 'canceled', 'expired'</div>
          <div className="enum-item"><span className="enum-name">report_status</span>: 'In progress', 'Deleted', 'Processed'</div>
          <div className="enum-item"><span className="enum-name">user_status</span>: 'active', 'inactive', 'pending', 'deleted'</div>
        </div>
      </div>

      {tables.map((table) => (
        <div key={table.name}>
          <h2>{table.number}. {table.name.replace(/_/g, ' ')} <span className="mysql-name">{table.mysqlName}</span></h2>
          <table>
            <thead><tr><th className="col-pg">Postgres Column</th><th className="col-type">Type</th><th className="col-my">MySQL Source</th><th className="col-note">Notes</th></tr></thead>
            <tbody>
              {table.columns.map((col, idx) => (
                <tr key={idx}>
                  <td><span className="pg-col">{col.pg}</span></td>
                  <td><span className={`badge ${getBadgeClass(col.type)}`}>{col.type}</span></td>
                  <td><span className="my-def">{col.mysql}</span></td>
                  <td>{col.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <h1 className="source-header">Excluded from Migration</h1>
      <div className="opt-note" style={{ borderColor: '#ff6b6b', background: '#fff5f5' }}>
        <strong>The following MySQL tables are NOT migrated to PostgreSQL:</strong>
        <p style={{ margin: '10px 0 5px 0' }}>Based on codebase analysis, these tables are either unused, legacy migration artifacts, or have been replaced by other systems.</p>
      </div>

      <h2>RBAC System Tables (Unused)</h2>
      <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>The Role-Based Access Control (RBAC) system was never fully implemented.</p>
      <table>
        <thead>
          <tr>
            <th className="col-name">MySQL Table</th>
            <th className="col-notes">Reason for Exclusion</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>fc_roles</code></td>
            <td>No references in active application code.</td>
          </tr>
          <tr>
            <td><code>fc_privileges</code></td>
            <td>No references in active application code.</td>
          </tr>
          <tr>
            <td><code>fc_resources</code></td>
            <td>No references in active application code.</td>
          </tr>
          <tr>
            <td><code>fc_user_role</code></td>
            <td>Only found in old migration scripts.</td>
          </tr>
        </tbody>
      </table>

      <h2>Apps Marketplace Tables (Never Implemented)</h2>
      <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>The apps marketplace feature was planned but never implemented. Only translation keys exist.</p>
      <table>
        <thead>
          <tr>
            <th className="col-name">MySQL Table</th>
            <th className="col-notes">Reason for Exclusion</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>fc_apps</code></td>
            <td>No actual table usage in models or controllers.</td>
          </tr>
          <tr>
            <td><code>fc_apps_data</code></td>
            <td>No references found in codebase.</td>
          </tr>
          <tr>
            <td><code>fc_apps_dev</code></td>
            <td>No references found in codebase.</td>
          </tr>
          <tr>
            <td><code>fc_apps_images</code></td>
            <td>No references found in codebase.</td>
          </tr>
        </tbody>
      </table>

      <h2>API Aggregate Tables (Unused)</h2>
      <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>Intended for API analytics but never implemented.</p>
      <table>
        <thead>
          <tr>
            <th className="col-name">MySQL Table</th>
            <th className="col-notes">Reason for Exclusion</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>fc_api_aggregate_functions</code></td>
            <td>No references found in codebase.</td>
          </tr>
          <tr>
            <td><code>fc_api_aggregate_methods</code></td>
            <td>No references found in codebase.</td>
          </tr>
        </tbody>
      </table>

      <h2>Deprecated API Tables</h2>
      <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>Legacy API infrastructure with no recent activity. Last records date back to 2012-2015.</p>
      <table>
        <thead>
          <tr>
            <th className="col-name">MySQL Table</th>
            <th className="col-notes">Reason for Exclusion</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>fc_api_access_logs</code></td>
            <td>Last record: 2014-05-26. Deprecated API logging system, replaced by modern analytics infrastructure.</td>
          </tr>
          <tr>
            <td><code>fc_api_client</code></td>
            <td>Last record: 2015-04-11. Legacy OAuth client system no longer in use.</td>
          </tr>
          <tr>
            <td><code>fc_api_client_map_user</code></td>
            <td>Last record: 2015-04-11. Client-user mapping for deprecated API system.</td>
          </tr>
          <tr>
            <td><code>fc_api_v1_nonce</code></td>
            <td>Last record: 1397042008 (Unix timestamp: 2014-04-09). OAuth nonce tracking for deprecated API v1.</td>
          </tr>
          <tr>
            <td><code>fc_api_v1_vendor</code></td>
            <td>Last record: 2012-10-25. Vendor management for discontinued API v1.</td>
          </tr>
          <tr>
            <td><code>fc_api_v1_request</code></td>
            <td>Last record: 1397042016 (Unix timestamp: 2014-04-09). Request tracking for deprecated API v1.</td>
          </tr>
        </tbody>
      </table>

      <h2>Gaming Features (Consolidated)</h2>
      <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>
        <strong>✓ Implemented:</strong> The following gaming tables have been consolidated into two unified tables: <code>gaming_scores</code> and <code>gaming_totals</code> to reduce schema complexity and improve maintainability.
      </p>
      <table>
        <thead>
          <tr>
            <th className="col-name">Original MySQL Table</th>
            <th className="col-notes">Consolidated Into</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>fc_jewel_scores</code></td>
            <td><code>gaming_scores</code> with game_type='jewel'</td>
          </tr>
          <tr>
            <td><code>fc_jewel_score_totals</code></td>
            <td><code>gaming_totals</code> with game_type='jewel'</td>
          </tr>
          <tr>
            <td><code>fc_stellarspeller_scores</code></td>
            <td><code>gaming_scores</code> with game_type='stellarspeller'</td>
          </tr>
          <tr>
            <td><code>fc_stellarspeller_score_totals</code></td>
            <td><code>gaming_totals</code> with game_type='stellarspeller'</td>
          </tr>
        </tbody>
      </table>

      <h2>Feature-Specific Exclusions</h2>
      <table>
        <thead>
          <tr>
            <th className="col-name">MySQL Table</th>
            <th className="col-notes">Reason for Exclusion</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>fc_user_email_notifications</code></td>
            <td>Feature not currently in use. Can be migrated later if email notification system is reactivated.</td>
          </tr>
          <tr>
            <td><code>fc_reports</code></td>
            <td>Content flagging now handled by Learneo platform. No longer needed in Cram database.</td>
          </tr>
          <tr>
            <td><code>fc_takedowns</code></td>
            <td>Migrate data to admin table instead of creating new PostgreSQL table. Moderation handled separately.</td>
          </tr>
          <tr>
            <td><code>translations</code></td>
            <td>I18n feature not supported in new Cram website. Translation system not implemented.</td>
          </tr>
          <tr>
            <td><code>fc_essay_link_support</code></td>
            <td>Essay link feature discontinued. No longer part of product roadmap.</td>
          </tr>
          <tr>
            <td><code>users_nta</code></td>
            <td>NTA (No Triggers Applied) users not supported. Cram is free for all users initially, making this table unnecessary.</td>
          </tr>
          <tr>
            <td><code>user_subscriptions</code></td>
            <td>Notification/subscription system being remodeled. Existing data not compatible with new architecture.</td>
          </tr>
        </tbody>
      </table>

      <h2>Migration Artifact Tables</h2>
      <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>One-time migration tables no longer needed.</p>
      <table>
        <thead>
          <tr>
            <th className="col-name">MySQL Table</th>
            <th className="col-notes">Reason for Exclusion</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>fcdb_to_fce_cardset_map</code></td>
            <td>FlashcardDB → FCE migration. Only in migration scripts.</td>
          </tr>
          <tr>
            <td><code>fcdb_to_fce_meta</code></td>
            <td>Migration metadata. Only in migration scripts.</td>
          </tr>
          <tr>
            <td><code>fcdb_to_fce_user_map</code></td>
            <td>User ID mapping. Only in migration scripts.</td>
          </tr>
          <tr>
            <td><code>temp_fcimage_migration_data</code></td>
            <td>Temporary image migration table.</td>
          </tr>
          <tr>
            <td><code>temp_fcimage_migration_data_backup</code></td>
            <td>Image migration backup table.</td>
          </tr>
          <tr>
            <td><code>temp_fcimage_migration_limits</code></td>
            <td>Image migration configuration.</td>
          </tr>
          <tr>
            <td><code>temp_fcimage_migration_processed</code></td>
            <td>Image migration progress tracking.</td>
          </tr>
        </tbody>
      </table>

      <h2>Other Legacy Tables</h2>
      <table>
        <thead>
          <tr>
            <th className="col-name">MySQL Table</th>
            <th className="col-notes">Reason for Exclusion</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>fc_langs</code></td>
            <td>Replaced by <code>translations</code> table. No active usage.</td>
          </tr>
          <tr>
            <td><code>legacy_stub_users</code></td>
            <td>Legacy user stub data. No references in active code.</td>
          </tr>
        </tbody>
      </table>

    </main>
  )
}
