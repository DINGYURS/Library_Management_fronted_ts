// 书籍信息表单类型
export interface BookForm {
  copyId?: number | null;
  bookName: string;
  author: string;
  press: string;
  category: string;
  totalWords: string | number;
  price: string | number;
  status?: number;
}

// 查询表单类型
export interface QueryForm {
  bookName: string;
  author: string;
  category: string;
}
