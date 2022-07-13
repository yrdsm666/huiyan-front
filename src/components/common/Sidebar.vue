<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">{{
                                    threeItem.title
                                }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-user-solid',
                    index: 'dashboard',
                    title: '可监管身份认证',
                    subs: [
                        {
                            index: 'User',
                            title: '身份认证系统客户端',
                            subs: [
                                {
                                    index: 'registerUser',
                                    title: '本地生成秘钥'
                                },
                                {
                                    index: 'createCredentialRequest',
                                    title: '本地产生证书请求'
                                },
                                {
                                    index: 'getCredential',
                                    title: '向CA申请证书'
                                },
                                {
                                    index: 'getRandomCredential',
                                    title: '本地产生随机化证书'
                                },
                                {
                                    index: 'verifyCredential',
                                    title: '验证证书'
                                }
                            ]
                        },
                        {
                            index: 'Issuer',
                            title: '身份认证系统服务端',
                            subs: [
                                {
                                    index: 'registerIssuer',
                                    title: '初始化'
                                },
                                {
                                    index: 'trace',
                                    title: '追踪用户'
                                }
                            ]
                        }
                    ]
                },
                {
                    icon: 'el-icon-lock',
                    index: 'communication',
                    title: '保密通信客户端',
                    subs: [
                        {
                            index: 'send',
                            title: '消息发送'
                        },
                        {
                            index: 'receive',
                            title: '消息接收'
                        }
                    ]
                }
        //         {
        //             icon: 'el-icon-lock',
        //             index: 'range',
        //             title: '敏感数据保护',
        //             subs: [
        //                 {
        //                     index: 'rangeProve',
        //                     title: '生成范围证明'
        //                 },
        //                 {
        //                     index: 'rangeVerify',
        //                     title: '验证范围证明'
        //                 }
        //             ]
        //         },
        //         {
        //             icon: 'el-icon-user',
        //             index: 'zkp',
        //             title: '可监管零知识证明',
        //             subs: [
        //                 {
        //                     index: 'zkpInit',
        //                     title: '本地生成秘钥'
        //                 },
        //                 {
        //                     index: 'zkpProve',
        //                     title: '生成证明'
        //                 },
        //                 {
        //                     index: 'zkpVerify',
        //                     title: '验证证明'
        //                 },
        //                 {
        //                     index: 'zkpRegulate',
        //                     title: '证明监管'
        //                 }
        //             ]
        //         },
		// {
		//      index: 'drop',
		//      title: '集群监控'
		// }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', (msg) => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
