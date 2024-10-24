import {default as request} from '@/utils/request.ts'

// 分页查询信息
export const pageQueryStudentInfo = (page:number, pageSize:number, queryForm:any) => {
  return request.get('/api/admin/student/page', {
    params: {
      page,
      pageSize,
      name: queryForm.name,
      username: queryForm.username
    }
  })
}

// 新增学生信息
export const insertStudentInfo = (addForm:object) => {
  console.log('addForm', addForm)
  return request.post('/api/admin/student', addForm)
}

// 修改学生信息
export const editStudentInfo = (editForm:object) => {
  return request.put(`/api/admin/student`, editForm)
}

// 删除学生信息
export const deleteStudentInfo = (userId: number) => {
  return request.delete(`/api/admin/student/${userId}`);
};


