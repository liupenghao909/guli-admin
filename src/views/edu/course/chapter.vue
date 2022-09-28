<template>

    <div class="app-container">
      <h2 style="text-align: center;">发布新课程</h2>
      <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
        <el-step title="填写课程基本信息"/>
        <el-step title="创建课程大纲"/>
        <el-step title="保存提交"/>
      </el-steps>

      <el-button type="text" @click="clickAddChapter()">添加章节</el-button>

      <!-- 章节 -->
      <ul class="chanpterList">
            <li
                v-for="chapter in chapterVideoList"
                :key="chapter.id">
                <p>
                    {{ chapter.title }}

                    <span class="acts">
                        <!-- <el-button type="text">添加课时</el-button> -->
                        <el-button style="" type="text" @click="openVideo(chapter.id)">添加小节</el-button>
                        <el-button style="" type="text" @click="editChapter(chapter.id)">编辑</el-button>
                        <el-button type="text" @click="deleteChapter(chapter.id)">删除</el-button>
                    </span>
                </p>

                <!-- 视频 -->
                <ul class="chanpterList videoList">
                    <li
                        v-for="video in chapter.children"
                        :key="video.id">
                        <p>
                            {{ video.title }}
                            
                            <span class="acts">
                                <el-button type="text" @click="editVideo(video.id)">编辑</el-button>
                                <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
                            </span>
                        </p>
                    </li>
                </ul>
            </li>
        </ul>

        <div>
            <el-button @click="previous">上一步</el-button>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
        </div>

        <!-- 添加和修改章节表单 -->
        <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
            <el-form :model="chapter" label-width="120px">
                <el-form-item label="章节标题">
                    <el-input v-model="chapter.title"/>
                </el-form-item>
                <el-form-item label="章节排序">
                    <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 添加和修改课时表单 -->
        <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
            <el-form :model="video" label-width="120px">
                <el-form-item label="课时标题">
                <el-input v-model="video.title"/>
                </el-form-item>
                <el-form-item label="课时排序">
                <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
                </el-form-item>
                <el-form-item label="是否免费">
                <el-radio-group v-model="video.isFree">
                    <el-radio :label="true">免费</el-radio>
                    <el-radio :label="false">收费</el-radio>
                </el-radio-group>
                </el-form-item>

                <el-form-item label="上传视频">
                    <el-upload
                        :on-success="handleVodUploadSuccess"
                        :on-remove="handleVodRemove"
                        :before-remove="beforeVodRemove"
                        :on-exceed="handleUploadExceed"
                        :file-list="fileList"
                        :action="BASE_API+'/eduVod/video/upload'"
                        :limit="1"
                        class="upload-demo">
                    <el-button size="small" type="primary">上传视频</el-button>
                    <el-tooltip placement="right-end">
                        <div slot="content">最大支持1G，<br>
                            支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                            GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                            MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                            SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
                        <i class="el-icon-question"/>
                    </el-tooltip>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
                <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import chapter from '@/api/edu/chapter' 
