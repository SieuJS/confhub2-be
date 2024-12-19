import { FoRDivisionData } from "../../../field-of-research/model";

export function renderForDivForm(forDivisions : FoRDivisionData[]) {
    return `
        <div class="form-group">
            <div class="form-field">
                <div class="select-wrap">
                    <div class="icon"><span class="ion-ios-arrow-down"></span></div>
                    <select name="" id="" class="form-control">
                        <option value="">All subject areas</option>
                        ${forDivisions.map(division => `<option value="${division.code}">${division.name}</option>`).join('')}
                    </select>
                </div>
            </div>
        </div>
    `;

}