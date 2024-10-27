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
