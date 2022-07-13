<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="font-size: 24px">证书请求</span>
            </div>
            <div class="text item">
                <div slot="header" class="clearfix">
                    <el-row :gutter="20">
                        <el-col :span="13">
                            <div class="grid-content bg-purple">
                                <div id="app">
                                    <el-form :model="dynamicValidateForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                                        <el-form-item label="用户名字">
                                            <el-input type="textarea" @blur="askUserInfo(false)" :rows="1" v-model="dynamicValidateForm.name"> </el-input>
                                        </el-form-item>
                                        <el-form-item label="trace信息">
                                            <el-input type="textarea" :rows="12" v-model="dynamicValidateForm.trace"> </el-input>
                                        </el-form-item>
                                        <el-form-item label="证书请求">
                                            <el-input type="textarea" :rows="4" v-model="dynamicValidateForm.credentialRequest"> </el-input>
                                        </el-form-item>
                                        <el-form-item label="用户公钥">
                                            <el-input type="textarea" :rows="10" v-model="dynamicValidateForm.userPubKey"> </el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" @click="submitForm('ruleForm')">请求证书</el-button>
                                            <el-button  @click="askUserInfo(true)">查看证书</el-button>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="grid-content bg-purple"></div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-card>
        <el-dialog title="证书" :visible.sync="dialogVisible" width="30%" center>
            <el-input type="textarea" :rows="21" v-model="credential"> </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            dialogVisible: false,
            credential: '',
            dynamicValidateForm: {
                name: 'admin',
                credentialRequest: '',
                trace: '',
                userPubKey: ''
            }
        };
    },
    created() {
      this.askUserInfo(false)
    },
    methods: {
        postData() {
            let param = {
                Cr: this.dynamicValidateForm.credentialRequest,
                user: this.dynamicValidateForm.name
            };
            axios
                .post(this.apiUrl + '/createCredential', param)
                .then((response) => {
                    if (response.data.code === '200') {
                        console.log(response.data);
                        this.credential = response.data.Cred;
                        this.dialogVisible = true;
                        console.log(response.data);
                        this.$message({
                            message: '用时：' + response.data.Spend / 1000000 + '（毫秒）',
                            duration: 0,
                            showClose: true
                        });
                    }
                    if (response.data.code === '400') {
                        alert(response.data.msg);
                    }
                })
                .catch((response) => {
                    alert(response);
                });
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then((_) => {
                    this.dialogVisible = false;
                    done();
                })
                .catch((_) => {});
        },
        askUserInfo(v) {
          console.log(v)
            let param = {
                user: this.dynamicValidateForm.name
            };
            axios
                .post(this.apiUrl + '/getUserInfo', param)
                .then((response) => {
                    this.dynamicValidateForm.trace = response.data.Trace;
                    this.dynamicValidateForm.userPubKey = response.data.Pub;
                    this.dynamicValidateForm.credentialRequest = response.data.Cr;
                    this.credential = response.data.Cred;
                    console.log(response.data);
                    this.dialogVisible=v
                })
                .catch((response) => {
                    console.log('运行报错');
                    alert(response);
                });
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.postData();
                } else {
                    this.$alert('初始化失败', '初始化CA', {
                        confirmButtonText: '确定',
                        callback: (action) => {
                            this.$message({
                                type: 'info',
                                message: `action: ${action}`
                            });
                        }
                    });
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        removeDomain(item) {
            var index = this.dynamicValidateForm.domains.indexOf(item);
            if (index !== -1) {
                this.dynamicValidateForm.domains.splice(index, 1);
            }
        },
        addDomain() {
            this.dynamicValidateForm.domains.push({
                value: '',
                key: Date.now()
            });
        }
    }
};
</script>


<style scoped>
@import url('//unpkg.com/element-ui@2.14.1/lib/theme-chalk/index.css');
</style>
