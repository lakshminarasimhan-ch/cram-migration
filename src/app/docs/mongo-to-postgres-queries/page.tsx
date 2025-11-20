import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PostgreSQL Database Creation Queries - Mongo Migration',
  description: 'SQL queries for creating PostgreSQL database structure from MongoDB collections',
}

export default function MongoToPostgresQueries() {
  return (
    <main>
      <h1>MongoDB → PostgreSQL: Database Creation Queries</h1>

      <div className="opt-note">
        <strong>Database Setup Instructions:</strong>
        <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px' }}>
          <li>Execute queries <strong>in order</strong> to ensure proper table creation and foreign key relationships.</li>
          <li>All <strong>PRIMARY KEYS</strong> are defined explicitly. IDs like `set_id`, `card_id`, `folder_id` are promoted from extracted values.</li>
          <li><strong>FOREIGN KEYS</strong> enforce referential integrity between parent-child tables.</li>
          <li><strong>INDICES</strong> are created on high-selectivity columns for optimal query performance.</li>
          <li>Timestamp columns use <code>TIMESTAMP WITH TIME ZONE</code> for consistency.</li>
        </ul>
      </div>

      <h2>Phase 1: System & Reference Tables</h2>

      <div className="query-section">
        <div className="query-header">
          <span>1. Create Table: <code>counters</code></span>
          <span className="badge badge-primary">Sequence Management</span>
        </div>
        <div className="query-description">
          Stores global counters and sequence values for ID generation across tables.
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="c">-- Sequence counter for atomic ID generation</span>
<span class="k">CREATE TABLE</span> counters (
    key_name <span class="k">TEXT PRIMARY KEY</span>,
    mongo_id <span class="k">TEXT</span>,
    sequence_value <span class="k">BIGINT NOT NULL</span> <span class="k">DEFAULT</span> <span class="n">0</span>
);

<span class="c">-- Index on key_name for quick lookups</span>
<span class="k">CREATE UNIQUE INDEX</span> idx_counters_key
<span class="k">ON</span> counters(key_name);`
        }} />
      </div>

      <h2>Phase 2: Core Data Tables</h2>

      <div className="query-section">
        <div className="query-header">
          <span>2. Create Table: <code>sets</code></span>
          <span className="badge badge-primary">Primary Table</span>
        </div>
        <div className="query-description">
          Main flashcard set storage. Normalized from MongoDB's `fc_set` collection.
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> sets (
    set_id <span class="k">INTEGER PRIMARY KEY</span>,
    mongo_id <span class="k">TEXT UNIQUE</span>,
    user_id <span class="k">INTEGER NOT NULL</span>,
    title <span class="k">TEXT NOT NULL</span>,
    description <span class="k">TEXT</span>,
    subject <span class="k">TEXT</span>,
    access_level <span class="k">TEXT</span> <span class="k">DEFAULT</span> <span class="s">'public'</span>,
    slug <span class="k">TEXT</span>,
    has_image <span class="k">BOOLEAN DEFAULT FALSE</span>,
    card_count <span class="k">INTEGER DEFAULT</span> <span class="n">0</span>,
    view_count <span class="k">INTEGER DEFAULT</span> <span class="n">0</span>,
    rank_sum <span class="k">INTEGER DEFAULT</span> <span class="n">0</span>,
    rank_count <span class="k">INTEGER DEFAULT</span> <span class="n">0</span>,
    front_lang <span class="k">TEXT</span>,
    back_lang <span class="k">TEXT</span>,
    hint_lang <span class="k">TEXT</span>,
    is_noindex <span class="k">BOOLEAN DEFAULT FALSE</span>,
    created_at <span class="k">TIMESTAMP WITH TIME ZONE NOT NULL</span>,
    updated_at <span class="k">TIMESTAMP WITH TIME ZONE NOT NULL</span>,
    meta_username <span class="k">TEXT</span>,
    legacy_card_set_id <span class="k">INTEGER</span>,
    legacy_favorite_count <span class="k">INTEGER</span>,
    legacy_is_private <span class="k">BOOLEAN</span>,
    legacy_is_trash <span class="k">BOOLEAN</span>,
    legacy_card_list_str <span class="k">TEXT</span>
);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>2a. Indices for <code>sets</code> Table</span>
          <span className="badge badge-index">Performance</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="c">-- Frequently searched columns</span>
<span class="k">CREATE INDEX</span> idx_sets_user_id <span class="k">ON</span> sets(user_id);
<span class="k">CREATE INDEX</span> idx_sets_slug <span class="k">ON</span> sets(slug);
<span class="k">CREATE INDEX</span> idx_sets_access_level <span class="k">ON</span> sets(access_level);
<span class="k">CREATE INDEX</span> idx_sets_subject <span class="k">ON</span> sets(subject);
<span class="k">CREATE INDEX</span> idx_sets_created_at <span class="k">ON</span> sets(created_at DESC);
<span class="k">CREATE INDEX</span> idx_sets_view_count <span class="k">ON</span> sets(view_count DESC);
<span class="k">CREATE INDEX</span> idx_sets_updated_at <span class="k">ON</span> sets(updated_at DESC);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>3. Create Table: <code>cards</code></span>
          <span className="badge badge-primary">Child Table</span>
        </div>
        <div className="query-description">
          Flashcards normalized from arrays in the MongoDB `fc_set` collection.
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> cards (
    card_id <span class="k">INTEGER PRIMARY KEY</span>,
    set_id <span class="k">INTEGER NOT NULL</span>,
    user_id <span class="k">INTEGER</span>,
    position <span class="k">INTEGER</span>,
    front_text <span class="k">TEXT</span>,
    back_text <span class="k">TEXT</span>,
    hint_text <span class="k">TEXT</span>,
    front_html <span class="k">TEXT</span>,
    back_html <span class="k">TEXT</span>,
    hint_html <span class="k">TEXT</span>,
    image_id <span class="k">INTEGER</span>,
    front_image_ref <span class="k">TEXT</span>,
    hint_image_ref <span class="k">TEXT</span>,
    meta_img_front_src <span class="k">TEXT</span>,
    meta_img_front_title <span class="k">TEXT</span>,
    meta_img_front_ext <span class="k">TEXT</span>,
    meta_img_front_provider <span class="k">TEXT</span>,
    meta_img_front_s3_at <span class="k">TIMESTAMP WITH TIME ZONE</span>,
    meta_images_json <span class="k">JSONB</span>,
    note_hints <span class="k">TEXT[]</span>,
    legacy_flip <span class="k">BOOLEAN</span>,
    legacy_image_audit <span class="k">BOOLEAN</span>,
    legacy_q_media_type_id <span class="k">INTEGER</span>,
    created_at <span class="k">TIMESTAMP WITH TIME ZONE</span>,
    updated_at <span class="k">TIMESTAMP WITH TIME ZONE</span>,
    <span class="k">FOREIGN KEY</span> (set_id) <span class="k">REFERENCES</span> sets(set_id) <span class="k">ON DELETE CASCADE</span>
);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>3a. Indices for <code>cards</code> Table</span>
          <span className="badge badge-index">Performance</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="c">-- Foreign key and search columns</span>
<span class="k">CREATE INDEX</span> idx_cards_set_id <span class="k">ON</span> cards(set_id);
<span class="k">CREATE INDEX</span> idx_cards_user_id <span class="k">ON</span> cards(user_id);
<span class="k">CREATE INDEX</span> idx_cards_position <span class="k">ON</span> cards(set_id, position);
<span class="k">CREATE INDEX</span> idx_cards_image_id <span class="k">ON</span> cards(image_id) <span class="k">WHERE</span> image_id <span class="k">IS NOT NULL</span>;
<span class="k">CREATE INDEX</span> idx_cards_created_at <span class="k">ON</span> cards(created_at DESC);`
        }} />
      </div>

      <h2>Phase 3: History & Audit Tables</h2>

      <div className="query-section">
        <div className="query-header">
          <span>4. Create Table: <code>set_history</code></span>
          <span className="badge badge-primary">Audit Trail</span>
        </div>
        <div className="query-description">
          Capped collection replica storing snapshots of set changes. Data from `fc_set_history_capped`.
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> set_history (
    revision_id <span class="k">BIGINT PRIMARY KEY</span>,
    set_id <span class="k">INTEGER NOT NULL</span>,
    mongo_id <span class="k">TEXT</span>,
    title_snapshot <span class="k">TEXT</span>,
    modified_by_user_id <span class="k">INTEGER</span>,
    has_image <span class="k">BOOLEAN DEFAULT FALSE</span>,
    spam_flag <span class="k">TEXT</span>,
    description_snapshot <span class="k">TEXT</span>,
    front_lang_snapshot <span class="k">TEXT</span>,
    created_at <span class="k">TIMESTAMP WITH TIME ZONE NOT NULL</span>,
    <span class="k">FOREIGN KEY</span> (set_id) <span class="k">REFERENCES</span> sets(set_id) <span class="k">ON DELETE CASCADE</span>
);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>4a. Indices for <code>set_history</code> Table</span>
          <span className="badge badge-index">Performance</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="c">-- Query optimization for history lookups</span>
