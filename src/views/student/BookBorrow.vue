<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { pageQueryBookInfo } from "@/api/admin/bookInfo.ts";
import { bookBorrow, bookReturn } from "@/api/student/borrowAndReturn.ts";
import { pageQueryBorrowDetailIndividual } from "@/api/student/borrowDetail.ts";

// 定义书籍数据和表单数据的类型
interface BookInfo {
  copyId: number;
  bookName: string;
  author: string;
  category: string;
  press: string;
  totalWords: number;
  price: number;
  status: number;
}

interface BorrowDetail {
  recordId: number;
  bookName: string;
  author: string;
  category: string;
  borrowTime: string;
  returnTime: string | null;
  isReturn: number;
  creditChange: number;
}

const size = ref<"small" | "default" | "large">("default");
const background = ref(true);
const disabled = ref(false);
const hideOnSinglePage = ref(true);
const tableData = ref<(BookInfo | BorrowDetail)[]>([]); // 书籍或借阅详情数据
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const switchValue = ref(false); // 控制查询类型的开关

const queryForm = reactive({
  bookName: "",
  author: "",
  category: "",
});

// 计算表格序号
const adjustedIndex = computed(() => {
  return (index: number) => {
    return (currentPage.value - 1) * pageSize.value + index + 1;
  };
});

// “借阅”按钮
const borrowButton = (row: BookInfo) => {
  ElMessageBox.confirm("确定借阅该书吗？", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "info",
  }).then(() => {
    handleBookBorrow(row.copyId);
  });
};

// “还书”按钮
const returnButton = (row: BorrowDetail) => {
  ElMessageBox.confirm("确定还书吗？", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "info",
  }).then(() => {
    handleBookReturn(row.recordId);
  });
};

// 处理借阅
async function handleBookBorrow(copyId: number) {
  try {
    await bookBorrow(copyId);
    await handleCurrentChange();
    ElMessage.success("借阅成功");
  } catch (error) {
    console.error("Failed to borrow book:", error);
    ElMessage.error("借阅失败");
  }
}

// 处理还书
async function handleBookReturn(recordId: number) {
  try {
    await bookReturn(recordId);
    await handleCurrentChange();
    ElMessage.success("还书成功");
  } catch (error) {
    console.error("Failed to return book:", error);
    ElMessage.error("还书失败");
  }
}

// 分页查询数据
async function handleCurrentChange() {
  try {
    const response = switchValue.value
      ? await pageQueryBorrowDetailIndividual(
          currentPage.value,
          pageSize.value,
          queryForm,
        )
      : await pageQueryBookInfo(currentPage.value, pageSize.value, queryForm);

    tableData.value = response.data.records;
    total.value = response.data.total;
    ElMessage.success("查询成功");
  } catch (error) {
    console.error("Failed to fetch data:", error);
    ElMessage.error("查询失败");
  }
}

// 页面加载时获取数据
onMounted(async () => {
  try {
    await handleCurrentChange();
  } catch (error) {
    console.error("Failed to fetch data on mounted:", error);
  }
});

// 监听 switchValue 的变化，重新查询数据
watch(switchValue, async () => {
  tableData.value = [];
  await handleCurrentChange();
});
</script>

<template>
  <div class="w-full p-5">
    <!-- 顶部表单 -->
    <div>
      <el-form
        :inline="true"
        :model="queryForm"
        class="mb-4 flex items-center justify-between rounded-lg bg-white font-bold"
      >
        <div class="space-x-4">
          <el-form-item class="query-Form-item" label="条件查询">
            <el-input
              v-model="queryForm.bookName"
              clearable
              placeholder="按书名查询"
              @keyup.enter="handleCurrentChange"
            />
          </el-form-item>
          <el-form-item class="query-Form-item">
            <el-input
              v-model="queryForm.author"
              clearable
              placeholder="按作者姓名查询"
              @keyup.enter="handleCurrentChange"
            />
          </el-form-item>
          <el-form-item class="query-Form-item">
            <el-input
              v-model="queryForm.category"
              clearable
              placeholder="按书籍类别查询"
              @keyup.enter="handleCurrentChange"
            />
          </el-form-item>
          <el-switch
            v-model="switchValue"
            active-text="还书"
            class="query-Form-item"
            inactive-text="借书"
            size="large"
          />
        </div>
        <!-- 右侧按钮组 -->
        <div class="mr-4 flex">
          <el-button type="primary" @click="handleCurrentChange"
            >查询
          </el-button>
        </div>
      </el-form>
    </div>
    <!-- 表单数据展示 -->
    <div>
      <!--      借书表单-->
      <el-table
        v-if="!switchValue"
        :data="tableData"
        border
        class="el-table"
        height="auto"
      >
        <el-table-column align="center" label="序号">
          <template #default="{ $index }">
            {{ adjustedIndex($index) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="书名" prop="bookName" />
        <el-table-column align="center" label="作者" prop="author" />
        <el-table-column align="center" label="出版社" prop="press" />
        <el-table-column align="center" label="分类" prop="category" />
        <el-table-column align="center" label="价格/元" prop="price" />
        <el-table-column align="center" label="状态" prop="sex">
          <template #default="{ row }">
            <el-tag v-if="row.status === 0" type="success">在馆</el-tag>
            <el-tag v-else type="danger">借出</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作">
          <template #default="{ row }">
            <el-button
              :disabled="row.status === 1"
              type="primary"
              @click="borrowButton(row)"
              >借阅
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      还书表单-->
      <el-table v-else :data="tableData" border class="el-table" height="auto">
        <el-table-column align="center" label="序号">
          <template #default="{ $index }">
            {{ adjustedIndex($index) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="书名" prop="bookName" />
        <el-table-column align="center" label="作者" prop="author" />
        <el-table-column align="center" label="分类" prop="category" />
        <el-table-column align="center" label="借出时间" prop="borrowTime" />
        <el-table-column align="center" label="归还时间" prop="returnTime">
          <template #default="{ row }">
            {{ row.returnTime !== null ? row.returnTime : "尚未归还" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否已归还" prop="isReturn">
          <template #default="{ row }">
            <el-tag v-if="row.isReturn === 0" type="success">是</el-tag>
            <el-tag v-else type="danger">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="信用变化" prop="creditChange">
          <template #default="{ row }">
            <el-tag v-if="row.creditChange > 0" type="success"
              >{{ row.creditChange }}
            </el-tag>
            <el-tag v-else type="danger">{{ row.creditChange }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作">
          <template #default="{ row }">
            <el-button
              :disabled="row.isReturn === 0"
              type="danger"
              @click="returnButton(row)"
            >
              还书
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
  </div>
</template>
<style scoped>
.query-Form-item {
  @apply mx-1.5 my-2.5;
}
</style>
