import { default as request } from "@/utils/request.ts";
import { QueryForm, StudentForm } from "@/types/studentTypes.ts"; // 引入类型

// 分页查询信息
export const pageQueryStudentInfo = (
  page: number,
  pageSize: number,
  queryForm: QueryForm,
) => {
  return request.get("/admin/student/page", {
    params: {
      page,
      pageSize,
      name: queryForm.name,
      username: queryForm.username,
    },
  });
};

// 新增学生信息
export const insertStudentInfo = (addForm: StudentForm) => {
  console.log("addForm", addForm);
  return request.post("/admin/student", addForm);
};

// 修改学生信息
export const editStudentInfo = (editForm: StudentForm) => {
  return request.put("/admin/student", editForm);
};

// 删除学生信息
export const deleteStudentInfo = (userId: number) => {
  return request.delete(`/admin/student/${userId}`);
};