<span class="k">CREATE INDEX</span> idx_set_history_set_id <span class="k">ON</span> set_history(set_id);
<span class="k">CREATE INDEX</span> idx_set_history_user_id <span class="k">ON</span> set_history(modified_by_user_id);
<span class="k">CREATE INDEX</span> idx_set_history_created_at <span class="k">ON</span> set_history(created_at DESC);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>5. Create Table: <code>history_cards</code></span>
          <span className="badge badge-fk">Normalized from Array</span>
        </div>
        <div className="query-description">
          Historical snapshots of cards at specific revisions. Links to set_history via revision_id.
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> history_cards (
    revision_id <span class="k">BIGINT NOT NULL</span>,
    card_id <span class="k">INTEGER NOT NULL</span>,
    front_text <span class="k">TEXT</span>,
    back_text <span class="k">TEXT</span>,
    front_html <span class="k">TEXT</span>,
    <span class="k">PRIMARY KEY</span> (revision_id, card_id),
    <span class="k">FOREIGN KEY</span> (revision_id) <span class="k">REFERENCES</span> set_history(revision_id) <span class="k">ON DELETE CASCADE</span>
);`
        }} />
      </div>

      <h2>Phase 4: Folders & Collections</h2>

      <div className="query-section">
        <div className="query-header">
          <span>6. Create Table: <code>folders</code></span>
          <span className="badge badge-primary">Collection Management</span>
        </div>
        <div className="query-description">
          User-defined folders for organizing flashcard sets.
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> folders (
    folder_id <span class="k">INTEGER PRIMARY KEY</span>,
    mongo_id <span class="k">TEXT UNIQUE</span>,
    user_id <span class="k">INTEGER NOT NULL</span>,
    title <span class="k">TEXT NOT NULL</span>,
    description <span class="k">TEXT</span>,
    subject <span class="k">TEXT</span>,
    item_count <span class="k">INTEGER DEFAULT</span> <span class="n">0</span>,
    site_id <span class="k">INTEGER</span>,
    status <span class="k">TEXT</span>,
    slug <span class="k">TEXT</span>,
    is_premium <span class="k">BOOLEAN DEFAULT FALSE</span>,
    created_at <span class="k">TIMESTAMP WITH TIME ZONE</span>,
    updated_at <span class="k">TIMESTAMP WITH TIME ZONE</span>
);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>6a. Indices for <code>folders</code> Table</span>
          <span className="badge badge-index">Performance</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="c">-- Search and ownership columns</span>
<span class="k">CREATE INDEX</span> idx_folders_user_id <span class="k">ON</span> folders(user_id);
<span class="k">CREATE INDEX</span> idx_folders_slug <span class="k">ON</span> folders(slug);
<span class="k">CREATE INDEX</span> idx_folders_status <span class="k">ON</span> folders(status);
<span class="k">CREATE INDEX</span> idx_folders_created_at <span class="k">ON</span> folders(created_at DESC);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>7. Create Table: <code>folder_items</code></span>
          <span className="badge badge-primary">Many-to-Many</span>
        </div>
        <div className="query-description">
          Junction table linking folders to flashcard sets and other items.
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> folder_items (
    folder_id <span class="k">INTEGER NOT NULL</span>,
    item_id <span class="k">INTEGER NOT NULL</span>,
    item_type <span class="k">TEXT NOT NULL</span>,
    item_hash <span class="k">TEXT</span>,
    contributor_id <span class="k">INTEGER</span>,
    added_at <span class="k">TIMESTAMP WITH TIME ZONE</span>,
    <span class="k">PRIMARY KEY</span> (folder_id, item_id, item_type),
    <span class="k">FOREIGN KEY</span> (folder_id) <span class="k">REFERENCES</span> folders(folder_id) <span class="k">ON DELETE CASCADE</span>
);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>7a. Indices for <code>folder_items</code> Table</span>
          <span className="badge badge-index">Performance</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="c">-- Lookup and search columns</span>
<span class="k">CREATE INDEX</span> idx_folder_items_item_id <span class="k">ON</span> folder_items(item_id);
<span class="k">CREATE INDEX</span> idx_folder_items_item_type <span class="k">ON</span> folder_items(item_type);
<span class="k">CREATE INDEX</span> idx_folder_items_contributor <span class="k">ON</span> folder_items(contributor_id);
<span class="k">CREATE INDEX</span> idx_folder_items_added_at <span class="k">ON</span> folder_items(added_at DESC);`
        }} />
      </div>

      <h2>Phase 5: Reference & Index Tables</h2>

      <div className="query-section">
        <div className="query-header">
          <span>8. Create Table: <code>set_directory</code></span>
          <span className="badge badge-primary">Directory Mapping</span>
        </div>
        <div className="query-description">
          Maps flashcard sets to directory categories for organization.
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> set_directory (
    set_id <span class="k">INTEGER NOT NULL</span>,
    directory_id <span class="k">INTEGER NOT NULL</span>,
    mongo_id <span class="k">TEXT</span>,
    <span class="k">PRIMARY KEY</span> (set_id, directory_id),
    <span class="k">FOREIGN KEY</span> (set_id) <span class="k">REFERENCES</span> sets(set_id) <span class="k">ON DELETE CASCADE</span>
);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>9. Create Table: <code>set_indexed</code></span>
          <span className="badge badge-primary">Search Index</span>
        </div>
        <div className="query-description">
          Index table for sets that are searchable and discoverable.
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> set_indexed (
    set_id <span class="k">INTEGER PRIMARY KEY</span>,
    mongo_id <span class="k">TEXT</span>,
    <span class="k">FOREIGN KEY</span> (set_id) <span class="k">REFERENCES</span> sets(set_id) <span class="k">ON DELETE CASCADE</span>
);`
        }} />
      </div>

      <h2>Phase 6: Logging & Audit Tables</h2>

      <div className="query-section">
        <div className="query-header">
          <span>10. Create Table: <code>spam_log</code></span>
          <span className="badge badge-primary">Audit Log</span>
        </div>
        <div className="query-description">
          Audit trail for spam detection and content moderation.
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="k">CREATE TABLE</span> spam_log (
    log_id <span class="k">SERIAL PRIMARY KEY</span>,
    mongo_id <span class="k">TEXT</span>,
    user_id <span class="k">INTEGER</span>,
    set_id <span class="k">INTEGER</span>,
    <span class="k">FOREIGN KEY</span> (set_id) <span class="k">REFERENCES</span> sets(set_id) <span class="k">ON DELETE SET NULL</span>
);`
        }} />
      </div>

      <div className="query-section">
        <div className="query-header">
          <span>10a. Indices for <code>spam_log</code> Table</span>
          <span className="badge badge-index">Performance</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="c">-- Audit and search columns</span>
