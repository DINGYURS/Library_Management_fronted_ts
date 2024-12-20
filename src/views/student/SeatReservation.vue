<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import * as echarts from "echarts";
import axios from "axios";
import dayjs from "dayjs";
import { ElMessage } from "element-plus";
import { getSeatInfo, insertSeatReservation } from "@/api/student/seatReview";
import { ReservationInfo } from "@/types/seatReservation";

const svgChart = ref<HTMLElement | null>(null);
const currentFloor = ref<number>(1);
let myChart: echarts.ECharts | null = null;
const takenSeatNames = ref<{ seat_number: string; floor: number }[]>([]);
const selectSeatNumber = ref<string>("");
const selectDate = ref("");
const selectTime = ref<string[]>([]);
const reservationForm = ref<ReservationInfo>();

// SVG文件路径
const svgPaths: { [key: number]: string } = {
  1: "/src/assets/seat1.svg", // 第一层
  2: "/src/assets/seat2.svg", // 第二层
  3: "/src/assets/seat3.svg", // 第三层
};

// 禁用选择当前时间之前的日期
const disabledDate = (currentDate: Date) => {
  return currentDate < dayjs().startOf("day").toDate();
};

// 禁用当前时间之前的小时
const disabledHours = () => {
  const currentHour = dayjs().hour();
  const currentDate = dayjs(selectDate.value);

  // 如果选择的日期是今天，禁用当前时间之前的小时
  if (currentDate.isSame(dayjs(), "day")) {
    return Array.from({ length: 24 }, (_, i) => i).filter(
      (hour) => hour <= currentHour,
    );
  }
  // 如果选择的是未来日期，则不禁用任何小时
  return [];
};

// 禁止选择分钟数
const disabledMinutes = () => {
  return Array.from({ length: 60 }, (_, i) => i);
};

// 禁止选择秒数
const disabledSeconds = () => {
  return Array.from({ length: 60 }, (_, i) => i);
};

// 提交预约
const submitReservation = async() => {
  if (!selectDate.value) {
    ElMessage.error("请选择预约日期！");
    return;
  }
  if (!selectTime.value) {
    ElMessage.error("请选择预约时间！");
    return;
  }
  if (selectSeatNumber.value.length === 0) {
    ElMessage.error("请选择座位！");
    return;
  }
  // 获取预约日期和时间，格式化为 YYYY-MM-DD-HH 的形式
  const startDate = selectDate.value;
  const startTime = selectTime.value[0];
  const endTime = selectTime.value[1];

  // 拼接日期和时间
  const startDateTime = formatDateTime(startDate, startTime);
  const endDateTime = formatDateTime(startDate, endTime);

  // 将数据添加到 reservationForm
  reservationForm.value = {
    floor: currentFloor.value,
    seatNumber: selectSeatNumber.value,
    startTime: startDateTime,
    endTime: endDateTime,
  };

  console.log("预约详情：", reservationForm.value);

  try {
    await insertSeatReservation(reservationForm.value);
    ElMessage.success("预约成功！");

    selectSeatNumber.value = "";
    selectDate.value = "";
    selectTime.value = [];
    takenSeatNames.value = [];
    loadFloorMap(currentFloor.value);

  } catch (error) {
    console.error("预约失败:", error);
  }
};

function formatDateTime(date: string, time: string): string {
  const dateParts = date.split("-");
  // 拼接成 YYYY-MM-DD-HH 形式
  return `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}-${time}`;
}

