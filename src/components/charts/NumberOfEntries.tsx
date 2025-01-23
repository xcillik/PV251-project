import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

const options = {
    responsive: true,
    scales: {
        x: {
            title: {
                text: "Category",
                display: true,
                align: "end",
            },
            offset: true,
            ticks: {
                autoSkip: true,
                maxTicksLimit: 15,
                source: "data",
            },
            grid: {
                display: false,
            },
        },
        y: {
            title: {
                text: "Count",
                display: true,
                align: "end",
            },
        }
    },
    plugins: {
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
    labels: string[];
    datasets: {
        data: number[];
        label: string;
    }[];
} = {
    labels: [],
    datasets: [
        {
            data: [],
            label: "Number of Entries",
        },
    ],
};

type Props = {
    xs: string[];
    ys: number[];
};

export function NumberOfEntries({ xs, ys }: Props) {
    const [data, setData] = useState({
        ...dataDefault,
        labels: xs,
        datasets: [{
            data: ys,
            label: "Number of Entries",
        }],
    });

    useEffect(() => {
        setData({
            ...data,
            labels: xs,
            datasets: [{
                data: ys,
                label: "Number of Entries",
            }],
        });
    }, [xs, ys]);
    
    // @ts-expect-error - Maybe inccorectly typed lib
    return <Bar options={options} datasetIdKey="numOfEntries" data={data} />;
}