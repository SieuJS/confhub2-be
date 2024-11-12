

export class PagingResponse<T> {
    maxRecords: number;
    maxPages: number;
    size: number;
    currentPage: number;
    count: number;
    data: T[];
}
