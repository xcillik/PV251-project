
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
                text: "Day of Month",
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
                unit: "day",
                displayFormats: {
                    day: "DD. MM. YYYY",
                },
                tooltipFormat: "DD. MMM. YYYY",
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
            label: "Daily Sum",
            fill: "start",
        },
    ],
};

type Props = {
    xs: Date[];
    ys: number[];
    datasetIdKey: string;
};

export function OverMonth({xs, ys, datasetIdKey }: Props) {
    const [data, setData] = useState({
        ...dataDefault,
        labels: xs,
        datasets: [{
            data: ys,
            label: "Daily Sum",
            fill: "start",
        }],
    });

    useEffect(() => {
        setData({
            ...data,
            labels: xs,
            datasets: [{
                data: ys,
                label: "Daily Sum",
                fill: "start",
            }],
        });
    }, [xs, ys]);

    // @ts-expect-error - Maybe inccorectly typed lib
    return <Line datasetIdKey={datasetIdKey} options={options} data={data} />;
}
