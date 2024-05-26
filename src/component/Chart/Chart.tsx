
import styled from "styled-components";
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
    ChartArea
} from "chart.js";
import Colors from "@/themes/colors";

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

export const StyledLine = styled(Line)`
  + .custom-tooltip {
    background-color: ${Colors.yellow};
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    color: ${Colors.grey900};
    opacity: 1;
    pointerevents: none;
    position: absolute;
    padding: 3px 16px;
    transition: all 0.1s ease;
    width: fit-content;
    height: 24px;
    display: flex;
    align-items: center;
    font-size: 14px;
  }
`;

export const whiteStraightLine = {
    id: "white-line",
    beforeDatasetsDraw({
      ctx,
      chartArea,
    }: {
      ctx: CanvasRenderingContext2D;
      chartArea: ChartArea;
    }) {
      ctx.strokeStyle = Colors.grey900;
      ctx.lineWidth = 1;
  
      ctx.beginPath();
      // ctx.setLineDash([4]);
      ctx.moveTo(chartArea.right, chartArea.top);
      ctx.lineTo(chartArea.right, chartArea.bottom);
      ctx.stroke();
      ctx.setLineDash([0]);
      ctx.closePath();
    },
  };