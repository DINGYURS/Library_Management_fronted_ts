<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import { pageQueryBorrowStatistic } from "@/api/admin/borrowStatistic.ts";
import { BorrowStatistic, QueryForm } from "@/types/borrowStatisticTypes.ts"; // 引入类型

const size = ref<"small" | "default" | "large">("default");
const background = ref(true);
const disabled = ref(false);
const hideOnSinglePage = ref(true);
const tableData = ref<BorrowStatistic[]>([]); // 绑定 BorrowStatistic 类型
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const ids = ref<number[]>([]);
const loading = ref(true)

const queryForm = reactive<QueryForm>({
  bookName: "",
});

// 计算表格序号
const adjustedIndex = computed(() => {
  return (index: number) => {
    return (currentPage.value - 1) * pageSize.value + index + 1;
  };
});

// 处理选中的行数据
const handleSelectionChange = (selectedRows: BorrowStatistic[]) => {
  ids.value = selectedRows.map((row) => row.recordId);
  console.log("Selected IDs:", ids.value);
};

// 分页查询数据
async function handleCurrentChange() {
  try {
    const response = await pageQueryBorrowStatistic(
      currentPage.value,
      pageSize.value,
      queryForm,
    );
    tableData.value = response.data.records;
    total.value = response.data.total;
  } catch (error) {
    console.error("Failed to fetch borrow statistics:", error);
  }
}

// 页面加载时获取数据
onMounted(async () => {
  try {
    await handleCurrentChange();
    loading.value = false;
  } catch (error) {
    console.error("Failed to fetch borrow statistics:", error);
  }
});
</script>

<template>
  <div class="rounded-lg p-5" v-loading="loading">
    <!-- 顶部表单 -->
    <div style="width: 100%">
      <el-form
        :inline="true"
        :model="queryForm"
        class="mb-4 flex items-center justify-between rounded-lg bg-white font-bold"
      >
        <div class="flex space-x-4">
          <el-form-item class="query-Form-item" label="条件查询">
            <el-input
              v-model="queryForm.bookName"
              clearable
              placeholder="按书名查询"
              @keyup.enter="handleCurrentChange"
            />
          </el-form-item>
        </div>
        <!-- 右侧按钮组 -->
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
      <el-table
        :data="tableData"
        border
        class="el-table"
        height="auto"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" label="序号">
          <template #default="{ $index }">
            {{ adjustedIndex($index) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="书名" prop="bookName" />
        <el-table-column align="center" label="作者" prop="author" />
        <el-table-column align="center" label="出版社" prop="press" />
        <el-table-column align="center" label="阅读量" prop="readVolume">
          <template #default="{ row }">
            <el-tag v-if="row.readVolume === 0" type="danger"
              >{{ row.readVolume }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="剩余数量" prop="remainNumber">
          <template #default="{ row }">
            <el-tag v-if="row.remainNumber === 0" type="danger"
              >{{ row.remainNumber }}
            </el-tag>
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

.el-table {
  @apply rounded-lg bg-white;
}
</style>
