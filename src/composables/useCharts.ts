import { ref } from "vue";
import * as echarts from "echarts";
import {
  ClassBorrowVolume,
  CreditScoreTop10,
  ReadVolumeOfEachType,
} from "@/types/statisticTypes.ts";

export default function (
  classBorrowVolume: ClassBorrowVolume,
  creditScoreTop10: CreditScoreTop10,
  readVolumeOfEachType: ReadVolumeOfEachType,
) {
  const lineChart = ref(null); // 折线图
  const barChart = ref(null); // 柱状图
  const hBarChart = ref(null); // 横向柱状图

  const updateChart = () => {
    const line = echarts.init(lineChart.value, null, { renderer: "canvas" });
    const bar = echarts.init(barChart.value, null, { renderer: "canvas" });
    const hBar = echarts.init(hBarChart.value, null, { renderer: "canvas" });

    line.setOption({
      title: {
        text: "书籍借阅量变化",
      },
      tooltip: {
        trigger: "axis",
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: { yAxisIndex: "none" },
          magicType: { type: ["line", "bar"] },
          restore: {},
          saveAsImage: {},
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: classBorrowVolume.dateList,
      },
      yAxis: {
        type: "value",
        axisLabel: { formatter: "{value} 本" },
      },
      series: [
        {
          name: "借阅数量",
          type: "line",
          data: classBorrowVolume.borrowVolume,
          itemStyle: { color: "#fa816a" },
          markPoint: {
            data: [
              { type: "max", name: "Max" },
              { type: "min", name: "Min" },
            ],
          },
          markLine: {
            data: [{ type: "average", name: "Avg" }],
          },
        },
      ],
    });

    bar.setOption({
      title: { text: "阅读积分Top10" },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: creditScoreTop10.nameList,
        axisTick: { alignWithLabel: true },
      },
      yAxis: { type: "value" },
      series: [
        {
          name: "阅读积分",
          type: "bar",
          barWidth: "60%",
          data: creditScoreTop10.creditScoreList,
          itemStyle: { color: "#fa816a" },
        },
      ],
    });

    hBar.setOption({
      title: { text: "每类图书的阅读量" },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: { type: "value", boundaryGap: [0, 0.01] },
      yAxis: { type: "category", data: readVolumeOfEachType.categoryList },
      series: [
        {
          name: "阅读量",
          type: "bar",
          data: readVolumeOfEachType.readVolumeList,
          itemStyle: { color: "#fa816a" },
        },
      ],
    });

    window.addEventListener("resize", () => {
      line.resize();
      bar.resize();
      hBar.resize();
    });
  };

  return { lineChart, barChart, hBarChart, updateChart };
}
