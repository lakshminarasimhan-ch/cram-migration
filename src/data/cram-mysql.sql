create table fc_api_access_logs
(
    api_access_log_id  int auto_increment
        primary key,
    client_id          varchar(32)                           null,
    user_id            int                                   null,
    method             enum ('get', 'post', 'put', 'delete') null,
    request_uri_raw    varchar(255)                          null,
    request_uri        varchar(255)                          null,
    client_ip          varchar(100)                          null,
    http_response_code int                                   null,
    meta               text                                  null,
    created_date       datetime                              not null
)
    charset = utf8mb3
    row_format = COMPACT;

create index client_id
    on fc_api_access_logs (client_id);

create index client_id_method
    on fc_api_access_logs (client_id, method);

create index method
    on fc_api_access_logs (method);

create table fc_api_aggregate_functions
(
    api_aggregate_function_id int auto_increment
        primary key,
    log_date                  date                                  not null,
    client_id                 varchar(32)                           not null,
    method                    enum ('get', 'post', 'put', 'delete') null,
    request_uri               varchar(255)                          null,
    count                     int default 0                         not null,
    constraint date_client_id_method_request_uri
        unique (log_date, client_id, method, request_uri)
)
    charset = utf8mb3
    row_format = COMPACT;

create index client_id
    on fc_api_aggregate_functions (client_id);

create index client_id_method
    on fc_api_aggregate_functions (client_id, method);

create index method
    on fc_api_aggregate_functions (method);

create table fc_api_aggregate_methods
(
    api_aggregate_method_id int auto_increment
        primary key,
    log_date                date                                  not null,
    client_id               varchar(32)                           not null,
    method                  enum ('get', 'post', 'put', 'delete') null,
    count                   int default 0                         not null,
    constraint date_client_id_method
        unique (log_date, client_id, method)
)
    charset = utf8mb3
    row_format = COMPACT;

create index client_id
    on fc_api_aggregate_methods (client_id);

create index client_id_method
    on fc_api_aggregate_methods (client_id, method);

create index method
    on fc_api_aggregate_methods (method);

create table fc_api_client
(
    user_id         int                                                     not null
        primary key,
    client_id       varchar(32)                                             not null,
    site_id         smallint                      default 100               not null,
    client_secret   varchar(64)                                             not null,
    app_name        varchar(255)                                            not null,
    app_description text                                                    null,
    redirect_uri    varchar(255)                                            null,
    status          enum ('active', 'inactive', 'deleted', '')              not null,
    type            enum ('admin', 'application') default 'application'     not null,
    created         datetime                                                not null,
    last_modified   timestamp                     default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    constraint idx_client_id
        unique (client_id)
)
    charset = utf8mb3
    row_format = COMPACT;

create table fc_api_client_map_user
(
    client_id     varchar(32)                                 not null,
    user_id       int                                         not null,
    oauth_token   varchar(64)                                 null,
    refresh_token varchar(64)                                 null,
    created_date  datetime                                    not null,
    status        enum ('active', 'deleted') default 'active' null,
    last_modified datetime                                    null,
    primary key (client_id, user_id)
)
    charset = utf8mb3
    row_format = COMPACT;

create table fc_api_v1_nonce
(
    id      int unsigned auto_increment
        primary key,
    nonce   varchar(255) not null,
    created int          not null,
    constraint nonce_multi_key
        unique (nonce, created)
)
    charset = utf8mb3
    row_format = COMPACT;

create table fc_api_v1_vendor
(
    id               int unsigned auto_increment
        primary key,
    oauth_key        varchar(255) not null,
    oauth_secret     varchar(255) not null,
    application_name varchar(255) not null,
    contact_email    varchar(255) not null,
    contact_name     varchar(255) not null,
    ins_date         date         not null,
    website          varchar(255) null
)
    charset = utf8mb3
    row_format = COMPACT;

create table fc_api_v1_request
(
    id         int auto_increment
        primary key,
    vendor_id  int unsigned                not null,
    token      varchar(255)                not null,
    secret     varchar(255)                not null,
    verifier   varchar(255)                null,
    callback   varchar(255)                null,
    token_type enum ('request', 'access')  not null,
    user_id    bigint unsigned default '0' null,
    created    int                         not null,
    constraint apiV1RequestVendorId
        foreign key (vendor_id) references fc_api_v1_vendor (id)
            on update cascade on delete cascade
)
    charset = utf8mb3
    row_format = COMPACT;

