import request from "@/utils/request.ts";

// 借书
export const bookBorrow = (copyId: number) => {
  return request.get("/student/bookBorrow", {
    params: {
      copyId,
    },
  });
};
// 还书
export const bookReturn = (recordId: number) => {
  return request.get("/student/bookReturn", {
    params: {
      recordId,
    },
  });
};
