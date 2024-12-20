// 注册与登录相关类型
export interface FormModel {
  name: string;
  sex: number | null;
  username: string;
  password: string;
  repassword?: string;
  checkCode: string;
  isOpenAdmin?: boolean;
  className: string;
}

export interface userInfo {
  name: string;
  sex: number;
  username: string;
  avatar: string;
  phone: string;
  email: string;
  role: number;
  userId: number;
}

export interface userInfoForm{
  name: string,
  sex: number,
  username: string,
  avatar: string,
  phone: string,
  email: string,
}
