"use client";

import React, { useState, useEffect } from 'react';
import { StyledLine, whiteStraightLine } from './Chart';
import Box from "@mui/material/Box";
import { externalTooltipHandler, graphDatasets, generateFinancialModel, generateDates } from './utils';
import { ScriptableContext } from 'chart.js';
import Colors from '@/themes/colors';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

const N = 100;
const BASE_VALUE = 100;
const GROWTH_RATE = 0.01;
const VOLATILITY = 0.02;

interface ChartProps { };

const Chart: React.FC<ChartProps> = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const [data, setData] = useState<number[]>(generateFinancialModel(
        N,
        BASE_VALUE,
        GROWTH_RATE,
        VOLATILITY
    ));

    useEffect(() => {
        const timerRef = setInterval(() => {
            const newValue = generateFinancialModel(
                1, data[data.length - 1], GROWTH_RATE, VOLATILITY
            )[0];
            setData(prev => [...prev, newValue]);
        }, 2000);

        return () => {
            clearInterval(timerRef);
        };
    }, []);

    if (!session) return null;

    return (
        <Box padding={16} sx={{ paddingBottom: 0 }} bgcolor={Colors.black}>
            <StyledLine
                plugins={[whiteStraightLine]}
                height={800}
                width={1600}
                options={{
                    plugins: {
                        legend: {
                            display: false,
                        },
                        tooltip: {
                            enabled: false,
                            external: (context: { chart: any; tooltip: any }) =>
                                externalTooltipHandler(context),
                        },
                    },
                    scales: {
                        // y: {
                        //   min: Math.min(start ?? 0, target ?? 0),
                        //   max: Math.max(start ?? 0, target ?? 0),
                        // },
                        //   x: {
                        //     min: '',
                        //     max: "",
                        //     grid: {
                        //       display: false,
                        //     },
                    },
                }}
                data={{
                    labels: generateDates(data.length),
                    datasets: [{
                        type: 'line',
                        pointRadius: 0,
                        label: 'Something Dataset',
                        ...graphDatasets()[0],
                        data: data,
                    }, {
                        type: 'line',
                        label: 'Line Dataset',
                        borderWidth: 2,
                        fill: "start",
                        borderColor: data[data.length - 1] > data[data.length - 2] ? 'rgba(0, 255, 0, 0.3)' : "rgba(255, 0, 0, 0.3)",
                        data: Array.from({ length: data.length }, (_, i) => data[data.length - 1]),
                        backgroundColor: ({ chart }: ScriptableContext<"line">) => {
                            const { ctx } = chart;

                            const lastItem = data[data.length - 1];
                            const secondLastItem = data[data.length - 2];

                            const fromGradient = lastItem > secondLastItem ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)";
                            const toGradient = "rgba(0, 0, 0, 0.2)";

                            const gradient = ctx.createLinearGradient(0, 0, 0, 200);

                            gradient.addColorStop(0, fromGradient);
                            gradient.addColorStop(1, toGradient);

                            return gradient;
                        },
                        pointRadius: 0,
                    }],
                }}
            />
        </Box>
    );
}

export default Chart;
