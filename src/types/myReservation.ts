// 学生信息表单类型
export type myReservationForm = {
  reservationId: number;
  floor: number;
  seatNumber: string;
  reservationTime: string;
  startTime: string;
  endTime: string;
  status: number;
};

export type statusChangeForm = {
  reservationId: number;
  status: number;
}
