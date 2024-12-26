import { Injectable } from "@nestjs/common";
import {
    ConferenceApiLintData,
    ConferenceApiLintMetaData,
    ConferenceApiLintParams,
    ConfernceApiLintResponseData,
} from "../model/conference-api-lint.data";
import { PrismaService } from "../../common";
import { SingleConferenceData } from "../model/single-conference.data";



@Injectable()
export class ConferenceApiLintService {
    constructor(private readonly prismaService: PrismaService) {}

    public async getConferenceData(searchParams: ConferenceApiLintParams) {
        const limit = searchParams.perPage || 5;
        const meta: ConferenceApiLintMetaData = {
            fieldOfResearches: [],
            sources: [],
            ranks: [],
            pagination: {
                perPage: limit,
                total: 0,
                currentPage: searchParams.page ?? 1,
                lastPage: 0,
                prev: null,
                next: null,
            },
        };

        const totalConferences = await this.prismaService.conferences.count({where: {
            AND: [
                {
                    name: {
                        contains: searchParams.name,
                        mode: "insensitive",
                    },
                },
                {
                    acronym: {
                        contains: searchParams.acronym,
                        mode: "insensitive",
                    },
                },
                {
                    conference_rank_footprints: {
                        some: {
                            ranks_of_source: {
                                AND : [
                                    {
                                        ...(searchParams.rank && {
                                            rank: {
                                                equals: searchParams.rank,
                                                mode: "insensitive",
                                            },
                                        }),
                                    },
                                    {
                                        ...(searchParams.source && {
                                            sources: {
                                                name: {
                                                    contains: searchParams.source,
                                                    mode: "insensitive",
                                                },
                                            },
                                        }),
                                    },
                                    {
                                        
                                    }
                                ]

                            },
                            ...(searchParams.fieldOfResearch && {
                                for_group: {
                                    OR: [
                                        {
                                            for_division: {
                                                name: {
                                                    contains: searchParams.fieldOfResearch,
                                                    mode: "insensitive",
                                                },
                                            },
                                        },
                                        {
                                            name: {
                                                contains: searchParams.fieldOfResearch,
                                                mode: "insensitive",
                                            },
                                        },
                                    ],
                                },
                            }),
                        },
                    },
                },
                {
                    call_for_papers: {
                        some: {
                            AND: [
                                {
                                    location: {
                                        contains: searchParams.location,
                                        mode: "insensitive",
                                    },
                                },
                                {
                                    ...(searchParams.startDate && {
                                        start_date: {
                                            gte: searchParams.startDate,
                                        },
                                    }),
                                    ...(searchParams.endDate && {
                                        end_date: {
                                            lte: searchParams.endDate,
                                        },
                                    }),
                                },
                            ],
                        },
                    },
                },
            ],
        }});

        const conferences = await this.prismaService.conferences.findMany({
            where: {
                AND: [
                    {
                        name: {
                            contains: searchParams.name,
                            mode: "insensitive",
                        },
                    },
                    {
                        acronym: {
                            contains: searchParams.acronym,
                            mode: "insensitive",
                        },
                    },
                    {
                        conference_rank_footprints: {
                            some: {
                                ranks_of_source: {
                                    AND : [
                                        {
                                            ...(searchParams.rank && {
                                                rank: {
                                                    equals: searchParams.rank,
                                                    mode: "insensitive",
                                                },
                                            }),
                                        },
                                        {
                                            ...(searchParams.source && {
                                                sources: {
                                                    name: {
                                                        contains: searchParams.source,
                                                        mode: "insensitive",
                                                    },
                                                },
                                            }),
                                        },
                                        {
                                            
                                        }
                                    ]

                                },
                                ...(searchParams.fieldOfResearch && {
                                    for_group: {
                                        OR: [
                                            {
                                                for_division: {
                                                    name: {
                                                        contains: searchParams.fieldOfResearch,
                                                        mode: "insensitive",
                                                    },
                                                },
                                            },
                                            {
                                                name: {
                                                    contains: searchParams.fieldOfResearch,
                                                    mode: "insensitive",
                                                },
                                            },
                                        ],
                                    },
                                }),
                            },
                        },
                    },
                    {
                        call_for_papers: {
                            some: {
                                AND: [
                                    {
                                        location: {
                                            contains: searchParams.location,
                                            mode: "insensitive",
                                        },
                                    },
                                    {
                                        ...(searchParams.startDate && {
                                            start_date: {
                                                gte: searchParams.startDate,
                                            },
                                        }),
                                        ...(searchParams.endDate && {
                                            end_date: {
                                                lte: searchParams.endDate,
                                            },
                                        }),
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
            include: {
                conference_rank_footprints: {
                    include: {
                        for_group: {
                            include: {
                                for_division: true,
                            },
                        },
                        ranks_of_source: {
                            include: {
                                sources: true,
                            },
                        },
                    },
                },
                call_for_papers: true,
            },
            take: limit,
            skip: searchParams.page ? limit * (searchParams.page - 1) : 0,
        });



        const reponseConferences = conferences.map(
            (conference : any): ConferenceApiLintData => {
                const lastCfp = conference.call_for_papers.find(
                    (cfp : any) => cfp.status === true
                );
                const location = lastCfp?.location;
                const startDate = lastCfp?.start_date;
                const endDate = lastCfp?.end_date;

                let chosenRank;
                conference.conference_rank_footprints =
                    conference.conference_rank_footprints.sort((a : any, b : any) => {
                        return (a.year as any) - (b.year as any);
                    });

                if (searchParams.rank && searchParams.source) {
                    chosenRank = conference.conference_rank_footprints.find(
                        (rank : any) => {
                            return (
                                rank.ranks_of_source?.rank?.toLowerCase() ===
                                    searchParams.rank?.toLowerCase() &&
                                rank.ranks_of_source?.sources?.name?.toLowerCase() ===
                                    searchParams.source?.toLowerCase()
                            );
                        }
                    );
                } else if (searchParams.rank) {
                    chosenRank = conference.conference_rank_footprints.find(
                        (rank : any) => {
                            return (
                                rank.ranks_of_source?.rank?.toLowerCase() ===
                                searchParams.rank?.toLowerCase()
                            );
                        }
                    );
                } else if (searchParams.source) {
                    chosenRank = conference.conference_rank_footprints.find(
                        (rank : any) => {
                            return (
                                rank.ranks_of_source?.sources?.name?.toLowerCase() ===
                                searchParams.source?.toLowerCase()
                            );
                        }
                    );
                } else {
                    chosenRank = conference.conference_rank_footprints[0];
                }

                return {
                    id: conference.id,
                    attributes: {
                        name: conference.name,
                        acronym: conference.acronym,
                        startDate: startDate?.toDateString(),
                        endDate: endDate?.toDateString(),
                        source: chosenRank?.ranks_of_source?.sources?.name,
                        rank: chosenRank?.ranks_of_source?.rank,
                        location: location,
                        fieldOfResearch: chosenRank?.for_group?.for_division?.name,
                    },
                } as ConferenceApiLintData;
            }
        );

        let forDivisions = (await this.prismaService.for_division.findMany({
            select: {
                name: true,
            },
            where: {
                code: {
                    not: {
                        equals: null,
                    },
                },
            },
        })) as any;

        forDivisions = [
            ...forDivisions,
            ...((await this.prismaService.for_group.findMany({
                select: {
                    name: true,
                },
                where: {
                    code: {
                        not: {
                            equals: null,
                        },
                    },
                },
            })) as any),
        ];

        meta.fieldOfResearches = forDivisions.map(
            (division: any) => division.name
        );

        let sources = (await this.prismaService.sources.findMany({
            select: {
                name: true,
            },
        })) as any;

        meta.sources = sources.map((source: any) => source.name);

        let ranks = (await this.prismaService.source_ranks.findMany({
            select: {
                rank: true,
            },
        })) as any;

        meta.ranks = ranks.map((rank: any) => rank.rank);

        const lastPage = Math.ceil(reponseConferences.length / limit);
        const nextPage = searchParams.page ? searchParams.page + 1 : 2;
        const prevPage = searchParams.page ? searchParams.page - 1 : 0;

        const result = {
            data: reponseConferences,
            meta: {
                fieldOfResearches: Array.from(new Set(meta.fieldOfResearches)),
                sources: Array.from(new Set(meta.sources)),
                ranks: Array.from(new Set(meta.ranks)),

                pagination: {
                    perPage: limit,
                    total: reponseConferences.length,
                    currentPage: searchParams.page ?? 1,
                    lastPage: Math.ceil(totalConferences / limit),
                    prev: Math.max(1, prevPage),
                    next: Math.max(lastPage, nextPage),
                },
            },
        } as ConfernceApiLintResponseData;
        return result;
    }

    async getConferenceById(id: string) : Promise<SingleConferenceData | null> {
        const conference = await this.prismaService.conferences.findUnique({
            where: {
            id: id,
            },
            select : {
                id : true,
                name : true, 
                acronym : true,
                conference_rank_footprints : {
                    select : {
                        year : true, 
                        ranks_of_source : {
                            select : {
                                rank : true, 
                                sources : {
                                    select : {
                                        name : true
                                    }
                                },
                                
                            }
                        },
                        for_group : {
                            select : {
                                name : true, 
                                for_division : {
                                    select : {
                                        name : true
                                    }
                                }
                            }
                        }
                    }
                },
                call_for_papers : {
                    where : {status : true},
                    select : {
                        location : true, 
                        start_date : true, 
                        end_date : true, 
                        access_type : true,
                        content : true,
                        submission_dates : {
                            select : {
                                date_type : true, 
                                date_value : true, 
                                status : true
                            }
                        },
                        notification_dates : {
                            select : {
                                date_type : true, 
                                date_value : true, 
                            }
                        },
                        registration_dates : {
                            select : {
                                date_type : true, 
                                date_value : true, 
                            }
                        },
                        camera_ready_dates : {
                            select : {
                                date_type : true, 
                                date_value : true, 
                            }
                        }
                    }
                },

            }
        });

        if (!conference) {
            return null;
        }

        const lintConference: SingleConferenceData = {
            id: conference.id ?? '',
            name: conference.name ?? '',
            acronym: conference.acronym ?? '',
            callForPapers: {
                location: conference.call_for_papers[0]?.location ?? '',
                startDate: conference.call_for_papers[0]?.start_date?.toDateString() ?? '',
                endDate: conference.call_for_papers[0]?.end_date?.toDateString() ?? '',
                accessType: conference.call_for_papers[0]?.access_type ?? '',
                content: conference.call_for_papers[0]?.content ?? '',
                submissionDates: conference.call_for_papers[0]?.submission_dates.map((date: any) => ({
                    dateType: date.date_type,
                    dateValue: date.date_value,
                    status: date.status
                })) ?? [],
                notificationDates: conference.call_for_papers[0]?.notification_dates.map((date: any) => ({
                    dateType: date.date_type,
                    dateValue: date.date_value,
                    status: date.status ?? ''
                })) ?? [],
                registrationDates: conference.call_for_papers[0]?.registration_dates.map((date: any) => ({
                    dateType: date.date_type,
                    dateValue: date.date_value,
                    status: date.status ?? ''
                })) ?? [],
                cameraReadyDates: conference.call_for_papers[0]?.camera_ready_dates.map((date: any) => ({
                    dateType: date.date_type,
                    dateValue: date.date_value,
                    status: date.status ?? ''
                })) ?? []
            },
            conferenceRanks: conference.conference_rank_footprints.map((rank: any) => {
                return {
                    year: rank.year,
                    source: rank.ranks_of_source.sources.name,
                    rank: rank.ranks_of_source.rank,
                    fieldOfResearch: [rank.for_group.for_division?.name ?? '', rank.for_group.name ?? '']
                };
            })
        };



        return lintConference ; 
    }
}
