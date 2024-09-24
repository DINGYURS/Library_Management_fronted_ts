import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'aim-user',
  () => {
    const token = ref('')
    const role = ref(null) // 新增角色信息的状态

    const setToken = (newToken) => {
      token.value = newToken
    }

    const setRole = (newRole) => {
      role.value = newRole // 新增设置角色的方法
    }

    const resetUser = () => {
      token.value = ''
      role.value = null // 重置角色信息
    }

    return {
      token,
      role, // 返回角色省份
      setToken,
      setRole, // 返回设置角色的方法
      resetUser // 返回重置用户的方法
    }
  },
  {
    persist: true // 启用持久化
  }
)
