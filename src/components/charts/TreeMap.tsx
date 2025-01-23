import { Chart } from "chart.js";
import { useEffect, useRef } from "react";
import {TreemapController, TreemapElement} from 'chartjs-chart-treemap';
import { ChartOptions } from "chart.js";
import { color as C } from "chart.js/helpers";
import zoomPlugin from "chartjs-plugin-zoom";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

Chart.register(TreemapController, TreemapElement, zoomPlugin);

type Context = {
    type: "data" | "label";
    raw: {
        _data: {
            label: string;
        };
        v: number;
    };
};

function getColor(ctx: Context) {
    if (ctx.type !== "data") return "transparent";

    const alpha = (1 + Math.log(ctx.raw.v)) / 15;
    const color = "purple";

    return C(color).alpha(alpha).rgbString();
}

const options: ChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            callbacks: {
                title(items) {
                    // @ts-expect-error - Unknown type at this point
                    return items[0].raw._data.label;
                },
            },
        },
        zoom: {
            zoom: {
                wheel: {
                    enabled: true,
                },
            },
            pan: {
                enabled: true,
            },
        },
    },
};

const dataDefault = {
    tree: [] as { label: string; value: number }[],
    key: "value",
    label: "Amouns per Category",
    backgroundColor: (ctx: Context) => getColor(ctx),
    labels: {
        display: true,
        formatter: (ctx: Context) => {
            if (ctx.type !== "data") return;
            return [`${ctx.raw.v} CZK`, ctx.raw._data.label];
        },
        color: ["white", "whiteSmoke"],
        font: [
            {
                size: 16,
            },
            {
                size: 12,
            }
        ],
        overflow: "fit",
    },
};

type Props = {
    tree: {
        label: string;
        value: number;
    }[];
};

export function TreeMap({ tree }: Props) {
    const ref = useRef<HTMLCanvasElement>(null);
    const chart = useRef<Chart | null>(null);

    useEffect(() => {
        if (!ref.current) return;
        if (chart.current) return;
        const ctx = ref.current.getContext("2d");
        if (!ctx) return;

        const newChart = new Chart(ctx, {
            type: "treemap",
            data: {
                // @ts-expect-error - Unknown type at this point
                datasets: [{
                    ...dataDefault,
                    tree: tree,
                }],
            },
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

        // @ts-expect-error - Unknown type at this point
        chart.current.data.datasets[0].tree = tree;
        chart.current.update();
    }, [tree]);

    return <>
        <canvas style={{ border: "1px solid lightgray" }} ref={ref}></canvas>
        <div className="d-flex align-items-center mt-2">
            <OverlayTrigger overlay={
                <Tooltip>
                    Supports zooming and panning. Hover over a rectangle to see the category and the amount.
                </Tooltip>
            }>
                <FontAwesomeIcon icon={faCircleInfo} className="me-2" style={{fontSize: "1.5rem"}} />
            </OverlayTrigger>
            <Button variant="outline-primary" className="me-2" onClick={() => chart.current?.zoom(1.1)}>Zoom +10%</Button>
            <Button variant="outline-primary" className="me-2" onClick={() => chart.current?.zoom(2 - 1 / 0.9)}>Zoom -10%</Button>
            <Button variant="outline-primary" className="me-2" onClick={() => chart.current?.resetZoom()}>Reset Zoom</Button>
        </div>
    </>;
}
