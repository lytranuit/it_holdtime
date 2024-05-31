<template>
  <Chart1 v-bind="chart(data)" :id="id" class="chart_trend" />
</template>
<script setup>
import Chart1 from "primevue/chart";

import { Chart } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
Chart.register(annotationPlugin);

const props = defineProps({
  data: Object,
  id: String,
});
const chart = (dataChart) => {
  console.log(dataChart);
  return {
    type: "line",
    options: {
      animation: {
        duration: 0,
      },
      // responsive: false,
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: "#334155",
            usePointStyle: true,
          },
          position: "right",
        },
        annotation: {
          annotations: dataChart.chart.annotations,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Date",
            align: "end",
          },
          ticks: {
            color: "#334155",
          },
          grid: {
            color: "#e2e8f0",
          },
        },
        y: {
          suggestedMax: dataChart.chart.suggestedMax,
          title: {
            display: true,
            text: dataChart.chart.yTitle,
            align: "end",
          },
          ticks: {
            color: "#334155",
          },
          grid: {
            color: "#e2e8f0",
          },
        },
      },
    },
    key: dataChart.chart.key,
    data: dataChart.chart,
    height: 700,
    // width: 1200,
    // class: "h-30rem",
  };
};
</script>