create table fc_apps
(
    app_id        int auto_increment
        primary key,
    app_name      varchar(64)    not null,
    slug          varchar(64)    not null,
    device        varchar(32)    not null,
    price         decimal(10, 2) not null,
    version_type  varchar(12)    null,
    version       varchar(12)    not null,
    size          decimal(10, 2) not null,
    languages     varchar(255)   not null,
    trial_length  int            not null,
    user_id       int            null,
    downloads     int            null,
    rating        decimal(10, 2) null,
    date_launched datetime       not null,
    date_updated  datetime       not null,
    constraint slug_UNIQUE
        unique (slug)
)
    row_format = COMPACT;

create table fc_apps_data
(
    id        int auto_increment
        primary key,
    app_id    int         null,
    desc_type varchar(32) null,
    desc_data longtext    null
)
    row_format = COMPACT;

create index app_id
    on fc_apps_data (app_id);

create table fc_apps_dev
(
    dev_id       int auto_increment
        primary key,
    company      varchar(64)  not null,
    name         varchar(64)  not null,
    dev_site     varchar(255) null,
    dev_fb_site  varchar(255) null,
    date_joined  datetime     null,
    date_updated datetime     null
)
    row_format = COMPACT;

create table fc_apps_images
(
    id           int auto_increment
        primary key,
    app_id       int          not null,
    device       varchar(32)  null,
    device_title varchar(32)  null,
    img_title    varchar(32)  null,
    img_src      varchar(255) null,
    modified     datetime     null,
    created      datetime     null
)
    row_format = COMPACT;

create index app_id
    on fc_apps_images (app_id);

create table fc_categories
(
    category_id smallint auto_increment
        primary key,
    site_id     int                     not null,
    parent      varchar(128) default '' null,
    slug        varchar(128)            not null,
    title       varchar(128)            null,
    count       int          default 0  null
)
    charset = utf8mb3
    row_format = COMPACT;

create index idx_slug
    on fc_categories (slug);

create table fc_essay_link_support
(
    id         int auto_increment
        primary key,
    target_url text         null,
    url1       text         null,
    anchor1    varchar(255) null,
    url2       text         null,
    anchor2    varchar(255) null,
    url3       text         null,
    anchor3    varchar(255) null
)
    charset = utf8mb3;

create table fc_image
(
    image_id    int auto_increment
        primary key,
    title       varchar(255)                                                       null,
    src         varchar(255)                                                       not null,
    extension   enum ('jpeg', 'jpg', 'png', 'gif')                                 not null,
    hash        varchar(32)                                                        null,
    provider    varchar(255)                                                       null,
    description text                                                               null,
    access      enum ('private', 'public', 'inactive', 'deleted') default 'public' null,
    meta        text                                                               null,
    creator_id  int                                                                not null,
    created     datetime                                                           not null
)
    charset = utf8mb3
    row_format = COMPACT;

create table fc_jewel_score_totals
(
    set_id     int           not null
        primary key,
    num_scores int default 0 not null,
    sum_scores int default 0 not null
)
    charset = utf8mb3
    row_format = COMPACT;

create table fc_jewel_scores
(
    id       int auto_increment
        primary key,
    score    int           null,
    name     varchar(31)   null,
    accuracy varchar(31)   null,
    user_id  int default 0 null,
    created  datetime      not null,
    set_id   int           null,
    time     int           not null comment 'milliseconds it took user to finish set',
    constraint user_scores
        unique (set_id, user_id)
)
    charset = utf8mb3
    row_format = COMPACT;

create table fc_langs
(
    lang_id int auto_increment
        primary key,
    code    varchar(10)  not null,
    slug    varchar(15)  null,
    title   varchar(100) not null
)
    charset = utf8mb3
    row_format = COMPACT;

create table fc_payment_subscriptions
(
    id                          int auto_increment
        primary key,
    subscription_id             int unsigned                                  null,
    external_id                 varchar(64)                                   null,
    site_id                     smallint unsigned                             not null,
    user_id                     int unsigned                                  null,
    user_external_id            varchar(64)                                   null,
    trans_id                    varchar(64)                                   null,
    email                       varchar(128)                                  null,
    username                    varchar(64)                                   null,
    plan                        varchar(64)                                   null,
    external_plan               varchar(64)                                   null,
    coupon                      varchar(64)                                   null,
    amount                      int                                           null,
    currency                    varchar(3)                                    null,
    quantity                    int                                           null,
    billing_first_name          varchar(64)                                   null,
    billing_last_name           varchar(64)                                   null,
    billing_address1            varchar(128)                                  null,
    billing_address2            varchar(128)                                  null,
    billing_city                varchar(64)                                   null,
    billing_state               varchar(64)                                   null,
    billing_zip                 varchar(16)                                   null,
    billing_country             varchar(2)                                    null,
    billing_phone               varchar(32)                                   null,
    payment_type                varchar(32)                                   null,
    payment_card_number         varchar(32)                                   null,
    payment_card_month          varchar(2)                                    null,
    payment_card_year           varchar(4)                                    null,
    payment_paypal_agreement_id varchar(64)                                   null,
    activated                   datetime                                      null,
    current_period_started      datetime                                      null,
    current_period_ends         datetime                                      null,
    canceled                    datetime                                      null,
    expires                     datetime                                      null,
    gateway                     varchar(32)                                   null,
    status                      enum ('new', 'active', 'canceled', 'expired') null,
    created                     datetime                                      null,
    updated                     timestamp default CURRENT_TIMESTAMP           null on update CURRENT_TIMESTAMP,
    constraint subscription_id
        unique (subscription_id)
)
    collate = utf8mb4_general_ci;

