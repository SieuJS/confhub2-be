create extension if not exists "uuid-ossp";

create table public.important_dates (
    "id" uuid primary key default uuid_generate_v4(),
    "cfp_id" uuid,
    "date_type" text,
    "date_value" date,
    "status" text
);

create table public.rank_of_cfc (
    "id" uuid primary key default uuid_generate_v4(),
    "rank_id" uuid,
    "cfc_id" uuid,
    "year" numeric
);

create table public.call_for_papers (
    "id" uuid primary key default uuid_generate_v4(),
    "conference_id" uuid,
    "content" text,
    "link" text,
    "avg_rating" float,
    "owner" text,
    "status" text,
    "view_count" numeric
);

create table call_for_paper_details (
    "id" uuid primary key default uuid_generate_v4(),
    "cfp_id" uuid,
    "location" text,
    "country" text,
    "start_date" date,
    "end_date" date,
    "access_type" text check ("access_type" in ('online', 'offline', 'hybrid')),
    "status" boolean
);

create table sources (
    "id" uuid primary key default uuid_generate_v4(),
    "name" text,
    "link" text
);

create table ranks_of_source (
    "id" uuid primary key default uuid_generate_v4(),
    "source_id" uuid,
    "rank" text,
    "value" numeric
);

create table fields_of_research (
    "id" uuid primary key default uuid_generate_v4(),
    "code" text,
    "name" text
);

create table conferences (
    "id" uuid primary key default uuid_generate_v4(),
    "name" text, 
    "acronym" text
);

create table journals (
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

create table journal_rank_footprints (
    "id" uuid primary key default uuid_generate_v4(),
    "journal_id" uuid,
    "rank_id" uuid,
    "year" numeric
);

create table conference_rank_footprints (
    "id" uuid primary key default uuid_generate_v4(),
    "conference_id" uuid,
    "rank_id" uuid,
    "year" numeric
);

-- foreign keys for call_for_paper_details table
alter table call_for_paper_details add constraint fk_detail_of_cfp foreign key (cfp_id) references call_for_papers(id);

-- foreign keys for important_dates table
alter table important_dates add constraint fk_important_date_of_cfp foreign key (cfp_id) references call_for_papers(id);

-- foreign keys for call_for_papers table 
alter table call_for_papers add constraint fk_cfp_belong_conference foreign key (conference_id) references conferences(id);

-- rank_of_cfc table foreign keys
alter table rank_of_cfc add constraint fk_cfp_has_rank foreign key (cfc_id) references call_for_papers(id);
alter table rank_of_cfc add constraint fk_rank_of_cfc foreign key (rank_id) references ranks_of_source(id);

-- foreign keys for ranks_of_source table
alter table ranks_of_source add constraint fk_rank_of_source foreign key (source_id) references sources(id);

-- foreign keys for conference_rank_footprints table
alter table conference_rank_footprints add constraint fk_conference_rank_footprints foreign key (conference_id) references conferences(id);
alter table conference_rank_footprints add constraint fk_rank_of_conference foreign key (rank_id) references ranks_of_source(id);

-- foreign keys for journal_rank_footprints table
alter table journal_rank_footprints add constraint fk_journal_rank_footprints foreign key (journal_id) references journals(id);
alter table journal_rank_footprints add constraint fk_rank_of_journal foreign key (rank_id) references ranks_of_source(id);
