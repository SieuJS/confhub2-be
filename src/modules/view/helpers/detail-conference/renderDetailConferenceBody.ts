import { CallForPaperData} from "../../../call-for-paper";
import { ConferenceWithCfpsRankFootprintsData } from "../../../conference";

export function renderDetailConferenceBody(conference : ConferenceWithCfpsRankFootprintsData ) : string {
    let mainCfp :CallForPaperData= {
            access_type: '', end_date: new Date(), location: '', start_date: new Date(), status: false,
            id: "",
            content: null,
            conference_id: null,
            link: null,
            owner: null,
            view_count: null,
            country: null,
            avg_rating: null
        } ;
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
        }
        else {
            higestSource = conference.conference_rank_footprints.sort((a, b) => Number(b.year) - Number(a.year))[0];
        };
        if(conference.call_for_papers.length === 0) {
    
        }
        else {
            mainCfp = conference.call_for_papers.filter(cfp => cfp.status === true)[0];
        }
    
        higestSource;




    return `

            <div class="col-md-12 ftco-animate">
              <div class=" p-4 d-block d-lg-flex align-items-center">
                <div class="job-post-item-header align-items-center">
                  <h2 class="mr-3 text-black">Acronym: ${conference.acronym}</h2>
                  <h2 class="mr-3 text-black">Start date: ${mainCfp.start_date?.toDateString()}</h2>
                  <h2 class="mr-3 text-black">End date: ${mainCfp.end_date?.toDateString()}</h2>
                  <h2 class="mr-3 text-black">Location: ${mainCfp.location}</h2>
                  </div>
                </div>
              </div>
            </div>




    `;
}