create index `site_id-user_id`
    on fc_payment_subscriptions (site_id, user_id);

create table fc_payment_transaction_log
(
    id               int unsigned auto_increment
        primary key,
    subscription_id  int unsigned           null,
    site_id          int unsigned           null,
    user_id          int unsigned           null,
    session_id       varchar(64)            null,
    session_ip       varchar(48)            null,
    session_trans_id varchar(64)            null,
    action           varchar(32) default '' null,
    query_str        varchar(255)           null,
    request          text                   null,
    response         text                   null,
    status           int                    null,
    api_key          varchar(32)            null,
    created          datetime               null
)
    collate = utf8mb4_general_ci;

create index `site_id-user_id`
    on fc_payment_transaction_log (site_id, user_id);

create index status
    on fc_payment_transaction_log (status);

create index subscription_id
    on fc_payment_transaction_log (subscription_id);

create index `type-action`
    on fc_payment_transaction_log (action);

create table fc_privileges
(
    privilege_id int auto_increment
        primary key,
    role_id      int        not null,
    resource_id  int        not null,
    access       tinyint(1) null,
    modified     datetime   not null,
    created      datetime   not null
)
    row_format = COMPACT;

create index resources_idx
    on fc_privileges (resource_id);

create index role_idx
    on fc_privileges (role_id);

create table fc_reports
(
    report_id   int auto_increment
        primary key,
    reporter_id int                                                                not null,
    set_id      int                                                                not null,
    status      enum ('In progress', 'Deleted', 'Processed') default 'In progress' null,
    dt          int                                                                null
)
    charset = utf8mb3
    row_format = COMPACT;

create table fc_resources
(
    resource_id     int auto_increment
        primary key,
    name            varchar(255) not null,
    `key`           varchar(255) null,
    multiple_assert tinyint(1)   null,
    assert          varchar(32)  null,
    modified        datetime     not null,
    created         datetime     not null,
    constraint `key`
        unique (`key`)
)
    row_format = COMPACT;

create table fc_roles
(
    id        int auto_increment
        primary key,
    role      varchar(255)                        not null,
    `default` tinyint(1)                          null,
    modified  timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    created   datetime                            not null
)
    row_format = COMPACT;

create table fc_stellarspeller_score_totals
(
    set_id     int           not null
        primary key,
    num_scores int default 0 not null,
    sum_scores int default 0 not null
)
    charset = utf8mb3;

create table fc_stellarspeller_scores
(
    id       int auto_increment
        primary key,
    score    int           null,
    name     varchar(31)   null,
    accuracy varchar(31)   null,
    user_id  int default 0 null,
    created  datetime      not null,
    set_id   int           null,
    time     int           not null comment 'milliseconds it took user to finish set',
    constraint user_scores
        unique (set_id, user_id)
)
    charset = utf8mb3;

create table fc_takedowns
(
    id              bigint auto_increment
        primary key,
    fce_set_id      bigint                             not null,
    admin_user_id   bigint                             not null,
    takedown_reason varchar(50)                        not null,
    created_at      datetime default CURRENT_TIMESTAMP not null
);

create index idx_fce_set_id_fc_takedowns
    on fc_takedowns (fce_set_id);

create table fc_user_email_notifications
(
    id      int auto_increment
        primary key,
    user_id bigint            not null,
    news    tinyint default 0 not null
)
    charset = utf8mb3
    row_format = COMPACT;

create table fc_user_role
(
    user_id int not null,
    role_id int not null,
    primary key (user_id, role_id)
)
    charset = utf8mb3
    row_format = COMPACT;

create table fc_user_social
(
    user_id     int         default 0   not null,
    social_type varchar(16) default ''  not null,
    social_id   varchar(32) default ''  not null,
    converted   tinyint(1)              null,
    meta        text                    null,
    created     datetime                null,
    updated     datetime                null,
    site_id     smallint    default 100 not null,
    primary key (user_id, social_type, social_id)
)
    charset = utf8mb3
    row_format = COMPACT;

create index IDX_site_id
    on fc_user_social (site_id);

