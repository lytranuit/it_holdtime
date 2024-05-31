<template>
  <BlockUI :blocked="blocked" fullScreen />
  <section class="login-block">
    <div class="container">
      <div class="row" style="">
        <div
          class="col-md-12"
          style="margin: 20px 0; display: flex; justify-content: center"
        >
          <img
            src="/src/assets/images/clientlogo_astahealthcare.com_f1800.png"
            width="200"
          />
        </div>
        <div class="col-md-12">
          <div class="box_login">
            <div class="row">
              <div class="col-md-4 login-sec">
                <h2 class="text-center">Đăng nhập</h2>
                <InlineMessage severity="error" v-if="error"
                  >{{ error }}
                </InlineMessage>

                <form id="account" method="post" class="mt-2">
                  <div class="form-group">
                    <input
                      class="form-control form-control-sm"
                      placeholder="Email"
                      type="email"
                      required
                      v-model="model.email"
                    />
                  </div>
                  <div class="form-group">
                    <input
                      class="form-control form-control-sm"
                      type="password"
                      placeholder="Password"
                      required
                      v-model="model.password"
                    />
                  </div>
                  <div class="form-check">
                    <!-- <div class="checkbox d-inline-block">
                                        <label asp-for="Input.RememberMe" class="form-label">
                                            <input class="form-check-input" asp-for="Input.RememberMe" />
                                            @Html.DisplayNameFor(m => m.Input.RememberMe)
                                        </label>
                                    </div> -->
                    <button
                      id="login-submit"
                      type="submit"
                      class="btn btn-sm btn-login float-right"
                      style="cursor: pointer"
                      @click="login"
                    >
                      Đăng nhập
                    </button>
                  </div>
                  <!--<div>
                                    <i class="fas fa-key"></i>
                                    <a href="/Identity/Account/ForgotPassword" class="small"> Quên mật khẩu?</a>
                                </div>-->
                </form>
              </div>
              <div class="col-md-8 banner-sec">
                <div
                  id="carouselExampleIndicators"
                  class="carousel slide"
                  data-ride="carousel"
                >
                  <ol class="carousel-indicators">
                    <li
                      data-target="#carouselExampleIndicators"
                      data-slide-to="0"
                      class="active"
                    ></li>
                  </ol>
                  <div class="carousel-inner" role="listbox">
                    <div class="carousel-item active">
                      <img
                        class="d-block img-fluid"
                        src="/src/assets/images/z4695140180255_f4e4d09310a5dc09c8374286b0f1183c.jpg"
                        alt="First slide"
                      />
                      <div class="carousel-caption d-none d-md-block">
                        <div class="banner-text"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-12 mt-5">
          <p style="text-align: center">
            Copyright ©2023 <b style="color: #2fa95e">ASTA</b>. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { onMounted, ref } from "vue";
import InlineMessage from "primevue/inlinemessage";
import BlockUI from "primevue/blockui";
import { useRoute, useRouter } from "vue-router";
import authApi from "../api/authApi";
import { useAuth } from "../stores/auth";
import { storeToRefs } from "pinia";
const model = ref({});
const error = ref();
const blocked = ref();
const router = useRouter();
const route = useRoute();
const store_auth = useAuth();
const { isAuth } = storeToRefs(store_auth);
const login = (e) => {
  e.preventDefault();
  if (!vaild()) {
    alert("Tài khoản hoặc mật khẩu chưa nhập!");
    return;
  }
  blocked.value = true;
  var returnUrl = route.query.returnUrl || "/";
  authApi
    .login(model.value)
    .then((res) => {
      blocked.value = false;
      if (res.authed) {
        localStorage.setItem("Auth-Token", res.token);
        localStorage.setItem("me", JSON.stringify(res.user));
        var groups = ["Administrator", "Manager Holdtime"];
        let re = false;
        let user_roles = res.user.roles;
        if (user_roles) {
          for (let d of user_roles) {
            if (groups.indexOf(d) != -1) {
              re = true;
              break;
            }
          }
        }
        // console.log(re);
        if (re) {
          location.href = returnUrl;
        } else {
          error.value = "Tài khoản không có quyền truy cập";
        }
        // router.push(returnUrl);
      } else {
        error.value = res.error;
      }
    })
    .catch(() => {
      blocked.value = false;
    });
};
const vaild = () => {
  if (!model.value.email) return false;
  if (!model.value.password) return false;
  return true;
};
onMounted(() => {
  var returnUrl = route.query.returnUrl || "/";
  if (isAuth.value) {
    router.push(returnUrl);
  }
});
</script>