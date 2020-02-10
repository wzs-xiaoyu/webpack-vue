let routeHistory = {};

export default function(vRouter, initHistory) {
  routeHistory = { ...initHistory }; //初始化注册历史
  vRouter.beforeEach((to, from, next) => {
    let fromMatched = from.matched;
    if (fromMatched.length < 2) return toHistory(to.fullPath, next);
    // 记住历史
    let fromFatherRoute = from.matched.slice(-1)[0].parent;
    let toFatherRoute = to.matched.slice(-1)[0].parent || {};
    if (fromFatherRoute.path !== toFatherRoute.path) {
      routeHistory[fromFatherRoute.path] = from.fullPath;
    }
    // 跳转到历史
    return toHistory(to.fullPath, next);
  });
}

function toHistory(path, next) {
  let target = routeHistory[path];
  target ? next({ path: target }) : next();
}
