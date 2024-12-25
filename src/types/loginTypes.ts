// 注册与登录相关类型
export interface FormModel {
  name: string;
  sex: number | null;
  username: string;
  phone: string;
  email: string;
  password: string;
  checkCode: string;
  isOpenAdmin?: boolean;
  className: string;
}

export interface UserInfo {
  name: string;
  sex: number;
  username: string;
  avatar: string;
  phone: string;
  email: string;
  role: number;
  userId: number;
}

export interface UserInfoForm{
  name: string,
  sex: number,
  username: string,
  avatar: string,
  phone: string,
  email: string,
}
