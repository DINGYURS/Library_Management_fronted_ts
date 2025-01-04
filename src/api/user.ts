import request from "@/utils/request.ts";
import { FormModel, UserInfoForm } from "@/types/loginTypes.ts";

// 用户注册
export const userRegisterService = (registerData: FormModel) => {
  return request.post("/register", registerData);
};

// 用户登录
export const userLoginService = (loginKey: string, password: string, captchaCode: string, captchaId: string) =>
  request.post("/login", {
    loginKey,
    password,
    captchaCode,
    captchaId,
  });

// 获取验证码
export const getCaptcha = () =>
  request.get("/captcha");


// 修改密码
export const changePassword = (changePasswordForm: {
  oldPassword: string;
  password: string;
  repassword: string;
}) => {
  return request.put("/changePassword", changePasswordForm);
};

// 修改用户信息
export const changeUserInfo = (userInfoForm: UserInfoForm) => {
  return request.put("/changeUserInfo", userInfoForm);
};

