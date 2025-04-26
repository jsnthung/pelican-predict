import React, { useEffect, useRef } from "react";
import { Chart, ChartData, ChartOptions, registerables } from "chart.js";
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";
import "chartjs-adapter-date-fns";
import {
  generatedSampleData,
  sampleData,
  sampleData2,
} from "@/assets/sample-data";

Chart.register(...registerables, CandlestickController, CandlestickElement);

const CandlestickChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<"candlestick"> | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const data: ChartData<"candlestick"> = {
      datasets: [
        {
          label: "Candlestick Chart",
          data: sampleData2,
          barThickness: 8,
        },
      ],
    };

    const options: ChartOptions<"candlestick"> = {
      responsive: true,
      scales: {
        x: {
          type: "timeseries",
          time: {
            unit: "day",
          },
        },
        y: {
          beginAtZero: false,
          // min: Math.min(...sampleData2.map((d) => d.l)) - 5,
          // max: Math.max(...sampleData2.map((d) => d.h)) + 5,
        },
      },
    };

    chartRef.current = new Chart(ctx, {
      type: "candlestick",
      data,
      options,
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, []);

  return (
    <div style={{ width: "800px", height: "400px" }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default CandlestickChart;
