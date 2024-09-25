import request from '@/utils/request.js'
import { useUserStore } from '@/stores/user.js'

// 分页查询信息
export const pageQueryStudentInfo = (page, pageSize, queryForm) => {
  const userStore = useUserStore()
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
  const userStore = useUserStore()
  console.log('addForm', addForm)
  return request.post('/api/admin/student', addForm)
}

// 修改学生信息
export const editStudentInfo = (editForm) => {
  const userStore = useUserStore()
  return request.put(`/api/admin/student`, editForm)
}

// 删除学生信息
export const deleteStudentInfo = (userId) => {
  const userStore = useUserStore();
  return request.delete(`/api/admin/student/${userId}`);
};


