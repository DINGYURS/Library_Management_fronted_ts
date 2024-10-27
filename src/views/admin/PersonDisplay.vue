<script lang="ts" setup>
import { computed, nextTick, onMounted, ref } from "vue";
import dayjs from "dayjs";
import useCharts from "@/composables/useCharts";
import {
  getClassBorrowVolume,
  getCreditScoreTop10,
  getReadVolumeOfEachType,
} from "@/api/admin/statistic.ts";
import {
  ClassBorrowVolume,
  CreditScoreTop10,
  ReadVolumeOfEachType,
} from "@/types/statisticTypes.ts";

const startDate = ref(dayjs().startOf("week").format("YYYY-MM-DD")); // 初始时间段开始日期
const endDate = ref(dayjs().endOf("week").format("YYYY-MM-DD")); // 初始时间段结束日期
const selectedButton = ref<"本周" | "近7天" | "近30天">("本周"); // 默认选中的按钮

// 定义选中和未选中按钮的样式
const selectedStyle = {
  backgroundColor: "#fa816a", // 橙红色背景
  color: "#fff", // 白色字体
  borderColor: "#fa816a", // 橙红色边框
};

const defaultStyle = {
  backgroundColor: "#fff", // 白色背景
  color: "#000", // 黑色字体
  borderColor: "#fff", // 默认边框颜色
};

const dateRange = computed(() => {
  return `${startDate.value} 至 ${endDate.value}`;
});

const classBorrowVolume = ref<ClassBorrowVolume>({
  dateList: [],
  borrowVolume: [],
});

const creditScoreTop10 = ref<CreditScoreTop10>({
  nameList: [],
  creditScoreList: [],
});

const readVolumeOfEachType = ref<ReadVolumeOfEachType>({
  categoryList: [],
  readVolumeList: [],
});

const { lineChart, barChart, hBarChart, updateChart } = useCharts(
  classBorrowVolume.value,
  creditScoreTop10.value,
  readVolumeOfEachType.value,
);

function selectTimeRange(range: "本周" | "近7天" | "近30天") {
  selectedButton.value = range;
  if (range === "本周") {
    startDate.value = dayjs().startOf("week").format("YYYY-MM-DD");
    endDate.value = dayjs().endOf("week").format("YYYY-MM-DD");
  } else if (range === "近7天") {
    startDate.value = dayjs().subtract(7, "day").format("YYYY-MM-DD");
    endDate.value = dayjs().format("YYYY-MM-DD");
  } else if (range === "近30天") {
    startDate.value = dayjs().subtract(30, "day").format("YYYY-MM-DD");
    endDate.value = dayjs().format("YYYY-MM-DD");
  }
  getStatisticInfo();
}

const getStatisticInfo = async () => {
  try {
    const response = await getClassBorrowVolume(startDate.value, endDate.value);
    const response2 = await getCreditScoreTop10();
    const response3 = await getReadVolumeOfEachType();

    classBorrowVolume.value.dateList = response.data.dateList;
    classBorrowVolume.value.borrowVolume = response.data.borrowVolume;

    creditScoreTop10.value.nameList = response2.data.nameList;
    creditScoreTop10.value.creditScoreList = response2.data.creditScoreList;

    readVolumeOfEachType.value.categoryList = response3.data.categoryList;
    readVolumeOfEachType.value.readVolumeList = response3.data.readVolumeList;

    await nextTick(() => updateChart());
  } catch (error) {
    console.error("Failed to fetch StatisticInfo:", error);
  }
};

onMounted(() => {
  nextTick(() => getStatisticInfo());
});
</script>
<template>
  <div class="flex h-full w-full flex-col bg-slate-100 p-5">
    <!-- 顶部时间选择区域 -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center">
        <el-button-group>
          <el-button
            :style="selectedButton === '本周' ? selectedStyle : defaultStyle"
            size="large"
            @click="selectTimeRange('本周')"
          >
            本周
          </el-button>
          <el-button
            :style="selectedButton === '近7天' ? selectedStyle : defaultStyle"
            size="large"
            @click="selectTimeRange('近7天')"
          >
            近7天
          </el-button>
          <el-button
            :style="selectedButton === '近30天' ? selectedStyle : defaultStyle"
            size="large"
            @click="selectTimeRange('近30天')"
          >
            近30天
          </el-button>
        </el-button-group>
        <span class="ml-4 text-lg text-gray-700"
          >已选时间：{{ dateRange }}</span
        >
      </div>
      <div></div>
    </div>
    <!-- 可视化数据展示区域 -->
    <div class="flex h-full w-full flex-grow flex-col space-y-4">
      <!-- 中部班级借阅数量折线图 -->
      <div
        ref="lineChart"
        class="flex h-full w-full items-center justify-center rounded-lg bg-white p-5"
      ></div>
      <!-- 底部柱状图区域 -->
      <div class="flex h-full w-full flex-grow space-x-4">
        <div
          ref="barChart"
          class="flex h-full w-full flex-1 items-center justify-center rounded-lg bg-white p-5"
        ></div>
        <div
          ref="hBarChart"
          class="flex h-full w-full flex-1 items-center justify-center rounded-lg bg-white p-5"
        ></div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
