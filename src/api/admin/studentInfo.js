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
    },
    headers: {
      token: userStore.token
    }
  })
}

// 新增学生信息
export const insertStudentInfo = (addForm) => {
  const userStore = useUserStore()
  console.log('addForm', addForm)
  return request.post('/api/admin/student', addForm, {
    headers: {
      token: userStore.token
    }
  })
}

// 修改学生信息
export const editStudentInfo = (editForm) => {
  const userStore = useUserStore()
  return request.put(`/api/admin/student`, editForm, {
    headers: {
      token: userStore.token
    }
  })
}

// 删除学生信息
export const deleteStudentInfo = (userId) => {
  const userStore = useUserStore();
  return request.delete(`/api/admin/student/${userId}`,{
    headers: {
      token: userStore.token,
    },
  });
};


