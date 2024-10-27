// 学生信息表单类型
export type StudentForm = {
  userId?: number | null;
  name: string;
  sex: number | null;
  username: string;
  readVolume?: number; // 可选的阅读量字段
  creditScore?: number; // 可选的信用分字段
};

// 查询表单类型
export type QueryForm = {
  name: string;
  username: string;
};
