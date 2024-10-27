// 书本阅读量统计类型
export interface ClassBorrowVolume {
  dateList: string[];
  borrowVolume: number[];
}

// 阅读积分Top10的类型
export interface CreditScoreTop10 {
  nameList: string[];
  creditScoreList: number[];
}

// 每类图书的阅读量统计类型
export interface ReadVolumeOfEachType {
  categoryList: string[];
  readVolumeList: number[];
}
