
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import 'chartjs-adapter-moment';
import { useEffect, useState } from "react";

const options = {
    responsive: true,
    scales: {
        x: {
            title: {
                text: "Month, Year",
                display: true,
                align: "end",
            },
            offset: true,
            ticks: {
                autoSkip: true,
                maxTicksLimit: 15,
                source: "data",
            },
            type: "time",
            time: {
                unit: "month",
                displayFormats: {
                    month: "MMMM",
                    year: "YYYY",
                },
                tooltipFormat: "MMMM YYYY",
            },
        },
        y: {
            title: {
                text: "Amount (CZK)",
                display: true,
                align: "end",
            },
        }
    },
    plugins: {
        // title: {
        //     display: true,
        //     text: "Data",
        // },
        legend: {
            display: true,
        },
    },
    interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
    },
};


const dataDefault: {
    labels: Date[];
    datasets: {
        data: number[];
        label: string;
    }[];
} = {
    labels: [],
    datasets: [
        {
            data: [],
            label: "Last 12 Months",
            // fill: "start",
        },
        {
            data: [],
            label: "Last 12-24 Months",
            // fill: "start"
        },
    ],
};

type Props = {
    xs: Date[];
    ys: number[][];
};

export function YearComparison({xs, ys}: Props) {
    const [data, setData] = useState({
        ...dataDefault
    });

    useEffect(() => {
        setData({
            ...dataDefault,
            labels: xs,
            datasets: [
                {
                    data: ys[0],
                    label: "Last 12 Months",
                },
                {
                    data: ys[1],
                    label: "Last 12-24 Months",
                },
            ],
        });
    }, [xs, ys]);


    // @ts-expect-error - Maybe inccorectly typed lib
    return <Line options={options} data={data} />;
}