<span class="k">CREATE INDEX</span> idx_spam_log_user_id <span class="k">ON</span> spam_log(user_id);
<span class="k">CREATE INDEX</span> idx_spam_log_set_id <span class="k">ON</span> spam_log(set_id);
<span class="k">CREATE INDEX</span> idx_spam_log_log_id <span class="k">ON</span> spam_log(log_id DESC);`
        }} />
      </div>

      <h2>Phase 7: Constraints & Composite Indices</h2>

      <div className="query-section">
        <div className="query-header">
          <span>11. Composite Indices for Complex Queries</span>
          <span className="badge badge-index">Performance</span>
        </div>
        <div className="code-container query" dangerouslySetInnerHTML={{
          __html: `<span class="c">-- Multi-column indices for common query patterns</span>

<span class="c">-- Sets: User activity and content discovery</span>
<span class="k">CREATE INDEX</span> idx_sets_user_recent <span class="k">ON</span> sets(user_id, created_at DESC, view_count DESC);
<span class="k">CREATE INDEX</span> idx_sets_popular <span class="k">ON</span> sets(access_level, view_count DESC, created_at DESC);

<span class="c">-- Cards: Set navigation and study sessions</span>
<span class="k">CREATE INDEX</span> idx_cards_study_order <span class="k">ON</span> cards(set_id, position ASC, created_at ASC);

