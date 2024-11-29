export const IncludeConferenceQuery = {
    conference_rank_footprints : {
        include : {
            ranks_of_source : {
                include : {
                    sources : true
                }
            },
            for_group : {
                include : {
                    for_division : true
                }
            },
            
            },
        },
    call_for_papers : {
        include : {
            important_dates : true
        }
    }

}