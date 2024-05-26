"use client";

import React, { useState, useEffect } from 'react';
import { StyledLine, whiteStraightLine } from './Chart';
import Box from "@mui/material/Box";
import { externalTooltipHandler, graphConfig, generateFinancialModel, generateTimes, lineGraphConfig } from './utils';
import { ScriptableContext } from 'chart.js';
import Colors from '@/themes/colors';
import { useSession } from "next-auth/react";

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
        <Box sx={{ padding: '16px', paddingBottom: 0, position: 'relative' }} bgcolor={Colors.black}>
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
                            external: (context: { chart: any; tooltip: any }) => {
                                return externalTooltipHandler({ ...context, data });
                            }      
                        },
                    },
                    scales: {
                        y: {
                            position: 'right',
                            ticks: {
                                color: Colors.grey700,
                                callback: (tickValue) => `$ ${tickValue}`,
                                align: 'end',
                            },
                            grid: {
                                color: Colors.grey900,
                            }
                        },
                        x: {
                            ticks: {
                                color: Colors.grey700,
                                maxTicksLimit: 10,
                            },
                            grid: {
                                color: Colors.grey900,
                            }
                        }
                    }
                }}
                data={{
                    labels: generateTimes(data.length),
                    datasets: [{
                        type: 'line',
                        animations: {
                            y: {
                                duration: 0,
                            },
                        },
                        pointRadius: (ctx: ScriptableContext<"line">) =>
                            ctx.chart.data.datasets[1].data[ctx.dataIndex] === ctx.chart.data.datasets[0].data[ctx.dataIndex] ? 5 : 0,
                        label: 'Price',
                        data: data,
                        ...graphConfig(),
                    }, {
                        type: 'line',
                        label: '',
                        animations: {
                            y: {
                                duration: 500,
                            },
                        },
                        borderColor: data[data.length - 1] > data[data.length - 2] ? 'rgba(0, 255, 0, 0.3)' : "rgba(255, 0, 0, 0.3)",
                        data: data.map(() => data[data.length - 1]),
                        backgroundColor: ({ chart }: ScriptableContext<"line">) => {
                            const { ctx } = chart;

                            const lastItem = data[data.length - 1];
                            const secondLastItem = data[data.length - 2];

                            const fromGradient = lastItem > secondLastItem ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)";
                            const toGradient = "rgba(0, 0, 0, 0.2)";

                            const gradient = ctx.createLinearGradient(0, 0, 0, 300);

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