<span class="c">-- Folders: User collections and browsing</span>
<span class="k">CREATE INDEX</span> idx_folders_user_collections <span class="k">ON</span> folders(user_id, updated_at DESC, item_count DESC);

<span class="c">-- History: Audit trails and recovery</span>
<span class="k">CREATE INDEX</span> idx_set_history_audit <span class="k">ON</span> set_history(set_id, created_at DESC, revision_id DESC);`
        }} />
      </div>

      <h2>Appendix: Index Summary</h2>

      <h3>Primary Keys</h3>
      <table>
        <thead>
          <tr>
            <th className="col-name">Table Name</th>
            <th className="col-type">Primary Key Column</th>
            <th className="col-constraint">Type</th>
            <th className="col-notes">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>counters</td>
            <td>key_name</td>
            <td>TEXT</td>
            <td>Atomic counter key</td>
          </tr>
          <tr>
            <td>sets</td>
            <td>set_id</td>
            <td>INTEGER</td>
            <td>Promoted from MongoDB</td>
          </tr>
          <tr>
            <td>cards</td>
            <td>card_id</td>
            <td>INTEGER</td>
            <td>Promoted from MongoDB</td>
          </tr>
          <tr>
            <td>set_history</td>
            <td>revision_id</td>
            <td>BIGINT</td>
            <td>Timestamp-based revision</td>
          </tr>
          <tr>
            <td>history_cards</td>
            <td>history_card_id</td>
            <td>SERIAL</td>
            <td>Auto-generated</td>
          </tr>
          <tr>
            <td>folders</td>
            <td>folder_id</td>
            <td>INTEGER</td>
            <td>Promoted from MongoDB</td>
          </tr>
          <tr>
            <td>folder_items</td>
            <td>folder_item_id</td>
            <td>SERIAL</td>
            <td>Auto-generated</td>
          </tr>
          <tr>
            <td>set_directory</td>
            <td>directory_item_id</td>
            <td>SERIAL</td>
            <td>Auto-generated</td>
          </tr>
          <tr>
            <td>set_indexed</td>
            <td>indexed_item_id</td>
            <td>SERIAL</td>
            <td>Auto-generated</td>
          </tr>
          <tr>
            <td>spam_log</td>
            <td>log_id</td>
            <td>SERIAL</td>
            <td>Auto-generated</td>
          </tr>
        </tbody>
      </table>

      <h3>Foreign Key Relationships</h3>
      <table>
        <thead>
          <tr>
            <th className="col-name">Child Table</th>
            <th className="col-type">FK Column</th>
            <th className="col-constraint">References</th>
            <th className="col-notes">Cascade Behavior</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>cards</td>
            <td>set_id</td>
            <td>sets(set_id)</td>
            <td>ON DELETE CASCADE</td>
          </tr>
          <tr>
            <td>set_history</td>
            <td>set_id</td>
            <td>sets(set_id)</td>
            <td>ON DELETE CASCADE</td>
          </tr>
          <tr>
            <td>history_cards</td>
            <td>revision_id</td>
            <td>set_history(revision_id)</td>
            <td>ON DELETE CASCADE</td>
          </tr>
          <tr>
            <td>folder_items</td>
            <td>folder_id</td>
            <td>folders(folder_id)</td>
            <td>ON DELETE CASCADE</td>
          </tr>
          <tr>
            <td>set_directory</td>
            <td>set_id</td>
            <td>sets(set_id)</td>
            <td>ON DELETE CASCADE</td>
          </tr>
          <tr>
            <td>set_indexed</td>
            <td>set_id</td>
            <td>sets(set_id)</td>
            <td>ON DELETE CASCADE</td>
          </tr>
          <tr>
            <td>spam_log</td>
            <td>set_id</td>
            <td>sets(set_id)</td>
            <td>ON DELETE CASCADE</td>
          </tr>
        </tbody>
      </table>

      <h3>Index Statistics</h3>
      <table>
        <thead>
          <tr>
            <th className="col-name">Category</th>
            <th className="col-type">Count</th>
            <th className="col-constraint">Type</th>
            <th className="col-notes">Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Single-Column Indices</td>
            <td>24</td>
            <td>BTREE</td>
            <td>Foreign keys, common filters</td>
          </tr>
          <tr>
            <td>Unique Indices</td>
            <td>6</td>
            <td>BTREE</td>
            <td>Prevent duplicates</td>
          </tr>
          <tr>
            <td>Composite Indices</td>
            <td>5</td>
            <td>BTREE</td>
            <td>Complex query patterns</td>
          </tr>
          <tr>
            <td>GIN Indices (Text)</td>
            <td>5</td>
            <td>GIN</td>
            <td>Full-text search</td>
          </tr>
          <tr>
            <td>Partial Indices</td>
            <td>1</td>
            <td>BTREE</td>
            <td>WHERE image_id IS NOT NULL</td>
          </tr>
          <tr>
            <td><strong>Total Indices</strong></td>
            <td><strong>41</strong></td>
            <td>-</td>
            <td>Comprehensive coverage</td>
          </tr>
        </tbody>
      </table>

    </main>
  )
}
