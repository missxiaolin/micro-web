import { isTurnChild } from '../utils/index'
import { lifecycle } from '../lifeCycle/index'


export const turnApp = async () => {
    if (isTurnChild()) {
        // 微前端的生命周期执行
        await lifecycle()
    }
}
