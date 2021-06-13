const asynchronously = async(doSomething, args) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(doSomething(args));
    }, 0)
  })
}

const getValue = (outerMap, keys) => {
  if (keys.length) return keys.reduce((innerMap, key) => innerMap[key], outerMap);
  return null;
}

const routesToPath = (routes) => {
  return routes.length > 0
  ? `/${routes.map((route) => route.resourceLocation).join('/')}`
  : '';
}

export { asynchronously, getValue, routesToPath };