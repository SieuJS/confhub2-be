import { FoRGroupData } from "../../../field-of-research/model";

export function renderForGroupForm (forGroups : FoRGroupData[]) {
    return `
        <div class="form-group">
            <div class="form-field">
                <div class="select-wrap">
                    <div class="icon"><span class="ion-ios-arrow-down"></span></div>
                    <select name="forGroup" id="" class="form-control">
                        <option value="">All subject areas</option>
                        ${forGroups.map(group => `<option value="${group.code}">${group.name}</option>`).join('')}
                    </select>
                </div>
            </div>
        </div>
    `;
}