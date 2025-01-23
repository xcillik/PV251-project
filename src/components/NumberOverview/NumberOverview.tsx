import { getDayCount } from "../../common/utils";
import "./number-overview.css";

export type Stats = {
    recordCountTotal: number;
    monthlyStats: {
        current: {
            month: number;
            year: number;
        };
        amount: {
            current: number;
            prev: number;
        },
        recordCount: {
            current: number;
            prev: number;
        }
    }
};

type Props = {
    stats: Stats;
    currencyLabel: string;
    className?: string;
};

export function NumberOverview({ stats, currencyLabel, className = "" }: Props) {
    // In case of division by zero, return 0
    // || 0 is used to prevent NaN

    const percRecordDiff = (stats.monthlyStats.recordCount.current - stats.monthlyStats.recordCount.prev) / stats.monthlyStats.recordCount.prev * 100 || 0;
    const percAmountDiff = (stats.monthlyStats.amount.current - stats.monthlyStats.amount.prev) / stats.monthlyStats.amount.prev * 100 || 0;

    const dailyAverageAmount = stats.monthlyStats.amount.current / getDayCount(stats.monthlyStats.current.year, stats.monthlyStats.current.month);
    const prev = new Date(stats.monthlyStats.current.year, stats.monthlyStats.current.month - 1, 1);
    const dailyAverageAmountPrev = stats.monthlyStats.amount.prev / getDayCount(prev.getFullYear(), prev.getMonth());
    const percDailyAverageDiff = (dailyAverageAmount - dailyAverageAmountPrev) / dailyAverageAmountPrev * 100 || 0;

    const currentMonthStr = new Date(stats.monthlyStats.current.year, stats.monthlyStats.current.month, 1).toLocaleString("default", {month: "long"});

    return <div className={`number-overview ${className}`}>
        <div className="number-overview__item">
            <div className="heading">Total Records</div>
            <div className="value">{stats.recordCountTotal}</div>
        </div>
        <div className="number-overview__item">
            <div className="heading">Records in {currentMonthStr}</div>
            <div className="value">{stats.monthlyStats.recordCount.current}</div>
            <div className="diff">
                <span className={
                    percRecordDiff === 0 ? "" :
                        (percRecordDiff > 0 ? "text-danger" : "text-success" )
                    }>{percRecordDiff.toFixed(0)}%</span>
                {percRecordDiff < 0 ? "less": "more"} than previous month
            </div>
        </div>
        <div className="number-overview__item">
            <div className="heading">Amount Spent in {currentMonthStr}</div>
            <div className="value">{stats.monthlyStats.amount.current.toFixed(3)}<span className="currency">{currencyLabel}</span></div>
            <div className="diff">
                <span className={
                    percAmountDiff === 0 ? "" :
                        (percAmountDiff > 0 ? "text-danger" : "text-success")
                    }>{percAmountDiff.toFixed(0)}%</span>
                {percAmountDiff < 0 ? "less": "more"} than previous month
            </div>
        </div>
        <div className="number-overview__item">
            <div className="heading">Daily Average for {currentMonthStr}</div>
            <div className="value">{dailyAverageAmount.toFixed(3)}<span className="currency">{currencyLabel}</span></div>
            <div className="diff">
                <span className={
                        percDailyAverageDiff === 0 ? "" :
                            (percDailyAverageDiff > 0 ? "text-danger" : "text-success")
                    }>{percDailyAverageDiff.toFixed(0)}%</span>
                {percDailyAverageDiff < 0 ? "less": "more"} than previous month
            </div>
        </div>
    </div>;
}
