import request from '@/utils/request.js'

// 用户注册
export const userRegisterService = (registerData) => {
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
  return request.put(`/api/changePassword`, changePasswordForm);
};
