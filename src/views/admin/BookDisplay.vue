<template>
  <div class="flex h-full w-full flex-col bg-slate-100 p-5">
    <!-- 可视化数据展示区域 -->
    <!-- 中部班级借阅数量折线图 -->
    <div ref="svgChart" class="h-full w-full rounded-lg bg-white p-5"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import * as echarts from "echarts";
import axios from "axios"; // 引入 axios
import svgPath from "@/assets/Untitled.svg";

const svgChart = ref<HTMLElement | null>(null); // 引用 DOM 元素

onMounted(() => {
  if (!svgChart.value) return;

  let myChart = echarts.init(svgChart.value!);
  let option: echarts.EChartsOption;

  // 使用 axios 来加载本地的 SVG 文件
  axios
    .get(svgPath, { responseType: "text" }) // 加载本地 SVG 文件
    .then((response) => {
      const svg = response.data;
      echarts.registerMap("flight-seats", { svg: svg });

      const takenSeatNames = ["1"];

      option = {
        tooltip: {},
        geo: {
          map: "flight-seats",
          roam: true,
          selectedMode: "multiple",
          left: "0%",
          top: "0%",
          tooltip: {
            show: true,
          },
          itemStyle: {
            color: "#fff",
          },
          emphasis: {
            itemStyle: {
              color: undefined,
              borderColor: "green",
              borderWidth: 2,
            },
            label: {
              show: false,
            },
          },
          select: {
            itemStyle: {
              color: "green",
            },
            label: {
              show: false,
              textBorderColor: "#fff",
              textBorderWidth: 2,
            },
          },
          regions: makeTakenRegions(takenSeatNames),
        },
      };

      function makeTakenRegions(takenSeatNames: string[]) {
        let regions = [];
        for (let i = 0; i < takenSeatNames.length; i++) {
          regions.push({
            name: takenSeatNames[i],
            silent: true,
            itemStyle: {
              color: "#bf0e08",
            },
            emphasis: {
              itemStyle: {
                borderColor: "#aaa",
                borderWidth: 1,
              },
            },
            select: {
              itemStyle: {
                color: "#bf0e08",
              },
            },
          });
        }
        return regions;
      }

      myChart.setOption(option);

      // Get selected seats.
      myChart.on("geoselectchanged", function (params: any) {
        const selectedNames: string[] = params.allSelected[0].name.slice();

        // Remove taken seats.
        for (let i = selectedNames.length - 1; i >= 0; i--) {
          if (takenSeatNames.indexOf(selectedNames[i]) >= 0) {
            selectedNames.splice(i, 1);
          }
        }

        console.log("selected", selectedNames);
      });
    })
    .catch((error) => {
      console.error("Error loading the SVG:", error);
    });

  // 确保在组件卸载时销毁图表实例
  onUnmounted(() => {
    myChart.dispose();
  });
});
</script>

<style scoped></style>
