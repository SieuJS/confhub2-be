import { CallForPaperData } from "../model";

export const PatternSearchCfpQuery = (
    filter: CallForPaperData & {
        start_date_range: {
            gte: Date;
            lte: Date;
        };
        end_date_range: {
            gte: Date;
            lte: Date;
        };
    }
) => {
    return [
        {
            location: {
                contains: filter.location as string,
            },
        },
        {
            id: filter.id,
        },
        {
            status: filter.status,
        },
        {
            ...(filter.start_date_range
                ? {
                      start_date: {
                          gte: filter.start_date_range.gte,
                          lte: filter.start_date_range.lte,
                      },
                  }
                : undefined),
        },
        {
            ...(filter.end_date_range
                ? {
                      end_date: {
                          gte: filter.end_date_range.gte,
                          lte: filter.end_date_range.lte,
                      },
                  }
                : undefined),
        },
        {
            ...(filter.avg_rating
                ? { avg_rating: { equals: filter.avg_rating } }
                : undefined),
        },
        {
            access_type: filter.access_type,
        },
        {
            country: filter.country,
        },
    ];
};
