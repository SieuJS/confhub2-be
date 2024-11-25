import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common';
import { ConferenceData, ConferenceInput } from '../model';
import {TransactionHost} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import {  getPaginatedResult } from '@nodeteam/nestjs-prisma-pagination';

import { ConferenceWithCfpsRankFootprintsData, ConferenceWithCfpsRankFootprintsPaginateData } from '../model';

import { IncludeConferenceQuery } from '../query';


@Injectable()
export class ConferenceService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly txHost: TransactionHost<TransactionalAdapterPrisma>
    ) {}

    public async find({
        where , orderBy, pagination
    } : {
        where?: ConferenceData,
        orderBy?: { [key: string]: 'asc' | 'desc' },
        pagination?: { page: number, perPage: number }
    } ): Promise<ConferenceWithCfpsRankFootprintsPaginateData> {

        const conferences = await this.prismaService.conferences.findMany({
            where : {
                ...where
            },
            orderBy : {
                ...orderBy
            },
            include : 
                IncludeConferenceQuery,
        }) ;

        return getPaginatedResult({
            data : conferences.map(conference => new ConferenceWithCfpsRankFootprintsData(conference as ConferenceWithCfpsRankFootprintsData)),
            pagination : {
                page : 1,
                perPage : 10,
                skip : 0,
            }
        } )
    }

    public async search(filter : any) {
        const conferences = await this.prismaService.conferences.findMany({
            where : {
                call_for_papers :{
                    some : {
                        start_date : {
                            gte : filter.start_date
                        },
                        end_date : {
                            lte : filter.end_date
                        }
                    }
                }
            },
            include : IncludeConferenceQuery
        })

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

    public async findOrCreate(input: ConferenceInput): Promise<{isExisted : boolean, data : ConferenceData}> {
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
}
