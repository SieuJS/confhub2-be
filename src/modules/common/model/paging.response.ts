import { ApiProperty } from '@nestjs/swagger';


export class PagingResponse<T> {
    @ApiProperty({description : 'Maximum number of records', example: 10})
    public maxRecords: number;

    @ApiProperty({description : 'Maximum number of pages', example: 1})
    public maxPages: number;

    @ApiProperty({description : 'Size of the page', example: 10})
    public size: number;

    @ApiProperty({description : 'Current page', example: 1})
    public currentPage: number;

    @ApiProperty({description : 'Number of records', example: 10})
    public count: number;

    @ApiProperty({ type: () => [Object] , description : 'Data', example: []})
    public data: T[];

    constructor(maxRecords: number, maxPages: number, size: number, currentPage: number, count: number, data: T[]) {
        this.maxRecords = maxRecords;
        this.maxPages = maxPages;
        this.size = size;
        this.currentPage = currentPage;
        this.count = count;
        this.data = data;
    }
}
