import { CallForPaperData } from "./call-for-paper.data";
import { ImportantDateData } from "./important-date.data";
import { RankOfCfpData } from "../../rank-source";
import { ConferenceData } from "../../conference";


export class DetailedCfpData extends CallForPaperData {
    important_dates: ImportantDateData[];
    rank_of_cfp: RankOfCfpData[];
    conferences: ConferenceData;
}