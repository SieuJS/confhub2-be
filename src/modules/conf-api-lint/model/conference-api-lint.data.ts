import {  ApiProperty, PartialType } from "@nestjs/swagger";
import { PaginationArgs, PaginationMeta } from "../../paginate";

export class ConferenceApiLintAttributes {
    @ApiProperty( {description : "The name of the conference" , type : String})
    name : string ;
    
    @ApiProperty({description : "The acronym of the conference" , type : String})
    acronym : string ;

    @ApiProperty ({description : "The start date of the conference " , type : String })
    startDate : string ; 

    @ApiProperty ({description : "The end date of the conference " , type : String})
    endDate : string ;

    @ApiProperty ({description : "The source of the conference" , type : String })
    source : string ;

    @ApiProperty ({description : "The rank of the conference" , type : String})
    rank : string ;

    @ApiProperty({description : "The location of the conference" , type : String})
    location : string ;
    
    @ApiProperty ({description : "Field Of Research" , type : String, isArray : true})
    fieldOfResearch : string ;
}

import { IntersectionType } from "@nestjs/swagger";

export class ConferenceApiLintParams extends IntersectionType(
    PartialType(ConferenceApiLintAttributes),
    PartialType(PaginationArgs)
) { 

}

export class ConferenceApiLintData {
    @ApiProperty( {description : "The id of the conference" , type : String})
    id : string ; 

    @ApiProperty ({description : "Attributes of the conference" , type : ConferenceApiLintAttributes})
    attributes : ConferenceApiLintAttributes ;
}

export class ConferenceApiLintMetaData { 
    @ApiProperty({description : "Field of researches" , type : String , isArray : true})
    fieldOfResearches : string [] ;

    @ApiProperty({description : "Sources" , type : String , isArray : true})
    sources : string [] ;

    @ApiProperty({description : "Ranks" , type : String , isArray : true})
    ranks : string [] ;

    @ApiProperty({description : "pagination" , type : PaginationMeta})
    pagination : PaginationMeta ;
}

export class ConfernceApiLintResponseData { 
    @ApiProperty({description : "The data of the conference" , type : ConferenceApiLintData})
    data : ConferenceApiLintData[];

    @ApiProperty({description : "The meta data of the conference" , type : ConferenceApiLintMetaData})
    meta : ConferenceApiLintMetaData ;
}