import { ImportantDateData } from "../../../call-for-paper";
export function renderImportantDates(dates : ImportantDateData[]) : string {

    const groupedDates = dates.reduce((acc, date) => {
        if (!acc[date.date_type as string]) {
            acc[date.date_type as string] = [];
        }
        acc[date.date_type as string].push(date.date_value as Date);
        return acc;
    }, {} as Record<string, Date[]>);


    const tableRows = Object.entries(groupedDates).map(([dateType, dateValues]) => {
        const formattedDates = dateValues.map(date => date.toDateString()).join(', ');
        return `<tr><td><strong>${dateType}</strong></td><td >${formattedDates}</td></tr>`;
    }).join('');

    return `<table class="table table-striped" >${tableRows}</table>`;
}