<script lang="ts" setup>
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useUserStore } from "@/stores/user.ts";

const userId = useUserStore().userInfo.userId;
let socket: WebSocket | null = null;

// 定义输入的消息和消息列表
const messageInput = ref("");
const messages = reactive<Array<{ sender: number; content: string }>>([]);

// WebSocket 相关功能
const connectWebSocket = () => {
  socket = new WebSocket(`ws://localhost:9000/chat/${userId}`);

  socket.onopen = () => {
    console.log("WebSocket 连接成功");
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);

      // 假设后端发送的消息格式为 { sender: string, content: string }
      if (message.sender && message.content) {
        messages.push({ sender: message.sender, content: message.content });
        console.log("消息列表:", messages);
      }
    } catch (e) {
      console.error("消息解析失败:", e);
    }
  };

  socket.onclose = () => {
    console.log("WebSocket 已关闭");
  };

  socket.onerror = (error) => {
    console.log("WebSocket 发生错误:", error);
  };
};

// 发送消息功能
const sendMessage = () => {
  if (
    socket &&
    socket.readyState === WebSocket.OPEN &&
    messageInput.value.trim()
  ) {
    const messageData = { sender: userId, content: messageInput.value };
    socket.send(JSON.stringify(messageData)); // 通过 WebSocket 发送消息
    messageInput.value = ""; // 发送后清空输入框
  }
};

// 页面加载时建立 WebSocket 连接
onMounted(() => {
  connectWebSocket();
});

// 页面卸载时关闭 WebSocket 连接
onBeforeUnmount(() => {
  if (socket) {
    socket.close();
  }
});
</script>

<template>
  <div class="flex h-full w-full flex-row rounded-lg bg-white">
    <!--		好友列表-->
    <div class="h-full basis-1/5 rounded-l-lg bg-blue-500 p-5">
      <h2 class="text-2xl font-bold">好友列表</h2>
    </div>

    <!--		聊天区-->
    <div class="grid h-full basis-4/5 grid-rows-12">
      <!--      当前聊天对象-->
      <div class="row-start-1 row-end-2">
        <h2 class="py-5 text-2xl font-bold">当前聊天对象：{{ userId }}</h2>
      </div>

      <!-- 消息展示区 -->
      <div
        class="row-start-2 row-end-11 flex flex-col space-y-3 overflow-auto bg-yellow-500"
      >
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="flex items-center space-x-3"
        >
          <span
            :class="{
              'text-blue-600': msg.sender === userId,
              'font-bold': msg.sender !== userId,
            }"
          >
            {{ msg.sender === userId ? "我" : msg.sender }}
          </span>
          <span>{{ msg.content }}</span>
        </div>
      </div>

      <!-- 消息输入区 -->
      <div class="row-start-11 row-end-13 flex items-center space-x-3">
        <label for="message">消息：</label>
        <input
          id="message"
          v-model="messageInput"
          class="w-1/2 rounded-lg border border-gray-300 p-1"
          placeholder="输入消息..."
          type="text"
          @keyup.enter="sendMessage"
        />
        <button
          class="rounded-lg bg-blue-500 px-3 py-1 text-white"
          @click="sendMessage"
        >
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 样式可以根据需要调整 */
</style>
