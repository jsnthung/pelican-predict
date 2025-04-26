import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  ChartOptions,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";
import zoomPlugin from "chartjs-plugin-zoom";

import { generatedSampleData, sampleData } from "@/data/sample-data";
import { CandlestickDataPoint } from "@/lib/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  CandlestickController,
  CandlestickElement,
  zoomPlugin
);

const candlestickChartData: CandlestickDataPoint[] = generatedSampleData;

const timestamps = candlestickChartData.map((d) => d.x);
const minTimestamp = Math.min(...timestamps);
const maxTimestamp = Math.max(...timestamps);

const options: ChartOptions<"candlestick"> = {
  responsive: true,
  scales: {
    x: {
      type: "time",
      time: {
        unit: "day",
        displayFormats: {
          day: "MMM d",
        },
        tooltipFormat: "PPpp",
        isoWeekday: true,
      },
      ticks: {
        source: "data",
      },
      adapters: {
        date: {
          zone: "UTC",
        },
      },
      min: minTimestamp,
      max: maxTimestamp,
    },
    y: {
      beginAtZero: false,
    },
  },
  plugins: {
    tooltip: {
      enabled: true,
    },
    zoom: {
      pan: {
        enabled: true,
        mode: "x",
        scaleMode: "xy",
      },
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        mode: "x",
        scaleMode: "xy",
      },
      limits: {
        x: {
          min: minTimestamp,
          max: maxTimestamp,
          minRange: 1000 * 60 * 60 * 24 * 7,
        },
      },
    },
  },
};

const data = {
  datasets: [
    {
      label: "Sample Candlestick",
      data: candlestickChartData,
      color: {
        up: "#26a69a",
        down: "#ef5350",
        unchanged: "#999",
      },
      categoryPercentage: 0.5,
      barPercentage: 0.8,
    },
  ],
};

const CandlestickChart: React.FC = () => {
  return (
    <div style={{ width: "800px", height: "500px" }}>
      <Chart type="candlestick" data={data} options={options} />
    </div>
  );
};

export default CandlestickChart;
