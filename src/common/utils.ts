export function groupArray<T>(array: T[], groupSize: number): T[][] {
    const grouped = [];

    for (let i = 0; i < array.length; i += groupSize) {
        grouped.push(array.slice(i, i + groupSize));
    }

    return grouped;
}

export function getDayCount(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
}
