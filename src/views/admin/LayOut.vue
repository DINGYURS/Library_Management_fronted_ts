<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import router from "@/router/index.ts";
import {
  CollectionTag,
  DataLine,
  Document,
  Notebook,
  Reading,
  School,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { changePassword } from "@/api/user.ts";
import { useUserStore } from "@/stores/user.ts";

const { setToken } = useUserStore();

const selectedMenuIndex = ref<string>("/admin/bookDisplay");

const changePasswordFormVisible = ref<boolean>(false);

// 表单标签位置
const labelPosition = ref<"left" | "right" | "top">("left");

// 处理菜单选择
const handleSelect = (index: string) => {
  router.push(index);
  selectedMenuIndex.value = index;
};

// 修改密码表单模型
const changePasswordForm = reactive<{
  oldPassword: string;
  password: string;
  repassword: string;
}>({
  oldPassword: "",
  password: "",
  repassword: "",
});

// 确认修改密码
async function submitChangePassword() {
  try {
    await changePassword(changePasswordForm);
    changePasswordFormVisible.value = false;
    ElMessage.success("修改成功，请重新登陆");
    setToken("");
    await router.push("/login");
  } catch (error) {
    ElMessage.error("修改密码失败");
    console.error("Failed to change password:", error);
  }
}

// 取消修改密码
const cancelChangePassword = () => {
  changePasswordFormVisible.value = false;
  Object.keys(changePasswordForm).forEach((key) => {
    (changePasswordForm as any)[key] = "";
  });
};

// “修改密码”按钮
const changePasswordButton = () => {
  Object.keys(changePasswordForm).forEach((key) => {
    (changePasswordForm as any)[key] = "";
  });
  changePasswordFormVisible.value = true;
};

// 登出
const logOut = () => {
  setToken("");
  router.push("/login");
};

// 页面加载时导航到当前选中菜单
onMounted(() => {
  router.push(selectedMenuIndex.value);
});
</script>
<template>
  <el-dialog v-model="changePasswordFormVisible" title="修改密码" width="500px">
    <el-form
      :label-position="labelPosition"
      :model="changePasswordForm"
      label-width="82px"
      show-message
      size="large"
      status-icon
      style="max-width: 460px; font-weight: bold"
    >
      <el-form-item label="原密码：" prop="oldPassword">
        <el-input
          v-model="changePasswordForm.oldPassword"
          placeholder="请输入原密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="password">
        <el-input
          v-model="changePasswordForm.password"
          placeholder="请输入新密码"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="repassword">
        <el-input
          v-model="changePasswordForm.repassword"
          placeholder="请再次输入密码"
          type="password"
          @keyup.enter="submitChangePassword()"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelChangePassword">取消</el-button>
        <el-button type="primary" @click="submitChangePassword">
          提交
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-container class="el-container">
    <el-header
      class="... m-0 flex items-center bg-gradient-to-r from-slate-100 to-cyan-200 p-0"
    >
      <div
        class="pl-4 text-left font-serif text-xl font-semibold text-gray-800"
      >
        书籍是人类进步的阶梯！
      </div>
      <el-dropdown class="ml-auto mr-4" placement="bottom">
        <el-avatar
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="changePasswordButton"
              >修改密码
            </el-dropdown-item>
            <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>
    <el-container>
      <el-aside class="el-aside">
        <el-menu
          background-color="#e0e5df"
          class="bw-0"
          default-active="/admin/bookDisplay"
          @select="handleSelect"
        >
          <el-menu-item index="/admin/bookDisplay">
            <el-icon>
              <DataLine />
            </el-icon>
            <span>数据大屏</span>
          </el-menu-item>
          <el-menu-item index="/admin/class">
            <el-icon>
              <School />
            </el-icon>
            <span>班级管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/book">
            <el-icon>
              <Reading />
            </el-icon>
            <span>图书信息</span>
          </el-menu-item>
          <el-sub-menu index="/admin/borrow">
            <template #title>
              <el-icon>
                <Notebook />
              </el-icon>
              <span>借阅情况</span>
            </template>
            <el-menu-item index="/admin/borrowDetail">
              <el-icon>
                <CollectionTag />
              </el-icon>
              借阅详情
            </el-menu-item>
            <el-menu-item index="/admin/borrowStatistic">
              <el-icon>
                <Document />
              </el-icon>
              借阅量统计
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main class="el-main">
        <routerView></routerView>
      </el-main>
    </el-container>
  </el-container>
</template>
<style scoped>
.el-container {
  padding: 0;
  margin: 0;
  height: 100vh;
}

.el-main {
  padding: 0;
  background-color: rgb(240, 242, 245);
}

.el-aside {
  width: 200px;
  text-align: center;
  background-color: #e0e5df;
}
</style>
