<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  deleteArticleCategory,
  updateArticleCategory,
  insertArticleCategory,
  pageQueryArticleCategory,
} from "@/api/admin/article.ts";

const size = ref<"small" | "default" | "large">("default");
const background = ref(true);
const disabled = ref(false);
const hideOnSinglePage = ref(true);
const labelPosition = ref<"left" | "right" | "top">("left");
const insertFormVisible = ref(false);
const editFormVisible = ref(false);
const tableData = ref<[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const addForm = reactive({
  categoryName: "",
});

const editForm = reactive({
  categoryId: null,
  categoryName: "",
});

// 计算表格序号
const adjustedIndex = computed(() => {
  return (index: number) => {
    return (currentPage.value - 1) * pageSize.value + index + 1;
  };
});

// “新增”按钮
const addButton = () => {
  Object.keys(addForm).forEach((key) => {
    addForm[key] = ""; // 其他字段设为空字符串
  });
  insertFormVisible.value = true;
};

// 新增学生信息
async function submitInsert() {
  try {
    await insertArticleCategory(addForm);
    await handleCurrentChange();
    insertFormVisible.value = false;
    ElMessage.success("添加成功");
  } catch (error) {
    console.error("Failed to insert Category data:", error);
  }
}

// 取消新增
const cancelInsert = () => {
  insertFormVisible.value = false;
};

// “删除”按钮
const deleteButton = (row) => {
  ElMessageBox.confirm("确定删除该标签信息吗？", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    handleDeleteArticleCategory(row.categoryId!);
  });
};

// 删除学生信息
async function handleDeleteArticleCategory(categoryId: number) {
  try {
    await deleteArticleCategory(categoryId);
    await handleCurrentChange();
    ElMessage.success("删除成功");
  } catch (error) {
    console.error("Failed to delete Category data:", error);
  }
}

// “编辑”按钮
const editButton = (row) => {
  editFormVisible.value = true;
  handleEchoData(row);
};

// 取消编辑
const cancelEdit = () => {
  editFormVisible.value = false;
};

// 编辑学生信息
async function submitEdit() {
  try {
    await updateArticleCategory(editForm);
    await handleCurrentChange();
    editFormVisible.value = false;
    ElMessage.success("编辑成功");
  } catch (error) {
    console.error("Failed to update Student data:", error);
  }
}

// 分页查询数据
async function handleCurrentChange() {
  try {
    const response = await pageQueryArticleCategory(
      currentPage.value,
      pageSize.value,
    );
    tableData.value = response.data.records;
    total.value = response.data.total;
  } catch (error) {
    console.error("Failed to fetch Student data:", error);
  }
}

// 回显数据
async function handleEchoData(row) {
  try {
    editForm.categoryId = row.categoryId!;
    editForm.categoryName = row.categoryName;
  } catch (error) {
    console.error("Failed to edit Student data:", error);
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
  <!-- 新增数据对话框 -->
  <el-dialog v-model="insertFormVisible" title="新增数据" width="500px">
    <el-form
      :label-position="labelPosition"
      :model="addForm"
      label-width="70px"
      show-message
      size="large"
      status-icon
      style="max-width: 460px; font-weight: bold"
    >
      <el-form-item label="分类名称" prop="categoryName">
        <el-input v-model="addForm.categoryName" placeholder="请输入分类名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelInsert">取消</el-button>
        <el-button
          type="primary"
          @click="submitInsert"
        >
          提交</el-button
        >
      </div>
    </template>
  </el-dialog>
  <!-- 编辑数据对话框 -->
  <el-dialog v-model="editFormVisible" title="编辑数据" width="500px">
    <el-form
      :label-position="labelPosition"
      :model="editForm"
      label-width="70px"
      show-message
      size="large"
      status-icon
      style="max-width: 460px; font-weight: bold"
    >
      <el-form-item label="分类名称" prop="categoryName">
        <el-input
          v-model="editForm.categoryName"
          placeholder="请输入分类名称"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="primary" @click="submitEdit"> 提交</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 顶部表单 -->
  <div class="rounded-lg p-5">
    <div style="width: 100%">
      <el-form
        :inline="true"
        class="mb-4 flex items-center justify-between rounded-lg bg-white font-bold"
      >
        <div class="mr-4 flex space-x-4">
          <el-form-item class="query-Form-item">
            <el-button type="primary" @click="addButton"> 新增</el-button>
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
        <el-table-column align="center" label="分类名称" prop="categoryName" />
        <el-table-column align="center" fixed="right" label="操作">
          <template #default="{ row }">
            <el-button type="primary" @click="editButton(row)">编辑</el-button>
            <el-button type="danger" @click="deleteButton(row)">删除</el-button>
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
