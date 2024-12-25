import axios from 'axios'
import { useUserStore } from "@/stores/user"
import { ElMessage } from 'element-plus'
import router from '../router/index.ts'

const instance = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    //  2. 携带token
    const useStore = useUserStore()
    if (useStore.token) {
      config.headers.token = useStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 添加响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 2xx 范围内的状态码都会触发该函数。
    //  3. 处理业务失败
    //  4. 摘取核心响应数据
    if (res.data.code === 1) {
      return res.data
    }

    // 处理业务失败
    ElMessage.error(res.data.msg || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    //  5. 处理401错误(权限不足？ token过期？)
    if (err.response && err.response.status === 401) {
      console.error('err.response', err.response)
      router.push('/login')
    }

    // 捕获错误，给出提示
    ElMessage.error(err.response.data.msg || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
