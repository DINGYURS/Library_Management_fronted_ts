// 学生信息表单类型
export type MyReservationForm = {
  reservationId: number;
  floor: number;
  seatNumber: string;
  reservationTime: string;
  startTime: string;
  endTime: string;
  status: number;
};

export type StatusChangeForm = {
  reservationId: number;
  status: number;
}
