<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { ElMessage,  } from "element-plus";
import { changeSeatStatus, pageQueryMySeatReservation } from "@/api/student/myReservation";
import { type MyReservationForm, type StatusChangeForm} from "@/types/myReservationTypes.ts";

const size = ref<"small" | "default" | "large">("default");
const background = ref(true);
const disabled = ref(false);
const hideOnSinglePage = ref(true);
const tableData = ref<MyReservationForm[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const StatusChangeForm = ref<StatusChangeForm>({
  reservationId: 0,
  status: 0,
});
const loading = ref(true)

// 计算表格序号
const adjustedIndex = computed(() => {
  return (index: number) => {
    return (currentPage.value - 1) * pageSize.value + index + 1;
  };
});

// “签到”按钮
const signInButton = async (row: MyReservationForm) => {
  try {
    StatusChangeForm.value.reservationId = row.reservationId;
    StatusChangeForm.value.status = 1;
    await changeSeatStatus(StatusChangeForm.value);
    ElMessage.success("签到成功");
    await handleCurrentChange();
  } catch (error) {
    console.error("无法完成签到：", error);
  }
};

// “删除”按钮
const signOutButton = async (row: MyReservationForm) => {
  try {
    StatusChangeForm.value.reservationId = row.reservationId;
    StatusChangeForm.value.status = 2;
    await changeSeatStatus(StatusChangeForm.value);
    ElMessage.success("签退成功");
    await handleCurrentChange();
  } catch (error) {
    console.error("无法完成签腿：", error);
  }
};


// 分页查询数据
async function handleCurrentChange() {
  try {
    const response = await pageQueryMySeatReservation(
      currentPage.value,
      pageSize.value,
    );
    tableData.value = response.data.records;
    total.value = response.data.total;
  } catch (error) {
    console.error("Failed to fetch Student data:", error);
  }
}

// 页面加载时获取数据
onMounted(async () => {
  try {
    await handleCurrentChange();
    loading.value = false;
  } catch (error) {
    console.error("Failed to fetch Student data when created:", error);
  }
});
</script>
<template>
  <div class="rounded-lg p-5" v-loading="loading">
    <!-- 表单数据展示 -->
    <div style="width: 100%">
      <el-table :data="tableData" border height="auto">
        <el-table-column align="center" label="序号">
          <template #default="{ $index }">
            {{ adjustedIndex($index) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="楼层" prop="floor" />
        <el-table-column align="center" label="座位编号" prop="seatNumber" />
        <el-table-column align="center" label="预约时间" prop="reservationTime"/>
        <el-table-column align="center" label="起始时间" prop="startTime" />
        <el-table-column align="center" label="终止时间" prop="endTime" />
        <el-table-column align="center" fixed="right" label="操作">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 0"
              type="success"
              @click="signInButton(row)"
            >
              签到
            </el-button>
            <el-button
              v-else-if="row.status === 1"
              type="primary"
              @click="signOutButton(row)"
            >
              签退
            </el-button>
            <el-button
              v-else-if="row.status === 2"
              type="danger"
              disabled
              @click="signOutButton(row)"
            >
              已完成
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :background="background"
      :disabled="disabled"
      :hide-on-single-page="hideOnSinglePage"
      :size="size"
      :total="total"
      layout="total, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<style scoped>
</style>
