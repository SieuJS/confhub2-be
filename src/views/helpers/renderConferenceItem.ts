
import { ConferenceWithCfpsRankFootprintsPaginateData } from "../../modules/conference";

export function renderConferenceItem(conferences: ConferenceWithCfpsRankFootprintsPaginateData) {
    return conferences.data.map(conference => {
    let mainCfp :any  = {access_type: '', end_date: new Date(), location: '', start_date: new Date(), status: false} ;;
    let higestSource : any = {
        year: 'unknow',
        ranks_of_source: {
            sources: {
                name: 'unknow'
            },
            rank: 'unknow'
        }
    }
    if(conference.conference_rank_footprints.length === 0) {
        console.log("no rank");
    }
    else {
        higestSource = conference.conference_rank_footprints.sort((a, b) => Number(b.year) - Number(a.year))[0];
    };
    if(conference.call_for_papers.length === 0) {

    }
    else {
        mainCfp = conference.call_for_papers.filter(cfp => cfp.status === true)[0];
    }
    return `
    <div class="col-md-12 ftco-animate">
        <div class="job-post-item p-4 d-block d-lg-flex align-items-center">
            <div class="one-third mb-4 mb-md-0">
                <div class="job-post-item-header align-items-center">
                <div class="d-flex justify-content-start gap-3">
                    <span class="subadge p-2">${mainCfp.access_type}</span>
                    <span class="subadge p-2">${higestSource.ranks_of_source.sources.name}</span>
                    <span class="subadge p-2">${higestSource.ranks_of_source.rank}</span>
                </div>
                    
                    <h2 class="mr-3 text-black"><a href="#">${conference.name}</a></h2>
                </div>
                <div class="job-post-item-body d-block d-md-flex">
                    <div class="mr-3"><span class="icon-calendar"></span> <span>Start Date: ${mainCfp.start_date?.toDateString()}</span></div>
                    <div class="mr-3"><span class="icon-calendar"></span> <span>End Date: ${mainCfp.end_date?.toDateString()}</span></div>
                    <div><span class="icon-my_location"></span> <span>${mainCfp.location}</span></div>
                </div>
            </div>

            <div class="one-forth ml-auto d-flex align-items-center mt-4 md-md-0">
                <div>
                    <a href="#"
                        class="icon text-center d-flex justify-content-center align-items-center icon mr-2">
                        <span class="icon-heart"></span>
                    </a>
                </div>
                <a href="conference-details.html" class="btn btn-primary py-2">View Details</a>
            </div>
        </div>
    </div>`;
    }).join('');
};