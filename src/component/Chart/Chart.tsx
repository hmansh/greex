
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
    background-color: ${Colors.white};
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

export const whiteStraightLine = {
    id: "white-line",
    beforeDatasetsDraw({
      ctx,
      chartArea,
    }: {
      ctx: CanvasRenderingContext2D;
      chartArea: ChartArea;
    }) {
      ctx.strokeStyle = Colors.grey700;
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