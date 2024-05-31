<template>
  <div class="row">
    <div class="col-md-12">
      <div class="form-group row">
        <div class="col-md-3">
          <div class="form-group">
            <b>Tên:<i class="text-danger">*</i></b>
            <div class="pt-1">
              <input
                class="form-control form-control-sm"
                v-model="model.name"
              />
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group">
            <b>Chỉ tiêu:</b>
            <div class="pt-1">
              <TargetTreeSelect
                v-model="model.list_target"
                :multiple="true"
              ></TargetTreeSelect>
            </div>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <b class="col-12 col-lg-12 col-form-label">Khoảng thời gian:</b>
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
import { useStage } from "../../stores/Stage";
import { useGeneral } from "../../stores/general";
import TargetTreeSelect from "../TreeSelect/TargetTreeSelect.vue";
import Api from "../../api/Api";
import Loading from "../Loading.vue";
import FormTime from "./FormTime.vue";
import Button from "primevue/button";
import StageApi from "../../api/StageApi";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
const toast = useToast();
const router = useRouter();
const waiting = ref(false);
const store_Stage = useStage();
const { model, datatable, list_add, list_update, list_delete } =
  storeToRefs(store_Stage);

// watch(model, (newValue, oldValue) => {
//     dates.value = [newValue.date_from, newValue.date_to];
// }, { immediate: true });

const submit = () => {
  // console.log(model.value);
  if (!vaild()) {
    alert("Điền đây đủ thông tin (*)!");
    return;
  }
  model.value.list_add = list_add.value;
  model.value.list_update = list_update.value;
  model.value.list_delete = list_delete.value;

  var params = model.value;
  StageApi.Save(params).then((res) => {
    if (res.success) {
      toast.add({
        severity: "success",
        summary: "Thành công",
        detail: "Thành công",
        life: 3000,
      });
      router.push("/Stage");
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
  if (!model.value.name) return false;
  return true;
};
onMounted(() => {});
</script>