import video from '@/api/edu/video'
import course from '../../../api/edu/course'
import vod from '@/api/edu/vod'
export default {
  data() {
      return {
          saveBtnDisabled: false, // 保存按钮是否禁用
          courseId:'',
          chapterId:'',
          chapterVideoList:[], // 大纲列表
          dialogChapterFormVisible:false, // 控制章节弹窗是否显示
          dialogVideoFormVisible: false,  // 控制小节弹窗是否显示
          chapter:{
            title:'',
            sort:0
          },
          video:{
            title: '',
            sort: 0,
            isFree: 0,
            videoSourceId: '',
            videoOriginalName:''
          },
          fileList:[],  // 上传文件列表
          BASE_API: process.env.BASE_API // 接口API地址 
      }
  },

  created() {
    if(this.$route.params && this.$route.params.id){
        this.courseId = this.$route.params.id
        this.getChapterVideoList(this.courseId)
    }
  },

  methods: {
    
    /**
     * 成功回调上传成功后执行的操作的操作
     */
    handleVodUploadSuccess(response, file, fileList){
        //  上传视频id赋值
        this.video.videoSourceId = response.data.videoId
        // 上传视频名称赋值
        this.video.videoOriginalName = file.name

    },
    /**
     *  移除上传视频时进行的操作
     */
    handleVodRemove(){
        // 删除阿里云中存储的视频
        vod.deleteVideoInAliyunById(this.video.videoSourceId)
            .then(response => {
                // 弹窗显示删除成功
                this.$message({
                    type: 'success',
                    message: '删除小节视频成功!'
                })
                // 将添加小节中的视频列表清空
                this.fileList = []
                // 将video对象中的视频id和视频名称清楚
                this.video.videoSourceId = ""
                
                this.video.videoOriginalName = ""
            })
    },

    /**
     * 移除要删除的视频之前要进行的操作
     */
    beforeVodRemove(file, fileList){
        return this.$confirm(`确定删除 ${file.name} ?`);

    },

    /**
     * 试图上传多于一个视频
     */
    handleUploadExceed(files,fileList){
        this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },

    deleteVideo(videoId){
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            return video.deleteVideoById(videoId)
        }).then(() => {
            this.getChapterVideoList(this.courseId)// 刷新列表
            this.$message({
            type: 'success',
            message: '删除小节成功!'
            })
        }).catch((response) => { // 失败
            if (response === 'cancel') {
            this.$message({
                type: 'info',
                message: '已取消删除'
            })
            } else {
            this.$message({
                type: 'error',
                message: response.message
            })
            }
        })
    },

    /**
     * 点击编辑小节按钮运行的函数
     * @param {*} videoId 
     */
    editVideo(videoId){
        video.getVideoById(videoId)
            .then(response => {
                this.video = response.data.eduVideo
                this.dialogVideoFormVisible = true
            })
    },
    saveOrUpdateVideo(){
        if(this.video.id){
            this.updateVideo()
        } else {
            this.saveVideo()
        }
    },
    /**
     * 添加小节信息
     */
    saveVideo(){
        this.video.courseId = this.courseId
        this.video.chapterId = this.chapterId
        video.addVideo(this.video)
            .then(response => {
                // 隐藏掉小节弹窗
                this.dialogVideoFormVisible = false,
                // 显示添加成功信息
                this.$message({
                type: 'success',
                message: '成功添加小节信息'
                })

                this.fileList=[]

                // 刷新章节列表
                this.getChapterVideoList(this.courseId)
            })
            .catch(error => {
                this.$message({
                type: 'error',
                message: '添加小节信息失败'
                })
            })
            
    },

    /**
     * 更新小节信息
     */
    updateVideo(){
        video.updateVideo(this.video)
            .then(response => {
                // 隐藏掉小节弹窗
                this.dialogVideoFormVisible = false,
                // 显示添加成功信息
                this.$message({
                type: 'success',
                message: '成功更新小节信息'
                })
                // 刷新章节列表
                this.getChapterVideoList(this.courseId)
            })
            .catch(error => {
                this.$message({
                type: 'error',
                message: '更新小节信息失败'
                })
            })
    },

    /**
     * 点击添加小节时运行的函数
     * @param {*} chapterId 
     */
    openVideo(chapterId){
        this.chapterId = chapterId
        this.dialogVideoFormVisible = true
        this.video ={
            title: '',
            sort: 0,
            free: 0,
            videoSourceId: ''
        }
    },
    /**
     * 点击添加章节时运行的函数
     */
    clickAddChapter(){
        this.dialogChapterFormVisible = true
        this.chapter={
            title:'',
            sort:0
        }
    },
    /**
     * 获取课程下的所有章节和小节列表
     * @param {*} courseId 
     */
    getChapterVideoList(courseId){
        chapter.getAllChapterVideoList(courseId)
            .then(response => {
                this.chapterVideoList = response.data.chapterVideoList
            })
    },

    previous(){
        this.$router.push({path:'/course/info/'+this.courseId})
    },
    next(){
        this.$router.push({path: '/course/publish/'+this.courseId})
    },

    saveOrUpdate(){
        if(this.chapter.id){
            this.updateChapter()
        } else {
            this.saveChapter()
        }
    },

    saveChapter(){
        this.chapter.courseId = this.courseId
        chapter.addChapter(this.chapter)
            .then(response => {
                // 隐藏掉章节弹窗
                this.dialogChapterFormVisible = false
                // 显示添加成功信息
                this.$message({
                type: 'success',
                message: '成功添加章节信息'
                })
                // 刷新章节列表
                this.getChapterVideoList(this.courseId)
            })
            .catch(error => {
                this.$message({
                type: 'error',
                message: '添加章节信息失败'
                })
            })
    },
    updateChapter(){
        chapter.updateChapter(this.chapter)
            .then(response => {
                // 隐藏掉章节弹窗
                this.dialogChapterFormVisible = false
                // 显示添加成功信息
                this.$message({
                type: 'success',
                message: '成功更新章节信息'
                })
                // 刷新章节列表
                this.getChapterVideoList(this.courseId)
            })
            .catch(error => {
                this.$message({
                type: 'error',
                message: '更新章节信息失败'
                })
            })
    },

    editChapter(chapterId){
        chapter.getChapterById(chapterId)
            .then(response => {
                
                // 显示编辑章节信息的弹窗
                this.dialogChapterFormVisible = true
                // 回显数据
                this.chapter = response.data.chapter
  

            })
            .catch(error => {
                
                this.$message({
                type: 'error',
                message: '获取章节信息失败'
                })
            })
    },
    deleteChapter(chapterId){
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            return chapter.deleteChapter(chapterId)
        }).then(() => {
            this.getChapterVideoList(this.courseId)// 刷新列表
            this.$message({
            type: 'success',
            message: '删除章节成功!'
            })
        }).catch((response) => { // 失败
            if (response === 'cancel') {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            } else {
                this.$message({
                    type: 'error',
                    message: '删除章节失败'
                })
            }
        })
    }     
        
    }
}
</script>

<style scoped>
    .chanpterList{
        position: relative;
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .chanpterList li{
      position: relative;
    }
    .chanpterList p{
      float: left;
      font-size: 20px;
      margin: 10px 0;
      padding: 10px;
      height: 70px;
      line-height: 50px;
      width: 100%;
      border: 1px solid #DDD;
    }
    .chanpterList .acts {
        float: right;
        font-size: 14px;
    }

    .videoList{
      padding-left: 50px;
    }
    .videoList p{
      float: left;
      font-size: 14px;
      margin: 10px 0;
      padding: 10px;
      height: 50px;
      line-height: 30px;
      width: 100%;
      border: 1px dotted #DDD;
    }
    </style>