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
      <el-form-item prop="oldPassword" label="原密码：">
        <el-input
          v-model="changePasswordForm.oldPassword"
          placeholder="请输入原密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password" label="新密码：">
        <el-input
          v-model="changePasswordForm.password"
          placeholder="请输入新密码"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item prop="repassword" label="确认密码：">
        <el-input
          v-model="changePasswordForm.repassword"
          placeholder="请再次输入密码"
          type="password"
          @keyup.enter="submitChangePasswordChangePassword()"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelChangePassword">取消</el-button>
        <el-button type="primary" @click="submitChangePasswordChangePassword"> 提交</el-button>
      </div>
    </template>
  </el-dialog>
  <el-container class="el-container">
    <el-header class="p-0 m-0 flex items-center bg-gradient-to-r from-slate-100 to-cyan-200 ...">
      <div class="pl-4 text-left font-serif text-xl text-gray-800 font-semibold">
        书籍是人类进步的阶梯！
      </div>
      <el-dropdown placement="bottom" class="ml-auto mr-4">
        <el-avatar
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="changePasswordButton">修改密码</el-dropdown-item>
            <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>
    <el-container>
      <el-main class="el-main">
        <routerView></routerView>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue'
import router from '@/router/index.js'
import {
  DataLine,
  Notebook,
  Document,
  CollectionTag,
  School,
  Reading
} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";
import {changePassword} from "@/api/user.js";
import {useUserStore} from "@/stores/user.js";

const userStore = useUserStore()
const changePasswordFormVisible = ref(false)
const labelPosition = ref('left')

const changePasswordForm = reactive({
  oldPassword: '',
  password: '',
  repassword: '',
})

// 确认修改密码
async function submitChangePasswordChangePassword() {
  try {
    await changePassword(changePasswordForm)
    changePasswordFormVisible.value = false
    await ElMessage.success('修改成功，请重新登陆')
    userStore.setToken('')
    await router.push('/login')
  } catch (error) {
    console.error('Failed to insert Label data:', error)
  }
}

// 取消修改密码
const cancelChangePassword = () => {
  changePasswordFormVisible.value = false
  Object.keys(changePasswordForm).forEach(key => {
    changePasswordForm[key] = '';
  });
}

// “修改密码”按钮
const changePasswordButton = () => {
  Object.keys(changePasswordForm).forEach(key => {
    changePasswordForm[key] = '';
  });
  changePasswordFormVisible.value = true
}

const logOut = () => {
  userStore.setToken('')
  router.push('/login')
}
</script>
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
