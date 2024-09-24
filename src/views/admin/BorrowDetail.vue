<template>
  <div class="rounded-lg p-5">
    <!-- 顶部表单 -->
    <div style="width: 100%">
      <el-form :inline="true" :model="queryForm" class="font-bold bg-white rounded-lg mb-4 flex justify-between items-center">
        <div class="flex space-x-4">
          <el-form-item class="query-Form-item" label="条件查询">
            <el-input
              v-model="queryForm.name"
              clearable
              placeholder="按姓名查询"
              @keyup.enter="handleCurrentChange"
            />
          </el-form-item>
          <el-form-item class="query-Form-item">
            <el-input
              v-model="queryForm.username"
              clearable
              placeholder="按学号查询"
              @keyup.enter="handleCurrentChange"
            />
          </el-form-item>
          <el-form-item class="query-Form-item">
            <el-input
              v-model="queryForm.bookName"
              clearable
              placeholder="按书名查询"
              @keyup.enter="handleCurrentChange"
            />
          </el-form-item>
        </div>
        <!-- 右侧按钮组 -->
        <div class="flex space-x-4 mr-4">
          <el-form-item class="query-Form-item">
            <el-button type="primary" @click="handleCurrentChange">查询</el-button>
          </el-form-item>
          <el-form-item class="query-Form-item">
            <el-button type="danger" @click="batchDelete">批量删除</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 表单数据展示 -->
    <div style="width: 100%">
      <el-table
        :data="tableData"
        border
        class="el-table"
        height="auto"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />
        <el-table-column align="center" label="序号">
          <template #default="{ $index }">
            {{ adjustedIndex($index) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="姓名" prop="name"/>
        <el-table-column align="center" label="学号" prop="username"/>
        <el-table-column align="center" label="书名" prop="bookName"/>
        <el-table-column align="center" label="借出时间" prop="borrowTime"/>
        <el-table-column align="center" label="归还时间" prop="returnTime">
          <template #default="{ row }">
            {{ row.returnTime !== null ? row.returnTime : '尚未归还' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否已归还" prop="isReturn">
          <template #default="{ row }">
            <el-tag v-if="row.isReturn === 0" type="success">是</el-tag>
            <el-tag v-else type="danger">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="信用变化" prop="creditChange">
          <template #default="{ row }">
            <el-tag v-if="row.creditChange > 0" type="success">{{row.creditChange}}</el-tag>
            <el-tag v-else type="danger">{{row.creditChange}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作">
          <template #default="{ row }">
            <el-button type="danger" @click="deleteButton(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :background="background"
      :disabled="disabled"
      :hide-on-single-page="hideOnSinglePage"
      :size="size"
      :total="total"
      layout="total, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
    />
  </div>

</template>
<script setup>
import {ref, reactive, computed, onMounted} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {deleteBorrowDetail, pageQueryBorrowDetail} from "@/api/admin/borrowDetail.js";

const size = ref('default')
const background = ref(true)
const disabled = ref(false)
const hideOnSinglePage = ref(true)
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const ids = ref([])

const queryForm = reactive({
  name: '',
  username: '',
  bookName: ''
})

// 计算表格序号
const adjustedIndex = computed(() => {
  return (index) => {
    return (currentPage.value - 1) * pageSize.value + index + 1
  }
})

const handleSelectionChange = (selectedRows) => {
  // 使用 map 方法从每个选中的行中提取 id 属性
  ids.value = selectedRows.map((row) => row.recordId)
  console.log('Selected IDs:', ids.value)
  // 这里 ids 将是一个包含所有选中行 id 的数组
}

// “删除”按钮
const deleteButton = (row) => {
  ElMessageBox.confirm('确定删除该标签信息吗？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ids.value.push(row.recordId)
    handleDeleteBorrowDetail()
  })
}

// “批量删除”按钮
const batchDelete = () => {
  ElMessageBox.confirm('确定删除这些标签信息吗？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    handleDeleteBorrowDetail()
  })
}

// 删除借阅记录
async function handleDeleteBorrowDetail() {
  try {
    await deleteBorrowDetail(ids.value)
    await handleCurrentChange(currentPage.value)
    ElMessage.success('删除成功')
  } catch (error) {
    console.error('Failed to delete Label data:', error)
  }
}

// 分页查询数据
async function handleCurrentChange() {
  try {
    const response = await pageQueryBorrowDetail(
      currentPage.value,
      pageSize.value,
      queryForm
    )
    tableData.value = response.data.data.records
    total.value = response.data.data.total
  } catch (error) {
    console.error('Failed to fetch Label data:', error)
  }
}

// 页面加载时获取数据
onMounted(async () => {
  try {
    await handleCurrentChange()
  } catch (error) {
    console.error('Failed to fetch Label data when created:', error)
  }
})
</script>
<style scoped>
.query-Form-item {
  @apply mx-1.5 my-2.5
}

.el-table {
  @apply bg-white rounded-lg
}
</style>
