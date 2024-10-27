CREATE SCHEMA IF NOT EXISTS confhub;
set schema 'confhub';
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

-- for: fields of research
create table confhub.for_division (
    "id" uuid primary key default uuid_generate_v4(),
    "code" varchar(2) UNIQUE,
    "name" text
);

create table confhub.for_group (
    "id" uuid primary key default uuid_generate_v4(),
    "code" varchar(4) UNIQUE,
    "name" text,
    "division_id" uuid
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

create table confhub.error_conferences(
	"id" uuid primary key default uuid_generate_v4(),
	"error_type" text, 
	"error_message" text , 
	"conference_id" uuid,
	"created_at" timestamp, 
	"updated_at" timestamp
) 

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
alter table confhub.conference_rank_footprints add constraint fk_conference_rank_footprints_for foreign key (for_id) references confhub.for_group(id);

-- foreign keys for journal_rank_footprints table
alter table confhub.journal_rank_footprints add constraint fk_journal_rank_footprints foreign key (journal_id) references confhub.journals(id);
alter table confhub.journal_rank_footprints add constraint fk_rank_of_journal foreign key (rank_id) references confhub.source_ranks(id);
alter table confhub.journal_rank_footprints add constraint fk_journal_rank_footprints_for foreign key (for_id) references confhub.for_group(id);

-- foreign keys for for_group table
alter table confhub.for_group add constraint fk_for_group_of_division foreign key (division_id) references confhub.for_division(id);


--job management : 
create table confhub.crawl_jobs (
    "id" uuid primary key default uuid_generate_v4(),
	"conference_id" text , 
	"type" text , 
	"progress_percent" int , 
	"progress_detail" text ,
	"duration" int,
	"status" text,
	"created_at" timestamp, 
	"updated_at" timestamp
);

CREATE OR REPLACE FUNCTION notify_table_change()
RETURNS trigger AS $$
DECLARE
    payload JSON;
BEGIN
    -- Construct payload based on the operation (INSERT, UPDATE, DELETE)
    IF (TG_OP = 'INSERT') THEN
        payload = json_build_object('operation', 'INSERT', 'data', row_to_json(NEW));
    ELSIF (TG_OP = 'UPDATE') THEN
        payload = json_build_object('operation', 'UPDATE', 'data', row_to_json(NEW));
    ELSIF (TG_OP = 'DELETE') THEN
        payload = json_build_object('operation', 'DELETE', 'data', row_to_json(OLD));
    END IF;
    
    -- Send the notification to the specified channel
    PERFORM pg_notify('table_change_channel', payload::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER table_change_trigger
AFTER INSERT OR UPDATE OR DELETE
ON crawl_jobs
FOR EACH ROW
EXECUTE FUNCTION notify_table_change();