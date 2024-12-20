import { ReservationInfo } from "@/types/seatReservation";
import request from "@/utils/request.ts";

// 查询座位信息
export const getSeatInfo = (startTime: string, endTime: string) => {
  return request.get("/api/student/queryReservedSeats", {
    params: {
      startTime,
      endTime
    },
  });
};

// 新增预约座位信息
export const insertSeatReservation = (reservationForm: ReservationInfo) => {
  return request.post("/api/student/seatReservation", reservationForm);
};
