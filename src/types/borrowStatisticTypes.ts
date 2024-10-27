// 书籍阅读量统计的类型
export interface BorrowStatistic {
  recordId: number;
  bookName: string;
  totalReadVolume: number;
  borrowTimes: number;
}

// 查询表单类型
export interface QueryForm {
  bookName: string;
}
