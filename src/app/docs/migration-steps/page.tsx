import { readFileSync } from 'fs';
import { join } from 'path';
import dmsConfig from '@/data/dms/dms-mysql-to-postgres-mysql-dump.json';

// Read SQL files at build time (server component)
const preMigrationSql = readFileSync(
    join(process.cwd(), 'src/data/migration/pre-migration-setup.sql'),
    'utf-8'
);

const postMigrationSql = readFileSync(
    join(process.cwd(), 'src/data/migration/post-migration-transform.sql'),
    'utf-8'
);

export default function MigrationSteps() {
    return (
        <main>
            <h1>Migration Steps</h1>
            <div className="opt-note">
                These files define the complete migration path from MongoDB and MySQL to PostgreSQL.
            </div>

            {/* MongoDB Migration Section */}
            <div className="collection-block" id="mongo-migration">
                <div className="collection-title">
                    <span>MongoDB → PostgreSQL Migration Overview</span>
                    <span className="badge t-text">MONGODB</span>
                </div>
                <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '6px' }}>
                    <MongoMigrationContent />
                </div>
            </div>

            {/* README Section */}
            <div className="collection-block" id="readme">
                <div className="collection-title">
                    <span>README.md - Migration Guide</span>
                    <span className="badge t-text">MARKDOWN</span>
                </div>
                <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '6px' }}>
                    <ReadmeContent />
                </div>
            </div>

            {/* DMS Configuration */}
            <div className="collection-block" id="dms-config">
                <div className="collection-title">
                    <span>dms-mysql-to-postgres-mysql-dump.json</span>
                    <span className="badge t-text">JSON</span>
                </div>
                <div className="code-container" style={{ display: 'block' }}>
                    <pre style={{ margin: 0, padding: '20px', overflow: 'auto' }}>
                        {JSON.stringify(dmsConfig, null, 2)}
                    </pre>
                </div>
            </div>

            {/* Pre-Migration SQL */}
            <div className="collection-block" id="pre-migration">
                <div className="collection-title">
                    <span>pre-migration-setup.sql</span>
                    <span className="badge t-text">SQL</span>
                </div>
                <div className="code-container" style={{ display: 'block' }}>
                    <pre style={{ margin: 0, padding: '20px', overflow: 'auto' }}>
                        {preMigrationSql}
                    </pre>
                </div>
            </div>

            {/* Post-Migration SQL */}
            <div className="collection-block" id="post-migration">
                <div className="collection-title">
                    <span>post-migration-transform.sql</span>
                    <span className="badge t-text">SQL</span>
                </div>
                <div className="code-container" style={{ display: 'block' }}>
                    <pre style={{ margin: 0, padding: '20px', overflow: 'auto' }}>
                        {postMigrationSql}
                    </pre>
                </div>
            </div>
        </main>
    );
}

