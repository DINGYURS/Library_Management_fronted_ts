<template>
  <div class="w-full h-full min-h-screen p-5 bg-slate-100 flex flex-col">
    <!-- 顶部时间选择区域 -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center">
        <el-button-group>
          <el-button
            :style="selectedButton === '本周' ? selectedStyle : defaultStyle"
            size="large"
            @click="selectTimeRange('本周')">
            本周
          </el-button>
          <el-button
            :style="selectedButton === '近7天' ? selectedStyle : defaultStyle"
            size="large"
            @click="selectTimeRange('近7天')">
            近7天
          </el-button>
          <el-button
            :style="selectedButton === '近30天' ? selectedStyle : defaultStyle"
            size="large"
            @click="selectTimeRange('近30天')">
            近30天
          </el-button>
        </el-button-group>
        <span class="ml-4 text-lg text-gray-700">已选时间：{{ dateRange }}</span>
      </div>
      <div></div>
    </div>
    <!-- 可视化数据展示区域 -->
    <div class="flex-grow flex flex-col space-y-4 w-full h-full">
      <!-- 中部班级借阅数量折线图 -->
      <div ref="lineChart" class="flex bg-white rounded-lg items-center justify-center p-5 w-full h-full"></div>
      <!-- 底部柱状图区域 -->
      <div class="flex-grow flex space-x-4 w-full h-full">
        <div ref="barChart" class="flex-1 p-5 bg-white rounded-lg flex items-center justify-center w-full h-full"></div>
        <div ref="hBarChart" class="flex-1 p-5 bg-white rounded-lg flex items-center justify-center w-full h-full"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed, nextTick} from 'vue';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import {getClassBorrowVolume, getCreditScoreTop10, getReadVolumeOfEachType} from "@/api/admin/statistic.js";

const startDate = ref(dayjs().startOf('week').format('YYYY-MM-DD')); // 初始时间段开始日期
const endDate = ref(dayjs().endOf('week').format('YYYY-MM-DD'));     // 初始时间段结束日期
const selectedButton = ref('本周'); // 默认选中的按钮
const lineChart = ref(null);// 折线图
const barChart = ref(null);// 柱状图
const hBarChart = ref(null);// 横向柱状图

// 定义选中和未选中按钮的样式
const selectedStyle = {
  backgroundColor: '#fa816a',  // 橙红色背景
  color: '#fff',               // 白色字体
  borderColor: '#fa816a'       // 橙红色边框
};

const defaultStyle = {
  backgroundColor: '#fff',     // 白色背景
  color: '#000',               // 黑色字体
  borderColor: '#fff'          // 默认边框颜色
};

const dateRange = computed(() => {
  return `${startDate.value} 至 ${endDate.value}`;
});

const classBorrowVolume = ref({
  dateList: [],
  borrowVolume: []
});

const creditScoreTop10 = ref({
  nameList: [],
  creditScoreList: []
});

const readVolumeOfEachType = ref({
  categoryList: [],
  readVolumeList: []
});

const updateChart = () => {

  const line = echarts.init(lineChart.value, null, {renderer: 'canvas'});
  const bar = echarts.init(barChart.value, null, {renderer: 'canvas'});
  const hBar = echarts.init(hBarChart.value, null, {renderer: 'canvas'});

  line.setOption({
    title: {
      text: '书籍借阅量变化'
    },
    tooltip: {
      trigger: 'axis'
    },
    toolbox: {
      show: true,
      feature: {
        dataZoom: {yAxisIndex: 'none'},
        magicType: {type: ['line', 'bar']},
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: classBorrowVolume.value.dateList,
    },
    yAxis: {
      type: 'value',
      axisLabel: {formatter: '{value} 本'}
    },
    series: [{
      name: '借阅数量',
      type: 'line',
      data: classBorrowVolume.value.borrowVolume,
      itemStyle: {color: '#fa816a'},
      markPoint: {data: [{type: 'max', name: 'Max'}, {type: 'min', name: 'Min'}]},
      markLine: {
        data: [{type: 'average', name: 'Avg'}]
      }
    }]
  });

  bar.setOption({
    title: {text: '阅读积分Top10'},
    tooltip: {
      trigger: 'axis',
      axisPointer: {type: 'shadow'}
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: creditScoreTop10.value.nameList,
      axisTick: {alignWithLabel: true}
    },
    yAxis: {type: 'value'},
    series: [{
      name: '阅读积分',
      type: 'bar',
      barWidth: '60%',
      data: creditScoreTop10.value.creditScoreList,
      itemStyle: {color: '#fa816a'}
    }]
  });

  hBar.setOption({
    title: {text: '每类图书的阅读量'},
    tooltip: {
      trigger: 'axis',
      axisPointer: {type: 'shadow'}
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {type: 'value', boundaryGap: [0, 0.01]},
    yAxis: {type: 'category', data: readVolumeOfEachType.value.categoryList},
    series: [{
      name: '阅读量',
      type: 'bar',
      data: readVolumeOfEachType.value.readVolumeList,
      itemStyle: {color: '#fa816a'}
    }]
  });

  window.addEventListener('resize', () => {
    line.resize();
    bar.resize();
    hBar.resize();
  });
};

function selectTimeRange(range) {
  selectedButton.value = range;
  if (range === '本周') {
    startDate.value = dayjs().startOf('week').format('YYYY-MM-DD');
    endDate.value = dayjs().endOf('week').format('YYYY-MM-DD');
  } else if (range === '近7天') {
    startDate.value = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
    endDate.value = dayjs().format('YYYY-MM-DD');
  } else if (range === '近30天') {
    startDate.value = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
    endDate.value = dayjs().format('YYYY-MM-DD');
  }
  getStatisticInfo();
}

const getStatisticInfo = async () => {
  try {
    const response = await getClassBorrowVolume(startDate.value, endDate.value);
    const response2 = await getCreditScoreTop10();
    const response3 = await getReadVolumeOfEachType();
    const data = response.data.data;
    const data2 = response2.data.data;
    const data3 = response3.data.data;

    classBorrowVolume.value.dateList = data.dateList;
    classBorrowVolume.value.borrowVolume = data.borrowVolume;

    creditScoreTop10.value.nameList = data2.nameList;
    creditScoreTop10.value.creditScoreList = data2.creditScoreList;

    readVolumeOfEachType.value.categoryList = data3.categoryList;
    readVolumeOfEachType.value.readVolumeList = data3.readVolumeList;

    await nextTick(() => updateChart());
  } catch (error) {
    console.error('Failed to fetch StatisticInfo:', error);
  }
};

onMounted(() => {
  nextTick(() => getStatisticInfo());
});
</script>

<style scoped>
</style>
