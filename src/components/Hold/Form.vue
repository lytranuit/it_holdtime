<template>
  <div class="row">
    <div class="col-md-12">
      <div class="row">
        <div class="col-md-3">
          <div class="form-group">
            <b>Tên sản phẩm:<i class="text-danger">*</i></b>
            <div class="pt-1">
              <input
                class="form-control form-control-sm"
                v-model="model.tensp"
              />
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group">
            <b>Mã sản phẩm:<i class="text-danger">*</i></b>
            <div class="pt-1">
              <input
                class="form-control form-control-sm"
                v-model="model.masp"
              />
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group">
            <b>Số lô:<i class="text-danger">*</i></b>
            <div class="pt-1">
              <input
                class="form-control form-control-sm"
                v-model="model.malo"
              />
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group">
            <b>Công đoạn:<i class="text-danger">*</i></b>
            <div class="pt-1">
              <StageTreeSelect
                v-model="model.stage_id"
                @update:modelValue="changeStage"
              ></StageTreeSelect>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3">
          <div class="form-group">
            <b>Ngày bắt đầu công đoạn:<i class="text-danger">*</i></b>
            <div class="pt-1">
              <input
                class="form-control form-control-sm"
                type="date"
                v-model="model.date_start"
                @change="check_time"
              />
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group">
            <b>Ngày sản xuất:<i class="text-danger">*</i></b>
            <div class="pt-1">
              <input
                class="form-control form-control-sm"
                type="date"
                v-model="model.date_manufacture"
                @change="check_time"
              />
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <b>Thông báo cho:</b>
            <div class="pt-1">
              <UserDepartmentTreeSelect
                v-model:modelValue="model.list_user"
                :multiple="true"
              ></UserDepartmentTreeSelect>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-3">
          <div class="form-group">
            <b>Số đề cương:</b>
            <div class="pt-1">
              <input
                class="form-control form-control-sm"
                v-model="model.madecuong"
              />
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group">
            <b>Số nghiên cứu:</b>
            <div class="pt-1">
              <input
                class="form-control form-control-sm"
                v-model="model.manghiencuu"
              />
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group">
            <b>Số phân tích:</b>
            <div class="pt-1">
              <input
                class="form-control form-control-sm"
                v-model="model.maphantich"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <b class="col-12 col-lg-12 col-form-label">Mẫu:</b>
        <div class="col-12 col-lg-12 pt-1">
          <FormTime></FormTime>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-12 text-center">
          <Button
            label="Lưu lại"
            icon="pi pi-save"
            class="p-button-success p-button-sm mr-2"
            @click.once="submit()"
          ></Button>
        </div>
      </div>
    </div>
  </div>

  <Loading :waiting="waiting"></Loading>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { useHold } from "../../stores/Hold";
import { useGeneral } from "../../stores/general";
import StageTreeSelect from "../TreeSelect/StageTreeSelect.vue";
import Api from "../../api/Api";
import Loading from "../Loading.vue";
import FormTime from "./FormTime.vue";
import Button from "primevue/button";
import HoldApi from "../../api/HoldApi";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import StageApi from "../../api/StageApi";
import { rand } from "../../utilities/rand";
import UserDepartmentTreeSelect from "../TreeSelect/UserDepartmentTreeSelect.vue";
const toast = useToast();
const router = useRouter();
const waiting = ref(false);
const store_Hold = useHold();
const { model, datatable, list_add, list_update, list_delete, startEvent } =
  storeToRefs(store_Hold);
const check_time = store_Hold.check_time;
// watch(model, (newValue, oldValue) => {
//     dates.value = [newValue.date_from, newValue.date_to];
// }, { immediate: true });
const changeStage = async () => {
  if (!startEvent.value) return;
  var times = await StageApi.getTime(model.value.stage_id);
  var targets = await StageApi.getListTarget(model.value.stage_id);
  let data = [];
  for (let time of times) {
    data.push({
      ids: rand(),
      time: time.time,
      time_type: time.time_type,
      based: time.based,
      type: 1,
      list_target: targets,
    });
  }
  if (!list_delete.value) {
    list_delete.value = [];
  }
  for (var item of datatable.value) {
    if (!item.ids) {
      list_delete.value.push(item);
    }
  }
  datatable.value = data;

  check_time();
  // console.log(times);
  console.log(targets);
};
const submit = () => {
  // console.log(model.value);
  if (!vaild()) {
    alert("Điền đây đủ thông tin (*)!");
    return;
  }
  model.value.list_add = list_add.value;
  model.value.list_update = list_update.value.map((item) => {
    delete item.targets;
    return item;
  });
  model.value.list_delete = list_delete.value.map((item) => {
    delete item.targets;
    return item;
  });

  var params = model.value;
  HoldApi.Save(params).then((res) => {
    if (res.success) {
      toast.add({
        severity: "success",
        summary: "Thành công",
        detail: "Thành công",
        life: 3000,
      });
      router.push("/Hold");
    } else {
      toast.add({
        severity: "error",
        summary: "Lỗi",
        detail: res.message,
        life: 3000,
      });
    }
    // console.log(response)
  });
};
const vaild = () => {
  if (!model.value.tensp) return false;
  if (!model.value.masp) return false;
  if (!model.value.malo) return false;
  if (!model.value.stage_id) return false;
  if (!model.value.date_manufacture) return false;
  if (!model.value.date_start) return false;
  return true;
};
onMounted(() => {});
</script>