function makeTakenRegions(
  takenSeats: { seat_number: string; floor: number }[],
  currentFloor: number,
) {
  // 过滤出当前楼层的已占用座位
  const floorTakenSeats = takenSeats.filter(
    (seat) => seat.floor === currentFloor,
  );

  // 返回对应楼层的已占用座位的配置
  return floorTakenSeats.map((seat) => ({
    name: seat.seat_number, // 与svg中name属性对应
    silent: true,
    itemStyle: {
      color: "#bf0e08", // 红色，表示已占用
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
  }));
}

async function loadFloorMap(floor: number) {
  if (!svgChart.value) return;

  // 每次加载前，如果已存在图表实例，清除旧图
  if (myChart) {
    myChart.dispose();
  }

  myChart = echarts.init(svgChart.value!);

  try {
    // 使用不同的svg文件路径加载不同楼层的座位映射图
    const svgPath = svgPaths[floor];

    const response = await axios.get(svgPath, { responseType: "text" });
    const svg = response.data;

    const mapName = `flight-seats-floor-${floor}`;
    echarts.registerMap(mapName, { svg: svg });

    const option: echarts.EChartsOption = {
      tooltip: {},
      geo: {
        map: mapName,
        roam: false,
        selectedMode: "single",
        layoutSize: "100%",
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
        regions: makeTakenRegions(takenSeatNames.value, currentFloor.value),
      },
    };

    myChart.setOption(option);

    // 获取选中座位 echarts事件geoselectchanged
    myChart.on("geoselectchanged", function (params: any) {
      const selectedSeat = params.name; // 选中单个座位

      // 检查当前楼层的已占用座位
      const isTaken = takenSeatNames.value.some(
        (seat) =>
          seat.seat_number === selectedSeat &&
          seat.floor === currentFloor.value,
      );

      if (isTaken) {
        ElMessage.error("当前座位正在使用中，请选择其他座位！");
        selectSeatNumber.value = ""; // 清空已占用座位的选择
      } else {
        selectSeatNumber.value = selectedSeat; // 更新为当前选中的座位
      }
    });
  } catch (error) {
    console.error("Error loading the SVG:", error);
  }
}

// 当选择的日期或时间变化时，调用API获取已占用的座位信息
const handlePickerVisibleChange = async (visible: boolean) => {
  console.log("visible", visible);

  if (!visible) {
    if (selectDate.value && selectTime.value.length === 2) {
      const startTime = formatDateTime(selectDate.value, selectTime.value[0]);
      const endTime = formatDateTime(selectDate.value, selectTime.value[1]);

      try {
        const response = await getSeatInfo(startTime, endTime);
        console.log("已占用座位信息：", response.data);

        // 更新已占用的座位信息
        const seatNumbers = response.data.seatNumbers;
        const floors = response.data.floors;

        // 映射返回数据到 takenSeatNames
        takenSeatNames.value = seatNumbers.map(
          (seat_number: string, index: number) => ({
            seat_number,
            floor: floors[index],
          }),
        );

        // 重新加载楼层地图
        loadFloorMap(currentFloor.value);
      } catch (error) {
        console.error("请求失败", error);
        ElMessage.error("请求失败，请稍后重试！");
      }
    }
  }
};

watch(currentFloor, async (newFloor) => {
  loadFloorMap(newFloor);
});

onMounted(() => {
  // 初始加载
  loadFloorMap(currentFloor.value);
});

onUnmounted(() => {
  if (myChart) {
    myChart.dispose();
  }
});

const selectFloor = (floor: number): void => {
  console.log("select floor", floor);
};
</script>

<template>
  <div class="h-full w-full bg-slate-100 p-5">
    <div
      class="flex h-full w-full flex-row overflow-hidden rounded-lg bg-blue-300"
    >
      <!-- 左侧区域：SVG 图表容器 -->
      <div class="h-full w-3/4 flex-1">
        <div key="floor-map" ref="svgChart" class="h-full w-full"></div>
      </div>

      <!-- 右侧区域：楼层、时间选择器 -->
      <div class="flex h-full w-1/4 flex-col bg-yellow-400 p-4">
        <!-- 楼层选择器 -->
        <div class="mb-4">
          <div class="mb-2 text-lg font-bold text-white">选择楼层</div>
          <el-radio-group
            v-model="currentFloor"
            size="large"
            text-color="#fff"
            fill="#fa816a"
            @change="selectFloor"
          >
            <el-radio-button label="一层" :value="1" />
            <el-radio-button label="二层" :value="2" />
            <el-radio-button label="三层" :value="3" />
          </el-radio-group>
        </div>

        <!-- 时间选择器 -->
        <div class="mb-4">
          <div class="mb-2 text-lg font-bold text-white">选择预约时间</div>
          <el-date-picker
            v-model="selectDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="选择预约日期"
            :disabled-date="disabledDate"
            @visible-change="handlePickerVisibleChange"
            size="large"
          />
          <el-time-picker
            v-model="selectTime"
            is-range
            format="HH:00"
            value-format="HH"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :disabled-hours="disabledHours"
            :disabled-minutes="disabledMinutes"
            :disabled-seconds="disabledSeconds"
            @visible-change="handlePickerVisibleChange"
            size="small"
            style="width: 220px"
          />
        </div>

        <!-- 提交按钮 -->
        <div class="mt-auto">
          <el-button type="primary" class="w-full" @click="submitReservation">
            提交预约
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
