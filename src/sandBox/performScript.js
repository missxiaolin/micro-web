

/**
 * js 导入
 * @param {*} script 
 * @param {*} appName 
 * @param {*} global
 * @returns 
 */
export const performScriptForEval = (script, appName, global) => {
  // library window.appName
  window.proxy = global
  const scriptText = `
    ((window) => {
      ${script}
      return window['${appName}'] 
    })(window.proxy)
  `
  return eval(scriptText)// app module mount
}

/**
 * js 导入
 * @param {*} script 
 * @param {*} appName 
 * @param {*} global
 * @returns 
 */
export const performScriptForFunction = (script, appName, global) => {
  window.proxy = global

  const scriptText = `
    return ((window) => {
      ${script}
      return window['${appName}']
    })(window.proxy)
  `
  return new Function(scriptText)()
}
