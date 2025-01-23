import { Col, Row } from "react-bootstrap";
import { EntireTimeline } from "../charts/EntireTimeline";
import { YearComparison } from "../charts/YearComparison";
import { ViolinPlot } from "../charts/ViolinPlot";
import { NumberOfEntries } from "../charts/NumberOfEntries";
import { TreeMap } from "../charts/TreeMap";
import { useEffect, useMemo, useState } from "react";
import { Category, Period, Record } from "../../common/types";
import { Filters } from "../Filters/Filters";
import * as df from "data-forge";
import { NumberOverview, Stats } from "../NumberOverview/NumberOverview";
import { calc1, calc2 } from "../../data/processing";
import { OverMonth } from "../charts/OverMonth";

type StatsT = {
    stats1: ReturnType<typeof calc1>;
    stats2: ReturnType<typeof calc2>;
};

type Props = {
    dataframe: df.IDataFrame<Date, Record>;
    categories: number[];
};

export function Dashboard({ dataframe, categories }: Props) {
    const [visibleCategories, setVisibleCategories] = useState<Category[]>([]);
    const visibleCategoriesIndices = visibleCategories.filter(category => category.visible).map(category => category.id);
    const [period, setPeriod] = useState<null | Period>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<StatsT>({
        stats1: {
            aggregation: new df.DataFrame(),
            index: [],
            monthlySums: [],
            yearComparisonIndices: [],
            last12MonthsPerMonthSums: [],
            prev12MonthsPerMonthSums: [],
        },
        stats2: {
            dailyIndices: [],
            dailyAmounts: [],
            dailyCumulativeSum: [],
            violinCategoryLabels: [],
            violinAmounts: [],
            numberOfEntriesCategoryLabels: [],
            categoryCounts: [],
            treemapData: [],
        },
    });

    useEffect(() => {
        setVisibleCategories(categories.map(category => ({
            id: category,
            visible: true,
        })));
    }, [JSON.stringify(categories)]);

    useEffect(() => {
        setIsLoading(true);

        const timeout = setTimeout(() => {
            const stats1 = calc1(dataframe);
            const stats2 = calc2(dataframe, visibleCategoriesIndices, period);
            
            setStats({
                stats1: stats1,
                stats2: stats2,
            });
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timeout);
    }, [dataframe, JSON.stringify(visibleCategoriesIndices), period]);

    // For NumberOverview to support also past data
    const availablePeriods = stats.stats1.aggregation
        .getIndex()
        .toArray()
        .sort((a, b) => a.getTime() - b.getTime())
        .map(date => ({
            year: date.getFullYear(),
            monthIndex: date.getMonth(),
        }));
    const indexCurrent = period === null ? availablePeriods.length - 1 : availablePeriods.findIndex(
        value => value.year === period.year && value.monthIndex === period.monthIndex
    );
    const indexPrev = Math.max(0, indexCurrent - 1);
    const counts = stats.stats1.aggregation.getSeries<number>("count").toArray();
    
    // Stats for NumberOverview
    const temp: Stats = {
        recordCountTotal: dataframe.count(),
        monthlyStats: {
            current: {
                month: period?.monthIndex ?? new Date().getMonth(),
                year: period?.year ?? new Date().getFullYear(),
            },
            recordCount: {
                current: counts[indexCurrent] ?? 0,
                prev: counts[indexPrev] ?? 0,
            },
            amount: {
                current: stats.stats1.monthlySums[indexCurrent] ?? 0,
                prev: stats.stats1.monthlySums[indexPrev] ?? 0,
            }
        }
    };

    const monthName = useMemo(() => {
        return new Date(
            period?.year ?? new Date().getFullYear(),
            period?.monthIndex ?? new Date().getMonth(),
        ).toLocaleString("default", {
            year: "numeric",
            month: "long"
        });
    }, [period?.year, period?.monthIndex]);

    return <>
        <h3 className="mb-4">Dashboard</h3>

        <Row>
            <Col>
                <h4>Entire Timeline</h4>
                <EntireTimeline xs={stats.stats1.index} ys={stats.stats1.monthlySums} />
            </Col>
            <Col>
                <h4>Current Year compared vs. Previous</h4>
                <YearComparison xs={stats.stats1.yearComparisonIndices} ys={[stats.stats1.last12MonthsPerMonthSums, stats.stats1.prev12MonthsPerMonthSums]} />
            </Col>
        </Row>

        <hr />

        <h3>Details</h3>
        <Filters 
            className="my-5"
            visibleCategories={visibleCategories}
            setVisibleCategories={setVisibleCategories}
            availablePeriods={stats.stats1.index}
            setPeriod={setPeriod}
            loading={isLoading}
        />
        <NumberOverview stats={temp} currencyLabel="CZK" className="my-5" />

        <Row>
            <Col>
                <h4>Mass Function over {monthName}</h4>
                <OverMonth xs={stats.stats2.dailyIndices} ys={stats.stats2.dailyAmounts} datasetIdKey="mass" />
            </Col>
            <Col>
                <h4>Cummulative Distribution over {monthName}</h4>
                <OverMonth xs={stats.stats2.dailyIndices} ys={stats.stats2.dailyCumulativeSum} datasetIdKey="cum" />
            </Col>
        </Row>
        <Row className="mt-4">
            <Col>
                <h4>Amount Analysis</h4>
                <ViolinPlot xs={stats.stats2.violinCategoryLabels} ys={stats.stats2.violinAmounts} />
            </Col>
            <Col>
                <h4>Frequency Analysis</h4>
                <NumberOfEntries xs={stats.stats2.numberOfEntriesCategoryLabels} ys={stats.stats2.categoryCounts} />
            </Col>
        </Row>
        <Row className="mt-4">
            <Col>
                <h4>Part of the Whole</h4>
                <TreeMap tree={stats.stats2.treemapData} />
            </Col>
            <Col></Col>
        </Row>
    </>;
}
