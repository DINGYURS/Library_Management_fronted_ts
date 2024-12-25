<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  deleteArticle,
  updateArticle,
  insertArticle,
  pageQueryArticle,
  getCategoryInfo,
} from "@/api/student/article.ts";
import {
  ArticleCategory,
  type ArticleInfo,
  type ArticlePageQuery,
} from "@/types/articleTypes.ts";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { useUserStore } from "@/stores/user.ts";
import { Plus } from "@element-plus/icons-vue";

const size = ref<"small" | "default" | "large">("default");
const background = ref(true);
const disabled = ref(false);
const hideOnSinglePage = ref(true);
// Drawer 显示与否
const formVisible = ref(false);
const drawerMode = ref<"create" | "edit" | "view">("create");
const tableData = ref<ArticleInfo[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const { token, userInfo } = useUserStore();
const categoryList = ref<ArticleCategory[]>([]);
const quillEditorRef = ref<any>(null);
const loading = ref(true)

// 统一的表单数据
const form = reactive<ArticleInfo>({
  id: 0,
  categoryName: "",
  title: "",
  content: "",
  coverImg: "",
  role: userInfo.role, // 用来记录当前登录用户的角色或文章作者角色
});

// 查询表单
const queryForm = reactive<ArticlePageQuery>({
  title: "",
  categoryName: "",
  status: null,
  role: userInfo.role, // 如果需要区分角色查询，可传递给后端
});

// 上传配置
const avatarUploadConfig = {
  action: "/api/common/upload",
  showFileList: false,
  headers: { token: token },
  onSuccess(response: any) {
    form.coverImg = response.data;
    ElMessage.success("封面上传成功");
  },
  onError() {
    ElMessage.error("封面上传失败");
  },
};

// 计算序号
const adjustedIndex = computed(() => {
  return (index: number) => {
    return (currentPage.value - 1) * pageSize.value + index + 1;
  };
});


// 获取分类信息
async function getCategory() {
  try {
    const response = await getCategoryInfo();
    categoryList.value = response.data;
  } catch (error) {
    console.error("Failed to fetch Category data:", error);
    ElMessage.error("获取分类信息失败");
  }
}

// 分页查询数据
async function handleCurrentChange() {
  try {
    const response = await pageQueryArticle(
      currentPage.value,
      pageSize.value,
      queryForm
    );
    tableData.value = response.data.records;
    total.value = response.data.total;
  } catch (error) {
    console.error("Failed to fetch Article data:", error);
    ElMessage.error("获取数据失败");
  }
}

// 1. “新增” 按钮
const addButton = async () => {
  drawerMode.value = "create";
  // 重置表单数据
  Object.assign(form, {
    id: 0,
    categoryName: "",
    title: "",
    content: " ",
    coverImg: "",
    role: userInfo.role, // 当前登录用户角色
  });
  try {
    await getCategory();
    formVisible.value = true;
  } catch (error) {
    console.log("Failed to fetch Category data:", error);
    ElMessage.error("获取分类信息失败");
  }
};

// 2. “编辑” 按钮 (适用于非管理员，且待审核/不通过)
const editButton = async (row: ArticleInfo) => {
  drawerMode.value = "edit";
  Object.assign(form, {
    ...row,
  });
  try {
    await getCategory();
    formVisible.value = true;
  } catch (error) {
    console.log("Failed to fetch Category data:", error);
    ElMessage.error("获取分类信息失败");
  }
};

// 3. “查看” 按钮 (管理员写的 OR 学生已完成)
const viewButton = async (row: ArticleInfo) => {
  drawerMode.value = "view";
  Object.assign(form, {
    ...row,
  });
  try {
    await getCategory();
    formVisible.value = true;
  } catch (error) {
    console.log("Failed to fetch Category data:", error);
    ElMessage.error("获取分类信息失败");
  }
};

// 4. “删除” 按钮
const deleteButton = (row: ArticleInfo) => {
  ElMessageBox.confirm("确定删除该文章信息吗？", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    handleDeleteArticle(row.id!);
  });
};

async function handleDeleteArticle(articleId: number) {
  try {
    await deleteArticle(articleId);
    await handleCurrentChange();
    ElMessage.success("删除成功");
  } catch (error) {
    console.error("Failed to delete Article data:", error);
    ElMessage.error("删除失败");
  }
}

// 提交表单（新增 or 编辑）
const submitForm = async () => {
  // 新增模式
  if (drawerMode.value === "create") {
    try {
      await insertArticle(form);
      await handleCurrentChange();
      formVisible.value = false;
      ElMessage.success("添加成功");
    } catch (error) {
      console.error("Failed to insert Article data:", error);
      ElMessage.error("添加失败");
    }
  }
  // 编辑模式
  else if (drawerMode.value === "edit") {
    form.status = 0;
    try {
      await updateArticle(form);
      await handleCurrentChange();
      formVisible.value = false;
      ElMessage.success("编辑成功");
    } catch (error) {
      console.error("Failed to update Article data:", error);
      ElMessage.error("编辑失败");
    }
  }
};

// 关闭/取消
const closeDrawer = () => {
  formVisible.value = false;
};

onMounted(async () => {
  try {
    await handleCurrentChange();
    loading.value = false;
  } catch (error) {
    console.error("Failed to fetch Article data when created:", error);
    ElMessage.error("获取数据失败");
  }
});
</script>

