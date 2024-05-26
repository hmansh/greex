"use client";

import React, { useState, useEffect } from 'react';
import { StyledLine, whiteStraightLine } from './Chart';
import Box from "@mui/material/Box";
import { externalTooltipHandler, graphConfig, generateFinancialModel, generateDates, lineGraphConfig } from './utils';
import { ScriptableContext } from 'chart.js';
import Colors from '@/themes/colors';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

const N = 100;
const BASE_VALUE = 100;
const GROWTH_RATE = 0.01;
const VOLATILITY = 0.02;

const UPDATE_DURATION = 2000;

interface ChartProps { };

const Chart: React.FC<ChartProps> = () => {
    const { data: session } = useSession();

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
        }, UPDATE_DURATION);

        return () => {
            clearInterval(timerRef);
        };
    }, []);

    if (!session) return null;

    return (
        <Box sx={{ padding: '16px', paddingBottom: 0 }} bgcolor={Colors.black}>
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
                        y: {
                            ticks: {
                                callback: (_, tickValue: string | number) => `$ ${(tickValue as number).toFixed(2)}`,
                                color: Colors.white,
                            },
                        },
                        x: {
                            ticks: {
                                color: Colors.white,
                            },
                        }
                    }
                }}
                data={{
                    labels: generateDates(data.length),
                    datasets: [{
                        type: 'line',
                        pointRadius: (ctx: ScriptableContext<"line">) =>
                            ctx.chart.data.datasets[1].data[ctx.dataIndex] === ctx.chart.data.datasets[0].data[ctx.dataIndex] ? 5 : 0,
                        label: '',
                        data: data,
                        ...graphConfig(),
                    }, {
                        type: 'line',
                        label: '',
                        borderColor: data[data.length - 1] > data[data.length - 2] ? 'rgba(0, 255, 0, 0.3)' : "rgba(255, 0, 0, 0.3)",
                        data: Array.from({ length: data.length }, (_, i) => data[data.length - 1]),
                        backgroundColor: ({ chart }: ScriptableContext<"line">) => {
                            const { ctx } = chart;

                            const lastItem = data[data.length - 1];
                            const secondLastItem = data[data.length - 2];

                            const fromGradient = lastItem > secondLastItem ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)";
                            const toGradient = "rgba(0, 0, 0, 0.2)";

                            const gradient = ctx.createLinearGradient(20, 0, 10, 200);

                            gradient.addColorStop(0, fromGradient);
                            gradient.addColorStop(1, toGradient);

                            return gradient;
                        },
                        ...lineGraphConfig(),
                    }],
                }}
            />
        </Box>
    );
}

export default Chart;
