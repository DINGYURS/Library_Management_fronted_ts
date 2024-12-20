import { default as request } from "@/utils/request.ts";
import { statusChangeForm } from "@/types/myReservation.ts";

// 分页查询自身座位预约信息
export const pageQueryMySeatReservation = (
  page: number,
  pageSize: number,
) => {
  return request.get("/api/student/myReservation/page", {
    params: {
      page,
      pageSize,
    }
  });
};

export const changeSeatStatus = (
  statusChangeForm: statusChangeForm
) => {
  return request.put("/api/student/myReservation", statusChangeForm);
};