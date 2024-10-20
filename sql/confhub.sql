CREATE SCHEMA IF NOT EXISTS confhub;
create extension if not exists "uuid-ossp";

create table confhub.important_dates (
    "id" uuid primary key default uuid_generate_v4(),
    "cfp_id" uuid,
    "date_type" text,
    "date_value" date,
    "status" text
);

create table confhub.rank_of_cfp (
    "id" uuid primary key default uuid_generate_v4(),
    "rank_id" uuid,
    "cfp_id" uuid,
    "year" numeric
);

create table confhub.call_for_papers (
    "id" uuid primary key default uuid_generate_v4(),
    "conference_id" uuid,
    "content" text,
    "link" text,
    "avg_rating" float,
    "owner" text,
    "view_count" numeric,
    "location" text,
    "country" text,
    "start_date" date,
    "end_date" date,
    "access_type" text check ("access_type" in ('online', 'offline', 'hybrid')),
    "status" boolean
);


create table confhub.sources (
    "id" uuid primary key default uuid_generate_v4(),
    "name" text,
    "link" text
);

create table confhub.source_ranks (
    "id" uuid primary key default uuid_generate_v4(),
    "source_id" uuid,
    "rank" text,
    "value" numeric
);

create table confhub.fields_of_research (
    "id" uuid primary key default uuid_generate_v4(),
    "code" text,
    "name" text
);

create table confhub.conferences (
    "id" uuid primary key default uuid_generate_v4(),
    "name" text, 
    "acronym" text
);

create table confhub.journals (
    "id" uuid primary key default uuid_generate_v4(),
    "country" text,
    "name" text,
    "issn" text,
    "h_index" numeric,
    "publisher" text,
    "scope" text,
    "home_page" text, 
    "email_submission" text
);

create table confhub.journal_rank_footprints (
    "id" uuid primary key default uuid_generate_v4(),
    "journal_id" uuid,
    "rank_id" uuid,
    "for_id" uuid,
    "year" numeric
);

create table confhub.conference_rank_footprints (
    "id" uuid primary key default uuid_generate_v4(),
    "conference_id" uuid,
    "rank_id" uuid,
    "for_id" uuid,
    "year" numeric
);

-- foreign keys for important_dates table
alter table confhub.important_dates add constraint fk_important_date_of_cfp foreign key (cfp_id) references confhub.call_for_papers(id);

-- foreign keys for call_for_papers table 
alter table confhub.call_for_papers add constraint fk_cfp_belong_conference foreign key (conference_id) references confhub.conferences(id);

-- rank_of_cfc table foreign keys
alter table confhub.rank_of_cfp add constraint fk_cfp_has_rank foreign key (cfp_id) references confhub.call_for_papers(id);
alter table confhub.rank_of_cfp add constraint fk_rank_of_cfc foreign key (rank_id) references confhub.source_ranks(id);

-- foreign keys for source_ranks table
alter table confhub.source_ranks add constraint fk_rank_of_source foreign key (source_id) references confhub.sources(id);

-- foreign keys for conference_rank_footprints table
alter table confhub.conference_rank_footprints add constraint fk_conference_rank_footprints foreign key (conference_id) references confhub.conferences(id);
alter table confhub.conference_rank_footprints add constraint fk_rank_of_conference foreign key (rank_id) references confhub.source_ranks(id);
alter table confhub.conference_rank_footprints add constraint fk_conference_rank_footprints_for foreign key (for_id) references confhub.fields_of_research(id);

-- foreign keys for journal_rank_footprints table
alter table confhub.journal_rank_footprints add constraint fk_journal_rank_footprints foreign key (journal_id) references confhub.journals(id);
alter table confhub.journal_rank_footprints add constraint fk_rank_of_journal foreign key (rank_id) references confhub.source_ranks(id);
alter table confhub.journal_rank_footprints add constraint fk_journal_rank_footprints_for foreign key (for_id) references confhub.fields_of_research(id);