create table fc_users
(
    id              int auto_increment
        primary key,
    site_id         smallint                                          default 100      not null,
    username        varchar(64)                                                        null,
    user_login      varchar(100)                                                       null,
    password        varchar(40)                                                        null,
    password_salt   varchar(40)                                                        null,
    email           varchar(100)                                                       null,
    user_type       int                                                                null,
    status          enum ('active', 'inactive', 'pending', 'deleted') default 'active' not null,
    date_joined     datetime                                                           null,
    meta            mediumtext                                                         null,
    updated         datetime                                                           null,
    last_login_date datetime                                                           null,
    constraint user_login
        unique (site_id, user_login, password, password_salt)
)
    charset = utf8mb3
    row_format = COMPACT;

create index idx_email
    on fc_users (site_id, email);

create index idx_username
    on fc_users (site_id, username);

create table fcdb_to_fce_cardset_map
(
    fcdb_cardset_id int                  not null
        primary key,
    fce_set_id      int                  not null,
    fce_slug        varchar(255)         not null,
    status          tinyint(1) default 0 not null comment '0:UNKNOWN, 1:SUCCESS, 2:EXISTING, -1:ERROR',
    constraint map
        unique (fcdb_cardset_id, fce_set_id)
)
    charset = utf8mb3;

create index migration_status
    on fcdb_to_fce_cardset_map (status);

create table fcdb_to_fce_meta
(
    meta_key   varchar(255) not null
        primary key,
    meta_value varchar(255) not null
)
    charset = utf8mb3;

create table fcdb_to_fce_user_map
(
    fcdb_id    int                  not null
        primary key,
    fce_id     bigint               not null,
    fcdb_login varchar(255)         not null,
    fce_login  varchar(255)         not null,
    fcdb_email varchar(255)         null,
    status     tinyint(1) default 0 not null comment '0:UNKNOWN, 1:SUCCESS, 2:RENAMED, -1:ERROR',
    constraint map
        unique (fcdb_id, fce_id)
)
    charset = utf8mb3;

create index fcdb_lookup
    on fcdb_to_fce_user_map (fcdb_login);

create index migration_status
    on fcdb_to_fce_user_map (status);

create table temp_fcimage_migration_data
(
    id        int auto_increment
        primary key,
    set_id    int                                not null,
    slug      varchar(255)                       not null,
    src       varchar(500)                       not null,
    extension enum ('jpeg', 'jpg', 'png', 'gif') not null
);

create table temp_fcimage_migration_data_backup
(
    id        int auto_increment
        primary key,
    set_id    int                                not null,
    slug      varchar(255)                       not null,
    src       varchar(500)                       not null,
    extension enum ('jpeg', 'jpg', 'png', 'gif') not null
);

create table temp_fcimage_migration_limits
(
    max_limit int not null
);

create table temp_fcimage_migration_processed
(
    id          int auto_increment
        primary key,
    batch_start int not null,
    batch_end   int not null
);

create table translations
(
    id     int unsigned auto_increment
        primary key,
    siteId smallint unsigned not null,
    token  varchar(255)      not null,
    value  text              not null
)
    charset = utf8mb3;

create table user_cancellation_reason_log
(
    logId      int unsigned auto_increment
        primary key,
    userId     int unsigned      not null,
    siteId     smallint unsigned not null,
    reasonId   tinyint           not null,
    createdAt  int               not null,
    reasonText text              null
)
    collate = utf8mb4_general_ci;

create index siteId
    on user_cancellation_reason_log (siteId, userId);

create table user_subscriptions
(
    userId       int        not null
        primary key,
    siteId       smallint   not null,
    created      int        not null,
    lastModified int        not null,
    newsletter   tinyint(1) null,
    notification tinyint(1) null,
    caslCampaign tinyint(1) null,
    meta         text       null
)
    charset = utf8mb3;

create index idx_siteid_caslcampaign
    on user_subscriptions (siteId, caslCampaign);

create index idx_siteid_newsletter
    on user_subscriptions (siteId, newsletter);

create index idx_siteid_notification
    on user_subscriptions (siteId, notification);

create table users
(
    id        int auto_increment
        primary key,
    username  varchar(255) null,
    email     varchar(255) null,
    password  varchar(255) null,
    hashToken varchar(255) null
);

create table users_nta
(
    nta_id       varchar(255) not null
        primary key,
    email        varchar(255) null,
    users_nta_id int          not null,
    postalcode   varchar(255) not null,
    meta         varchar(255) null,
    status       varchar(255) not null,
    dateExpired  varchar(255) not null,
    dateCreated  varchar(255) not null,
    dateModified varchar(255) null,
    dateUsed     varchar(255) null
)
    charset = utf8mb3;

