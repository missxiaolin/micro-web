import { findAppByRoute } from '../utils/index'
import { getMainLifecycle } from '../const/mainLifeCycle'
import { loadHtml } from '../loader/index'

export const lifecycle = async () => {
    // 获取到上一个子应用
    const prevApp = findAppByRoute(window.__ORIGIN_APP__)

    // 获取要跳转的子应用，执行对应的生命周期
    const nextApp = findAppByRoute(window.__CURRENT_SUB_APP__)

    if (!nextApp) {
        return
    }    
    if (prevApp && prevApp.unmount) {
        if (prevApp.proxy) {
            prevApp.proxy.inactive() // 将沙箱销毁
        }
        await destroyed(prevApp)
    }
    const app = await beforeLoad(nextApp)

    // app && app.beforeLoad && app.beforeLoad()

    await mounted(app)
}

/**
 * 加载时候执行
 * @param {*} app 
 * @returns 
 */
export const beforeLoad = async (app) => {
    await runMainLifeCycle('beforeLoad')
    app && app.bootstrap && app.bootstrap(app)

    const subApp = await loadHtml(app) // 获取子应用内容

    subApp && subApp.beforeLoad && subApp.beforeLoad()

    return subApp
}

/**
 * 渲染完成执行
 * @param {*} app 
 */
export const mounted = async (app) => {
    app && app.mount && app.mount(app)
    await runMainLifeCycle('mounted')
}

/**
 * 卸载时执行
 * @param {*} app 
 */
export const destroyed = async (app) => {
    app && app.unmount && app.unmount(app)
    // 对应的执行以下主应用的生命周期
    await runMainLifeCycle('destroyed')
}

/**
 * 执行生命周期
 * @param {*} type 
 */
export const runMainLifeCycle = async (type) => {
    const mainlife = getMainLifecycle()
    
    await Promise.all(mainlife[type].map(async item => await item()))
}
