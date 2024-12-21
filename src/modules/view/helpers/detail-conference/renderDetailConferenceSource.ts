import { ConferenceWithCfpsRankFootprintsData } from "../../../conference";

export function renderDetailConferenceSource(conference : ConferenceWithCfpsRankFootprintsData) : string {
    let tableBody= conference.conference_rank_footprints.map((source) => {
        return `
        <tr>
          <td>${source.ranks_of_source.sources.name}</td>
          <td>${source.ranks_of_source.rank}</td>
          <td>${source.for_group.name}</td>
        </tr>`
    }).concat(''); // Lấy ra danh sách các source
    return `<table id="conference-table" class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Source</th>
                  <th scope="col">Rank</th>
                  <th scope="col">Field of Research</th>
                </tr>
              </thead>
              <tbody>
                ${tableBody}
              </tbody>
      </table>
    `
};