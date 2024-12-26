/* eslint-disable import/no-extraneous-dependencies */
import { Injectable } from '@nestjs/common';
import {Transactional, TransactionHost} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import {   paginator, PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';
import { CallForPaperData } from '../../call-for-paper';

import { PatternSearchCfpQuery } from '../../call-for-paper/query';
import { SourceService, RankService } from '../../rank-source';
import { PrismaService } from '../../common';
import { ConferenceData, ConferenceFilter, ConferenceInput } from '../model';
import { ConferenceWithCfpsRankFootprintsData, ConferenceWithCfpsRankFootprintsPaginateData } from '../model';

import { IncludeConferenceQuery } from '../query';
import { PaginationArgs } from '../../paginate';
import { FieldOfResearchService } from '../../field-of-research/service';
import { ConferenceRankFootPrintsService } from './conference-rank-footprints.service';

const paginate : PaginatorTypes.PaginateFunction = paginator({});
@Injectable()
export class ConferenceService {
    
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
        private readonly sourceService: SourceService,
        private readonly rankService: RankService,
        private readonly fieldOfResearchService: FieldOfResearchService,
        private readonly conferenceRankFootPrintService: ConferenceRankFootPrintsService
    ) {}

    public async find(where? : ConferenceFilter, paginationArgs? : PaginationArgs ): Promise<ConferenceWithCfpsRankFootprintsPaginateData> {
        let conferences  : 
        ConferenceWithCfpsRankFootprintsPaginateData;
        this.prismaService.conferences.findMany({
            where : {
                AND : [
                    {
                        OR : [
                            {
                                name : {
                                    contains : where?.name as string,
                                    mode : 'insensitive'
                                },
                            },
                            {
                                acronym : {
                                    contains : where?.name as string,
                                    mode : 'insensitive'
                                }
                            }
                        ]
                    },
                    {
                        call_for_papers : {
                            some : {
                                AND : [
                                    {
                                        ...(where?.fromDate ?{ start_date : {
                                            gte : new Date(where?.fromDate as string)
                                        }} : null)
                                    },
                                    {
                                        ...(where?.toDate ? { end_date : {
                                            lte : new Date(where?.toDate as string)
                                        }} : null)
                                    },
                                    {
                                        location : {
                                            contains : where?.location as string,
                                            mode : 'insensitive'
                                        }
                                    },
                                ]
                            }
                        }
                    },
                    {
                        conference_rank_footprints : {
                            some : {
                                ranks_of_source : {
                                    rank : {
                                        contains : where?.rank as string,
                                        mode : 'insensitive'
                                    },
                                    sources : {
                                         name : {
                                            contains : where?.source as string,
                                            mode : 'insensitive'
                                         }
                                        
                                    }
                                }
                            }
                        }
                    }

                ]
            },
            include : IncludeConferenceQuery
        })
        conferences = await paginate(
            this.prismaService.conferences,
            {
                where : {
                    AND : [
                        {
                            OR : [
                                {
                                    name : {
                                        contains : where?.name as string,
                                        mode : 'insensitive'
                                    },
                                },
                                {
                                    acronym : {
                                        contains : where?.name as string,
                                        mode : 'insensitive'
                                    }
                                }
                            ]
                        },
                        {
                            call_for_papers : {
                                some : {
                                    AND : [
                                        {
                                            ...(where?.fromDate ?{ start_date : {
                                                gte : new Date(where?.fromDate as string)
                                            }} : null)
                                        },
                                        {
                                            ...(where?.toDate ? { end_date : {
                                                lte : new Date(where?.toDate as string)
                                            }} : null)
                                        },
                                        {
                                            location : {
                                                contains : where?.location as string,
                                                mode : 'insensitive'
                                            }
                                        },
                                    ]
                                }
                            }
                        },
                    (where?.rank ? 
                        {
                            conference_rank_footprints : {
                                some : {
                                    ranks_of_source : {
                                        rank : {
                                            contains : where?.rank as string,
                                            mode : 'insensitive'
                                        },
                                        sources : {
                                             name : {
                                                contains : where?.source as string,
                                                mode : 'insensitive'
                                             }
                                            
                                        }
                                    }
                                }
                            }
                        } : {})
    
                    ]
                },
                include : IncludeConferenceQuery
            },
            paginationArgs 
        )
        return conferences ;
    }

    public async search(  filter: CallForPaperData & {
        start_date_range: {
            gte: Date;
            lte: Date;
        };
        end_date_range: {
            gte: Date;
            lte: Date;
        };
    }) {

        const conferences = await this.prismaService.conferences.findMany({
            where : {
                call_for_papers :{
                    some : {
                        AND :[
                            ...PatternSearchCfpQuery(filter)
                        ]
                    }
                }
            },
            include : IncludeConferenceQuery
        });

        return conferences;
    }

    public async findOne(filter : ConferenceData): Promise<ConferenceData> {
        const conference = await this.prismaService.conferences.findFirst({
            where : {
                ...filter
            }
        });

        return new ConferenceData(conference as ConferenceData);
    }

    public async create(data: ConferenceInput): Promise<ConferenceData> {
        return this.txHost.tx.conferences.create({data});
    }

    public async findOrCreate(input: ConferenceInput): Promise<{isExisted : boolean; data : ConferenceData}> {
        const existConference = await this.txHost.tx.conferences.findUnique({
            where: {
                name_acronym: {
                    name: input.name as string,
                    acronym: input.acronym as string
                }
            }
        });
        if(existConference) {
            return {isExisted: true, data: new ConferenceData(existConference)};
        }
        else {
            const conference = await this.txHost.tx.conferences.create({
                data: input
            });
            return {isExisted: false, data: conference};
        }
    }

    public async findById (id: string): Promise<ConferenceData | null> {
        return this.prismaService.conferences.findUnique({
            where : {
                id : id
            }
        }) 
    }

    public async getDetailWithId (id: string): Promise<ConferenceWithCfpsRankFootprintsData | null> {
        return this.prismaService.conferences.findUnique({
            where : {
                id : id
            },
            include : IncludeConferenceQuery
        }) as unknown as ConferenceWithCfpsRankFootprintsData;
    }

    @Transactional()
    public async importConferenceFromCoreInput(inputs : ConferenceInput) : Promise<ConferenceData> {
        const existsConference = await this.findOrCreate({
            name: inputs.name,
            acronym: inputs.acronym,
        } as ConferenceInput);

        const existsSource = await this.sourceService.findOrCreate({
            name: inputs.source,
            link: '',
        });
        const existsRank = await this.rankService.createOrFindRankOfSource({
            source_id: existsSource.id,
            rank: inputs.rank,
            value: 0 as any,
        });

        inputs.fieldOfResearches.split(',').forEach(async (field) => {
            if(field === '') return;
            const newField = `${field}`.trim();
            const existForGroup = await this.fieldOfResearchService.findOrCreateGroup({
            code: newField,
            name: 'unknown'
            });

            await this.conferenceRankFootPrintService.findOrCreate({
            conference_id: existsConference.data.id,
            rank_id: existsRank.id,
            year: (parseInt(inputs.source.slice(-4), 10)) as any,
            for_id: existForGroup.id
            });
        });
        return existsConference.data;
    } 


}
