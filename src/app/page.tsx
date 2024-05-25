"use client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import styled from "styled-components";
import { ChartArea, ScriptableContext } from "chart.js";
import { Line } from "react-chartjs-2";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { generateDates, generateFinancialModel } from "@/lib/utils";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StyledLine = styled(Line)`
  + .custom-tooltip {
    background-color: #ffffff;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    color: #000000;
    opacity: 1;
    pointerevents: none;
    position: absolute;
    padding: 12px;
    transition: all 0.1s ease;
    width: 189px;
    height: 110px;
  }
`;

const graphDatasets = () => [
  {
    borderWidth: 2,
    lineTension: 0.15,
    fill: "start",
    borderColor: "#F3BA2F",
    backgroundColor: (context: ScriptableContext<"line">) => {
      const { ctx } = context.chart;
      const gradient = ctx.createLinearGradient(0, 0, 0, 700);
      gradient.addColorStop(0, "rgba(248, 212, 107, 0.2)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.0)");
      return gradient;
    },
  },
];

export const greenStraightLine = {
  id: "green-line",
  beforeDatasetsDraw({
    ctx,
    chartArea,
  }: {
    ctx: CanvasRenderingContext2D;
    chartArea: ChartArea;
  }) {
    ctx.strokeStyle = "green";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.setLineDash([4]);
    ctx.moveTo(chartArea.right, chartArea.top);
    ctx.lineTo(chartArea.right, chartArea.bottom);
    ctx.stroke();
    ctx.setLineDash([0]);
    ctx.closePath();
  },
};

export default function Home() {
  const start = 0;
  const target = 3500;
  const n = 100;
  const baseValue = 100;
  const growthRate = 0.05;
  const volatility = 0.3;

  const [data, setData] = React.useState<number[]>(generateFinancialModel(n, baseValue, growthRate, volatility));

  React.useEffect(() => {
    const timerRef = setInterval(() => {
      const newValue = generateFinancialModel(1, data[data.length - 1], growthRate, volatility)[0];
      setData(prev => [...prev, newValue]);
    }, 2000);

    return () => {
      clearInterval(timerRef);
    };
  }, []);

  return (
    <main style={{ background: "black" }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            ></IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              GreeX
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
        <Box
          bgcolor={"#black"}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 63px)",
          }}
        >
          <Box bgcolor={"black"}>
            <StyledLine
              plugins={[greenStraightLine]}
              height={800}
              width={1600}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    enabled: false,
                    // external: (context: { chart: any; tooltip: any }) =>
                    //   externalTooltipHandler(context),
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
                  label: 'Something Dataset',
                  ...graphDatasets()[0],
                  data: data,
                  elements: {
                    point: {
                      radius: 0,
                    },
                  },
                }, {
                  type: 'line',
                  label: 'Line Dataset',
                  borderWidth: 2,
                  fill: "start",
                  borderColor: data[data.length - 1] > data[data.length - 2] ? 'rgba(0, 255, 0, 0.3)' : "rgba(255, 0, 0, 0.3)",
                  data: Array.from({ length: data.length }, (_, i) => data[data.length - 1]),
                  elements: {
                    point: {
                      radius: 0,
                    }
                  },
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
                }],
              }}
            />
          </Box>
        </Box>
      </Box>
    </main>
  );
}
