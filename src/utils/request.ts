import axios from "axios";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";
import router from "../router/index.ts";

const { setToken } = useUserStore();

const instance = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    //  2. 携带token
    const useStore = useUserStore();
    if (useStore.token) {
      config.headers.token = useStore.token;
    }
    return config;
  },
  (err) => Promise.reject(err),
);

// 添加响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 2xx 范围内的状态码都会触发该函数。

    // 如果是文件流（blob），直接返回整个响应
    if (res.config.responseType === "blob") {
      return res;
    }

    // 如果返回的数据包含 code 字段，按正常逻辑处理
    if (res.data.code === 1) {
      return res.data;
    }

    // 处理业务失败
    ElMessage.error(res.data.msg || "服务异常");
    return Promise.reject(res.data);
  },
  (err) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    if (err.response && err.response.status === 401) {
      console.error("err.response", err.response);
      setToken("");
      router.push("/login");
    }

    // 捕获错误，给出提示
    ElMessage.error(
      err.response.data || err.response.data.msg || "服务异常",
    );
    return Promise.reject(err);
  },
);

export default instance;
