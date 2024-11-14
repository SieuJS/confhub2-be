-- CreateTable
create extension if not exists "uuid-ossp";
CREATE TABLE "conferences" (
    "id" UUID NOT NULL DEFAULT public.uuid_generate_v4(),
    "name" TEXT,
    "acronym" TEXT,

    CONSTRAINT "conferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "important_dates" (
    "id" UUID NOT NULL DEFAULT public.uuid_generate_v4(),
    "cfp_id" UUID,
    "date_type" TEXT,
    "date_value" DATE,
    "status" TEXT,

    CONSTRAINT "important_dates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_rank_footprints" (
    "id" UUID NOT NULL DEFAULT public.uuid_generate_v4(),
    "journal_id" UUID,
    "rank_id" UUID,
    "for_id" UUID,
    "year" DECIMAL,

    CONSTRAINT "journal_rank_footprints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journals" (
    "id" UUID NOT NULL DEFAULT public.uuid_generate_v4(),
    "country" TEXT,
    "name" TEXT,
    "issn" TEXT,
    "h_index" DECIMAL,
    "publisher" TEXT,
    "scope" TEXT,
    "home_page" TEXT,
    "email_submission" TEXT,

    CONSTRAINT "journals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sources" (
    "id" UUID NOT NULL DEFAULT public.uuid_generate_v4(),
    "name" TEXT,
    "link" TEXT,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "call_for_papers" (
    "id" UUID NOT NULL DEFAULT public.uuid_generate_v4(),
    "conference_id" UUID,
    "content" TEXT,
    "link" TEXT,
    "avg_rating" DOUBLE PRECISION,
    "owner" TEXT,
    "view_count" DECIMAL,
    "location" TEXT,
    "country" TEXT,
    "start_date" DATE,
    "end_date" DATE,
    "access_type" TEXT,
    "status" BOOLEAN,

    CONSTRAINT "call_for_papers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conference_rank_footprints" (
    "id" UUID NOT NULL DEFAULT public.uuid_generate_v4(),
    "conference_id" UUID,
    "rank_id" UUID,
    "for_id" UUID,
    "year" DECIMAL,

    CONSTRAINT "conference_rank_footprints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rank_of_cfp" (
    "id" UUID NOT NULL DEFAULT public.uuid_generate_v4(),
    "rank_id" UUID,
    "cfp_id" UUID,
    "year" DECIMAL,

    CONSTRAINT "rank_of_cfp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "for_division" (
    "id" UUID NOT NULL DEFAULT public.uuid_generate_v4(),
    "code" VARCHAR(2),
    "name" TEXT,

    CONSTRAINT "for_division_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "for_group" (
    "id" UUID NOT NULL DEFAULT public.uuid_generate_v4(),
    "code" VARCHAR(8),
    "name" TEXT,
    "division_id" UUID,

    CONSTRAINT "for_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source_ranks" (
    "id" UUID NOT NULL DEFAULT public.uuid_generate_v4(),
    "source_id" UUID,
    "rank" TEXT,
    "value" DECIMAL,

    CONSTRAINT "source_ranks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crawl_jobs" (
    "id" UUID NOT NULL DEFAULT public.uuid_generate_v4(),
    "conference_id" TEXT,
    "type" TEXT,
    "progress_percent" INTEGER,
    "progress_detail" TEXT,
    "duration" INTEGER,
    "status" TEXT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "crawl_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "error_conferences" (
    "id" UUID NOT NULL DEFAULT public.uuid_generate_v4(),
    "error_type" TEXT,
    "error_message" TEXT,
    "conference_id" UUID,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "error_conferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "conferences_acronym_key" ON "conferences"("acronym");

-- CreateIndex
CREATE UNIQUE INDEX "sources_name_key" ON "sources"("name");

-- CreateIndex
CREATE UNIQUE INDEX "for_division_code_key" ON "for_division"("code");

-- CreateIndex
CREATE UNIQUE INDEX "for_group_code_key" ON "for_group"("code");

-- CreateIndex
CREATE UNIQUE INDEX "source_ranks_source_id_rank_key" ON "source_ranks"("source_id", "rank");

-- AddForeignKey
ALTER TABLE "important_dates" ADD CONSTRAINT "fk_important_date_of_cfp" FOREIGN KEY ("cfp_id") REFERENCES "call_for_papers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "journal_rank_footprints" ADD CONSTRAINT "fk_journal_rank_footprints" FOREIGN KEY ("journal_id") REFERENCES "journals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "journal_rank_footprints" ADD CONSTRAINT "fk_journal_rank_footprints_for" FOREIGN KEY ("for_id") REFERENCES "for_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "journal_rank_footprints" ADD CONSTRAINT "fk_rank_of_journal" FOREIGN KEY ("rank_id") REFERENCES "source_ranks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "call_for_papers" ADD CONSTRAINT "fk_cfp_belong_conference" FOREIGN KEY ("conference_id") REFERENCES "conferences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conference_rank_footprints" ADD CONSTRAINT "fk_conference_rank_footprints" FOREIGN KEY ("conference_id") REFERENCES "conferences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conference_rank_footprints" ADD CONSTRAINT "fk_conference_rank_footprints_for" FOREIGN KEY ("for_id") REFERENCES "for_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conference_rank_footprints" ADD CONSTRAINT "fk_rank_of_conference" FOREIGN KEY ("rank_id") REFERENCES "source_ranks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rank_of_cfp" ADD CONSTRAINT "fk_cfp_has_rank" FOREIGN KEY ("cfp_id") REFERENCES "call_for_papers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rank_of_cfp" ADD CONSTRAINT "fk_rank_of_cfp" FOREIGN KEY ("rank_id") REFERENCES "source_ranks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "for_group" ADD CONSTRAINT "fk_for_group_of_division" FOREIGN KEY ("division_id") REFERENCES "for_division"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "source_ranks" ADD CONSTRAINT "fk_rank_of_source" FOREIGN KEY ("source_id") REFERENCES "sources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
