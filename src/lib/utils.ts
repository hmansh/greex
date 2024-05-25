import { renderToString } from "react-dom/server";

export const generateDates = (n: number): string[] => {
  const dates = [];
  for (let i = 0; i < n; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.getDate() + "/" + date.getMonth());
  }
  return dates.reverse();
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

const stringifiedCustomTooltip = (dataIndex: number) => {
  return renderToString(`
    <div>
      <p>Current Price</p>
    </div>
  `);
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
  dataIndex: number
) => {
  let tooltipEl = chart.canvas.parentNode.querySelector("div");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.classList.add("custom-tooltip");
    tooltipEl.innerHTML = stringifiedCustomTooltip(dataIndex);

    chart.canvas.parentNode.appendChild(tooltipEl);
  }
  tooltipEl.innerHTML = stringifiedCustomTooltip(dataIndex);
  return tooltipEl;
};

export const externalTooltipHandler = (context: {
  chart: any;
  tooltip: any;
}) => {
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart, tooltip.dataPoints[0].dataIndex);

  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }
  tooltipEl.style.opacity = 1;
  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  tooltipEl.style.left = `${positionX + tooltip.caretX - 190}px`;
  tooltipEl.style.top = `${positionY + 10 + tooltip.caretY}px`;
};
