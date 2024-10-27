// 借阅信息的类型
export interface BorrowDetail {
  recordId: number;
  name: string;
  username: string;
  bookName: string;
  borrowTime: string;
  returnTime: string | null;
  isReturn: number;
  creditChange: number;
}

// 查询表单类型
export interface QueryForm {
  name: string;
  username: string;
  bookName: string;
}
