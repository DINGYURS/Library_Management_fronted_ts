<script lang="ts" setup>
import {
  Cellphone,
  ChatLineRound,
  Lock,
  Male,
  Tickets,
  User,
} from "@element-plus/icons-vue";
import { getCaptcha, userLoginService, userRegisterService } from "@/api/user.ts";
import { onMounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user.ts";
import { useRouter } from "vue-router";
import { FormModel } from "@/types/loginTypes.ts";

const isRegister = ref(false);
const form = ref();
const userStore = useUserStore();
const router = useRouter();
const captchaSrc = ref<string>("");
const captchaId = ref<string>("");
const captchaCode = ref<string>("");
const loading = ref(true)

// 定义表单模型
const formModel = ref<FormModel>({
  name: "",
  sex: null,
  username: "",
  phone: "",
  email: "",
  password: "",
  checkCode: "",
  isOpenAdmin: false,
  className: "",
});

// 表单验证规则
const rules = ref({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      pattern: /^\S{6,15}$/,
      message: "只能是非空字符，长度在 6 到 15 个字符",
      trigger: "blur",
    },
  ],
});

// 注册函数
const register = async () => {
  try {
    // 验证表单
    await form.value?.validate();

    // 提交注册数据
    const registerData = {
      name: formModel.value.name,
      sex: formModel.value.sex!,
      username: formModel.value.username,
      phone: formModel.value.phone,
      email: formModel.value.email,
      password: formModel.value.password,
      checkCode: formModel.value.checkCode,
      className: formModel.value.className,
    };
    await userRegisterService(registerData);
    ElMessage.success("注册成功");
    isRegister.value = false;
  } catch (error) {
    ElMessage.error("注册失败");
  }
};

// 登录函数
const login = async () => {
  try {
    await form.value?.validate();

    const res = await userLoginService(
      formModel.value.username,
      formModel.value.password,
      captchaCode.value,
      captchaId.value,
    );

    userStore.setToken(res.data.token);
    userStore.setUserInfo(res.data);

    ElMessage.success("登录成功");

    if (res.data.role === 0) {
      await router.push("/admin/bookDisplay");
    } else if (res.data.role === 1) {
      await router.push("/student/seatReservation");
    }
  } catch (error) {
    await refreshCaptcha();
    console.error("登录失败");
  }
};

// 刷新验证码
const refreshCaptcha = async () => {
  try {
    const response = await getCaptcha();
    captchaSrc.value = response.data.captchaSrc;
    captchaId.value = response.data.captchaId;
  } catch (error) {
    console.log(' Refresh Captcha Error', error);
  }
};

// 监视 isRegister 变化，重置表单
watch(isRegister, () => {
  formModel.value = {
    name: "",
    sex: null,
    username: "",
    phone: "",
    email: "",
    password: "",
    checkCode: "",
    className: "",
  };
});

onMounted(() => {
  refreshCaptcha();
  loading.value = false;
});
</script>

<template>
  <el-row class="login-page">
    <el-col :span="6" class="form">
      <h1 class="font-sans text-4xl font-black">图书管理系统</h1>
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
          <span class="font-sans text-lg font-normal">注册</span>
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
            <el-option label="男" value="1" />
            <el-option label="女" value="0" />
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
        <el-form-item prop="phone">
          <el-input
            v-model="formModel.phone"
            :prefix-icon="Cellphone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.email"
            :prefix-icon="ChatLineRound"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否为管理员" prop="isOpenAdmin">
          <el-switch v-model="formModel.isOpenAdmin" />
        </el-form-item>
        <el-form-item v-show="formModel.isOpenAdmin" prop="checkCode">
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
            class="button-register bg-blue-500 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
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
          <span class="font-sans text-lg font-normal">登录</span>
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
        <el-form-item prop="captchaCode">
          <div class="flex items-center space-x-2">
            <img
              :src="captchaSrc"
              alt="Captcha"
              class="cursor-pointer"
              @click="refreshCaptcha"
              v-loading="loading"
            />
            <el-input
              v-model="captchaCode"
              :prefix-icon="Lock"
              placeholder="请输入验证码"
              @keyup.enter="login"
            ></el-input>

          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            auto-insert-space
            class="button-login bg-blue-500 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
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
<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-image: url("@/assets/CX_20221112_090313.jpg");
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