function MongoMigrationContent() {
    return (
        <div>
            <h2 style={{ marginTop: 0 }}>MongoDB to PostgreSQL Migration</h2>

            <h3>📋 Overview</h3>
            <p>The MongoDB migration involves transforming document-based collections into normalized PostgreSQL tables with proper relationships and constraints.</p>

            <h4>Collections Migrated</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #e5e7eb', padding: '10px', background: '#f9fafb', textAlign: 'left' }}>MongoDB Collection</th>
                        <th style={{ border: '1px solid #e5e7eb', padding: '10px', background: '#f9fafb', textAlign: 'left' }}>PostgreSQL Table(s)</th>
                        <th style={{ border: '1px solid #e5e7eb', padding: '10px', background: '#f9fafb', textAlign: 'left' }}>Transformation</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>fc_set</td>
                        <td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>sets, cards</td>
                        <td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>Normalized: Sets table + Cards extracted from arrays</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>fc_folder</td>
                        <td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>folders, folder_items</td>
                        <td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>Normalized: Folders table + Items junction table</td>
                    </tr>
                </tbody>
            </table>

            <h4>Key Transformations</h4>
            <ol>
                <li><strong>Array Normalization</strong>: Embedded card arrays → separate <code>cards</code> table with foreign keys</li>
                <li><strong>ID Promotion</strong>: MongoDB nested IDs (<code>set_id.value</code>) → PostgreSQL primary keys</li>
                <li><strong>Type Conversion</strong>: MongoDB types → PostgreSQL types (Date → TIMESTAMP WITH TIME ZONE)</li>
                <li><strong>Relationship Enforcement</strong>: Foreign key constraints with CASCADE delete</li>
                <li><strong>Performance Optimization</strong>: 25 indices created for common query patterns</li>
            </ol>

            <h3>🗄️ Database Schema</h3>

            <h4>Core Tables</h4>
            <ul>
                <li><strong>sets</strong> - Main flashcard set storage (from fc_set collection)</li>
                <li><strong>cards</strong> - Individual flashcards (normalized from fc_set.cards array)</li>
                <li><strong>folders</strong> - User-defined folders (from fc_folder collection)</li>
                <li><strong>folder_items</strong> - Junction table for folder-set relationships</li>
            </ul>

            <h4>Schema Features</h4>
            <ul>
                <li>✅ Primary keys on all tables (<code>set_id</code>, <code>card_id</code>, <code>folder_id</code>)</li>
                <li>✅ Foreign key constraints with CASCADE delete</li>
                <li>✅ 20 single-column indices for common filters</li>
                <li>✅ 4 composite indices for complex query patterns</li>
                <li>✅ 1 partial index for conditional queries</li>
                <li>✅ Timestamp columns with timezone support</li>
            </ul>

            <h3>📝 Migration Steps</h3>

            <h4>Step 1: Create PostgreSQL Schema</h4>
            <p>Execute the SQL queries in the <strong>PostgreSQL Queries (Mongo)</strong> tab in the following order:</p>
            <ol>
                <li>Phase 1: Core Data Tables (<code>sets</code>, <code>cards</code>)</li>
                <li>Phase 2: Folders & Collections (<code>folders</code>, <code>folder_items</code>)</li>
                <li>Phase 3: Constraints & Composite Indices</li>
            </ol>

            <h4>Step 2: Extract and Transform Data</h4>
            <p>Use a migration script to:</p>
            <ul>
                <li>Connect to MongoDB and PostgreSQL</li>
                <li>Extract documents from <code>fc_set</code> and <code>fc_folder</code> collections</li>
                <li>Transform nested structures to relational format</li>
                <li>Insert data into PostgreSQL tables</li>
                <li>Validate row counts and relationships</li>
            </ul>

            <h4>Step 3: Validate Migration</h4>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>{`-- Check row counts
SELECT 'sets' AS table, COUNT(*) FROM sets
UNION ALL SELECT 'cards', COUNT(*) FROM cards
UNION ALL SELECT 'folders', COUNT(*) FROM folders
UNION ALL SELECT 'folder_items', COUNT(*) FROM folder_items;

-- Verify foreign key relationships
SELECT COUNT(*) FROM cards WHERE set_id NOT IN (SELECT set_id FROM sets);
SELECT COUNT(*) FROM folder_items WHERE folder_id NOT IN (SELECT folder_id FROM folders);`}</pre>

            <h3>🔍 Excluded Collections</h3>
            <p>The following MongoDB collections are <strong>not migrated</strong>:</p>
            <ul>
                <li><code>set_directory</code> - Used for HTML sitemaps (handled via S3)</li>
                <li><code>counters</code> - Not needed in PostgreSQL</li>
            </ul>

            <h3>📚 Reference</h3>
            <p>For complete SQL queries and detailed schema mapping, see:</p>
            <ul>
                <li><strong>PostgreSQL Queries (Mongo)</strong> tab - Complete CREATE TABLE statements</li>
                <li><strong>Mongo Mapping</strong> tab - Detailed field-by-field mapping</li>
            </ul>

            <hr />
        </div>
    );
}

