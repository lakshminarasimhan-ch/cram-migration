export default function Home() {
  const tables = [
    {
      name: 'sets',
      source: 'fc_set',
      rows: [
        { mongo: 'set_id.value', pg: 'set_id', type: 'INTEGER', notes: 'PRIMARY KEY.' },
        { mongo: '_id', pg: 'mongo_id', type: 'TEXT', notes: 'Legacy ObjectId Audit.' },
        { mongo: 'user_id.value', pg: 'user_id', type: 'INTEGER', notes: 'Owner ID.' },
        { mongo: 'title', pg: 'title', type: 'TEXT', notes: '' },
        { mongo: 'description', pg: 'description', type: 'TEXT', notes: '' },
        { mongo: 'subject', pg: 'subject', type: 'TEXT', notes: '' },
        { mongo: 'access', pg: 'access_level', type: 'TEXT', notes: '' },
        { mongo: 'slug', pg: 'slug', type: 'TEXT', notes: '' },
        { mongo: 'has_image', pg: 'has_image', type: 'BOOLEAN', notes: '' },
        { mongo: 'count_cards.value', pg: 'card_count', type: 'INTEGER', notes: '' },
        { mongo: 'views.value', pg: 'view_count', type: 'INTEGER', notes: '' },
        { mongo: 'rankSum.value', pg: 'rank_sum', type: 'INTEGER', notes: '' },
        { mongo: 'rankCount.value', pg: 'rank_count', type: 'INTEGER', notes: '' },
        { mongo: 'lang_front', pg: 'front_lang', type: 'TEXT', notes: 'ISO Code.' },
        { mongo: 'lang_back', pg: 'back_lang', type: 'TEXT', notes: 'ISO Code.' },
        { mongo: 'lang_hint', pg: 'hint_lang', type: 'TEXT', notes: 'ISO Code (Nullable).' },
        { mongo: 'noindex', pg: 'is_noindex', type: 'BOOLEAN', notes: '' },
        { mongo: 'created', pg: 'created_at', type: 'TIMESTAMP', notes: '' },
        { mongo: 'last_modified', pg: 'updated_at', type: 'TIMESTAMP', notes: '' },
        { mongo: 'meta.username', pg: 'meta_username', type: 'TEXT', notes: '' },
        { mongo: 'meta.legacyFlashexData.card_set_id.value', pg: 'legacy_card_set_id', type: 'INTEGER', notes: 'Deep legacy ref.' },
        { mongo: 'meta.legacyFlashexData.favorite_count.value', pg: 'legacy_favorite_count', type: 'INTEGER', notes: '' },
        { mongo: 'meta.legacyFlashexData.private', pg: 'legacy_is_private', type: 'BOOLEAN', notes: '' },
        { mongo: 'meta.legacyFlashexData.trash', pg: 'legacy_is_trash', type: 'BOOLEAN', notes: '' },
        { mongo: 'meta.legacyFlashexData.card_list', pg: 'legacy_card_list_str', type: 'TEXT', notes: 'Raw string list.' },
      ]
    },
    {
      name: 'cards',
      source: 'fc_set.cards[]',
      rows: [
        { mongo: 'cards[].card_id.value', pg: 'card_id', type: 'INTEGER', notes: 'PRIMARY KEY.' },
        { mongo: 'cards[].set_id.value', pg: 'set_id', type: 'INTEGER', notes: 'FOREIGN KEY (sets.set_id).' },
        { mongo: 'cards[].user_id', pg: 'user_id', type: 'INTEGER', notes: 'Handle object/int variance.' },
        { mongo: 'cards[].position.value', pg: 'position', type: 'INTEGER', notes: '' },
        { mongo: 'cards[].front', pg: 'front_text', type: 'TEXT', notes: '' },
        { mongo: 'cards[].back', pg: 'back_text', type: 'TEXT', notes: '' },
        { mongo: 'cards[].hint', pg: 'hint_text', type: 'TEXT', notes: '' },
        { mongo: 'cards[].front_html', pg: 'front_html', type: 'TEXT', notes: '' },
        { mongo: 'cards[].back_html', pg: 'back_html', type: 'TEXT', notes: '' },
        { mongo: 'cards[].hint_html', pg: 'hint_html', type: 'TEXT', notes: '' },
        { mongo: 'cards[].image_id.value', pg: 'image_id', type: 'INTEGER', notes: '' },
        { mongo: 'cards[].front_image_id', pg: 'front_image_ref', type: 'TEXT', notes: '' },
        { mongo: 'cards[].hint_image_id', pg: 'hint_image_ref', type: 'TEXT', notes: '' },
        { mongo: 'cards[].meta.images.front.src', pg: 'meta_img_front_src', type: 'TEXT', notes: '' },
        { mongo: 'cards[].meta.images.front.title', pg: 'meta_img_front_title', type: 'TEXT', notes: '' },
        { mongo: 'cards[].meta.images.front.extension', pg: 'meta_img_front_ext', type: 'TEXT', notes: '' },
        { mongo: 'cards[].meta.images.front.provider', pg: 'meta_img_front_provider', type: 'TEXT', notes: '' },
        { mongo: 'cards[].meta.images.front.s3_upload.low', pg: 'meta_img_front_s3_at', type: 'TIMESTAMP', notes: 'Flattened low/high.' },
        { mongo: 'cards[].meta.images', pg: 'meta_images_json', type: 'JSONB', notes: 'Full fallback.' },
        { mongo: 'cards[].meta.note_hint', pg: 'note_hints', type: 'TEXT[]', notes: '' },
        { mongo: 'cards[].meta.legacyFlashexData.flip', pg: 'legacy_flip', type: 'BOOLEAN', notes: '' },
        { mongo: 'cards[].meta.legacyFlashexData.image_audit', pg: 'legacy_image_audit', type: 'BOOLEAN', notes: '' },
        { mongo: 'cards[].meta.legacyFlashexData.question_media_type_id.value', pg: 'legacy_q_media_type_id', type: 'INTEGER', notes: '' },
        { mongo: 'cards[].created', pg: 'created_at', type: 'TIMESTAMP', notes: '' },
        { mongo: 'cards[].last_modified', pg: 'updated_at', type: 'TIMESTAMP', notes: '' },
      ]
    },
    {
      name: 'set_history',
      source: 'fc_set_history_capped',
      rows: [
        { mongo: 'revision', pg: 'revision_id', type: 'BIGINT', notes: 'PRIMARY KEY.' },
        { mongo: 'set_id.value', pg: 'set_id', type: 'INTEGER', notes: 'FOREIGN KEY.' },
        { mongo: '_id', pg: 'mongo_id', type: 'TEXT', notes: 'Legacy ObjectId.' },
        { mongo: 'title', pg: 'title_snapshot', type: 'TEXT', notes: '' },
        { mongo: 'user_id.value', pg: 'modified_by_user_id', type: 'INTEGER', notes: '' },
        { mongo: 'has_image.value', pg: 'has_image', type: 'BOOLEAN', notes: 'Cast 0/1 to Boolean.' },
        { mongo: 'spam', pg: 'spam_flag', type: 'TEXT', notes: '' },
        { mongo: 'description', pg: 'description_snapshot', type: 'TEXT', notes: '' },
        { mongo: 'lang_front', pg: 'front_lang_snapshot', type: 'TEXT', notes: '' },
        { mongo: 'created', pg: 'created_at', type: 'TIMESTAMP', notes: '' },
      ]
    },
    {
      name: 'history_cards',
      source: 'fc_set_history_capped.cards[]',
      rows: [
        { mongo: '(link)', pg: 'revision_id', type: 'BIGINT', notes: 'FK to set_history.' },
        { mongo: 'cards[].card_id.value', pg: 'card_id', type: 'INTEGER', notes: 'Snapshot.' },
        { mongo: 'cards[].front', pg: 'front_text', type: 'TEXT', notes: 'Snapshot.' },
        { mongo: 'cards[].back', pg: 'back_text', type: 'TEXT', notes: 'Snapshot.' },
        { mongo: 'cards[].front_html', pg: 'front_html', type: 'TEXT', notes: 'Snapshot.' },
      ]
    },
    {
      name: 'folders',
      source: 'fc_folders',
      rows: [
        { mongo: 'folder_id.value', pg: 'folder_id', type: 'INTEGER', notes: 'PRIMARY KEY.' },
        { mongo: '_id', pg: 'mongo_id', type: 'TEXT', notes: 'Legacy ObjectId.' },
        { mongo: 'user_id.value', pg: 'user_id', type: 'INTEGER', notes: '' },
        { mongo: 'title', pg: 'title', type: 'TEXT', notes: '' },
        { mongo: 'description', pg: 'description', type: 'TEXT', notes: '' },
        { mongo: 'subject', pg: 'subject', type: 'TEXT', notes: '' },
        { mongo: 'item_count.value', pg: 'item_count', type: 'INTEGER', notes: '' },
        { mongo: 'site_id.value', pg: 'site_id', type: 'INTEGER', notes: '' },
        { mongo: 'status', pg: 'status', type: 'TEXT', notes: '' },
        { mongo: 'slug', pg: 'slug', type: 'TEXT', notes: '' },
        { mongo: 'is_premium', pg: 'is_premium', type: 'BOOLEAN', notes: '' },
        { mongo: 'created.value', pg: 'created_at', type: 'TIMESTAMP', notes: 'Epoch -> Timestamp.' },
        { mongo: 'last_modified.value', pg: 'updated_at', type: 'TIMESTAMP', notes: 'Epoch -> Timestamp.' },
      ]
    },
    {
      name: 'folder_items',
      source: 'fc_folders.items[]',
      rows: [
        { mongo: 'parent.folder_id', pg: 'folder_id', type: 'INTEGER', notes: 'FOREIGN KEY.' },
        { mongo: 'items[].item_id.value', pg: 'item_id', type: 'INTEGER', notes: 'Target ID.' },
        { mongo: 'items[].item_type', pg: 'item_type', type: 'TEXT', notes: 'e.g., \'set\'.' },
        { mongo: 'items[].hash', pg: 'item_hash', type: 'TEXT', notes: '' },
        { mongo: 'items[].contributer.value', pg: 'contributor_id', type: 'INTEGER', notes: '' },
        { mongo: 'items[].created.value', pg: 'added_at', type: 'TIMESTAMP', notes: '' },
      ]
    },
  ];

  const systemTables = [
    {
      title: 'Table: counters',
      rows: [
        { mongo: 'key', pg: 'key_name', type: 'TEXT', notes: 'PRIMARY KEY.' },
        { mongo: '_id', pg: 'mongo_id', type: 'TEXT', notes: '' },
        { mongo: 'value.value', pg: 'sequence_value', type: 'BIGINT', notes: 'Flattened high/low.' },
      ]
    },
    {
      title: 'Table: set_directory',
      rows: [
        { mongo: 'set_id.value', pg: 'set_id', type: 'INTEGER', notes: 'FK to sets.set_id.' },
        { mongo: 'dir.value', pg: 'directory_id', type: 'INTEGER', notes: '' },
        { mongo: '_id', pg: 'mongo_id', type: 'TEXT', notes: '' },
      ]
    },
    {
      title: 'Table: set_indexed',
      rows: [
        { mongo: 'set_id.value', pg: 'set_id', type: 'INTEGER', notes: 'FK to sets.set_id.' },
        { mongo: '_id', pg: 'mongo_id', type: 'TEXT', notes: '' },
      ]
    },
    {
      title: 'Table: spam_log',
      rows: [
        { mongo: '(generated)', pg: 'log_id', type: 'SERIAL', notes: 'PG Primary Key.' },
        { mongo: '_id', pg: 'mongo_id', type: 'TEXT', notes: '' },
        { mongo: 'user_id.value', pg: 'user_id', type: 'INTEGER', notes: '' },
        { mongo: 'set_id.value', pg: 'set_id', type: 'INTEGER', notes: 'FK to sets.set_id.' },
      ]
    },
  ];

  const getBadgeClass = (type: string) => {
    switch(type) {
      case 'INTEGER': return 't-int';
      case 'TEXT': return 't-text';
      case 'BOOLEAN': return 't-bool';
      case 'TIMESTAMP': return 't-ts';
      case 'JSONB': return 't-json';
      case 'TEXT[]': return 't-arr';
      case 'BIGINT': return 't-big';
      case 'SERIAL': return 't-int';
      default: return 't-text';
    }
  };

  return (
    <>
      <h1>MongoDB → PostgreSQL: Migration Mapping</h1>

      <div className="opt-note">
        <strong>Engineering Directives:</strong>
        <ul style={{margin: '5px 0 0 0', paddingLeft: '20px'}}>
          <li><strong>Identity:</strong> Integer <code>set_id</code>, <code>card_id</code>, <code>folder_id</code> are promoted to <strong>Primary Keys</strong>. Legacy <code>_id</code> is preserved as <code>mongo_id</code> (TEXT).</li>
          <li><strong>Normalization:</strong> Nested arrays (`cards`, `items`) are normalized to child tables (`cards`, `folder_items`).</li>
          <li><strong>Complex Objects:</strong> Legacy metadata (`legacyFlashexData`) and Image metadata (`meta.images`) are flattened where common, or stored as JSONB where sparse.</li>
          <li><strong>Timestamps:</strong> Epoch integers and Date strings are normalized to <code>TIMESTAMP WITH TIME ZONE</code>.</li>
        </ul>
      </div>

      <h2>1. Table: <code>sets</code></h2>
      <p style={{fontSize:'13px', color:'#666', marginBottom:'10px'}}>Source: <code>fc_set</code></p>
      <table>
        <thead>
          <tr>
            <th className="col-mongo">Mongo Path</th>
            <th className="col-pg">Postgres Column</th>
            <th className="col-type">Type</th>
            <th className="col-notes">Notes</th>
          </tr>
        </thead>
        <tbody>
          {tables[0].rows.map((row, idx) => (
            <tr key={idx}>
              <td><span className="mongo-path">{row.mongo}</span></td>
              <td><span className="pg-col">{row.pg}</span></td>
              <td><span className={`badge ${getBadgeClass(row.type)}`}>{row.type}</span></td>
              <td>{row.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>2. Table: <code>cards</code></h2>
      <p style={{fontSize:'13px', color:'#666', marginBottom:'10px'}}>Source: <code>fc_set.cards[]</code></p>
      <table>
        <thead>
          <tr>
            <th className="col-mongo">Mongo Path</th>
            <th className="col-pg">Postgres Column</th>
            <th className="col-type">Type</th>
            <th className="col-notes">Notes</th>
          </tr>
        </thead>
        <tbody>
          {tables[1].rows.map((row, idx) => (
            <tr key={idx}>
              <td><span className="mongo-path">{row.mongo}</span></td>
              <td><span className="pg-col">{row.pg}</span></td>
              <td><span className={`badge ${getBadgeClass(row.type)}`}>{row.type}</span></td>
              <td>{row.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>3. Table: <code>set_history</code></h2>
      <p style={{fontSize:'13px', color:'#666', marginBottom:'10px'}}>Source: <code>fc_set_history_capped</code></p>
      <table>
        <thead>
          <tr>
            <th className="col-mongo">Mongo Path</th>
            <th className="col-pg">Postgres Column</th>
            <th className="col-type">Type</th>
            <th className="col-notes">Notes</th>
          </tr>
        </thead>
        <tbody>
          {tables[2].rows.map((row, idx) => (
            <tr key={idx}>
              <td><span className="mongo-path">{row.mongo}</span></td>
              <td><span className="pg-col">{row.pg}</span></td>
              <td><span className={`badge ${getBadgeClass(row.type)}`}>{row.type}</span></td>
              <td>{row.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>4. Table: <code>history_cards</code></h2>
      <p style={{fontSize:'13px', color:'#666', marginBottom:'10px'}}>Source: <code>fc_set_history_capped.cards[]</code></p>
      <table>
        <thead>
          <tr>
            <th className="col-mongo">Mongo Path</th>
            <th className="col-pg">Postgres Column</th>
            <th className="col-type">Type</th>
            <th className="col-notes">Notes</th>
          </tr>
        </thead>
        <tbody>
          {tables[3].rows.map((row, idx) => (
            <tr key={idx}>
              <td><span className="mongo-path">{row.mongo}</span></td>
              <td><span className="pg-col">{row.pg}</span></td>
              <td><span className={`badge ${getBadgeClass(row.type)}`}>{row.type}</span></td>
              <td>{row.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>5. Table: <code>folders</code></h2>
      <p style={{fontSize:'13px', color:'#666', marginBottom:'10px'}}>Source: <code>fc_folders</code></p>
      <table>
        <thead>
          <tr>
            <th className="col-mongo">Mongo Path</th>
            <th className="col-pg">Postgres Column</th>
            <th className="col-type">Type</th>
            <th className="col-notes">Notes</th>
          </tr>
        </thead>
        <tbody>
          {tables[4].rows.map((row, idx) => (
            <tr key={idx}>
              <td><span className="mongo-path">{row.mongo}</span></td>
              <td><span className="pg-col">{row.pg}</span></td>
              <td><span className={`badge ${getBadgeClass(row.type)}`}>{row.type}</span></td>
              <td>{row.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>6. Table: <code>folder_items</code></h2>
      <p style={{fontSize:'13px', color:'#666', marginBottom:'10px'}}>Source: <code>fc_folders.items[]</code></p>
      <table>
        <thead>
          <tr>
            <th className="col-mongo">Mongo Path</th>
            <th className="col-pg">Postgres Column</th>
            <th className="col-type">Type</th>
            <th className="col-notes">Notes</th>
          </tr>
        </thead>
        <tbody>
          {tables[5].rows.map((row, idx) => (
            <tr key={idx}>
              <td><span className="mongo-path">{row.mongo}</span></td>
              <td><span className="pg-col">{row.pg}</span></td>
              <td><span className={`badge ${getBadgeClass(row.type)}`}>{row.type}</span></td>
              <td>{row.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>7. System Tables</h2>

      {systemTables.map((table, tableIdx) => (
        <div key={tableIdx}>
          <h3>{table.title}</h3>
          <table>
            <thead>
              <tr>
                <th className="col-mongo">Mongo Path</th>
                <th className="col-pg">Postgres Column</th>
                <th className="col-type">Type</th>
                <th className="col-notes">Notes</th>
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, idx) => (
                <tr key={idx}>
                  <td><span className="mongo-path">{row.mongo}</span></td>
                  <td><span className="pg-col">{row.pg}</span></td>
                  <td><span className={`badge ${getBadgeClass(row.type)}`}>{row.type}</span></td>
                  <td>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <h1 className="source-header">Appendix: Source Data Reference</h1>
      <p className="opt-note" style={{marginTop: '0', borderColor: '#ccc', background: '#f9fafb', color: '#444'}}>
        The following sections provide the <strong>exact raw JSON content</strong> for verification purposes. Use horizontal scrolling to view full deep-nested objects.
      </p>

      <div className="collection-block">
        <div className="collection-title">
          <span>Appendix A: Full Sample Collection Data</span>
          <span className="badge t-text">JSON</span>
        </div>
        <div className="code-container">
          <div className="code-col">
            <span className="col-label">sample collection_final.json</span>
            <pre dangerouslySetInnerHTML={{
              __html: `[
  {
    <span class="k">"collection"</span>: <span class="s">"fc_set_history"</span>,
    <span class="k">"sample"</span>: <span class="b">null</span>
  },
  {
    <span class="k">"collection"</span>: <span class="s">"fc_set_indexed"</span>,
    <span class="k">"sample"</span>: <span class="s">"{_id=593012a02381ed6d235bef86, set_id=7151085}"</span>
  },
  {
    <span class="k">"collection"</span>: <span class="s">"fc_set"</span>,
    <span class="k">"sample"</span>: <span class="s">"{_id=52e9ee0bfc73cacc578b456c, access=public, cards=[{user_id=15148817, set_id=13283370, front=Onset, back=شروع, hint=, front_html=&lt;p&gt;&lt;font class='font-xs'&gt;Onset&lt;/font&gt;&lt;/p&gt;&lt;p&gt; &lt;/p&gt;&lt;p&gt; &lt;/p&gt;&lt;p&gt; &lt;/p&gt;, back_html=&lt;p&gt;&lt;font class='font-xs'&gt;شروع&lt;/font&gt;&lt;/p&gt;, hint_html=, image_id=null, front_image_id=null, hint_image_id=null, position=1, last_modified=Wed Nov 12 23:11:24 IST 2025, created=Wed Nov 12 23:11:24 IST 2025, card_id=44565, meta={images={front=null, back=null, hint=null}, note_hint=[]}}, {user_id=15148817, set_id=13283370, front=antagonistic, back=آنتاگونیست ، مخالفت آمیز ، خصومت آمیز ، رقابت آمیز , hint=, front_html=&lt;p&gt;antagonisti&lt;font class='font-s'&gt;c&lt;/font&gt;&lt;/p&gt;, back_html=&lt;p&gt;&lt;font class='font-s'&gt;آنتاگونیست ، مخالفت آمیز ، خصومت آمیز ، رقابت آمیز &lt;/font&gt;&lt;/p&gt;, hint_html=, image_id=null, front_image_id=null, hint_image_id=null, position=2, last_modified=Wed Nov 12 23:11:24 IST 2025, created=Wed Nov 12 23:11:24 IST 2025, card_id=44566, meta={images={front=null, back=null, hint=null}, note_hint=[]}}], count_cards=10, created=Sun Feb 25 13:30:00 IST 2001, description=colors in spanish, has_image=false, lang_back=es, lang_front=en, lang_hint=null, last_modified=Fri May 15 19:39:46 IST 2015, meta={legacyFlashexData={card_set_id=10, favorite_count=5, private=false}, username=andreaferroni9}, rankCount=1, rankSum=4, set_id=10, site_id=100, slug=spanishenglish-colors-10, subject=colors spanish, title=Spanish/English Colors, user_id=11331, views=8034}"</span>
  },
  {
    <span class="k">"collection"</span>: <span class="s">"fc_spam_log"</span>,
    <span class="k">"sample"</span>: <span class="s">"{_id=542393443d95cfe6028b48f8, user_id=4062671, set_id=5073241}"</span>
  },
  {
    <span class="k">"collection"</span>: <span class="s">"counters"</span>,
    <span class="k">"sample"</span>: <span class="s">"{_id=5388bb9885bae897c5ecf24c, key=set_id, value=14797606}"</span>
  },
  {
    <span class="k">"collection"</span>: <span class="s">"fc_folders"</span>,
    <span class="k">"sample"</span>: <span class="s">"{_id=5408efa8bc6aa07722001692, user_id=2996112, username=JeffShelton, is_premium=false, title=New Folder 1, subject=, access=public, description=, item_count=2, folder_id=3, created=1409871784, site_id=100, items=[{hash=set_1974723, item_type=set, item_id=1974723, contributer=2996112, created=1409871822}, {hash=set_4718859, item_type=set, item_id=4718859, contributer=2996112, created=1409871840}], last_modified=1409871784, status=deleted, slug=new-folder-1-3}"</span>
  },
  {
    <span class="k">"collection"</span>: <span class="s">"<span class="c">collection</span>"</span>,
    <span class="k">"sample"</span>: <span class="b">null</span>
  },
  {
    <span class="k">"collection"</span>: <span class="s">"fc_set_history_capped"</span>,
    <span class="k">"sample"</span>: <span class="s">"{_id=691c030407d5b918008b4580, title=Go ahead; Aussie, lang_front=en, lang_back=en, subject=, description=, access=public, user_id=15148817, user_name=behnamsharifitabar, count_cards=2, has_image=0, cards=[{user_id=15148817, set_id=13283370, front=Onset, back=شروع, hint=, front_html=&lt;p&gt;&lt;font class='font-xs'&gt;Onset&lt;/font&gt;&lt;/p&gt;&lt;p&gt; &lt;/p&gt;&lt;p&gt; &lt;/p&gt;&lt;p&gt; &lt;/p&gt;, back_html=&lt;p&gt;&lt;font class='font-xs'&gt;شروع&lt;/font&gt;&lt;/p&gt;, hint_html=, image_id=null, front_image_id=null, hint_image_id=null, position=1, last_modified=Wed Nov 12 23:11:24 IST 2025, created=Wed Nov 12 23:11:24 IST 2025, card_id=44565, meta={images={front=null, back=null, hint=null}, note_hint=[]}}, {user_id=15148817, set_id=13283370, front=antagonistic, back=آنتاگونیست ، مخالفت آمیز ، خصومت آمیز ، رقابت آمیز , hint=, front_html=&lt;p&gt;antagonisti&lt;font class='font-s'&gt;c&lt;/font&gt;&lt;/p&gt;, back_html=&lt;p&gt;&lt;font class='font-s'&gt;آنتاگونیست ، مخالفت آمیز ، خصومت آمیز ، رقابت آمیز &lt;/font&gt;&lt;/p&gt;, hint_html=, image_id=null, front_image_id=null, hint_image_id=null, position=2, last_modified=Wed Nov 12 23:11:24 IST 2025, created=Wed Nov 12 23:11:24 IST 2025, card_id=44566, meta={images={front=null, back=null, hint=null}, note_hint=[]}}], revision=20251117212420}"</span>
  },
  {
    <span class="k">"collection"</span>: <span class="s">"fc_set_indexed_2"</span>,
    <span class="k">"sample"</span>: <span class="s">"{_id=5bd33c5bdd271d8389a47247, set_id=556231}"</span>
  },
  {
    <span class="k">"collection"</span>: <span class="s">"fc_set_directory"</span>,
    <span class="k">"sample"</span>: <span class="s">"{_id=5c06745fc156dad3038b4568, dir=1, set_id=556231}"</span>
  }
]`
            }} />
          </div>
        </div>
      </div>

      <div className="collection-block">
        <div className="collection-title">
          <span>Appendix B: Full Collection Schema</span>
          <span className="badge t-text">JSON Definition</span>
        </div>
        <div className="code-container">
          <div className="code-col">
            <span className="col-label">collection schema.json</span>
            <pre dangerouslySetInnerHTML={{
              __html: `[
  {
    <span class="k">"collection"</span>: <span class="s">"{}"</span>,
    <span class="k">"counters"</span>: <span class="s">"{_id=[object], key=[string], value=[object], value.low=[number], value.high=[number], value.unsigned=[boolean]}"</span>,
    <span class="k">"fc_folders"</span>: <span class="s">"{_id=[object], user_id=[object], user_id.value=[number], username=[string, null], is_premium=[boolean], title=[string], subject=[string], access=[string], description=[string], item_count=[object], item_count.value=[number], folder_id=[object], folder_id.value=[number], created=[object], created.value=[number], site_id=[object], site_id.value=[number], items=[array, array&lt;object&gt;], items[].hash=[string], items[].item_type=[string], items[].item_id=[object], items[].item_id.value=[number], items[].contributer=[object], items[].contributer.value=[number], items[].created=[object], items[].created.value=[number], last_modified=[object], last_modified.value=[number], status=[string], slug=[string]}"</span>,
    <span class="k">"fc_set"</span>: <span class="s">"{_id=[object], access=[string], cards=[array, array&lt;object&gt;], cards[].card_id=[object], cards[].card_id.low=[number], cards[].card_id.high=[number], cards[].card_id.unsigned=[boolean], cards[].front=[string], cards[].back=[string], cards[].meta=[object], cards[].meta.legacyFlashexData=[object], cards[].meta.legacyFlashexData.card_id=[object], cards[].meta.legacyFlashexData.card_id.low=[number], cards[].meta.legacyFlashexData.card_id.high=[number], cards[].meta.legacyFlashexData.card_id.unsigned=[boolean], cards[].meta.legacyFlashexData.image_audit=[boolean], cards[].meta.legacyFlashexData.flip=[boolean], cards[].access=[string], cards[].position=[object], cards[].position.low=[number], cards[].position.high=[number], cards[].position.unsigned=[boolean], cards[].image_id=[object], cards[].image_id.low=[number], cards[].image_id.high=[number], cards[].image_id.unsigned=[boolean], cards[].created=[object], cards[].last_modified=[object], count_cards=[object], count_cards.low=[number], count_cards.high=[number], count_cards.unsigned=[boolean], created=[object], description=[string], has_image=[boolean], lang_back=[string, null], lang_front=[string, null], lang_hint=[null], last_modified=[object], meta=[object], meta.legacyFlashexData=[object], meta.legacyFlashexData.card_set_id=[object], meta.legacyFlashexData.card_set_id.low=[number], meta.legacyFlashexData.card_set_id.high=[number], meta.legacyFlashexData.card_set_id.unsigned=[boolean], meta.legacyFlashexData.favorite_count=[object], meta.legacyFlashexData.favorite_count.low=[number], meta.legacyFlashexData.favorite_count.high=[number], meta.legacyFlashexData.favorite_count.unsigned=[boolean], meta.legacyFlashexData.private=[boolean], meta.username=[string], rankCount=[object], rankCount.low=[number], rankCount.high=[number], rankCount.unsigned=[boolean], rankSum=[object], rankSum.low=[number], rankSum.high=[number], rankSum.unsigned=[boolean], set_id=[object], set_id.low=[number], set_id.high=[number], set_id.unsigned=[boolean], site_id=[object], site_id.low=[number], site_id.high=[number], site_id.unsigned=[boolean], slug=[string], subject=[string, null], title=[string], user_id=[object], user_id.low=[number], user_id.high=[number], user_id.unsigned=[boolean], views=[object], views.low=[number], views.high=[number], views.unsigned=[boolean], meta.legacyFlashexData.card_list=[string], noindex=[boolean], cards[].meta.legacyFlashexData.note_hint=[string], cards[].meta.legacyFlashexData.question_media_type_id=[object], cards[].meta.legacyFlashexData.question_media_type_id.low=[number], cards[].meta.legacyFlashexData.question_media_type_id.high=[number], cards[].meta.legacyFlashexData.question_media_type_id.unsigned=[boolean], cards[].meta.images=[object], cards[].meta.images.back=[object], cards[].meta.images.back.image_id=[string], cards[].meta.images.back.title=[null], cards[].meta.images.back.src=[string], cards[].meta.images.back.extension=[string], cards[].meta.images.back.provider=[string], cards[].meta.images.back.description=[null], cards[].meta.images.back.access=[string], meta.legacyFlashexData.trash=[boolean], views.value=[number]}"</span>,
    <span class="k">"fc_set_directory"</span>: <span class="s">"{_id=[object], dir=[object], dir.low=[number], dir.high=[number], dir.unsigned=[boolean], set_id=[object], set_id.low=[number], set_id.high=[number], set_id.unsigned=[boolean]}"</span>,
    <span class="k">"fc_set_history"</span>: <span class="s">"{}"</span>,
    <span class="k">"fc_set_history_capped"</span>: <span class="s">"{_id=[object], user_id=[object], user_id.low=[number], user_id.high=[number], user_id.unsigned=[boolean], user_name=[string], is_premium=[boolean], title=[string], subject=[string], access=[string], description=[string], count_cards=[object], count_cards.low=[number], count_cards.high=[number], count_cards.unsigned=[boolean], lang_front=[string], lang_back=[string], lang_hint=[string], has_image=[object], has_image.low=[number], has_image.high=[number], has_image.unsigned=[boolean], meta=[object], meta.lang_hint=[string], meta.username=[string], cards=[array, array&lt;object&gt;], cards[].hint=[string, null], cards[].access=[string], cards[].created=[object, string], cards[].last_modified=[object, string], cards[].card_id=[object], cards[].card_id.low=[number], cards[].card_id.high=[number], cards[].card_id.unsigned=[boolean], cards[].front=[string], cards[].back=[string], cards[].image_id=[null], cards[].front_image_id=[string, null], cards[].hint_image_id=[null], cards[].position=[object], cards[].position.low=[number], cards[].position.high=[number], cards[].position.unsigned=[boolean], cards[].meta=[object], cards[].meta.images=[object], cards[].meta.images.front=[object, null], cards[].meta.images.front.image_id=[string], cards[].meta.images.front.title=[string], cards[].meta.images.front.src=[string], cards[].meta.images.front.extension=[string], cards[].meta.images.front.hash=[null], cards[].meta.images.front.provider=[string], cards[].meta.images.front.description=[null], cards[].meta.images.front.access=[string], cards[].meta.images.front.s3_upload=[object], cards[].meta.images.front.s3_upload.low=[number], cards[].meta.images.front.s3_upload.high=[number], cards[].meta.images.front.s3_upload.unsigned=[boolean], cards[].meta.images.back=[null], cards[].meta.images.hint=[null], cards[].meta.note_hint=[array, array&lt;string&gt;], cards[].user_id=[string, object], cards[].set_id=[object], cards[].set_id.low=[number], cards[].set_id.high=[number], cards[].set_id.unsigned=[boolean], cards[].front_html=[string], cards[].back_html=[string], cards[].hint_html=[string], folders=[array], noindex=[string], site_id=[object], site_id.low=[number], site_id.high=[number], site_id.unsigned=[boolean], created=[object], set_id=[object], set_id.low=[number], set_id.high=[number], set_id.unsigned=[boolean], rankSum=[object], rankSum.low=[number], rankSum.high=[number], rankSum.unsigned=[boolean], rankCount=[object], rankCount.low=[number], rankCount.high=[number], rankCount.unsigned=[boolean], views=[object], views.low=[number], views.high=[number], views.unsigned=[boolean], last_modified=[object], slug=[string], revision=[string], cards[].user_id.low=[number], cards[].user_id.high=[number], cards[].user_id.unsigned=[boolean], spam=[string]}"</span>,
    <span class="k">"fc_set_indexed"</span>: <span class="s">"{_id=[object], set_id=[object], set_id.value=[number]}"</span>,
    <span class="k">"fc_set_indexed_2"</span>: <span class="s">"{_id=[object], set_id=[object], set_id.value=[number]}"</span>,
    <span class="k">"fc_spam_log"</span>: <span class="s">"{_id=[object], user_id=[object], user_id.value=[number], set_id=[object], set_id.value=[number]}"</span>
  }
]`
            }} />
          </div>
        </div>
      </div>
    </>
  )
}
