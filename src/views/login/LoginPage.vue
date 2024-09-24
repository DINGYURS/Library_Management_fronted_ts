<template>
  <el-row class="login-page">
    <el-col :span="6" class="form">
      <h1 class="font-sans font-black text-4xl">图书管理系统</h1>
      <!-- 注册表单 -->
      <el-form
        v-if="isRegister"
        ref="form"
        :model="formModel"
        :rules="rules"
        autocomplete="off"
        size="large"
      >
        <div class="mb-2">
          <span class="font-sans font-normal text-lg">注册</span>
        </div>
        <el-form-item prop="name">
          <el-input
            v-model="formModel.name"
            :prefix-icon="User"
            placeholder="请输入真实姓名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="username">
          <el-select
            v-model="formModel.sex"
            :prefix-icon="Male"
            placeholder="请选择性别"
          >
            <el-option label="男" value="1"/>
            <el-option label="女" value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="className">
          <el-input
            v-model="formModel.className"
            :prefix-icon="Tickets"
            placeholder="请输入所在班级"
          ></el-input>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            placeholder="请再次输入密码"
            type="password"
            @keyup.enter="register"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否为管理员" prop="isOpenAdmin">
          <el-switch v-model="formModel.isOpenAdmin"/>
        </el-form-item>
        <el-form-item prop="checkCode" v-show="formModel.isOpenAdmin">
          <el-input
            v-model="formModel.checkCode"
            :prefix-icon="Lock"
            placeholder="请输入管理员校验码"
            @keyup.enter="register"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            auto-insert-space
            class="button-register transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
            type="primary"
            @click="register"
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link
            :underline="false"
            style="color: black"
            type="info"
            @click="isRegister = false"
          >
            ← 登录
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登录表单 -->
      <el-form
        v-else
        ref="form"
        :model="formModel"
        :rules="rules"
        autocomplete="off"
        size="large"
      >
        <div class="mb-2">
          <span class="font-sans font-normal text-lg">登录</span>
        </div>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            name="password"
            placeholder="请输入密码"
            type="password"
            @keyup.enter="login"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            auto-insert-space
            class="button-login transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
            type="primary"
            @click="login"
          >
            登录
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link
            :underline="false"
            style="color: black"
            type="info"
            @click="isRegister = true"
          >
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import {User, Lock, Tickets, Male} from '@element-plus/icons-vue'
import {userRegisterService, userLoginService} from '@/api/user.js'
import {ref, watch} from 'vue'
import {ElMessage} from 'element-plus'
import {useUserStore} from '@/stores/user.js'
import {useRouter} from 'vue-router'

const isRegister = ref(false)
const form = ref()

// 整个表单用于提交的form数据对象
const formModel = ref({
  name: '',
  sex: '',
  username: '',
  password: '',
  repassword: '',
  checkCode: '',
  isOpenAdmin: false,
  className: ''
})

// 表单验证规则
const rules = ref({
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {
      pattern: /^\S{6,15}$/,
      message: '只能是非空字符，长度在 6 到 15 个字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {
      pattern: /^\S{6,15}$/,
      message: '只能是非空字符，长度在 6 到 15 个字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 注册成功之前进行效验
const register = async () => {
  // 验证表单
  await form.value.validate()

  // 创建一个包含所需字段的对象
  const registerData = {
    name: formModel.value.name,
    sex: formModel.value.sex,
    username: formModel.value.username,
    password: formModel.value.password,
    checkCode: formModel.value.checkCode,
    className: formModel.value.className
  }
  // 如果验证成功，执行注册服务
  const res = await userRegisterService(registerData)

  // 显示成功消息
  if (res.data.code === 1) {
    ElMessage.success('注册成功')

    // 跳转到登录页面
    isRegister.value = false
  } else {
    ElMessage.error(res.data.msg)
  }
}

const userStore = useUserStore()
const router = useRouter()

// 登录成功之前进行效验
const login = async () => {
  try {
    // 验证表单
    await form.value.validate()

    // 创建一个包含所需字段的对象
    const loginData = {
      username: formModel.value.username,
      password: formModel.value.password,
    }

    // 如果验证成功，执行登录服务
    const res = await userLoginService(loginData)

    if (res.data.code === 1) {
      // 假设后端返回的数据结构如下：
      // res.data.data = { token: '...', role: 'admin' }
      userStore.setToken(res.data.data.token)
      userStore.setRole(res.data.data.role) // 存储角色信息
      ElMessage.success('登录成功')
      console.log('role:', res.data.data.role)
      // 跳转到首页或根据角色跳转
      if (res.data.data.role === 0) {
        await router.push('/admin/display')
      } else if (res.data.data.role === 1) {
        await router.push('/student/bookBorrow')
      }
    } else {
      ElMessage.error(res.data.msg)
    }
  } catch (error) {
    console.error('Failed to login:', error)
    ElMessage.error('登录失败')
  }
}

//监视变化，当isRegister变化时，重置表单
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-image: url('@/assets/CX_20221112_082545.jpg');
  background-size: cover;
  background-position: center;
}

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.form {
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 300px;
}

.button-login,
.button-register {
  width: 100%;
  background-color: #4caf50;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.button-login:hover,
.button-register:hover {
  background-color: #45a049;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
