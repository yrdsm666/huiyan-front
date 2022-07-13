<template>
    <div>
        <el-row type="flex" justify="center">
            <el-button @click="initKey">初始化密钥</el-button>
            <el-dialog title="运算结果" :visible.sync="init.initKeyVisible">
                <el-alert title="初始化密钥成功,共计耗时:" type="success" show-icon
                    ><h3>{{ init.timekey }} ms</h3></el-alert
                >
                <el-alert title="密钥大小:" type="info" show-icon
                    ><h3>{{ init.sizekey }} bytes</h3></el-alert
                >
            </el-dialog>
            <el-button @click="initPederson">初始化承诺生成元</el-button>
            <el-dialog title="运算结果" :visible.sync="init.initPedersenVisible">
                <el-alert title="初始化承诺生成元成功,共计耗时:" type="success" show-icon
                    ><h3>{{ init.timepd }} ms</h3></el-alert
                >
                <el-alert title="生成元大小:" type="info" show-icon
                    ><h3>{{ init.sizepd }} bytes</h3></el-alert
                >
            </el-dialog>
            <el-button type="primary" @click="open(init.pk)">显示公钥</el-button>
            <el-button type="primary" @click="open(init.sk)">显示私钥</el-button>
            <el-button type="primary" @click="open(init.pcgen)">显示生成元</el-button>
        </el-row>
        <el-divider></el-divider>

        <el-row :gutter="20">
            <el-col :span="8" style="box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04); padding: 10px; height: 500px"
                ><div class="grid-content bg-purple-light">
                    <h3 style="text-align: center">证明方</h3>
                    <el-divider></el-divider>
                    <el-form ref="prover" :model="prover" label-width="100px">
                        <el-form-item label="待证明秘密数">
                            <el-input v-model="prover.secret"></el-input>
                        </el-form-item>
                        <el-form-item label="证明范围">
                            <el-select v-model="prover.range" placeholder="0~2^n">
                                <el-option label="8" value="8"></el-option>
                                <el-option label="16" value="16"></el-option>
                                <el-option label="32" value="32"></el-option>
                                <el-option label="64" value="64"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="初始化字符串">
                            <el-input v-model="prover.crs"></el-input>
                        </el-form-item>
                    </el-form>

                    <el-row type="flex" justify="center">
                        <el-button style="margin: auto 10px" @click="genZkProof">生成零知识证明</el-button>
                        <el-dialog title="运算结果" :visible.sync="prover.genZkpVisible">
                            <el-alert title="生成零知识范围证明成功,共计耗时:" type="success" show-icon
                                ><h3>{{ prover.timezkp }} ms</h3></el-alert
                            >
                            <el-alert title="零知识范围证明大小:" type="info" show-icon
                                ><h3>{{ prover.sizezkp }} bytes</h3></el-alert
                            >
                        </el-dialog>
                        <el-button @click="genRegulation">生成监管凭据</el-button>
                        <el-dialog title="运算结果" :visible.sync="prover.genRegVisible">
                            <el-alert title="生成相等性证明成功,共计耗时:" type="success" show-icon
                                ><h3>{{ prover.timereg }} ms</h3></el-alert
                            >
                            <el-alert title="零知识证明大小:" type="info" show-icon
                                ><h3>{{ prover.sizereg }} bytes</h3></el-alert
                            >
                        </el-dialog>
                    </el-row>
                    <el-divider></el-divider>
                    <el-row type="flex" justify="center">
                        <el-button type="primary" @click="open(prover.zkp)">显示范围证明</el-button>
                        <el-button type="primary" @click="open(prover.commit)">显示承诺</el-button>
                    </el-row>
                    <br />
                    <el-row type="flex" justify="center">
                        <el-button type="primary" @click="open(prover.reg)">显示相等性证明</el-button>
                        <el-button type="primary" @click="open(prover.cipher)">显示密文</el-button>
                    </el-row>
                </div></el-col
            >

            <el-col :span="8" style="box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04); padding: 10px; height: 500px"
                ><div class="grid-content bg-purple">
                    <h3 style="text-align: center">验证方</h3>
                    <el-divider></el-divider>
                    <el-form ref="verifier" :model="verifier" label-width="100px">
                        <el-form-item label="初始化字符串">
                            <el-input v-model="verifier.crs"></el-input>
                        </el-form-item>
                        <el-form-item label="证明范围">
                            <el-select v-model="verifier.range" placeholder="0~2^n">
                                <el-option label="8" value="8"></el-option>
                                <el-option label="16" value="16"></el-option>
                                <el-option label="32" value="32"></el-option>
                                <el-option label="64" value="64"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <el-row type="flex" justify="center">
                        <el-button @click="verifyRange">验证范围证明</el-button>
                        <el-dialog title="运算结果" :visible.sync="verifier.visible">
                            <el-alert title="验证零知识范围证明成功,共计耗时:" type="success" show-icon
                                ><h3>{{ verifier.time }} ms</h3></el-alert
                            >
                            <el-alert title="验证结果:" type="info" show-icon
                                ><h3>{{ verifier.res }}</h3></el-alert
                            >
                        </el-dialog>
                    </el-row>
                    <el-divider></el-divider></div
            ></el-col>

            <el-col :span="8" style="box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04); padding: 10px; height: 500px"
                ><div class="grid-content bg-purple">
                    <h3 style="text-align: center">监管方</h3>
                    <el-divider></el-divider>
                    <el-form ref="regulator" :model="regulator" label-width="100px">
                        <el-form-item label="监管密钥">
                            <el-select v-model="regulator.skselect" placeholder="请选择">
                                <el-option v-for="item in regulator.sk" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <el-row type="flex" justify="center">
                        <el-button style="margin: auto 10px" @click="verifyEquality">验证相等性证明</el-button>
                        <el-dialog title="运算结果" :visible.sync="regulator.verifyVisible">
                            <el-alert title="验证承诺与密文相等性成功,共计耗时:" type="success" show-icon
                                ><h3>{{ regulator.timeverify }} ms</h3></el-alert
                            >
                            <el-alert title="验证结果:" type="info" show-icon
                                ><h3>{{ regulator.res }}</h3></el-alert
                            >
                        </el-dialog>
                        <el-button @click="extract(init.sk)">提取秘密</el-button>
                        <el-dialog title="运算结果" :visible.sync="regulator.decVisible">
                            <el-alert title="提取秘密成功,共计耗时:" type="success" show-icon
                                ><h3>{{ regulator.timedec }} ms</h3></el-alert
                            >
                            <el-alert title="结果为:" type="info" show-icon
                                ><h3>{{ regulator.plain }}</h3></el-alert
                            >
                        </el-dialog>
                        <el-dialog title="运算结果" :visible.sync="regulator.decFailVisible">
                            <el-alert title="解密失败，密钥错误:" type="warning" show-icon></el-alert>
                        </el-dialog>
                    </el-row>
                    <el-divider></el-divider></div
            ></el-col>
        </el-row>
    </div>
