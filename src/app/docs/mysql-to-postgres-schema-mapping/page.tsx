import type { Metadata } from 'next'

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
      name: 'api_access_logs',
      mysqlName: 'fc_api_access_logs',
      columns: [
        { pg: 'api_access_log_id', type: 'SERIAL', mysql: 'int auto_inc', notes: '' },
        { pg: 'client_id', type: 'VARCHAR(32)', mysql: 'varchar(32)', notes: '' },
        { pg: 'user_id', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'method', type: 'http_method', mysql: 'enum(...)', notes: '' },
        { pg: 'request_uri_raw', type: 'VARCHAR(255)', mysql: 'varchar(255)', notes: '' },
        { pg: 'request_uri', type: 'VARCHAR(255)', mysql: 'varchar(255)', notes: '' },
        { pg: 'client_ip', type: 'VARCHAR(100)', mysql: 'varchar(100)', notes: '' },
        { pg: 'http_response_code', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'meta', type: 'TEXT', mysql: 'text', notes: '' },
        { pg: 'created_date', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
      ]
    },
{
      number: 2,
      name: 'api_client',
      mysqlName: 'fc_api_client',
      columns: [
        { pg: 'client_id', type: 'VARCHAR(32)', mysql: 'varchar(32) pk', notes: 'Primary Key' },
        { pg: 'status', type: 'client_status', mysql: 'enum', notes: 'Active status' },
        { pg: 'client_type', type: 'client_type', mysql: 'enum', notes: 'Type classification' },
        { pg: 'api_key_hash', type: 'TEXT', mysql: 'text', notes: 'Hashed API key' },
        { pg: 'created_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
        { pg: 'updated_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
      ]
    },
{
      number: 3,
      name: 'api_client_map_user',
      mysqlName: 'fc_api_client_map_user',
      columns: [
        { pg: 'client_id', type: 'VARCHAR(32)', mysql: 'varchar(32) pk', notes: 'Primary Key' },
        { pg: 'user_id', type: 'INTEGER', mysql: 'int pk', notes: 'Primary Key' },
        { pg: 'created_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
      ]
    },
{
      number: 4,
      name: 'api_v1_nonce',
      mysqlName: 'fc_api_v1_nonce',
      columns: [
        { pg: 'nonce', type: 'VARCHAR(32)', mysql: 'varchar(32) pk', notes: 'Primary Key' },
        { pg: 'client_id', type: 'VARCHAR(32)', mysql: 'varchar(32)', notes: '' },
        { pg: 'created_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
      ]
    },
{
      number: 5,
      name: 'api_v1_vendor',
      mysqlName: 'fc_api_v1_vendor',
      columns: [
        { pg: 'vendor_id', type: 'SERIAL', mysql: 'int auto_inc pk', notes: 'Primary Key' },
        { pg: 'client_id', type: 'VARCHAR(32)', mysql: 'varchar(32)', notes: '' },
        { pg: 'vendor_name', type: 'VARCHAR(255)', mysql: 'varchar(255)', notes: '' },
        { pg: 'created_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
      ]
    },
{
      number: 6,
      name: 'api_v1_request',
      mysqlName: 'fc_api_v1_request',
      columns: [
        { pg: 'request_id', type: 'SERIAL', mysql: 'int auto_inc pk', notes: 'Primary Key' },
        { pg: 'vendor_id', type: 'INTEGER', mysql: 'int fk', notes: 'Foreign Key' },
        { pg: 'client_id', type: 'VARCHAR(32)', mysql: 'varchar(32)', notes: '' },
        { pg: 'request_type', type: 'VARCHAR(50)', mysql: 'varchar(50)', notes: '' },
        { pg: 'request_data', type: 'JSONB', mysql: 'json', notes: '' },
        { pg: 'response_data', type: 'JSONB', mysql: 'json', notes: '' },
        { pg: 'status', type: 'VARCHAR(20)', mysql: 'varchar(20)', notes: '' },
        { pg: 'created_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
        { pg: 'processed_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
      ]
    },
{
      number: 7,
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
      number: 8,
      name: 'essay_link_support',
      mysqlName: 'fc_essay_link_support',
      columns: [
        { pg: 'id', type: 'SERIAL', mysql: 'int auto_inc', notes: '' },
        { pg: 'target_url', type: 'TEXT', mysql: 'text', notes: '' },
        { pg: 'url1', type: 'TEXT', mysql: 'text', notes: '' },
        { pg: 'anchor1', type: 'VARCHAR(255)', mysql: 'varchar(255)', notes: '' },
        { pg: 'url2', type: 'TEXT', mysql: 'text', notes: '' },
        { pg: 'anchor2', type: 'VARCHAR(255)', mysql: 'varchar(255)', notes: '' },
        { pg: 'url3', type: 'TEXT', mysql: 'text', notes: '' },
        { pg: 'anchor3', type: 'VARCHAR(255)', mysql: 'varchar(255)', notes: '' },
      ]
    },
{
      number: 9,
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
      number: 10,
      name: 'jewel_score_totals',
      mysqlName: 'fc_jewel_score_totals',
      columns: [
        { pg: 'id', type: 'SERIAL', mysql: 'int auto_inc', notes: '' },
        { pg: 'user_id', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'total_score', type: 'INTEGER', mysql: 'int', notes: 'Default 0' },
        { pg: 'games_played', type: 'INTEGER', mysql: 'int', notes: 'Default 0' },
        { pg: 'updated_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
      ]
    },
{
      number: 11,
      name: 'jewel_scores',
      mysqlName: 'fc_jewel_scores',
      columns: [
        { pg: 'score_id', type: 'SERIAL', mysql: 'int auto_inc', notes: '' },
        { pg: 'user_id', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'score', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'level', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'game_duration', type: 'INTEGER', mysql: 'int', notes: 'Seconds' },
        { pg: 'created_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
      ]
    },
{
      number: 12,
      name: 'payment_subscriptions',
      mysqlName: 'fc_payment_subscriptions',
      columns: [
        { pg: 'subscription_id', type: 'SERIAL', mysql: 'int auto_inc', notes: '' },
        { pg: 'user_id', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'stripe_subscription_id', type: 'VARCHAR(255)', mysql: 'varchar(255)', notes: '' },
        { pg: 'status', type: 'sub_status', mysql: 'enum(...)', notes: '' },
        { pg: 'plan_name', type: 'VARCHAR(100)', mysql: 'varchar(100)', notes: '' },
        { pg: 'amount', type: 'NUMERIC(10,2)', mysql: 'decimal(10,2)', notes: '' },
        { pg: 'currency', type: 'VARCHAR(3)', mysql: 'varchar(3)', notes: '' },
        { pg: 'interval', type: 'VARCHAR(20)', mysql: 'varchar(20)', notes: '' },
        { pg: 'current_period_start', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
        { pg: 'current_period_end', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
        { pg: 'trial_start', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
        { pg: 'trial_end', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
        { pg: 'canceled_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
        { pg: 'created_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
        { pg: 'updated_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
      ]
    },
{
      number: 13,
      name: 'payment_transaction_log',
      mysqlName: 'fc_payment_transaction_log',
      columns: [
        { pg: 'transaction_id', type: 'SERIAL', mysql: 'int auto_inc', notes: '' },
        { pg: 'user_id', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'stripe_charge_id', type: 'VARCHAR(255)', mysql: 'varchar(255)', notes: '' },
        { pg: 'amount', type: 'NUMERIC(10,2)', mysql: 'decimal(10,2)', notes: '' },
        { pg: 'currency', type: 'VARCHAR(3)', mysql: 'varchar(3)', notes: '' },
        { pg: 'status', type: 'VARCHAR(50)', mysql: 'varchar(50)', notes: '' },
        { pg: 'description', type: 'TEXT', mysql: 'text', notes: '' },
        { pg: 'metadata', type: 'JSONB', mysql: 'json', notes: '' },
        { pg: 'created_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
      ]
    },
{
      number: 14,
      name: 'reports',
      mysqlName: 'fc_reports',
      columns: [
        { pg: 'report_id', type: 'SERIAL', mysql: 'int auto_inc', notes: '' },
        { pg: 'user_id', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'report_type', type: 'VARCHAR(50)', mysql: 'varchar(50)', notes: '' },
        { pg: 'status', type: 'report_status', mysql: 'enum(...)', notes: '' },
        { pg: 'title', type: 'VARCHAR(255)', mysql: 'varchar(255)', notes: '' },
        { pg: 'content', type: 'TEXT', mysql: 'text', notes: '' },
        { pg: 'metadata', type: 'JSONB', mysql: 'json', notes: '' },
        { pg: 'created_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
        { pg: 'resolved_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
      ]
    },
{
      number: 15,
      name: 'stellarspeller_score_totals',
      mysqlName: 'fc_stellarspeller_score_totals',
      columns: [
        { pg: 'id', type: 'SERIAL', mysql: 'int auto_inc', notes: '' },
        { pg: 'user_id', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'total_score', type: 'INTEGER', mysql: 'int', notes: 'Default 0' },
        { pg: 'games_played', type: 'INTEGER', mysql: 'int', notes: 'Default 0' },
        { pg: 'updated_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
      ]
    },
{
      number: 16,
      name: 'stellarspeller_scores',
      mysqlName: 'fc_stellarspeller_scores',
      columns: [
        { pg: 'score_id', type: 'SERIAL', mysql: 'int auto_inc', notes: '' },
        { pg: 'user_id', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'score', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'level', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'words_found', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'time_bonus', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'created_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
      ]
    },
{
      number: 17,
      name: 'takedowns',
      mysqlName: 'fc_takedowns',
      columns: [
        { pg: 'takedown_id', type: 'SERIAL', mysql: 'int auto_inc', notes: '' },
        { pg: 'user_id', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'moderator_id', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'content_type', type: 'VARCHAR(50)', mysql: 'varchar(50)', notes: '' },
        { pg: 'content_id', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'reason', type: 'TEXT', mysql: 'text', notes: '' },
        { pg: 'status', type: 'VARCHAR(20)', mysql: 'varchar(20)', notes: '' },
        { pg: 'created_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
        { pg: 'resolved_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
      ]
    },
{
      number: 18,
      name: 'user_email_notifications',
      mysqlName: 'fc_user_email_notifications',
      columns: [
        { pg: 'notification_id', type: 'SERIAL', mysql: 'int auto_inc', notes: '' },
        { pg: 'user_id', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'notification_type', type: 'VARCHAR(100)', mysql: 'varchar(100)', notes: '' },
        { pg: 'email_sent', type: 'BOOLEAN', mysql: 'tinyint(1)', notes: '' },
        { pg: 'sent_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
        { pg: 'created_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
      ]
    },
{
      number: 19,
      name: 'user_social',
      mysqlName: 'fc_user_social',
      columns: [
        { pg: 'social_id', type: 'SERIAL', mysql: 'int auto_inc', notes: '' },
        { pg: 'user_id', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'provider', type: 'VARCHAR(50)', mysql: 'varchar(50)', notes: '' },
        { pg: 'provider_id', type: 'VARCHAR(255)', mysql: 'varchar(255)', notes: '' },
        { pg: 'profile_data', type: 'JSONB', mysql: 'json', notes: '' },
        { pg: 'created_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
      ]
    },
{
      number: 20,
      name: 'users',
      mysqlName: 'fc_users',
      columns: [
        { pg: 'user_id', type: 'SERIAL', mysql: 'int auto_inc', notes: '' },
        { pg: 'username', type: 'VARCHAR(100)', mysql: 'varchar(100)', notes: '' },
        { pg: 'email', type: 'VARCHAR(255)', mysql: 'varchar(255)', notes: '' },
        { pg: 'password_hash', type: 'TEXT', mysql: 'text', notes: '' },
        { pg: 'status', type: 'user_status', mysql: 'enum(...)', notes: '' },
        { pg: 'first_name', type: 'VARCHAR(100)', mysql: 'varchar(100)', notes: '' },
        { pg: 'last_name', type: 'VARCHAR(100)', mysql: 'varchar(100)', notes: '' },
        { pg: 'display_name', type: 'VARCHAR(200)', mysql: 'varchar(200)', notes: '' },
        { pg: 'bio', type: 'TEXT', mysql: 'text', notes: '' },
        { pg: 'avatar_url', type: 'VARCHAR(500)', mysql: 'varchar(500)', notes: '' },
        { pg: 'website', type: 'VARCHAR(255)', mysql: 'varchar(255)', notes: '' },
        { pg: 'timezone', type: 'VARCHAR(50)', mysql: 'varchar(50)', notes: '' },
        { pg: 'language', type: 'VARCHAR(5)', mysql: 'varchar(5)', notes: '' },
        { pg: 'email_verified', type: 'BOOLEAN', mysql: 'tinyint(1)', notes: '' },
        { pg: 'last_login', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
        { pg: 'created_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
        { pg: 'updated_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
      ]
    },
{
      number: 21,
      name: 'translations',
      mysqlName: 'translations',
      columns: [
        { pg: 'translation_id', type: 'SERIAL', mysql: 'int auto_inc', notes: '' },
        { pg: 'key_name', type: 'VARCHAR(255)', mysql: 'varchar(255)', notes: '' },
        { pg: 'language_code', type: 'VARCHAR(5)', mysql: 'varchar(5)', notes: '' },
        { pg: 'translation_text', type: 'TEXT', mysql: 'text', notes: '' },
        { pg: 'context', type: 'VARCHAR(100)', mysql: 'varchar(100)', notes: '' },
        { pg: 'created_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
        { pg: 'updated_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
      ]
    },
{
      number: 22,
      name: 'user_cancellation_reason_log',
      mysqlName: 'user_cancellation_reason_log',
      columns: [
        { pg: 'log_id', type: 'SERIAL', mysql: 'int auto_inc', notes: '' },
        { pg: 'user_id', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'reason', type: 'VARCHAR(255)', mysql: 'varchar(255)', notes: '' },
        { pg: 'additional_feedback', type: 'TEXT', mysql: 'text', notes: '' },
        { pg: 'created_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
      ]
    },
{
      number: 23,
      name: 'user_subscriptions',
      mysqlName: 'user_subscriptions',
      columns: [
        { pg: 'subscription_id', type: 'SERIAL', mysql: 'int auto_inc', notes: '' },
        { pg: 'user_id', type: 'INTEGER', mysql: 'int', notes: '' },
        { pg: 'plan_id', type: 'VARCHAR(100)', mysql: 'varchar(100)', notes: '' },
        { pg: 'status', type: 'sub_status', mysql: 'enum(...)', notes: '' },
        { pg: 'started_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
        { pg: 'expires_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
        { pg: 'auto_renew', type: 'BOOLEAN', mysql: 'tinyint(1)', notes: '' },
        { pg: 'created_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
        { pg: 'updated_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
      ]
    },
{
      number: 24,
      name: 'users_nta',
      mysqlName: 'users_nta',
      columns: [
        { pg: 'user_id', type: 'INTEGER', mysql: 'int', notes: 'No triggers applied' },
        { pg: 'username', type: 'VARCHAR(100)', mysql: 'varchar(100)', notes: '' },
        { pg: 'email', type: 'VARCHAR(255)', mysql: 'varchar(255)', notes: '' },
        { pg: 'status', type: 'user_status', mysql: 'enum(...)', notes: '' },
        { pg: 'created_at', type: 'TIMESTAMP', mysql: 'datetime', notes: '' },
      ]
    }
  ];;

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
