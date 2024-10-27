import request from "@/utils/request.ts";
import { FormModel } from "@/types/loginTypes.ts";

// 用户注册
export const userRegisterService = (registerData: FormModel) => {
  return request.post("/api/register", registerData);
};

// 用户登录
export const userLoginService = (username: string, password: string) =>
  request.post("/api/login", {
    username,
    password,
  });

// 修改密码
export const changePassword = (changePasswordForm: {
  oldPassword: string;
  password: string;
  repassword: string;
}) => {
  return request.put("/api/changePassword", changePasswordForm);
};
