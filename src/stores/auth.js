import { ref, computed } from "vue";
import { defineStore } from "pinia";
// import VueJwtDecode from "vue-jwt-decode";

import { useCookies } from "vue3-cookies";
import authApi from "../api/authApi";
import userApi from "../api/userApi";
import Api from "../api/Api";
export const useAuth = defineStore("auth", () => {
  const data = ref({});
  const users = ref([]);
  const roles = ref([]);
  const departments = ref([]);
  const userdepartments = ref([]);
  const isAuth = computed(() => {
    const Token = getToken();
    return Token && user.value.id && (is_admin.value || is_manager.value) ? true : false;
  });
  const user = computed(() => {
    const cacheUser = localStorage.getItem("me") || "{}";
    return JSON.parse(cacheUser);
  });
  const list_users = computed(() => {
    // console.log(user);
    return user.value.list_users;
  });
  const is_admin = computed(() => {
    return in_groups(["Administrator"]);
  });
  const is_manager = computed(() => {
    return in_groups(["Manager Holdtime"]);
  });
  function getToken() {
    const { cookies } = useCookies();
    const Token =
      cookies.get("Auth-Token") || localStorage.getItem("Auth-Token");

    return Token;
  }
  async function getUser() {
    const Token = getToken();
    if (!Token) logout();
    const cacheUser = localStorage.getItem("me");
    if (!cacheUser) {
      return authApi.TokenInfo(Token).then((response) => {
        localStorage.setItem("me", JSON.stringify(response));
        return response;
      });
    }
    return JSON.parse(cacheUser);
  }
  async function logout() {
    localStorage.removeItem("me");
    localStorage.removeItem("Auth-Token");
    const { cookies } = useCookies();
    cookies.remove("Auth-Token");
    // document.getElementById("logoutForm").submit();
    authApi.logout().then((res) => {
      location.href = "/login";
    });
  }
  async function fetchRoles() {
    if (roles.value.length) return;
    return userApi.roles().then((response) => {
      roles.value = response;
      return response;
    });
  }
  async function fetchDepartment() {
    if (departments.value.length) return;
    return userApi.departments().then((response) => {
      departments.value = response;
      return response;
    });
  }
  async function fetchUserDepartment() {
    if (userdepartments.value.length) return;
    return Api.departments().then((response) => {
      userdepartments.value = response;
      return response;
    });
  }
  async function fetchUsers() {
    if (users.value.length) return;
    return authApi.users().then((response) => {
      users.value = response;
      return response;
    });
  }
  async function fetchData(id) {
    return userApi.get(id).then((response) => {
      data.value = response;
      return response;
    });
  }
  function in_groups(groups) {
    let re = false;
    let user_roles = user.value.roles;
    if (user_roles) {
      for (let d of user_roles) {
        if (groups.indexOf(d) != -1) {
          re = true;
          break;
        }
      }
    }
    return re;
  }
  return {
    data,
    roles,
    users,
    departments,
    userdepartments,
    isAuth,
    user,
    is_admin,
    is_manager,
    list_users,
    in_groups,
    getUser,
    logout,
    fetchRoles,
    fetchDepartment,
    fetchUserDepartment,
    fetchUsers,
    fetchData,
  };
});
