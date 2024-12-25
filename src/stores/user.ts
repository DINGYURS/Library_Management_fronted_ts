import { defineStore } from 'pinia'
import { ref } from 'vue'
import { UserInfo } from "@/types/loginTypes.ts";

export const useUserStore = defineStore('user', () => {
    const token = ref<string>('') // token 为 string 类型
    const userInfo = ref<UserInfo>({
      avatar: "",
      email: "",
      name: "",
      phone: "",
      role: 0,
      sex: 0,
      userId: 0,
      username: ""
    })

    const setToken = (newToken: string) => {
      token.value = newToken
    }
    const resetUser = () => {
      token.value = ''
      userInfo.value = {
        avatar: "",
        email: "",
        name: "",
        phone: "",
        role: 0,
        sex: 0,
        userId: 0,
        username: ""
      }
    }

    const setUserInfo = (newUserInfo: UserInfo) => {
      userInfo.value = newUserInfo
    }

    return {
      token,
      userInfo,
      setToken,
      resetUser,
      setUserInfo,
    }
  },
  {
    persist: true // 启用持久化
  }
)
