<template>
    <div>
        <el-card class="box-card" style="height: 870px">
            <div slot="header" class="clearfix">
                <span style="font-size: 24px">验证证书（验签名）</span>
            </div>
            <div class="text item">
                <div slot="header" class="clearfix">
                    <el-row :gutter="20">
                        <el-col :span="17">
                            <div class="grid-content bg-purple">
                                <div id="app">
                                    <el-form
                                        :model="dynamicValidateForm"
                                        ref="dynamicValidateForm"
                                        label-width="100px"
                                        class="demo-dynamic"
                                    >
                                        <el-form-item label="消息">
                                            <el-input type="textarea" :rows="4" v-model="dynamicValidateForm.msg"> </el-input>
                                        </el-form-item>
                                        <el-form-item label="随机化证书">
                                            <el-input type="textarea" :rows="4" v-model="dynamicValidateForm.randomCredential"> </el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" @click="submitForm('dynamicValidateForm')">验证随机化证书</el-button>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="2">
                            <div class="grid-content bg-purple"></div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-card>
        <!--    <el-dialog-->
        <!--        title="Issuer秘钥"-->
        <!--        :visible.sync="dialogVisible"-->
        <!--        width="30%"-->
        <!--        center>-->

        <!--      <el-input-->
        <!--          type="textarea"-->
        <!--          :rows="21"-->
        <!--          v-model="issuerKey">-->
        <!--      </el-input>-->
        <!--      <span slot="footer" class="dialog-footer">-->
        <!--    <el-button @click="dialogVisible = false">取 消</el-button>-->
        <!--    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
        <!--      </span>-->
        <!--    </el-dialog>-->
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            dialogVisible: false,
            dynamicValidateForm: {
                randomCredential: '',
                name: '',
                msg: ''
            }
        };
    },
    methods: {
        postData() {
            let param = {
                user: this.dynamicValidateForm.name,
                random: this.dynamicValidateForm.randomCredential,
                msg: this.dynamicValidateForm.msg
            };
            console.log(param);
            axios
                .post(this.apiUrl + '/verify', param)
                .then((response) => {
                    if (response.data.code === '200') {
                        console.log(response.data);
                        this.$message({
                            message: '用时：' + response.data.Spend / 1000000 + '（毫秒）',
                            duration: 0,
                            showClose: true
                        });
                        alert(response.data.Msg);
                    }
                    if (response.data.code === '400') {
                        console.log(400);
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
