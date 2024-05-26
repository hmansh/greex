import Colors from "@/themes/colors";
import { ScriptableContext } from "chart.js";
import { renderToString } from "react-dom/server";

export const generateTimes = (n: number): string[] => {
  const times = [];

  for (let i = 0; i < n; i++) {
    const date = new Date();
    date.setMinutes(date.getMinutes() - i);
    const result = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    times.push(result);
  }

  return times.reverse();
};

export const generateFinancialModel = (
  n: number,
  baseValue: number,
  growthRate: number,
  volatility: number
): number[] => {
  const data = [];
  let currentValue = baseValue;

  for (let i = 0; i < n; i++) {
    currentValue *= 1 + growthRate;
    const randomFactor = Math.random() * 2 * volatility - volatility;
    currentValue *= 1 + randomFactor;
    currentValue = Math.round(currentValue * 100) / 100;
    data.push(currentValue);
  }

  return data;
}

const stringifiedCustomTooltip = (dataIndex: number, data: number[]) => {
  return renderToString(data[dataIndex] + ' $');
};

export const getOrCreateTooltip = (
  chart: {
    canvas: {
      parentNode: {
        querySelector: (arg0: string) => any;
        appendChild: (arg0: any) => void;
      };
    };
  },
  dataIndex: number,
  data: number[] = []
) => {
  let tooltipEl = chart.canvas.parentNode.querySelector("div");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.classList.add("custom-tooltip");
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  tooltipEl.innerHTML = stringifiedCustomTooltip(dataIndex, data);
  return tooltipEl;
};

export const externalTooltipHandler = (context: {
  chart: any;
  tooltip: any;
  data: number[];
}) => {
  const { chart, tooltip, data } = context;
  const tooltipEl = getOrCreateTooltip(chart, tooltip.dataPoints?.[0]?.dataIndex, data);

  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  tooltipEl.style.opacity = 1;
  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  tooltipEl.style.left = `${positionX + tooltip.caretX - 80}px`;
  tooltipEl.style.top = `${positionY + 10 + tooltip.caretY}px`;
};

export const graphConfig = () => ({
  borderWidth: 2,
  fill: "start",
  borderColor: Colors.yellow,
  pointBorderColor: Colors.yellow,
  pointBackgroundColor: Colors.black,
  backgroundColor: (context: ScriptableContext<"line">) => {
    const { ctx } = context.chart;
    const gradient = ctx.createLinearGradient(0, 0, 0, 700);
    gradient.addColorStop(0, "rgba(248, 212, 107, 0.2)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.0)");
    return gradient;
  },
  lineTension: 0.20
})

export const lineGraphConfig = () => ({
  borderWidth: 2,
  fill: "start",
  pointRadius: 0,
});