import request from '@/utils/request.js'
import {useUserStore} from "@/stores/user.js";

// 用户注册
export const userRegisterService = (registerData) => {
  const token = '' // 从本地存储中获取token
  return request.post(
    '/api/register',
    registerData,
  )
}

// 用户登录
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', {
    username,
    password
  })

// 修改密码
export const changePassword = (changePasswordForm) => {
  const userStore = useUserStore();
  return request.put(`/api/changePassword`, changePasswordForm, {
    headers: {
      token: userStore.token,
    },
  });
};
