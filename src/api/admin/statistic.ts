import request from "@/utils/request.ts";

// 查询书本阅读量
export const getClassBorrowVolume = (start: string, end: string) => {
  return request.get("/admin/statistic/classBorrow", {
    params: {
      start,
      end,
    },
  });
};

// 查询进馆人流量
export const getTrafficVolume = (start: string, end: string) => {
  return request.get("/admin/statistic/traffic", {
    params: {
      start,
      end,
    },
  });
};

// 查询阅读积分Top10
export const getCreditScoreTop10 = () => {
  return request.get("/admin/statistic/top10");
};

// 查询每类图书的阅读量
export const getReadVolumeOfEachType = () => {
  return request.get("/admin/statistic/bookCategory");
};
