import request from '@/utils/request.js'

// 分页查询信息
export const pageQueryStudentInfo = (page, pageSize, queryForm) => {
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
export const insertStudentInfo = (addForm) => {
  console.log('addForm', addForm)
  return request.post('/api/admin/student', addForm)
}

// 修改学生信息
export const editStudentInfo = (editForm) => {
  return request.put(`/api/admin/student`, editForm)
}

// 删除学生信息
export const deleteStudentInfo = (userId) => {
  return request.delete(`/api/admin/student/${userId}`);
};


