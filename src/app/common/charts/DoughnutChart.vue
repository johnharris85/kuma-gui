<template>
  <div class="chart">
    <div class="chart-canvas-container">
      <div class="chart-title-box">
        <div class="chart-title">
          <span
            v-if="total !== null"
            class="chart-title__total"
          >{{ total }}</span>

          {{ props.data.title }}

          <span
            v-if="props.data.subtitle"
            class="chart-title__subtitle"
          >{{ props.data.subtitle }}</span>
        </div>
      </div>

      <Doughnut
        :data="chartData"
        :options="chartOptions"
      />
    </div>

    <div class="chart-legend">
      <div
        v-for="(dataPoint, index) in props.data.dataPoints"
        :key="index"
        class="legend-entry"
        :style="`--data-background-color: ${(chartData.datasets[0].backgroundColor as string[])[index]}`"
      >
        {{ dataPoint.title }} ({{ dataPoint.data }})
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ArcElement,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Tooltip,
} from 'chart.js'
import { computed, PropType } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { useRouter } from 'vue-router'

import { DoughnutChartData } from '@/types/index.d'

const CHART_COLORS = [
  '#67b7dc',
  '#6771dc',
  '#a367dc',
  '#dc67ce',
  '#dc6788',
  '#dc8c67',
  '#dcd267',
  '#a0dc67',
  '#67dc75',
]

const STATUS_COLORS: Record<string, string> = {
  Online: '#19a654',
  Offline: '#bf1330',
  'Partially degraded': '#f2a230',
}

ChartJS.register(
  ArcElement,
  Tooltip,
)

ChartJS.defaults.font = {
  size: 16,
  family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
}

ChartJS.defaults.plugins.tooltip.bodyFont = {
  size: 12,
}

const router = useRouter()

const props = defineProps({
  data: {
    type: Object as PropType<DoughnutChartData>,
    required: true,
  },
})

const chartData = computed<ChartData<'doughnut'>>(function () {
  let labels: string[]
  let data: number[]
  let backgroundColor: string[]

  if (props.data.dataPoints.length > 0) {
    labels = props.data.dataPoints.map((dataPoint) => dataPoint.title)
    data = props.data.dataPoints.map((dataPoint) => dataPoint.data)
    backgroundColor = props.data.dataPoints.map((dataPoint, index) => props.data.isStatusChart === true ? STATUS_COLORS[dataPoint.title] : CHART_COLORS[index % CHART_COLORS.length])
  } else {
    labels = []
    data = [1]
    backgroundColor = ['#e7e7ec']
  }

  return {
    labels,
    datasets: [
      {
        label: props.data.title,
        borderRadius: 6,
        rotation: 90,
        data,
        backgroundColor,
      },
    ],
  }
})

const total = computed(() => props.data.showTotal
  ? props.data.dataPoints
    .map((dataPoint) => dataPoint.data)
    .reduce((total, value) => total + value, 0)
  : null)

const chartOptions = computed<ChartOptions<'doughnut'>>(function () {
  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    cutout: 65,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: props.data.dataPoints.length > 0,
        displayColors: false,
        backgroundColor: '#000',
        callbacks: {
          title: () => '',
          // Constructs the tooltip shown when hovering over the arcs.
          label: function (context) {
            const label = context.label
            const data = context.dataset.data[context.dataIndex]
            const total = context.dataset.data.reduce((total, value) => total + value, 0)
            const percentage = (data / total) * 100

            return `${label}: ${percentage.toFixed(1)}% (${data})`
          },
        },
      },
    },
    onClick: function (_event, elements) {
      const dataPoint = props.data.dataPoints[elements[0].index]

      if (dataPoint.route) {
        router.push(dataPoint.route)
      }
    },
  }

  if (chartOptions.plugins && props.data.subtitle) {
    chartOptions.plugins.subtitle = {
      display: true,
      text: props.data.subtitle,
    }
  }

  return chartOptions
})
</script>

<style lang="scss" scoped>
.chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

// This element is important. Do not remove it.
// See: https://www.chartjs.org/docs/latest/configuration/responsive.html#important-note
.chart-canvas-container {
  height: 200px;
  position: relative;
  display: inline-flex;
  justify-content: center;
}

.chart-title-box {
  pointer-events: none;
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-title {
  pointer-events: initial;
  text-align: center;
  font-size: 0.9em;
}

.chart-title__total {
  display: block;
  font-size: 1.2em;
  font-weight: 600;
}

.chart-title__subtitle {
  display: block;
  font-size: 0.9em;
}

.legend-entry::before {
  content: '';
  display: inline-block;
  margin-right: var(--spacing-xs);
  width: 30px;
  height: 10px;
  background-color: var(--data-background-color);
}
</style>
