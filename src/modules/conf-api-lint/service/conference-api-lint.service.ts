import { Injectable } from "@nestjs/common";
import { ConferenceApiLintData, ConferenceApiLintMetaData, ConferenceApiLintParams, ConfernceApiLintResponseData } from "../model/conference-api-lint.data";
import { PrismaService } from "../../common";
import { max } from "rxjs";

@Injectable()
export class ConferenceApiLintService {
    constructor(private readonly prismaService: PrismaService) {}

    public async getConferenceData(searchParams: ConferenceApiLintParams) {
        const limit = searchParams.perPage  || 10 ; 
        const meta  : ConferenceApiLintMetaData = {
            fieldOfResearches : [],
            sources : [],
            ranks : [],
            locations : [],
            pagination : {
                perPage : limit,
                total : 0,
                currentPage : searchParams.page ?? 1,
                lastPage : 0,
                prev : null,
                next : null
            }  
        }

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
                                AND: [
                                    {
                                        ranks_of_source: {
                                            ...(searchParams.rank && {
                                                rank: {
                                                    contains: searchParams.rank,
                                                    mode: "insensitive",
                                                },
                                            }),
                                            ...(searchParams.source && {
                                                sources: {
                                                    name: {
                                                        contains:
                                                            searchParams.source,
                                                        mode: "insensitive",
                                                    },
                                                },
                                            }),
                                        },
                                        ...(searchParams.fieldOfResearches && {
                                            for_group: {
                                                OR: [
                                                    {
                                                        for_division: {
                                                            code: {
                                                                in: searchParams.fieldOfResearches,
                                                            },
                                                        },
                                                    },
                                                    {
                                                        code: {
                                                            in: searchParams.fieldOfResearches,
                                                        },
                                                    },
                                                ],
                                            },
                                        }),
                                    },
                                ],
                            },
                        },
                    },
                    {
                        call_for_papers : {
                            some : {
                                AND : [
                                    {
                                        location : {
                                            contains : searchParams.location,
                                            mode : "insensitive"
                                        }
                                    },
                                    {
                                        ...searchParams.startDate && {
                                            start_date : {
                                                gte : searchParams.startDate
                                            }
                                        },
                                        ...searchParams.endDate && {
                                            end_date : {
                                                lte : searchParams.endDate
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
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
            take : limit, 
            skip : searchParams.page ? limit * (searchParams.page - 1) : 0
        });



        const reponseConferences = conferences.map ((conference) : ConferenceApiLintData => {
            const lastCfp = conference.call_for_papers.find((cfp) => cfp.status === true);
            const location = lastCfp?.location ; 
            const startDate = lastCfp?.start_date ;
            const endDate = lastCfp?.end_date ;

            let chosenRank ; 
            conference.conference_rank_footprints = conference.conference_rank_footprints.sort((a, b) => {
                return (a.year as any) - (b.year as any) ;
            });

            if(searchParams.rank && searchParams.source) {
                chosenRank = conference.conference_rank_footprints.find((rank) => {
                    return rank.ranks_of_source?.rank?.toLowerCase() === searchParams.rank?.toLowerCase() &&
                    rank.ranks_of_source?.sources?.name?.toLowerCase() === searchParams.source?.toLowerCase()
                });
            }
            else if (searchParams.rank) {
                chosenRank = conference.conference_rank_footprints.find((rank) => {
                    return rank.ranks_of_source?.rank?.toLowerCase() === searchParams.rank?.toLowerCase()
                });
            }
            else if (searchParams.source) {
                chosenRank = conference.conference_rank_footprints.find((rank) => {
                    return rank.ranks_of_source?.sources?.name?.toLowerCase() === searchParams.source?.toLowerCase()
                });
            }
            else {
                chosenRank = conference.conference_rank_footprints[0];
            }

            conference.conference_rank_footprints.forEach((rank) => {
                const fieldOfResearches = rank.for_group?.for_division?.code;
                meta.fieldOfResearches = [...meta.fieldOfResearches, (fieldOfResearches && fieldOfResearches) as string];
            })

            const newSources = chosenRank?.ranks_of_source?.rank;
            meta.sources = Array.from(new Set([...meta.sources, (newSources && newSources) as string ]));

            const newRanks = conference.conference_rank_footprints.map((rank) => {
                return rank.ranks_of_source?.rank ?? ""
            });
            meta.ranks = [...meta.ranks, ...newRanks];

            meta.locations = [...meta.locations, (location && location) as string ];

            return {
                id : conference.id,
                attributes : {
                    name : conference.name,
                    acronym : conference.acronym,
                    startDate : startDate?.toDateString(),
                    endDate : endDate?.toDateString(),
                    source : chosenRank?.ranks_of_source?.sources?.name,
                    rank : chosenRank?.ranks_of_source?.rank,
                    location : location,
                    fieldOfResearches: conference.conference_rank_footprints.map((rank) => {
                        return rank.for_group?.for_division?.code ?? null
                    })
                }
            }  as ConferenceApiLintData
        })

        const lastPage = Math.ceil(reponseConferences.length / limit);
        const nextPage = searchParams.page ? searchParams.page + 1 : 2;
        const prevPage = searchParams.page ? searchParams.page - 1 : 0;

        const result = {
            data : reponseConferences,
            meta : {
                fieldOfResearches : searchParams.fieldOfResearches || Array.from(new Set(meta.fieldOfResearches)),
                sources : searchParams.source || Array.from(new Set(meta.sources)),
                ranks : searchParams.rank || Array.from(new Set(meta.ranks)),
                locations : searchParams.location || Array.from(new Set(meta.locations)),
                pagination : {
                    perPage : limit,
                    total : reponseConferences.length,
                    currentPage : searchParams.page ?? 1,
                    lastPage : Math.ceil(reponseConferences.length / limit),
                    prev : Math.max(0, prevPage),
                    next : Math.min(lastPage, nextPage)
                }
            }
        } as ConfernceApiLintResponseData
        return result ; 
    }
}
