import { ViolinChart} from "@sgratzl/chartjs-chart-boxplot";
import { useEffect, useRef } from "react";

const options = {
    responsive: true,
    scales: {
        x: {
            grid: {
                display: false,
            },
            title: {
                text: "Category",
                display: true,
                align: "end",
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

type Props = {
    xs: string[];
    ys: number[][];
};

export function ViolinPlot({ xs, ys }: Props) {
    const ref = useRef<HTMLCanvasElement>(null);
    const chart = useRef<ViolinChart<number[][], string> | null>(null);

    useEffect(() => {
        if (!ref.current) return;
        if (chart.current) return;
        const ctx = ref.current.getContext("2d");
        if (!ctx) return;

        const newChart = new ViolinChart(ctx, {
            data: {
                labels: xs,
                datasets: [
                    {
                        data: ys,
                        label: "Amount",
                    }
                ],
            },
            // @ts-expect-error - Maybe inccorectly typed lib
            options: options,
        });
        chart.current = newChart;
        
        // return () => {
        //     newChart.destroy()
        //     chart.current = null;
        // };
    }, []);

    useEffect(() => {
        if (!chart.current) return;

        chart.current.data.labels = xs;
        chart.current.update();
    }, [xs]);

    useEffect(() => {
        if (!chart.current) return;

        chart.current.data.datasets[0].data = ys;
        chart.current.update();
    }, [ys]);

    return <canvas ref={ref}></canvas>;
}
