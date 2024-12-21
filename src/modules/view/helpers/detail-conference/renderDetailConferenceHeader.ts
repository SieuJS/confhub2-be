import { CallForPaperData } from "../../../call-for-paper";
import { ConferenceWithCfpsRankFootprintsData } from "../../../conference";

export function renderDetailConferenceHeader (conference: ConferenceWithCfpsRankFootprintsData) {

    let mainCfp :CallForPaperData  = {
        access_type: '', end_date: new Date(), location: '', start_date: new Date(), status: false,
        id: "",
        content: null,
        conference_id: null,
        link: null,
        owner: null,
        view_count: null,
        country: null,
        avg_rating: null
    } ;;
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

    higestSource;
  return `
    <div class="col-md-10 d-flex align-items-center ftco-animate">
          <div class="text text-center pt-5 mt-md-5">
            <!-- <p class="mb-4">Find Job, Employment, and Career Opportunities</p> -->
            <h1 class="mb-5">${conference.name}</h1>
            <h1 class="mb-4">${conference.acronym}</h1>
            <div class="ftco-counter ftco-no-pt ftco-no-pb">
              <div class="row">
                <div class="col-md-4 d-flex justify-content-center counter-wrap ftco-animate">
                  <div class="block-18">
                    <div class="text d-flex">
                      <div class="icon mr-2">
                        <span class="icon-calendar"></span>
                      </div>
                      <div class="desc text-left">
                        <strong class="number">Start Date: </strong>
                        <strong class="number">${mainCfp.start_date?.toDateString()}</strong>
                        <!-- <span>Countries</span> -->
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 d-flex justify-content-center counter-wrap ftco-animate">
                  <div class="block-18 text-center">
                    <div class="text d-flex">
                      <div class="icon mr-2">
                        <span class="icon-calendar"></span>
                      </div>
                      <div class="desc text-left">
                        <strong class="number">End Date: </strong>
                        <strong class="number">${mainCfp.end_date?.toDateString()}</strong>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 d-flex justify-content-center counter-wrap ftco-animate">
                  <div class="block-18 text-center">
                    <div class="text d-flex">
                      <div class="icon mr-2">
                        <span class="icon-my_location"></span>
                      </div>
                      <div class="desc text-left">
                        <strong class="number">Location: </strong>
                        <strong class="number">${mainCfp.location}</span> 
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="ftco-search my-md-5"> 
              <div class="row">
                <div class="col-md-12 tab-wrap">
                  <div class="row no-gutters">
                    <div class="col-md mr-md-2 mb-2">
                      <button class="form-control btn btn-primary">
                        <a href="" class="text-white">Follow</a>
                      </button>
                    </div>
                    <div class="col-md">
                        <button class="form-control btn btn-primary update-btn">
                          <a href="#" class="text-white">Update</a>
                        </button>
                    </div>
                  </div>    
                </div>
              </div>
            </div> 
          </div>
        </div>
    `

}