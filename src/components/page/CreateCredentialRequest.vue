<template>
    <div>
        <el-card class="box-card" style="height: 870px">
            <div slot="header" class="clearfix">
                <span style="font-size: 24px">产生证书请求</span>
            </div>
            <div class="text item">
                <div slot="header" class="clearfix">
                    <el-row :gutter="20">
                        <el-col :span="13">
                            <div class="grid-content bg-purple">
                                <div id="app">
                                    <el-form :model="dynamicValidateForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                                        <el-form-item label="用户名字">
                                            <el-input  @blur="askUserInfo" type="textarea" :rows="1" v-model="dynamicValidateForm.name"> </el-input>
                                        </el-form-item>
                                        <el-form-item label="用户私钥">
                                            <el-input type="textarea" :rows="1" v-model="dynamicValidateForm.userPriKey"> </el-input>
                                        </el-form-item>
                                        <el-form-item label="CA公钥">
                                            <el-input type="textarea" :rows="15" v-model="dynamicValidateForm.issuerPubKey"> </el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" @click="submitForm('ruleForm')">产生证书请求</el-button>
                                            <el-button @click="askCredentialRequest">查看生成的证书请求</el-button>
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
        <el-dialog title="证书请求" :visible.sync="dialogVisible" width="30%" center>
            <el-input type="textarea" :rows="5" v-model="credentialRequest"> </el-input>
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
            credentialRequest: '',
            dynamicValidateForm: {
                userPriKey: '',
                issuerPubKey: '',
                name: 'admin'
            }
        };
    },
    created() {
        this.askCAPubInfo();
        this.askUserInfo();
    },
    methods: {
        postData() {
           this.askCAPubInfo();
            let param = {
                pri: this.dynamicValidateForm.userPriKey,
                user: this.dynamicValidateForm.name
            };
            axios
                .post(this.apiUrl + '/createCredentialRequest', param)
                .then((response) => {
                    if (response.data.code === '200') {
                        console.log(response.data);
                        this.credentialRequest = response.data.Cr;
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

        askCAPubInfo() {
            let param = {
                user: 'CA'
            };
            axios
                .post(this.apiUrl + '/getUserInfo', param)
                .then((response) => {
                    this.dynamicValidateForm.issuerPubKey = response.data.Pub;
                })
                .catch((response) => {
                    console.log('运行报错');
                    alert(response);
                });
        },
        askUserInfo() {
          console.log("获取用户信息")
            let param = {
                user: this.dynamicValidateForm.name
            };
            axios
                .post(this.apiUrl + '/getUserInfo', param)
                .then((response) => {
                    this.dynamicValidateForm.userPriKey = response.data.Pri;
                    console.log(response.data);
                })
                .catch((response) => {
                    console.log('运行报错');
                    alert(response);
                });
        },
        askCredentialRequest() {
            let param = {
                user: this.dynamicValidateForm.name
            };
            axios
                .post(this.apiUrl + '/getUserInfo', param)
                .then((response) => {
                    console.log(response.data);
                    this.credentialRequest = response.data.Cr;
                    this.dialogVisible = true;
                    console.log(response.data);
                })
                .catch((response) => {
                    console.log('运行报错');
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
