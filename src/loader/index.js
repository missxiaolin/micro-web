import { fetchResource } from '../utils/fetchResource'
import { sandBox } from '../sandBox/index'

const cache = {} // 根据子应用应用名称

/**
 * 加载html方法
 * @param {*} app 
 */
export const loadHtml = async (app) => {
    // 子应用需要显示的在哪里
    let container = app.container


    // 子应用的入口
    let entry = app.entry

    const [dom, scripts] = await parseHtml(entry, app.name)
    const ct = document.querySelector(container)

    if (!ct) {
        throw new Error('容器不存在')
    }

    ct.innerHTML = dom

    scripts.forEach(item => {
        sandBox(app, item)
    })

    return app
}

/**
 * @param {*} entry 
 * @param {*} name 
 * @returns 
 */
export const parseHtml = async (entry, name) => {
    if (cache[name]) {
        return cache[name]
    }
    const html = await fetchResource(entry)

    let allScript = []
    const div = document.createElement('div')
    div.innerHTML = html

    const [dom, scriptUrl, script] = await getResources(div, entry)

    const fetchedScripts = await Promise.all(scriptUrl.map(async item => fetchResource(item)))

    allScript = script.concat(fetchedScripts)
    cache[name] = [dom, allScript]

    return [dom, allScript]
}

/**
 * @param {*} root 
 * @param {*} entry 
 * @returns 
 */
export const getResources = async (root, entry) => {
    const scriptUrl = [] // js 链接  src  href
    const script = [] // 写在script中的js脚本内容
    const dom = root.outerHTML

    // 深度解析
    function deepParse(element) {
        const children = element.children
        const parent = element.parent;

        // 处理位于 script 中的内容
        if (element.nodeName.toLowerCase() === 'script') {
            const src = element.getAttribute('src');
            if (!src) {
                script.push(element.outerHTML)
            } else {
                if (src.startsWith('http')) {
                    scriptUrl.push(src)
                } else {
                    scriptUrl.push(`http:${entry}/${src}`)
                }
            }

            if (parent) {
                parent.replaceChild(document.createComment('此 js 文件已经被微前端替换'), element)
            }
        }

        // link 也会有js的内容
        if (element.nodeName.toLowerCase() === 'link') {
            const href = element.getAttribute('href');

            if (href.endsWith('.js')) {
                if (href.startsWith('http')) {
                    scriptUrl.push(href)
                } else {
                    scriptUrl.push(`http:${entry}/${href}`)
                }
            }
        }

        for (let i = 0; i < children.length; i++) {
            deepParse(children[i])
        }
    }

    deepParse(root)

    return [dom, scriptUrl, script]
}
