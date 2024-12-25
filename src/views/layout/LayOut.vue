<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import router from "@/router/index.ts";
import {
  CollectionTag,
  DataBoard,
  DataLine,
  Document,
  EditPen,
  Files,
  Notebook,
  Reading,
  School,
  View,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { changePassword, changeUserInfo } from "@/api/user.ts";
import { useUserStore } from "@/stores/user.ts";

const { setToken, token, userInfo } = useUserStore();
const selectedMenuIndex = ref<string>("/admin/bookDisplay");
const changePasswordFormVisible = ref<boolean>(false);
const userInfoDialogVisible = ref<boolean>(false);
const isAdmin = ref<boolean>(false);

// 表单标签位置
const labelPosition = ref<"left" | "right" | "top">("left");

// 头像上传配置
const avatarUploadConfig = {
  action: "/api/common/upload",
  showFileList: false,
  headers: { token: token },
  onSuccess(response: any) {
    userInfoForm.value.avatar = response.data;
    ElMessage.success("头像更新成功");
  },
  onError() {
    ElMessage.error("头像更新失败");
  },
};

// 用户个人信息表单模型
const userInfoForm = ref<{
  name: string;
  sex: number;
  username: string;
  avatar: string;
  phone: string;
  email: string;
}>({
  name: "",
  sex: 0,
  username: "",
  avatar: "",
  phone: "",
  email: "",
});

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

// 处理菜单选择
const handleSelect = (index: string) => {
  router.push(index);
  selectedMenuIndex.value = index;
};

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

// 修改个人信息按钮
const changeUserInfoButton = () => {
  userInfoForm.value = {
    name: userInfo.name,
    sex: userInfo.sex,
    username: userInfo.username,
    avatar: userInfo.avatar,
    phone: userInfo.phone,
    email: userInfo.email,
  };
  userInfoDialogVisible.value = true;
};

// 提交修改个人信息
async function submitUserInfo() {
  try {
    // 提交个人信息更新
    await changeUserInfo(userInfoForm.value);
    Object.assign(userInfo, {
      sex: userInfoForm.value.sex,
      username: userInfoForm.value.username,
      avatar: userInfoForm.value.avatar,
      phone: userInfoForm.value.phone,
      email: userInfoForm.value.email,
    });
    ElMessage.success("个人信息更新成功");
    userInfoDialogVisible.value = false;
  } catch (error) {
    ElMessage.error("更新个人信息失败");
    console.error("Failed to update personal info:", error);
  }
}

// 取消修改个人信息
const cancelPersonalInfo = () => {
  userInfoDialogVisible.value = false;
};

// 登出
const logOut = () => {
  setToken("");
  router.push("/login");
};

// 页面加载时导航到当前选中菜单
onMounted(() => {
  isAdmin.value = userInfo.role === 1;
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

  <el-dialog v-model="userInfoDialogVisible" title="个人信息" width="500px">
    <el-form :model="userInfoForm" label-width="100px" size="large">
      <el-form-item label="头像：" prop="avatar">
        <el-upload
          v-model="userInfoForm.avatar"
          :action="avatarUploadConfig.action"
          :show-file-list="avatarUploadConfig.showFileList"
          :on-success="avatarUploadConfig.onSuccess"
          :on-error="avatarUploadConfig.onError"
          :headers="avatarUploadConfig.headers"
        >
          <el-avatar :src="userInfoForm.avatar" size="large"></el-avatar>
        </el-upload>
      </el-form-item>
      <el-form-item label="姓名：" prop="name">
        <el-input
          v-model="userInfoForm.name"
          placeholder="请输入姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="性别：" prop="sex">
        <el-select v-model="userInfoForm.sex" placeholder="请选择性别">
          <el-option :value="1" label="男" />
          <el-option :value="0" label="女" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户名：" prop="username">
        <el-input
          v-model="userInfoForm.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号：" prop="phone">
        <el-input
          v-model="userInfoForm.phone"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input
          v-model="userInfoForm.email"
          placeholder="请输入邮箱"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelPersonalInfo">取消</el-button>
        <el-button type="primary" @click="submitUserInfo">提交</el-button>
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
        <el-avatar :src="userInfo.avatar" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="changeUserInfoButton"
              >个人信息
            </el-dropdown-item>
            <el-dropdown-item @click="changePasswordButton"
              >修改密码
            </el-dropdown-item>
            <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>
    <el-container>
      <!--      学生侧边栏-->
      <el-aside v-if="isAdmin" class="el-aside">
        <el-menu
          background-color="#e0e5df"
          class="bw-0"
          default-active="/student/seatReservation"
          @select="handleSelect"
        >
          <el-menu-item index="/student/seatReservation">
            <el-icon>
              <School />
            </el-icon>
            <span>座位预约</span>
          </el-menu-item>
          <el-menu-item index="/student/myReservation">
            <el-icon>
              <View />
            </el-icon>
            <span>我的预约</span>
          </el-menu-item>
          <el-menu-item index="/student/bookBorrow">
            <el-icon>
              <Reading />
            </el-icon>
            <span>图书借阅</span>
          </el-menu-item>
          <el-menu-item index="/student/articleReview">
            <el-icon>
              <EditPen />
            </el-icon>
            <span>书评撰写</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!--      管理员侧边栏-->
      <el-aside v-else class="el-aside">
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
          <el-menu-item index="/admin/articleCategory">
            <el-icon>
              <Files />
            </el-icon>
            <span>书评类型</span>
          </el-menu-item>
          <el-menu-item index="/admin/noticeIssue">
            <el-icon>
              <DataBoard />
            </el-icon>
            <span>公告发布</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
        <el-main class="el-main bg-slate-100">
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
}

.el-aside {
  width: 200px;
  text-align: center;
  background-color: #e0e5df;
}
</style>