<template>
  <!-- 统一的 新增/编辑/查看 数据对话框 -->
  <el-drawer v-model="formVisible" size="30%">
    <template #header>
      <h1>
        {{
          drawerMode === "create"
            ? "新增公告"
            : drawerMode === "edit"
              ? "编辑公告"
              : "查看公告"
        }}
      </h1>
    </template>

    <el-form :model="form" label-width="100px" class="space-y-4">
      <!-- 标题 -->
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="form.title"
          :disabled="drawerMode === 'view'"
          placeholder="请输入文章标题"
          class="w-full"
        />
      </el-form-item>

      <!-- 分类 -->
      <el-form-item label="分类" prop="categoryName">
        <el-select
          v-model="form.categoryName"
          :disabled="drawerMode === 'view'"
          placeholder="请选择分类"
          class="w-full"
        >
          <el-option
            v-for="category in categoryList"
            :key="category.categoryId"
            :label="category.categoryName"
            :value="category.categoryName"
          />
        </el-select>
      </el-form-item>

      <!-- 文章封面 -->
      <el-form-item label="文章封面" prop="coverImg">
        <el-upload
          v-model="form.coverImg"
          :action="avatarUploadConfig.action"
          :show-file-list="avatarUploadConfig.showFileList"
          :on-success="avatarUploadConfig.onSuccess"
          :on-error="avatarUploadConfig.onError"
          :headers="avatarUploadConfig.headers"
          :disabled="drawerMode === 'view'"
        >
          <img
            v-if="form.coverImg"
            :src="form.coverImg"
            alt="文章封面"
          />
          <div v-else class="avatar-uploader-icon">
            <Plus />
          </div>
        </el-upload>
      </el-form-item>

      <!-- 文章内容 -->
      <el-form-item label="文章内容" prop="content">
        <QuillEditor
          ref="quillEditorRef"
          v-model:content="form.content"
          theme="snow"
          content-type="html"
          class="w-full"
          :readOnly="drawerMode === 'view'"
        />
      </el-form-item>
    </el-form>

    <!-- drawer底部按钮 -->
    <template #footer>
      <div style="flex: auto;">
        <!-- 当处于查看模式时，只显示“关闭”按钮 -->
        <template v-if="drawerMode === 'view'">
          <el-button @click="closeDrawer">关闭</el-button>
        </template>
        <!-- 新增或编辑模式：显示“取消”和“提交”按钮 -->
        <template v-else>
          <el-button @click="closeDrawer">取消</el-button>
          <el-button type="primary" @click="submitForm">
            {{ drawerMode === "create" ? "提交" : "保存" }}
          </el-button>
        </template>
      </div>
    </template>
  </el-drawer>

  <!-- 主页面 -->
  <div class="rounded-lg p-5" v-loading="loading">
    <!-- 顶部查询表单 -->
    <div style="width: 100%">
      <el-form
        :inline="true"
        :model="queryForm"
        class="mb-4 flex items-center justify-between rounded-lg bg-white font-bold"
      >
        <div class="flex space-x-4">
          <el-form-item class="query-Form-item" label="条件查询">
            <el-input
              v-model="queryForm.title"
              clearable
              placeholder="按标题查询"
              @keyup.enter="handleCurrentChange"
            />
          </el-form-item>
          <el-form-item class="query-Form-item">
            <el-input
              v-model="queryForm.categoryName"
              clearable
              placeholder="按分类名称查询"
              @keyup.enter="handleCurrentChange"
            />
          </el-form-item>
          <el-form-item class="query-Form-item" style="width: 198px">
            <el-select v-model="queryForm.status" placeholder="按文章状态查询">
              <el-option :value="0" label="待审核" />
              <el-option :value="1" label="已完成" />
              <el-option :value="2" label="不通过" />
            </el-select>
          </el-form-item>
        </div>
        <div class="mr-4 flex space-x-4">
          <el-form-item class="query-Form-item">
            <el-button type="primary" @click="handleCurrentChange">
              查询
            </el-button>
          </el-form-item>
          <el-form-item class="query-Form-item">
            <el-button type="primary" @click="addButton">新增</el-button>
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

        <el-table-column align="center" label="标题" prop="title" />
        <el-table-column align="center" label="分类" prop="categoryName" />
        <el-table-column align="center" label="作者" prop="name" />
        <el-table-column align="center" label="最后修改时间" prop="updateTime" />

        <!-- 状态 -->
        <el-table-column align="center" label="状态" prop="status">
          <template #default="{ row }">
            <el-tag v-if="row.status === 0" type="danger">待审核</el-tag>
            <el-tag v-else-if="row.status === 1" type="success">已完成</el-tag>
            <el-tag v-else type="warning">不通过</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" fixed="right" label="操作">
          <template #default="{ row }">
            <!-- 1) 文章作者不是管理员 && (状态=待审核(0) || 不通过(2)) => 编辑 + 删除 -->
            <template
              v-if="row.role !== 0 && (row.status === 0 || row.status === 2)"
            >
              <el-button type="primary" @click="editButton(row)">编辑</el-button>
              <el-button type="danger" @click="deleteButton(row)">删除</el-button>
            </template>

            <!-- 2) 文章作者是管理员 => 查看 -->
            <template v-else-if="row.role === 0">
              <el-button type="info" @click="viewButton(row)">查看</el-button>
            </template>

            <!-- 3) 文章作者不是管理员 && 状态=已完成(1) => 查看 -->
            <template v-else-if="row.role !== 0 && row.status === 1">
              <el-button type="info" @click="viewButton(row)">查看</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
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

.avatar-uploader-icon {
  font-size: 10px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
}
</style>
