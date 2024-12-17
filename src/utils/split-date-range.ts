export function splitDateRange(dateRange: string): { startDate: string; endDate: string } {
    console.log("Splitting date range:", dateRange);
    // Split the input range into start and end parts
    const [start, end] = dateRange.split('-').map(part => part.trim());

    // Extract the year from the range
    const yearMatch = end.match(/\d{4}$/); // Matches the year in the end part
    const year = yearMatch ? yearMatch[0] : '';

    // Parse the start part (always includes month and day)
    const [startMonth, startDay] = start.split(' ');

    // Parse the end part
    let endMonth = startMonth; // Default to the same month as the start
    let endDay = '';

    // Case 1: End contains both month and day (e.g., "March 2, 2025")
    if (end.includes(' ')) {
        const [potentialEndMonth, potentialEndDay] = end.replace(',', '').split(' ');
        if (isNaN(parseInt(potentialEndMonth))) {
            // If the first part of `end` is a month, assign it to `endMonth`
            endMonth = potentialEndMonth;
            endDay = potentialEndDay;
        } else {
            // Otherwise, it's just the day, so keep the default `endMonth`
            endDay = potentialEndMonth;
        }
    } else {
        // Case 2: End only contains the day (e.g., "28, 2025")
        endDay = end.replace(',', '').trim();
    }

    // Construct full date strings
    const startDateString = `${startMonth} ${startDay}, ${year}`;
    const endDateString = `${endMonth} ${endDay}, ${year}`;

    // Parse into Date objects
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    // Validate the dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid date format. Please check the input.");
    }

    // Format the dates as YYYY-MM-DD
    const formatDate = (date: Date): string =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    return {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
    };
}