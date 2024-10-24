import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const token = ref<string>('') // token 为 string 类型
    const role = ref<number | null>(null) // role 为 number 或 null 类型
    const userId = ref<number | null>(null) // userId 为 number 或 null 类型

    const setToken = (newToken: string) => {
      token.value = newToken
    }

    const setRole = (newRole: number | null) => {
      role.value = newRole
    }

    const setUserId = (newUserId: number | null) => {
      userId.value = newUserId
    }

    const resetUser = () => {
      token.value = ''
      role.value = null
      userId.value = null
    }

    return {
      token,
      role,
      userId,
      setToken,
      setRole,
      setUserId,
      resetUser
    }
  },
  {
    persist: true // 启用持久化
  }
)
