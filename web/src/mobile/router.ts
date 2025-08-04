import { useStore } from '@/store';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

//  菜单栏路由
export const asyncRoutes = [];

export const constantRoutes: Array<RouteRecordRaw> = [
    // {
    //     path: '/redirect',
    //     meta: { hidden: true },
    //     children: [
    //         {
    //             path: '/redirect/:path(.*)',
    //             component: () => import('@/pc/pages/redirect/index.vue')
    //         }
    //     ]
    // },
    
    //设置兜底路由
    {
        path: '/',
        redirect: '/home',
        children: [
            {
                path: '/home',
                component: () => import('@/mobile/pages/home/index.vue')
            },
        ]
    },
    {
        path: '/:w+',
        redirect: {
            path: '/404',
        },
    },
    {
        path: '/404',
        component: () => import('@/mobile/pages/404.vue'),
        meta: { hidden: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: constantRoutes,
});


export function resetRouter() {
    const newRouter = router;
    (router as any).matcher = (newRouter as any).matcher
}

export default router;
