import { createRouter, createWebHistory } from "vue-router";
import defaultLayout from "../layouts/Default.vue";
import AdminLayout from "../layouts/Layout/index.vue";

import routes from "~pages";
import { i18n } from "../service/i18n";
import { useAuth } from "../stores/auth";
import { storeToRefs } from "pinia";

const routes_1 = routes.map((item) => {
  item.meta = {
    layout: AdminLayout,
    transition: "fade",
  };
  return item;
});
routes_1.unshift({
  path: "/login",
  component: () => import("../views/login.vue"),
  meta: { layout: defaultLayout },
});
routes_1.push({
  path: "/:pathMatch(.*)*",
  component: () => import("../views/404.vue"),
  meta: { layout: defaultLayout },
});
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes_1,
});
window.popStateDetected = false;
window.addEventListener("popstate", () => {
  window.popStateDetected = true;
});

router.beforeEach((toRoute, fromRoute, next) => {
  i18n.global.locale.value = localStorage.getItem("language") || "vi";
  const title =
    toRoute.meta && toRoute.meta.title ? toRoute.meta.title : "Lấy mẫu - Thời gian chờ";
  document.title = title;
  const IsItABackButton = window.popStateDetected;
  window.popStateDetected = false;
  if (IsItABackButton && fromRoute.meta.someLogica) {
    next(false);
    return "";
  }
  const publicPages = ["/login"];
  const authRequired = !publicPages.includes(toRoute.path);
  const store_auth = useAuth();
  const { user } = storeToRefs(store_auth);
  if (authRequired && !user.value.id) {
    var login = "/login";
    if (toRoute.fullPath != "/") {
      login += "?returnUrl=" + toRoute.fullPath;
    }
    next(login);
    return "";
  }
  next();
});
export default router;
