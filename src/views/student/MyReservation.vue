<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage,  } from "element-plus";
import { QueryForm } from "@/types/studentTypes.ts";
import { changeSeatStatus, pageQueryMySeatReservation } from "@/api/student/myReservation";
import { myReservationForm, statusChangeForm } from "@/types/myReservation";

const size = ref<"small" | "default" | "large">("default");
const background = ref(true);
const disabled = ref(false);
const hideOnSinglePage = ref(true);
const tableData = ref<myReservationForm[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const statusChangeForm = ref<statusChangeForm>({
  reservationId: 0,
  status: 0,
});

const queryForm = reactive<QueryForm>({
  name: "",
  username: "",
});

// 计算表格序号
const adjustedIndex = computed(() => {
  return (index: number) => {
    return (currentPage.value - 1) * pageSize.value + index + 1;
  };
});

// “签到”按钮
const signInButton = async (row: myReservationForm) => {
  try {
    statusChangeForm.value.reservationId = row.reservationId;
    statusChangeForm.value.status = 1;
    await changeSeatStatus(statusChangeForm.value);
    ElMessage.success("签到成功");
    await handleCurrentChange();
  } catch (error) {
    console.error("无法完成签到：", error);
  }
};

// “删除”按钮
const signOutButton = async (row: myReservationForm) => {
  try {
    statusChangeForm.value.reservationId = row.reservationId;
    statusChangeForm.value.status = 2;
    await changeSeatStatus(statusChangeForm.value);
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
  } catch (error) {
    console.error("Failed to fetch Student data when created:", error);
  }
});
</script>
<template>
  <!-- 顶部表单 -->
  <div class="rounded-lg p-5">
    <div style="width: 100%">
      <el-form
        :inline="true"
        :model="queryForm"
        class="mb-4 flex items-center justify-between rounded-lg bg-white font-bold"
      >
        <div class="flex space-x-4">
          <el-form-item class="query-Form-item" label="条件查询">
            <el-input
              v-model="queryForm.name"
              clearable
              placeholder="按姓名查询"
              @keyup.enter="handleCurrentChange"
            />
          </el-form-item>
          <el-form-item class="query-Form-item">
            <el-input
              v-model="queryForm.username"
              clearable
              placeholder="按学号查询"
              @keyup.enter="handleCurrentChange"
            />
          </el-form-item>
        </div>
        <div class="mr-4 flex space-x-4">
          <el-form-item class="query-Form-item">
            <el-button type="primary" @click="handleCurrentChange"
              >查询
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
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
.query-Form-item {
  @apply mx-1.5 my-2.5;
}
</style>