function ReadmeContent() {
    return (
        <div>
            <h2 style={{ marginTop: 0 }}>MySQL to PostgreSQL Migration - Complete Package</h2>

            <h3>🚀 Quick Start</h3>

            <h4>Step 1: Pre-Migration Setup (2 minutes)</h4>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>{`psql -h postgres-host -U postgres -d flashcards \\
  -f migration/pre-migration-setup.sql`}</pre>
            <p>Creates <code>mysql_dump</code> schema and sets permissions.</p>

            <h4>Step 2: AWS DMS Migration (1-2 hours)</h4>
            <p><strong>AWS Console:</strong></p>
            <ol>
                <li>DMS → Database migration tasks → Create task</li>
                <li>Task identifier: <code>flashcards-mysql-to-mysql-dump</code></li>
                <li>Migration type: <strong>Migrate existing data</strong></li>
                <li>Table mappings → JSON editor → Paste contents of <code>dms/dms-mysql-to-postgres-mysql-dump.json</code></li>
                <li>Start task</li>
            </ol>

            <p><strong>AWS CLI:</strong></p>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>{`aws dms create-replication-task \\
  --replication-task-identifier flashcards-mysql-to-mysql-dump \\
  --source-endpoint-arn arn:aws:dms:...:endpoint:mysql-source \\
  --target-endpoint-arn arn:aws:dms:...:endpoint:postgres-target \\
  --replication-instance-arn arn:aws:dms:...:rep:instance \\
  --migration-type full-load \\
  --table-mappings file://dms/dms-mysql-to-postgres-mysql-dump.json`}</pre>

            <h4>Step 3: Validate mysql_dump (5 minutes)</h4>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>{`-- Check all tables exist
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
UNION ALL SELECT 'user_cancellation_reason_log', COUNT(*) FROM mysql_dump.user_cancellation_reason_log;`}</pre>

            <h4>Step 4: Transform to Production (15-30 minutes)</h4>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>{`psql -h postgres-host -U postgres -d flashcards \\
  -f migration/post-migration-transform.sql`}</pre>

            <p><strong>What it does:</strong></p>
            <ul>
                <li>Creates ENUM types (4 types)</li>
                <li>Creates production tables (9 tables)</li>
                <li>Transforms and loads data from mysql_dump</li>
                <li>Consolidates gaming tables (4 → 2)</li>
                <li>Creates indexes (12 indexes)</li>
                <li>Adds foreign keys (4 constraints)</li>
                <li>Creates triggers (2 triggers)</li>
                <li>Resets sequences (8 sequences)</li>
                <li><strong>Validates data automatically</strong> ✓</li>
            </ul>

            <h4>Step 5: Review Validation Results</h4>
            <p>The script outputs validation results automatically. Look for ✓ or ✗ for each table.</p>

            <hr />

            <h3>📊 Migration Overview</h3>

            <h4>Tables Migrated</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #e5e7eb', padding: '10px', background: '#f9fafb', textAlign: 'left' }}>MySQL Table</th>
                        <th style={{ border: '1px solid #e5e7eb', padding: '10px', background: '#f9fafb', textAlign: 'left' }}>PostgreSQL Table</th>
                        <th style={{ border: '1px solid #e5e7eb', padding: '10px', background: '#f9fafb', textAlign: 'left' }}>Method</th>
                        <th style={{ border: '1px solid #e5e7eb', padding: '10px', background: '#f9fafb', textAlign: 'left' }}>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>fc_categories</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>categories</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>Transform</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>Renamed</td></tr>
                    <tr><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>fc_image</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>image</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>Transform</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>Renamed, ENUM types</td></tr>
                    <tr><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>fc_jewel_scores</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>gaming_scores</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}><strong>Consolidate</strong></td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>Added game_type='jewel'</td></tr>
                    <tr><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>fc_stellarspeller_scores</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>gaming_scores</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}><strong>Consolidate</strong></td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>Added game_type='stellarspeller'</td></tr>
                    <tr><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>fc_jewel_score_totals</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>gaming_totals</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}><strong>Consolidate</strong></td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>Added game_type='jewel'</td></tr>
                    <tr><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>fc_stellarspeller_score_totals</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>gaming_totals</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}><strong>Consolidate</strong></td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>Added game_type='stellarspeller'</td></tr>
                    <tr><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>fc_payment_subscriptions</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>payment_subscriptions</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>Transform</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>Renamed, 26 columns removed</td></tr>
                    <tr><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>fc_payment_transaction_log</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>payment_transaction_log</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>Transform</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>Renamed, 7 columns removed</td></tr>
                    <tr><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>fc_user_social</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>user_social</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>Transform</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>Renamed</td></tr>
                    <tr><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>fc_users</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>users</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>Transform</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>Renamed, 5 columns removed</td></tr>
                    <tr><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>user_cancellation_reason_log</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>user_cancellation_reason_log</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>Transform</td><td style={{ border: '1px solid #e5e7eb', padding: '10px' }}>Column renaming</td></tr>
                </tbody>
            </table>

            <p><strong>Result</strong>: 11 MySQL tables → 9 PostgreSQL tables</p>

            <h4>Key Transformations</h4>
            <ol>
                <li><strong>Gaming Table Consolidation</strong>: 4 tables → 2 tables with <code>game_type</code> discriminator</li>
                <li><strong>Column Renaming</strong>: camelCase → snake_case, descriptive names</li>
                <li><strong>Data Type Conversions</strong>: INT → INTEGER, DATETIME → TIMESTAMP, TINYINT(1) → BOOLEAN</li>
                <li><strong>ENUM Types</strong>: MySQL ENUMs → PostgreSQL custom ENUM types</li>
                <li><strong>Column Cleanup</strong>: Removed 33 unused/redundant fields</li>
            </ol>

            <hr />
        </div>
    );
}
