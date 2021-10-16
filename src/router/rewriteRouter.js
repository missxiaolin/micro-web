import { patchRouter } from '../utils/index'
import { turnApp } from '../router/routerHandle'

// 重写window 路由跳转
export const rewriteRouter = () => {
    window.history.pushState = patchRouter(window.history.pushState, 'micro_push')
    window.history.replaceState = patchRouter(window.history.replaceState, 'micro_replace')

    window.addEventListener('micro_push', turnApp)
    window.addEventListener('micro_replace', turnApp)

    // 监听返回事件
    window.onpopstate = async function () {
        await turnApp()
    }
}

