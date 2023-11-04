/**
 * @description 处理 prop，当 prop 为多级嵌套时 ==> 返回最后一级 prop
 * @param {String} prop 当前 prop
 * @returns {String}
 * */
export function handleProp(obj: { [prop: string]: any }, prop: string) {
  const propArr = prop.split('.')
  if (propArr.length == 1) return obj[prop]
  let value = obj
  while (propArr.length > 0) {
    const temp = propArr.shift()
    if (temp != undefined) value = value[temp]
  }
  return value
}
