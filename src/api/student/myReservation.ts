import { default as request } from "@/utils/request.ts";
import { StatusChangeForm } from "@/types/myReservationTypes.ts";

// 分页查询自身座位预约信息
export const pageQueryMySeatReservation = (
  page: number,
  pageSize: number,
) => {
  return request.get("/student/myReservation/page", {
    params: {
      page,
      pageSize,
    }
  });
};

export const changeSeatStatus = (
  statusChangeForm: StatusChangeForm
) => {
  return request.put("/student/myReservation", statusChangeForm);
};