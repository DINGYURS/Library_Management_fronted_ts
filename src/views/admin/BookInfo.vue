<template>
  <!-- 新增数据对话框 -->
  <el-dialog v-model="insertFormVisible" title="新增数据" width="500px">
    <el-form
      :label-position="labelPosition"
      :model="addForm"
      label-width="60px"
      show-message
      size="large"
      status-icon
      style="max-width: 460px; font-weight: bold"
    >
      <el-form-item label="书名" prop="bookName">
        <el-input
          placeholder="请输入书名" v-model="addForm.bookName"/>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input placeholder="请输入作者姓名" v-model="addForm.author"/>
      </el-form-item>
      <el-form-item label="出版社" prop="author">
        <el-input placeholder="请输入出版社名称" v-model="addForm.press"/>
      </el-form-item>
      <el-form-item label="类别" prop="author">
        <el-input placeholder="请输入书籍所属类别" v-model="addForm.category"/>
      </el-form-item>
      <el-form-item label="字数" prop="totalWords">
        <el-input placeholder="请输入书籍总字数" v-model="addForm.totalWords"/>
      </el-form-item>
      <el-form-item label="价格" prop="author">
        <el-input @keyup.enter="submitInsert" placeholder="请输入价格" v-model="addForm.price"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelInsert">取消</el-button>
        <el-button type="primary" @click="submitInsert"> 提交</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 编辑数据对话框 -->
  <el-dialog v-model="editFormVisible" title="编辑数据" width="500px">
    <el-form
      :label-position="labelPosition"
      :model="addForm"
      label-width="60px"
      show-message
      size="large"
      status-icon
      style="max-width: 460px; font-weight: bold"
    >
      <el-form-item label="书名" prop="bookName">
        <el-input
          placeholder="请输入书名" v-model="editForm.bookName"/>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input placeholder="请输入作者姓名" v-model="editForm.author"/>
      </el-form-item>
      <el-form-item label="出版社" prop="press">
        <el-input placeholder="请输入出版社名称" v-model="editForm.press"/>
      </el-form-item>
      <el-form-item label="类别" prop="category">
        <el-input placeholder="请输入书籍所属类别" v-model="editForm.category"/>
      </el-form-item>
      <el-form-item label="字数" prop="totalWords">
        <el-input placeholder="请输入书籍总字数" v-model="editForm.totalWords"/>
      </el-form-item>
      <el-form-item label="价格/元" prop="price">
        <el-input @keyup.enter="submitInsert" placeholder="请输入价格" v-model="editForm.price"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="primary" @click="submitEdit"> 提交</el-button>
      </div>
    </template>
  </el-dialog>
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
        </div>

        <!-- 右侧按钮组 -->
        <div class="flex space-x-4 mr-4">
          <el-form-item class="query-Form-item">
            <el-button type="primary" @click="handleCurrentChange">查询</el-button>
          </el-form-item>
          <el-form-item class="query-Form-item">
            <el-button type="primary" @click="addButton">新增</el-button>
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
            <el-button type="primary" @click="editButton(row)">编辑</el-button>
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
import {deleteBookInfo, editBookInfo, insertBookInfo, pageQueryBookInfo} from "@/api/admin/bookInfo.js";

const size = ref('default')
const background = ref(true)
const disabled = ref(false)
const hideOnSinglePage = ref(true)
const labelPosition = ref('left')
const insertFormVisible = ref(false)
const editFormVisible = ref(false)
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const ids = ref([])

const addForm = reactive({
  bookName: '',
  author: '',
  press: '',
  category: '',
  totalWords: '',
  price: ''
})

const editForm = reactive({
  copyId: '',
  bookName: '',
  author: '',
  press: '',
  category: '',
  totalWords: '',
  price: ''
})

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

// “新增”按钮
const addButton = () => {
  Object.keys(addForm).forEach(key => {
    addForm[key] = '';
  });
  insertFormVisible.value = true
}

// “编辑”按钮
const editButton = (row) => {
  editFormVisible.value = true
  handleEchoData(row)
}

const handleSelectionChange = (selectedRows) => {
  // 使用 map 方法从每个选中的行中提取 id 属性
  ids.value = selectedRows.map((row) => row.copyId)
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
    ids.value.push(row.copyId)
    handleDeleteBookInfo()
  })
}

// “批量删除”按钮
const batchDelete = () => {
  ElMessageBox.confirm('确定删除这些标签信息吗？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    handleDeleteBookInfo()
  })
}

// 新增学生信息
async function submitInsert() {
  try {
    await insertBookInfo(addForm)
    await handleCurrentChange()
    insertFormVisible.value = false
    ElMessage.success('添加成功')
  } catch (error) {
    console.error('Failed to insert Label data:', error)
  }
}

// 取消新增
const cancelInsert = () => {
  insertFormVisible.value = false
}

//取消编辑
const cancelEdit = () => {
  editFormVisible.value = false
}

// 编辑学生信息
async function submitEdit() {
  try {
    await editBookInfo(editForm)
    await handleCurrentChange()
    editFormVisible.value = false
    ElMessage.success('编辑成功')
  } catch (error) {
    console.error('Failed to update Label data:', error)
  }
}

// 删除学生信息
async function handleDeleteBookInfo() {
  try {
    await deleteBookInfo(ids.value)
    await handleCurrentChange(currentPage.value)
    ElMessage.success('删除成功')
  } catch (error) {
    console.error('Failed to delete Label data:', error)
  }
}

// 分页查询数据
async function handleCurrentChange() {
  try {
    const response = await pageQueryBookInfo(
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

// 回显数据
async function handleEchoData(row) {
  try {
    Object.assign(editForm, {
      copyId: row.copyId,
      bookName: row.bookName,
      author: row.author,
      press: row.press,
      category: row.category,
      totalWords: row.totalWords,
      price: row.price
    });
  } catch (error) {
    console.error('Failed to edit Label data:', error)
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
