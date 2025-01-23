import "chart.js/auto";
import { Line } from "react-chartjs-2";
import 'chartjs-adapter-moment';
import { ChartOptions } from "chart.js/auto";
import { useEffect, useState } from "react";

const options: ChartOptions = {
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
                    month: "MMM YYYY",
                    year: "YYYY",
                },
                tooltipFormat: "MMMM YYYY",
            },
            grid: {
                display: false,
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
            display: false,
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
        fill: "start";
    }[];
} = {
    labels: [],
    datasets: [
        {
            data: [],
            label: "Monthly Sum",
            fill: "start",
        },
    ],
};

type Props = {
    xs: Date[];
    ys: number[];
};

export function EntireTimeline({xs, ys}: Props) {
    const [data, setData] = useState({
        ...dataDefault,
        labels: xs,
        datasets: [{
            data: ys,
            label: "Monthly Sum",
            fill: "start",
        }],
    });

    useEffect(() => {
        setData({
            ...data,
            labels: xs,
            datasets: [{
                data: ys,
                label: "Monthly Sum",
                fill: "start",
            }],
        });
    }, [xs, ys]);

    // @ts-expect-error - Maybe inccorectly typed lib
    return <Line options={options} data={data} />;
}
