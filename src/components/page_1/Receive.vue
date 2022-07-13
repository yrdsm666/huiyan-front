<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i>消息接收</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <span style="margin-right: 15px; font-size: 15px">发送者：</span>
            <el-input v-model="tableData.searchSender" placeholder="发送者" class="handle-input mr10"></el-input>
            <span style="margin-right: 15px; font-size: 15px; margin-left: 30px">消息类型：</span>
            <!-- <el-input v-model="tableData.searchType" placeholder="消息类型" class="handle-input mr10"></el-input> -->
            <el-select v-model="tableData.searchType" placeholder="请选择" class="handle-input mr10">
                <el-option label="文本" value="text"></el-option>
                <el-option label="文件" value="file"></el-option>
            </el-select>
            <div style="float: right">
                <el-button icon="el-icon-refresh" @click="handleSearchInputReset()" style="color: #696969">重置</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch()">搜索</el-button>
            </div>
        </div>
        <div class="container">
            <div>
                <el-table ref="multipleTable"
                          :data="tableData.displayMessage"
                          style="width: 100%"
                          @selection-change="handleSelectionChange"
                          :row-key="getRowKey">
                    <el-table-column type="selection" width="55" :reserve-selection="true"/>
                    <el-table-column label="消息">
                        <template #default="scope" >
                            <el-button
                                type="text"
                                class="message-title"
                                @click="if(scope.row.type==='text') dialogVisible=true;
                                    messageAppear(scope.row);"
                            >{{scope.row.content}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="发送者" width="100px">
                        <template #default="scope" >
                            <p style="color:#3399FF">{{scope.row.sender}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="类型" prop="type" width="100px">
                        <template #default="scope">
                            <template v-if="scope.row.type === 'text'">
                                <el-tag type="">文本</el-tag>
                            </template>
                            <template v-else-if="scope.row.type === 'file'">
                                <el-tag type="success">文件</el-tag>
                            </template>
                            <template v-else>
                                <el-tag type="danger">未知类型</el-tag>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="时间" width="150px">
                        <template #default="scope" >
                            <p style="color:#3399FF">{{scope.row.time}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120px">
                        <template #default="scope">
                            <el-button size="small" @click="deleteMessage(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog
                    :visible.sync="dialogVisible"
                    title="消息内容"
                    width="30%"
                >
                    <el-input type="textarea" rows="5" :readonly="true" v-model="tableData.now_message"></el-input>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="dialogVisible = false">取消</el-button>
                            <el-button type="primary" @click="dialogVisible = false">确认</el-button>
                        </span>
                    </template>
                </el-dialog>
            </div>
            <div class="handle-row">
                <el-button type="primary" @click="deleteSelectMessage">删除选中</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { getMyMessage, deleteMyMessage } from "../../api/confidentialRecevie"
export default {
    data() {
        return {
            tableData: {
                message: [],
                displayMessage: [],
                now_message: "", //这两个域必须在tableData里面，不然后面会报奇奇怪怪的错
                searchSender: "",
                searchType: "",
            },
            multipleSelection: [],
            dialogVisible: false,

            rules: {
                sender: [
                    { required: true, message: '请输入发送者身份', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                receiver: [
                    { required: true, message: '请输入接收者身份', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
            },
        };
    },
    created() {
        this.getMyMessageData();
    },
    methods: {
        handleSearchInputReset(){
            this.tableData.searchSender = "";
            this.tableData.searchType = "";
        },
        handleSearch(){
            // displayMessage 中的内容将会显示在界面的表格中
            // 清空 displayMessage 数组
            this.tableData.displayMessage.splice(0,this.tableData.displayMessage.length);
            for(let i = 0;i<this.tableData.message.length;i++){
                // 将符合要求的元素添加进 displayMessage 中，使其显示在前端
                // 模糊匹配：检测字符串是否以指定的子字符串开始
                if(this.tableData.message[i].sender.startsWith(this.tableData.searchSender)&&this.tableData.message[i].type.startsWith(this.tableData.searchType))
                    this.tableData.displayMessage.push(this.tableData.message[i]);
            }
            // 当先选中在搜索时，multipleTable里面可能有displayMessage未包含的元素，故干脆清空
            // multipleTable变化时，会触发handleSelectionChange函数，故multipleSelection也会变
            this.$refs.multipleTable.clearSelection(); 
        },
        messageAppear(rowData){
            if (rowData.type==='text'){
                // this.dialogVisible = true;
                this.tableData.now_message = rowData.content;
            }else if(rowData.type==='file'){
                window.open(rowData.url,"_blank");
            }else{
                ElMessage.error("类型错误");
            }
        },
        handleSelectionChange(val){
            console.log("selectionChange");
            this.multipleSelection = val;
            
        },
        getRowKey(row){
            return row.id;
        },
        deleteMessage(index){
            this.$confirm('确定要删除吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // const item = this.tableData.message.splice(index, 1);
                // console.log(item);
                // console.log(item[0].id);
                deleteMyMessage({userId: "Org2", messageId: [this.tableData.message[index].id]}).then((res) => {
                    //console.log(res);
                    this.tableData.message.splice(index, 1);
                    this.tableData.displayMessage.splice(index, 1);
                    // 不能直接赋值，如果先筛选在删除的话，displayMessage 和 message 是不一样的
                    //this.tableData.displayMessage=[].concat(this.tableData.message);
                    //在已选列表multipleSelection中清除刚刚被删的行
                    // let a = this.multipleSelection.indexOf(item[0]);
                    // if(a !== -1){
                    //     this.multipleSelection.splice(a, 1);
                    // }
                    // console.log(this.multipleSelection); 
                    // 直接清空一了百了
                    this.multipleSelection.splice(0,this.tableData.length);//清空数组
                    this.$refs.multipleTable.clearSelection(); 
                    this.$message({
                        showClose: true,
                        message: '删除成功',
                        type: 'success'
                    });
                    
                }).catch((error) => {
                    console.log(error);
                    this.$message({
                        showClose: true,
                        message: '删除失败',
                        type: 'error'
                    });
                });
            }).catch(() => {});
        },
        deleteSelectMessage(){
            this.$confirm('确定要删除选中吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let selectId=[];
                if(this.multipleSelection.length !== 0){
                    // (this.multipleSelection).forEach(function (item,index,) {
                    //     console.log(index);
                    //     if(item){
                    //         selectId.push(item.id);
                    //         //先不要删，万一删失败了结果没显示就比较尴尬
                    //         //this.tableData.message.splice(this.tableData.message.indexOf(item), 1);
                    //     }
                    // })
                    // 在vue2中，这里不要用forEach，因为forEach有个function，里面无法识别this.xx
                    // vue3没有这个问题
                    for(let i = 0;i<this.multipleSelection.length;i++){
                        selectId.push(this.multipleSelection[i].id);
                        // 先不要删，万一删失败了，但是前端对应的元素还是没了就比较尴尬
                        // this.tableData.message.splice(this.tableData.message.indexOf(this.multipleSelection[i]), 1);
                    }
                    // id是按选中的先后顺利排列
                    console.log(selectId+'---selectId');
                    let query = {userId: "Org2", messageId: selectId};
                    deleteMyMessage(query).then((res) => {
                        for(let i = 0;i<this.multipleSelection.length;i++){
                            this.tableData.message.splice(this.tableData.message.indexOf(this.multipleSelection[i]), 1);
                            this.tableData.displayMessage.splice(this.tableData.displayMessage.indexOf(this.multipleSelection[i]), 1);
                        }
                        // this.tableData.displayMessage=[].concat(this.tableData.message);
                        this.multipleSelection.splice(0,this.tableData.length);//清空数组
                        this.$refs.multipleTable.clearSelection(); //vue2的写法
                        // multipleTable.value.clearSelection(); //vue3的写法，清除当前选中
                        this.$message({
                            showClose: true,
                            message: '删除成功',
                            type: 'success'
                        });
                    }).catch((error) => {
                        console.log(error);
                        this.$message({
                            showClose: true,
                            message: '删除失败',
                            type: 'error'
                        });
                    });
                }else{
                    this.$message({
                        showClose: true,
                        message: '请至少选中一个',
                        type: 'error'
                    });
                }
            }).catch(() => {});
        },
        getMyMessageData(){
            getMyMessage({userId: "Org2"}).then((res) => {
                this.tableData.message=[].concat(res);
                this.tableData.displayMessage=[].concat(this.tableData.message);
                // console.log(this.tableData.message);
            }).catch((error) => {
                console.log(error);
                this.$message({
                    showClose: true,
                    message: '获取消息失败',
                    type: 'error'
                });
            });
        },
    }
};

</script>
<style>
.handle-box {
  margin-bottom: 20px;
}

.handle-input {
  width: 200px;
  display: inline-block;
}

.mr10 {
  margin-right: 10px;
}

.red {
  color: #ff0000;
}

.green {
  color: #3CB371;
}

.message-title {
  cursor: pointer;
  font-size: 15px;
  width: 10px;
}

.handle-row {
  margin-top: 30px;
}

</style>

