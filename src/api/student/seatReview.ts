import { ReservationInfo } from "@/types/seatReservationTypes.ts";
import request from "@/utils/request.ts";

// 查询座位信息
export const getSeatInfo = (startTime: string, endTime: string) => {
  return request.get("/student/queryReservedSeats", {
    params: {
      startTime,
      endTime
    },
  });
};

// 新增预约座位信息
export const insertSeatReservation = (reservationForm: ReservationInfo) => {
  return request.post("/student/seatReservation", reservationForm);
};