</template>


<script>
import axios from 'axios';
import Header from '../common/Header.vue';

export default {
    components: { Header },
    data() {
        return {
            init: {
                pk: '',
                sk: '',
                pcgen: '',
                timekey: 0,
                sizekey: 0,
                timepd: 0,
                sizepd: 0,
                initKeyVisible: false,
                initPedersenVisible: false
            },
            prover: {
                secret: 0,
                range: 0,
                crs: '',
                zkp: '',
                reg: '',
                commit: '',
                cipher: '',
                timezkp: 0,
                sizezkp: 0,
                timereg: 0,
                sizereg: 0,
                genZkpVisible: false,
                genRegVisible: false
            },
            verifier: {
                range: 0,
                crs: '',
                time: 0,
                res: false,
                visible: false
            },
            regulator: {
                sk: [],
                skselect: '',
                timeverify: 0,
                timedec: 0,
                plain: 0,
                res: false,
                verifyVisible: false,
                decVisible: false,
                decFailVisible: false
            }
        };
    },
    methods: {
        stringToBytes(str) {
            var ch,
                st,
                re = [];
            for (var i = 0; i < str.length; i++) {
                ch = str.charCodeAt(i); // get char
                st = []; // set up "stack"
                do {
                    st.push(ch & 0xff); // push byte to stack
                    ch = ch >> 8; // shift value down by 1 byte
                } while (ch);
                // add stack contents to result
                // done because chars have "wrong" endianness
                re = re.concat(st.reverse());
            }
            // return an array of bytes
            return re;
        },
        initKey() {
            axios
                .get(this.apiUrl + '/initKey')
                .then((response) => {
                    this.init.pk = JSON.stringify(response.data.pk);
                    this.init.sk = JSON.stringify(response.data.sk);
                    this.regulator.sk.push(this.init.sk);
                    this.init.timekey = JSON.stringify(response.data.time);
                    this.init.sizekey = JSON.stringify(response.data.size);
                    this.init.initKeyVisible = true;
                })
                .catch((response) => console.log(response));
        },
        initPederson() {
            axios
                .get(this.apiUrl + '/initPcGen')
                .then((response) => {
                    this.init.pcgen = this.stringToBytes(JSON.stringify(response.data.pcgen));
                    this.init.timepd = JSON.stringify(response.data.time);
                    this.init.sizepd = JSON.stringify(response.data.size);
                    this.init.initPedersenVisible = true;
                })
                .catch((response) => alert(response));
        },
        genZkProof() {
            let data = {
                secret: parseInt(this.prover.secret),
                range: parseInt(this.prover.range),
                crs: this.prover.crs
            };
            axios
                .post(this.apiUrl + '/genZkp', data)
                .then((response) => {
                    this.prover.zkp = this.stringToBytes(JSON.stringify(response.data.rangeproof));
                    this.prover.commit = this.stringToBytes(JSON.stringify(response.data.commitment));
                    this.prover.timezkp = JSON.stringify(response.data.time);
                    this.prover.sizezkp = JSON.stringify(response.data.size);
                    this.prover.genZkpVisible = true;
                })
                .catch((response) => alert(response));
        },
        genRegulation() {
            let data = {
                secret: parseInt(this.prover.secret),
                range: parseInt(this.prover.range),
                crs: this.prover.crs
            };
            axios
                .post(this.apiUrl + '/genEq', data)
                .then((response) => {
                    this.prover.reg = JSON.stringify(response.data.equality);
                    this.prover.cipher = JSON.stringify(response.data.cipher);
                    this.prover.timereg = JSON.stringify(response.data.time);
                    this.prover.sizereg = JSON.stringify(response.data.size);
                    this.prover.genRegVisible = true;
                })
                .catch((response) => alert(response));
        },
        verifyRange() {
            let data = {
                range: parseInt(this.verifier.range),
                crs: this.verifier.crs
            };
            axios
                .post(this.apiUrl + '/verifyRange', data)
                .then((response) => {
                    this.verifier.res = JSON.stringify(response.data.res);
                    this.verifier.time = JSON.stringify(response.data.time);
                    this.verifier.visible = true;
                })
                .catch((response) => alert(response));
        },
        verifyEquality() {
            let data = {
                sk: JSON.parse(this.regulator.skselect)
            };
            axios
                .post(this.apiUrl + '/verifyEq', data)
                .then((response) => {
                    this.regulator.res = JSON.stringify(response.data.res);
                    this.regulator.timeverify = JSON.stringify(response.data.time);
                    this.regulator.verifyVisible = true;
                })
                .catch((response) => alert(response));
        },
        extract() {
            let data = {
                sk: JSON.parse(this.regulator.skselect)
            };
            axios
                .post(this.apiUrl + '/dec', data)
                .then((response) => {
                    this.regulator.plain = JSON.stringify(response.data.plain);
                    this.regulator.timedec = JSON.stringify(response.data.time);
                    this.regulator.decVisible = true;
                })
                .catch((response) => (this.regulator.decFailVisible = true));
        },
        open(message) {
            alert(message);
        }
    }
};
</script>