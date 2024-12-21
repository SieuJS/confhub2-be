import { CallForPaperData } from "../../call-for-paper";
import { ConferenceWithCfpsRankFootprintsData } from "../../conference";
export class ConferenceRenderService {
    public getMainCfp = (conference: ConferenceWithCfpsRankFootprintsData) : CallForPaperData => {
        let mainCfp: any = {
            access_type: "",
            end_date: new Date(),
            location: "",
            start_date: new Date(),
            status: false,
        };

        if (conference.call_for_papers.length === 0) {
            return mainCfp;
        } else {
            mainCfp = conference.call_for_papers.filter(
                (cfp) => cfp.status === true
            )[0];
        }
        return mainCfp;
    };

    public getHigestSource = (conference: ConferenceWithCfpsRankFootprintsData) : ConferenceWithCfpsRankFootprintsData => {
        let higestSource: any = {
            year: "unknow",
            ranks_of_source: {
                sources: {
                    name: "unknow",
                },
                rank: "unknow",
            },
        };

        if (conference.conference_rank_footprints.length === 0) {
            return higestSource;
        } else {
            higestSource = conference.conference_rank_footprints.sort(
                (a, b) => Number(b.year) - Number(a.year)
            )[0];
        }
        return higestSource;
    };

    public getSpecificSource = (source : string, conference: ConferenceWithCfpsRankFootprintsData) : ConferenceWithCfpsRankFootprintsData => {
        let specificSource: any = {
            year: "unknow",
            ranks_of_source: {
                sources: {
                    name: "unknow",
                },
                rank: "unknow",
            },
        };

        if (conference.conference_rank_footprints.length === 0) {
            return specificSource;
        } else {
            specificSource = conference.conference_rank_footprints.filter(
                (rank) => rank.ranks_of_source.sources.name === source
            )[0];
        }
        return specificSource ;
    }
}
