import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/registerIssuer'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/pki',
                    meta: { title: '可监管身份认证' }
                },
                // {
                //     path: '/zkp',
                //     component: () => import(/* webpackChunkName: "table" */ '../components/page/Zkp.vue'),
                //     meta: { title: '可监管零知识证明' }
                // },
                // {
                //     path: '/zkpInit',
                //     component: () => import(/* webpackChunkName: "table1" */ '../components/page/ZkpInit.vue'),
                //     meta: { title: '本地生成秘钥', keepAlive: true }
                // },
                // {
                //     path: '/zkpProve',
                //     component: () => import(/* webpackChunkName: "table2" */ '../components/page/ZkpProve.vue'),
                //     meta: { title: '生成证明', keepAlive: false }
                // },
                // {
                //     path: '/zkpVerify',
                //     component: () => import(/* webpackChunkName: "table3" */ '../components/page/ZkpVerify.vue'),
                //     meta: { title: '验证证明', keepAlive: false }
                // },
                // {
                //     path: '/zkpRegulate',
                //     component: () => import(/* webpackChunkName: "table4" */ '../components/page/ZkpRegulate.vue'),
                //     meta: { title: '证明监管', keepAlive: false }
                // },
                // {
                //     path: '/rangeProve',
                //     component: () => import(/* webpackChunkName: "table6" */ '../components/page/RangeProve.vue'),
                //     meta: { title: '生成范围证明', keepAlive: false }
                // },
                // {
                //     path: '/rangeVerify',
                //     component: () => import(/* webpackChunkName: "table7" */ '../components/page/RangeVerify.vue'),
                //     meta: { title: '验证范围证明', keepAlive: false }
                // },
                {
                    path: '/registerIssuer',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/RegisterIssuer.vue'),
                    meta: { title: '初始化Issuer' }
                },
                {
                    path: '/registerUser',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/RegisterUser'),
                    meta: { title: '初始化User' }
                },
                {
                    path: '/createCredentialRequest',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/CreateCredentialRequest'),
                    meta: { title: '本地产生证书请求' }
                },
                {
                    path: '/getCredential',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/GetCredential'),
                    meta: { title: '申请证书' }
                },
                {
                    // 富文本编辑器组件
                    path: '/getRandomCredential',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/GetRandomCredential'),
                    meta: { title: '产生随机化证书' }
                },
                {
                    // 富文本编辑器组件
                    path: '/verifyCredential',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VerifyCredential'),
                    meta: { title: '验证随机化证书' }
                },
                {
                    // 富文本编辑器组件
                    path: '/trace',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/Trace'),
                    meta: { title: '追踪' }
                },
                {
                    // 富文本编辑器组件
                    path: '/send',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page_1/Send'),
                    meta: { title: '发送消息' }
                },
                {
                    // 富文本编辑器组件
                    path: '/receive',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page_1/Receive'),
                    meta: { title: '接收消息' }
                },
		    // {
	        //     path: '/drop',
            //         component: () => import(/* webpackChunkName: "editor" */ '../components/page/drop.vue'),
            //         meta: { title: '删除节点' }
		    // }
                // {
                //     // markdown组件i
                //     path: '/markdown',
                //     component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                //     meta: { title: 'markdown编辑器' }
                // },
                // {
                //     // 图片上传组件
                //     path: '/login1',
                //     component: () => import(/* webpackChunkName: "upload" */ '../components/page/BaseTable'),
                //     meta: { title: '测试' }
                // },
                // {
                //     // vue-schart组件
                //     path: '/charts',
                //     component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                //     meta: { title: 'schart图表' }
                // },
                // {
                //     // 拖拽列表组件
                //     path: '/drag',
                //     component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                //     meta: { title: '拖拽列表' }
                // },
                // {
                //     // 拖拽Dialog组件
                //     path: '/dialog',
                //     component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
                //     meta: { title: '拖拽弹框' }
                // },
                // {
                //     // 国际化组件
                //     path: '/i18n',
                //     component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                //     meta: { title: '国际化' }
                // },
                // {
                //     // 权限页面
                //     path: '/permission',
                //     component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                //     meta: { title: '权限测试', permission: true }
                // },
                //
                // {
                //     path: '/403',
                //     component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                //     meta: { title: '403' }
                // },
                // {
                //     path: '/donate',
                //     component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
                //     meta: { title: '支持作者' }
                // }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        }
    ]
});
