<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-3">
      <div class="card report-card bg-purple-gradient shadow-purple">
        <div class="card-body">
          <div class="float-right">
            <i class="dripicons-wallet report-main-icon bg-icon-purple"></i>
          </div>
          <span class="badge badge-light text-black">Tổng số mẫu</span>
          <h3 class="my-3">{{ tab1 }}</h3>
        </div>
        <!--end card-body-->
      </div>
      <!--end card-->
    </div>
    <!--end col-->
    <div class="col-md-6 col-lg-3">
      <div class="card report-card bg-warning-gradient shadow-warning">
        <div class="card-body">
          <div class="float-right">
            <i class="fas fa-spinner report-main-icon bg-icon-warning"></i>
          </div>
          <span class="badge badge-light text-black">Đã lấy mẫu</span>
          <h3 class="my-3">{{ tab2 }}</h3>
        </div>
        <!--end card-body-->
      </div>
      <!--end card-->
    </div>
    <!--end col-->
    <div class="col-md-6 col-lg-3">
      <div class="card report-card bg-success-gradient shadow-success">
        <div class="card-body">
          <div class="float-right">
            <i class="dripicons-checkmark report-main-icon bg-icon-success"></i>
          </div>
          <span class="badge badge-light text-black">Mẫu đạt</span>
          <h3 class="my-3">{{ tab3 }}</h3>
        </div>
        <!--end card-body-->
      </div>
      <!--end card-->
    </div>
    <!--end col-->

    <div class="col-md-6 col-lg-3">
      <div class="card report-card bg-danger-gradient shadow-danger">
        <div class="card-body">
          <div class="float-right">
            <i class="fas fa-ban report-main-icon bg-icon-danger"></i>
          </div>
          <span class="badge badge-light text-black">Quá hạn lấy mẫu</span>
          <h3 class="my-3">{{ tab4 }}</h3>
        </div>
        <!--end card-body-->
      </div>
      <!--end card-->
    </div>
    <!--end col-->
    <Table1></Table1>
    <Table2></Table2>
  </div>
  <Loading :waiting="waiting"></Loading>
</template>
<script setup>
import { onMounted, ref } from "vue";
import Loading from "../components/Loading.vue";
import { useAuth } from "../stores/auth";
import { useRouter } from "vue-router";
import adminApi from "../api/adminApi.js";
import Table1 from "../components/admin/Table1.vue";
import Table2 from "../components/admin/Table2.vue";
const store = useAuth();
const tab1 = ref(0);
const tab2 = ref(0);
const tab3 = ref(0);
const tab4 = ref(0);
const waiting = ref(false);

const router = useRouter();

// const now = new Date();
onMounted(() => {
  adminApi.HomeBadge().then((res) => {
    tab1.value = res.tab1;
    tab2.value = res.tab2;
    tab3.value = res.tab3;
    tab4.value = res.tab4;
  });
});
</script>