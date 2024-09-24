<template>
  <div class="rounded-lg p-5">
    <!-- 顶部表单 -->
    <div style="width: 100%">
      <el-form :inline="true" :model="queryForm" class="font-bold bg-white rounded-lg mb-4 flex justify-between items-center">
        <div class="flex space-x-4">
          <el-form-item class="query-Form-item" label="条件查询">
            <el-input
              v-model="queryForm.bookName"
              clearable
              placeholder="按书名查询"
              @keyup.enter="handleCurrentChange"
            />
          </el-form-item>
          <el-form-item class="query-Form-item">
            <el-input
              v-model="queryForm.author"
              clearable
              placeholder="按作者姓名查询"
              @keyup.enter="handleCurrentChange"
            />
          </el-form-item>
          <el-form-item class="query-Form-item">
            <el-input
              v-model="queryForm.category"
              clearable
              placeholder="按书籍类别查询"
              @keyup.enter="handleCurrentChange"
            />
          </el-form-item>
          <el-switch
            v-model="switchValue"
            class="query-Form-item"
            size="large"
            active-text="还书"
            inactive-text="借书"
          />
        </div>
        <!-- 右侧按钮组 -->
        <div class="flex space-x-4 mr-4">
          <el-form-item class="query-Form-item">
            <el-button type="primary" @click="handleCurrentChange">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 表单数据展示 -->
    <div style="width: 100%">
      <!--      借书表单-->
      <el-table
        :data="tableData"
        border
        class="el-table"
        height="auto"
        v-if="!switchValue"
      >
        <el-table-column align="center" label="序号">
          <template #default="{ $index }">
            {{ adjustedIndex($index) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="书名" prop="bookName"/>
        <el-table-column align="center" label="作者" prop="author"/>
        <el-table-column align="center" label="出版社" prop="press"/>
        <el-table-column align="center" label="分类" prop="category"/>
        <el-table-column align="center" label="价格/元" prop="price"/>
        <el-table-column align="center" label="状态" prop="sex">
          <template #default="{ row }">
            <el-tag v-if="row.status === 0" type="success">在馆</el-tag>
            <el-tag v-else type="danger">借出</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作">
          <template #default="{ row }">
            <el-button type="primary" @click="borrowButton(row)" :disabled="row.status === 1">借阅</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      还书表单-->
      <el-table
        :data="tableData"
        border
        class="el-table"
        height="auto"
        v-else
      >
        <el-table-column align="center" label="序号">
          <template #default="{ $index }">
            {{ adjustedIndex($index) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="书名" prop="bookName"/>
        <el-table-column align="center" label="作者" prop="author"/>
        <el-table-column align="center" label="分类" prop="category"/>
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
            <el-tag v-if="row.creditChange > 0" type="success">{{ row.creditChange }}</el-tag>
            <el-tag v-else type="danger">{{ row.creditChange }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作">
          <template #default="{ row }">
            <el-button
              type="danger"
              @click="returnButton(row)"
              :disabled="row.isReturn === 0"
            >
              还书
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
  </div>
</template>

<script setup>
import {ref, reactive, computed, onMounted} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {pageQueryBookInfo} from "@/api/admin/bookInfo.js";
import {bookBorrow, bookReturn} from "@/api/student/borrowAndReturn.js";
import {pageQueryBorrowDetailIndividual} from "@/api/student/borrowDetail.js";

const size = ref('default')
const background = ref(true)
const disabled = ref(false)
const hideOnSinglePage = ref(true)
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const switchValue = ref(false)

const queryForm = reactive({
  bookName: '',
  author: '',
  category: ''
})

// 计算表格序号
const adjustedIndex = computed(() => {
  return (index) => {
    return (currentPage.value - 1) * pageSize.value + index + 1
  }
})

// “借阅”按钮
const borrowButton = (row) => {
  ElMessageBox.confirm('确定借阅该书吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    handleBookBorrow(row.copyId)
  })
}

// “还书”按钮
const returnButton = (row) => {
  ElMessageBox.confirm('确定还书吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    handleBookReturn(row.recordId)
  })
}

async function handleBookBorrow(copyId) {
  try {
    await bookBorrow(copyId)
    await handleCurrentChange()
    ElMessage.success('借阅成功')
  } catch (error) {
    console.error('Failed to fetch Label data:', error)
  }
}

async function handleBookReturn(recordId) {
  try {
    await bookReturn(recordId)
    await handleCurrentChange()
    ElMessage.success('还书成功')
  } catch (error) {
    console.error('Failed to fetch Label data:', error)
  }
}

// 分页查询数据
async function handleCurrentChange() {
  try {
    // TODO:这个书本分页查询需要返回的结果跟admin下的接口一样，需要在后端写两个一模一样但是请求路径不一样的代码吗
    if (switchValue.value) {
      const response = await pageQueryBorrowDetailIndividual(
        currentPage.value,
        pageSize.value,
        queryForm
      )
      tableData.value = response.data.data.records
      total.value = response.data.data.total
    } else {
      const response = await pageQueryBookInfo(
        currentPage.value,
        pageSize.value,
        queryForm
      )
      tableData.value = response.data.data.records
      total.value = response.data.data.total
    }
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

watch(switchValue, async () => {
  tableData.value = []
  await handleCurrentChange()
})
</script>
<style scoped>
.query-Form-item {
  @apply mx-1.5 my-2.5
}
</style>
