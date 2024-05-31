<template>
  <div id="TableTime">
    <DataTable
      showGridlines
      :value="datatable"
      ref="dt"
      class="p-datatable-ct"
      :rowHover="true"
      :loading="loading"
      responsiveLayout="scroll"
      :resizableColumns="true"
      columnResizeMode="expand"
      v-model:selection="selected"
    >
      <template #header>
        <div class="d-inline-flex" style="width: 200px">
          <Button
            label="Thêm"
            icon="pi pi-plus"
            class="p-button-success p-button-sm mr-2"
            @click="addRow"
          ></Button>
          <Button
            label="Xóa"
            icon="pi pi-trash"
            class="p-button-danger p-button-sm"
            :disabled="!selected || !selected.length"
            @click="confirmDeleteSelected"
          ></Button>
        </div>
        <div class="d-inline-flex float-right"></div>
      </template>

      <template #empty>
        <div class="text-center">Không có dữ liệu.</div>
      </template>
      <Column selectionMode="multiple"></Column>
      <Column
        v-for="col in selectedColumns"
        :field="col.data"
        :header="col.label"
        :key="col.data"
        :showFilterMatchModes="false"
        :class="col.data"
      >
        <template #body="slotProps">
          <template v-if="col.data == 'id'">
            {{ slotProps.data[col.data] }}
          </template>
          <template v-else-if="col.data == 'time'">
            <div class="text-center">
              <input
                class="form-control form-control-sm"
                type="number"
                v-model="slotProps.data.time"
                style="width: 50px; display: inline-block; margin-right: 5px"
              />
              <select
                class="form-control form-control-sm"
                v-model="slotProps.data.time_type"
                style="width: 200px; display: inline-block"
              >
                <option value="h">Giờ</option>
                <option value="d">Ngày</option>
                <option value="w">Tuần</option>
                <option value="M">Tháng</option>
                <option value="y">Năm</option>
              </select>
            </div>
          </template>
          <template v-else-if="col.data == 'based'">
            <select
              class="form-control form-control-sm"
              v-model="slotProps.data[col.data]"
            >
              <option value="date_start">Ngày bắt đầu</option>
              <option value="date_manufacture">Ngày sản xuất</option>
              <option value="custom">Tùy chỉnh</option>
            </select>
          </template>
          <template v-else>
            {{ slotProps.data[col.data] }}
          </template>
        </template>
      </Column>
    </DataTable>
  </div>
  <Dialog
    v-model:visible="visible"
    modal
    header="Lý do hủy"
    style="width: 50vw"
    :breakpoints="{ '1199px': '75vw', '575px': '95vw' }"
  >
    <textarea
      class="form-control form-control-sm"
      v-model="editRow.note_huy"
      rows="5"
    ></textarea>

    <div class="d-flex justify-content-center mt-2">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="visible = false"
        size="small"
        class="mr-2"
      ></Button>
      <Button
        type="button"
        label="Save"
        severity="danger"
        @click="HuyChitiet"
        size="small"
      ></Button>
    </div>
  </Dialog>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { storeToRefs } from "pinia";

import { useConfirm } from "primevue/useconfirm";
import { rand } from "../../utilities/rand";
import { useAuth } from "../../stores/auth";
import { useStage } from "../../stores/Stage";
import { useGeneral } from "../../stores/general";
import StageApi from "../../api/StageApi";
import { useToast } from "primevue/usetoast";
const toast = useToast();
const visible = ref();
const editRow = ref({});

const store_Stage = useStage();
const { datatable, model, list_delete } = storeToRefs(store_Stage);
const confirm = useConfirm();

const loading = ref(false);
const selected = ref();
const columns = ref([
  {
    label: "Thời gian(*)",
    data: "time",
    className: "text-center",
  },
  {
    label: "Dựa theo(*)",
    data: "based",
    className: "text-center",
  },
]);
const selectedColumns = computed(() => {
  return columns.value.filter((col) => col.hide != true);
});
const addRow = () => {
  let stt = 0;
  if (datatable.value.length) {
    stt = datatable.value[datatable.value.length - 1].stt;
  }
  stt++;
  datatable.value.push({
    ids: rand(),
    time: 0,
    time_type: "h",
    based: "date_start",
  });
};
const confirmDeleteSelected = () => {
  confirm.require({
    message: "Bạn có chắc muốn xóa những dòng đã chọn?",
    header: "Xác nhận",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      datatable.value = datatable.value.filter((item) => {
        return !selected.value.includes(item);
      });

      if (!list_delete.value) {
        list_delete.value = [];
      }
      for (var item of selected.value) {
        if (!item.ids) {
          list_delete.value.push(item);
        }
      }
      selected.value = [];
      // selected
    },
  });
};
onMounted(async () => {});
</script>