import * as df from "data-forge";
import { Period, Record } from "../common/types";
import { getDayCount } from "../common/utils";

export function processFromRaw(data: string | undefined): df.IDataFrame<Date, Record> {
    if (data === undefined)
        return new df.DataFrame<Date, Record>();

    let dataframe: df.IDataFrame<Date, Record> = df.fromCSV(data, {
            columnNames: ["categoryId", "amount", "createdAt"]
        })
        .parseDates("createdAt")
        .parseInts("categoryId")
        .parseFloats("amount")
        .skip(1)  // Skip the header
        .orderBy<Record>(row => row.createdAt)
        .setIndex("createdAt");
    
    // Round the amount to 3 decimal places
    dataframe = dataframe.withSeries<Record>("amount",
            dataframe.getSeries<number>("amount").map(
                amount => parseFloat(amount.toFixed(3))
            )
        ).bake();

    return dataframe;
}

function getMonthYear(date: Date) {
    return `${date.getMonth() + 1}/${date.getFullYear()}`;
}

export function calc1(dataframe: df.IDataFrame<Date, Record>) {
    const byMonth = dataframe.groupBy(row => getMonthYear(row.createdAt));

    const aggregation = byMonth
        .select(group => ({
            period: new Date(
                group.first().createdAt.getFullYear(),
                group.first().createdAt.getMonth(),
                1,
                0, 0, 0, 0
            ),
            sum: group.deflate(row => row.amount).sum(),
            count: group.count(),
        }))
        .inflate()
        .setIndex<Date>("period")
        .dropSeries("period")
        .bake();
    
    let indices: Date[] = [];
    if (aggregation.count() > 0) {
        const lastMonth = aggregation.getIndex().last();

        for (let i = 0; i < 12; i++) {
            const month = new Date(lastMonth);
            month.setMonth(month.getMonth() - i);
            indices.push(month);
        }
        indices.reverse();
    }

    return {
        index: aggregation.getIndex().toArray(),
        monthlySums: aggregation.getSeries<number>("sum").toArray(),

        yearComparisonIndices: indices,
        last12MonthsPerMonthSums: aggregation.tail(12).getSeries<number>("sum").toArray(),
        prev12MonthsPerMonthSums: aggregation.tail(24).head(12).getSeries<number>("sum").toArray(),

        aggregation,
    };
}

export function calc2(
    dataframe: df.IDataFrame<Date, Record>,
    visibleCategoriesIndices: number[],
    period: Period | null,
) {
    let onlyMonth = dataframe;
    // Either entire dataset
    // or only for a specific period - month and year
    if (period !== null) {
        dataframe = dataframe.filter(row => 
            row.createdAt.getMonth() === period.monthIndex &&
            row.createdAt.getFullYear() === period.year
        );
       onlyMonth = dataframe;
    } else
        onlyMonth = dataframe.filter(
            row => row.createdAt.getMonth() === new Date().getMonth() &&
            row.createdAt.getFullYear() === new Date().getFullYear()
        );

    // For number of entries
    const numberOfEntriesAggregation = dataframe
        .groupBy(row => row.categoryId)
        .select(group => ({
            categoryId: group.first().categoryId,
            count: group.count(),
        }))
        .inflate()
        .filter(row => visibleCategoriesIndices.includes(row.categoryId))
        .orderByDescending(row => row.count)
        .setIndex("categoryId")
        .dropSeries("categoryId")
        .bake();

    const numberOfEntriesCategoryLabels = numberOfEntriesAggregation
        .getIndex()
        .toArray()
        .map(category => `Category ${category}`);
    
    // For violin plot
    const aggregatedAmounts = dataframe
        .filter(row => visibleCategoriesIndices.includes(row.categoryId))
        .groupBy(row => row.categoryId)
        .select(group => ({
            categoryId: group.first().categoryId,
            amounts: group.deflate(row => row.amount).toArray(),
        }))
        .inflate()
        .orderBy(row => row.categoryId)
        .setIndex("categoryId")
        .dropSeries("categoryId");

    const violinCategoryLabels = aggregatedAmounts
        .getIndex()
        .toArray()
        .map(category => `Category ${category}`);
    
    const violinAmounts = aggregatedAmounts
        .getSeries<number[]>("amounts")
        .toArray()
    
    // Treemap
    const perCategoryAmountSums = violinAmounts
        .map(amount => amount.reduce((acc, curr) => acc + curr, 0));
    const treemapData = violinCategoryLabels
        .map((category, i) => ({
            label: category,
            value: parseFloat(perCategoryAmountSums[i].toFixed(3)),
        }));

    // Over month
    const monthly = onlyMonth
        .filter(row => visibleCategoriesIndices.includes(row.categoryId));
    const month = period === null ? new Date().getMonth() : period.monthIndex;
    const year = period === null ? new Date().getFullYear() : period.year;

    const dailyIndices: Date[] = [];
    const dailyAmounts: number[] = [];
    const dailyCumulativeSum: number[] = [];
    let cumulative = 0;
    for (let i = 0; i < getDayCount(year, month); i++) {
        const date = new Date(year, month, i + 1, 0, 0, 0, 0);
        const sum = monthly
            .where(row => row.createdAt.getDate() === i + 1)
            .deflate(row => row.amount)
            .sum();
        dailyIndices.push(date);
        dailyAmounts.push(sum);
        cumulative += sum;
        dailyCumulativeSum.push(cumulative);
    }

    return {
        categoryCounts: numberOfEntriesAggregation.getSeries<number>("count").toArray(),
        numberOfEntriesCategoryLabels,

        violinCategoryLabels: aggregatedAmounts.getIndex().toArray().map(category => `Category ${category}`),
        violinAmounts: aggregatedAmounts.getSeries<number[]>("amounts").toArray(),

        treemapData,

        dailyIndices,
        dailyAmounts,
        dailyCumulativeSum,
    };
}
