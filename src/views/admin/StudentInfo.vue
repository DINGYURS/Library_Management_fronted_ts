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
      <el-form-item label="姓名" prop="name">
        <el-input
          placeholder="请输入姓名" v-model="addForm.name"/>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select
          v-model="addForm.sex"
          placeholder="请选择性别"
          style="width: 100%"
        >
          <el-option :value="1" label="男"/>
          <el-option :value="0" label="女"/>
        </el-select>
      </el-form-item>
      <el-form-item label="学号" prop="username">
        <el-input @keyup.enter="submitInsert" placeholder="请输入学号" v-model="addForm.username"/>
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
      <el-form-item label="姓名" prop="name">
        <el-input
          placeholder="请输入姓名" v-model="editForm.name"/>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select
          v-model="editForm.sex"
          placeholder="请选择性别"
          style="width: 100%"
        >
          <el-option :value="1" label="男"/>
          <el-option :value="0" label="女"/>
        </el-select>
      </el-form-item>
      <el-form-item label="学号" prop="username">
        <el-input @keyup.enter="submitEdit" placeholder="请输入学号" v-model="editForm.username"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="primary" @click="submitEdit"> 提交</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 顶部表单 -->
  <div class="rounded-lg p-5">
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
          <div class="query-Form-item flex items-center ">
            班级总阅读量：{{ totalReadVolume }}
          </div>
        </div>
        <div class="flex space-x-4 mr-4">
          <el-form-item class="query-Form-item">
            <el-button type="primary" @click="handleCurrentChange">查询</el-button>
          </el-form-item>
          <el-form-item class="query-Form-item">
            <el-button type="primary" @click="addButton"> 新增</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 表单数据展示 -->
    <div style="width: 100%">
      <el-table
        :data="tableData"
        border
        height="auto"
      >
        <el-table-column align="center" label="序号">
          <template #default="{ $index }">
            {{ adjustedIndex($index) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="姓名" prop="name"/>
        <el-table-column align="center" label="性别" prop="sex">
          <template #default="{ row }">
            <el-tag v-if="row.sex === 0" type="danger">女</el-tag>
            <el-tag v-else type="success">男</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="学号" prop="username"/>
        <el-table-column align="center" label="阅读量（字数）" prop="readVolume">
          <template #default="{ row }">
            {{ row.readVolume !== null ? row.readVolume : 0 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="信用分" prop="creditScore"/>
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
import {deleteStudentInfo, editStudentInfo, insertStudentInfo, pageQueryStudentInfo} from "@/api/admin/studentInfo.js";

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

const addForm = reactive({
  name: '',
  sex: '',
  username: '',
})

const editForm = reactive({
  userId: '',
  name: '',
  sex: '',
  username: '',
})

const queryForm = reactive({
  name: '',
  username: ''
})

// 计算表格序号
const adjustedIndex = computed(() => {
  return (index) => {
    return (currentPage.value - 1) * pageSize.value + index + 1
  }
})

// 计算班级所有人的阅读量总和
const totalReadVolume = computed(() => {
  return tableData.value.reduce((sum, row) => sum + (row.readVolume || 0), 0);
});

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

// “删除”按钮
const deleteButton = (row) => {
  ElMessageBox.confirm('确定删除该标签信息吗？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    handleDeleteStudentInfo(row.userId)
  })
}
// 新增学生信息
async function submitInsert() {
  try {
    await insertStudentInfo(addForm)
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
    await editStudentInfo(editForm)
    await handleCurrentChange()
    editFormVisible.value = false
    ElMessage.success('编辑成功')
  } catch (error) {
    console.error('Failed to update Label data:', error)
  }
}

// 删除学生信息
async function handleDeleteStudentInfo(userId) {
  try {
    await deleteStudentInfo(userId)
    await handleCurrentChange(currentPage.value)
    ElMessage.success('删除成功')
  } catch (error) {
    console.error('Failed to delete Label data:', error)
  }
}

// 分页查询数据
async function handleCurrentChange() {
  try {
    const response = await pageQueryStudentInfo(
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
    editForm.userId = row.userId
    editForm.name = row.name
    editForm.sex = row.sex
    editForm.username = row.username
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
</style>