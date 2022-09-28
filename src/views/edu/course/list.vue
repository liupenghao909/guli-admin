<template>
    <div class="app-container">
      课程列表
      <!--查询表单-->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="teacherQuery.title" placeholder="课程名称"/>
        </el-form-item>
  
        <el-form-item>
          <el-select v-model="teacherQuery.status" clearable placeholder="课程状态">
            <el-option value="Normal" label="已发布"/>
            <el-option value="Draft" label="未发布"/>
          </el-select>
        </el-form-item>
  
        <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form>
  
      <!-- 表格 -->
      <el-table
        :data="list"
        border
        fit
        highlight-current-row>
        <el-table-column
          label="序号"
          width="70"
          align="center">
          <template slot-scope="scope">
            {{ (page - 1) * limit + scope.$index + 1 }}
          </template>
        </el-table-column>
  
        <el-table-column prop="title" label="课程名称" width="80" />
  
        <el-table-column label="课程状态" width="80">
          <template slot-scope="scope">
            {{ scope.row.status==='Normal'?'已发布':'未发布' }}
          </template>
        </el-table-column>
  
        <el-table-column prop="lessonNum" label="课时数" />
  
        <el-table-column prop="gmtCreate" label="添加时间" width="160"/>
  
        <el-table-column prop="viewCount" label="浏览数量" width="60" />
  
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <router-link :to="'/course/info/'+scope.row.id">
              <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程基本信息</el-button>
            </router-link>

            <router-link :to="'/course/chapter/'+scope.row.id">
              <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程大纲信息</el-button>
            </router-link>

            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 分页 -->
      <el-pagination
        :current-page="page"
        :page-size="limit"
        :total="total"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="getList"
      />
    </div>
  </template>
  
  <script>
  // 引入调用teacher.js文件
  import course from '@/api/edu/course'
  
  export default {
      // 写核心代码位置
      // 定义变量和初始值
      data() { 
          return {
              list:[],  // 查询之后接口返回集合
              page:1,  // 当前页
              limit:10, // 每页记录数
              total:0, // 总记录数
              teacherQuery:{     // 查询条件封装对象
                  title:"",
                  status:""
              }
  
          }
      },
      created() {  // 页面渲染之前执行，一般调用methods定义的方法
          // 调用
          this.getList()
      },
      methods:{  // 创建具体方法，调用teacher.js定义的方法
          // 讲师列表的方法
          getList(page=1){
              this.page = page
              course.getpageCourseList(this.page, this.limit,this.teacherQuery)
                  .then(response => {   // 请求成功
                      // response 接口返回的数据
                      this.list = response.data.items
                      this.total = response.data.total
                      console.log(this.list)
                      console.log(this.total)
                  })
                  .catch(error => {   // 请求失败
                      // error 失败信息
                      console.log(error)
                      this.$message({
                        type: 'error',
                        message: '获取课程信息失败'
                    })
                  })
          },
          // 清空方法
          resetData(){
              // 对象查询条件对象
              this.teacherQuery={}
              // 执行查询操作
              this.getList()
          },
          // 删除讲师
          removeDataById(id){
              this.$confirm('此操作将永久删除该讲师记录, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
              }).then(() => {   // 点击确定，执行then()
                  course.deleteCourseById(id)
                      .then(response => {
                          // 显示删除成功的提示信息
                          this.$message({
                              type: 'success',
                              message: '删除成功!'
                          });
                          // 刷新列表
                          this.getList(this.page)
                      })
          
              })
          }
      }
  }
  </script>