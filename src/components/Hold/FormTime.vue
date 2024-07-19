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
      v-model:expandedRows="expandedRows"
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
          <template v-else-if="col.data == 'name'">
            <div class="text-center">
              <input
                class="form-control form-control-sm"
                type="text"
                v-model="slotProps.data.name"
                :disabled="slotProps.data.is_pass != null"
              />
            </div>
          </template>
          <template v-else-if="col.data == 'type'">
            <div class="text-center">
              <select
                class="form-control form-control-sm"
                v-model="slotProps.data.type"
                :disabled="slotProps.data.is_pass != null"
              >
                <option value="1">Thử nghiệm</option>
                <option value="2">Backup</option>
              </select>
            </div>
          </template>
          <template v-else-if="col.data == 'time'">
            <div class="text-center">
              <input
                class="form-control form-control-sm"
                type="number"
                v-model="slotProps.data.time"
                style="width: 50px; display: inline-block; margin-right: 5px"
                @change="check_time"
                :disabled="slotProps.data.is_pass != null"
              />
              <select
                class="form-control form-control-sm"
                v-model="slotProps.data.time_type"
                style="width: 200px; display: inline-block"
                @change="check_time"
                :disabled="slotProps.data.is_pass != null"
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
              @change="check_time"
              :disabled="slotProps.data.is_pass != null"
            >
              <option value="date_start">Ngày bắt đầu</option>
              <option value="date_manufacture">Ngày sản xuất</option>
              <option value="custom">Tùy chỉnh</option>
            </select>
          </template>

          <template v-else-if="col.data == 'is_remind'">
            <div class="text-center">
              <InputSwitch v-model="slotProps.data.is_remind" />
            </div>
          </template>
          <template v-else-if="col.data == 'date_theory'">
            <div class="text-center">
              <input
                class="form-control form-control-sm"
                type="date"
                v-model="slotProps.data.date_theory"
                :disabled="
                  slotProps.data.based != 'custom' ||
                  slotProps.data.is_pass != null
                "
              />
            </div>
          </template>
          <template v-else-if="col.data == 'list_target'">
            <TargetTreeSelect
              :multiple="true"
              v-model="slotProps.data.list_target"
              :disabled="slotProps.data.is_pass != null"
            ></TargetTreeSelect>
          </template>
          <template v-else-if="col.data == 'date_reality'">
            <div class="text-center">
              <input
                class="form-control form-control-sm"
                :class="check_date_reality(slotProps.data)"
                type="date"
                v-model="slotProps.data.date_reality"
                :disabled="slotProps.data.is_pass != null"
              /></div
          ></template>

          <template
            v-else-if="
              col.data == 'is_pass' &&
              slotProps.data.date_reality &&
              slotProps.data.id > 0
            "
          >
            <a href="#" @click="nhapketqua(slotProps.data)">
              <i
                class="pi"
                :class="{
                  'pi-check-circle text-success mr-2':
                    slotProps.data.is_pass == true,
                  'pi-times-circle text-danger mr-2':
                    slotProps.data.is_pass == false,
                }"
              ></i>
              <template v-if="slotProps.data.is_pass == true">Đạt</template>
              <template v-else-if="slotProps.data.is_pass == false"
                >Không đạt</template
              >
              <template v-else>Nhập kết quả</template>
            </a>
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
    header="Kết quả"
    style="width: 50vw"
    :breakpoints="{ '1199px': '75vw', '575px': '95vw' }"
  >
    <div class="row align-items-center">
      <div class="col-3"><b>Chỉ tiêu</b></div>

      <div class="col-6">
        <div v-for="target of dialog.targets" :key="target.id">
          <div class="my-2">{{ target.target.name }}</div>
          <div>
            <SelectButton
              v-model="target.is_pass"
              :options="[
                { name: 'Đạt', value: true },
                { name: 'Không đạt', value: false },
              ]"
              optionLabel="name"
              optionValue="value"
              :pt="{ button: { class: 'p-button-sm' } }"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="row align-items-center">
      <div class="col-12 my-2"><b>Kết quả</b></div>

      <div class="col-6">
        <SelectButton
          v-model="dialog.is_pass"
          :options="[
            { name: 'Đạt', value: true },
            { name: 'Không đạt', value: false },
          ]"
          optionLabel="name"
          optionValue="value"
          :pt="{ button: { class: 'p-button-sm' } }"
        />
      </div>
    </div>

    <div class="d-flex justify-content-center mt-2">
      <Button
        type="button"
        label="Lưu lại"
        severity="success"
        icon="pi pi-save"
        @click="Capnhatketqua"
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
import InputSwitch from "primevue/inputswitch";
import SelectButton from "primevue/selectbutton";
import { storeToRefs } from "pinia";

import { useConfirm } from "primevue/useconfirm";
import { rand } from "../../utilities/rand";
import { useHold } from "../../stores/Hold";
import { useToast } from "primevue/usetoast";
import moment from "moment/moment";
import TargetTreeSelect from "../TreeSelect/TargetTreeSelect.vue";
import HoldApi from "../../api/HoldApi";
import { useAuth } from "../../stores/auth";
const toast = useToast();
const visible = ref();
const dialog = ref({});
const editRow = ref({});
const expandedRows = ref([]);
const store_auth = useAuth();
const { is_admin, is_manager } = storeToRefs(store_auth);
const store_Hold = useHold();
const { datatable, model, list_delete } = storeToRefs(store_Hold);
const check_time = store_Hold.check_time;
const confirm = useConfirm();

const loading = ref(false);
const selected = ref();
const columns = ref([
  {
    label: "Tên mẫu",
    data: "name",
    className: "text-center",
  },
  {
    label: "Loại mẫu",
    data: "type",
    className: "text-center",
  },
  {
    label: "Thời gian",
    data: "time",
    className: "text-center",
  },
  {
    label: "So với",
    data: "based",
    className: "text-center",
  },
  {
    label: "Ngày lấy mẫu lý thuyết",
    data: "date_theory",
    className: "text-center",
  },
  {
    label: "Nhắc nhở",
    data: "is_remind",
    className: "text-center",
  },
  {
    label: "Ngày lấy mẫu thực tế",
    data: "date_reality",
    className: "text-center",
  },

  {
    label: "Chỉ tiêu",
    data: "list_target",
    className: "text-center",
  },
  {
    label: "Kết quả",
    data: "is_pass",
    className: "text-center",
  },
]);
const selectedColumns = computed(() => {
  return columns.value.filter((col) => col.hide != true);
});
const addRow = () => {
  datatable.value.push({
    ids: rand(),
    time: 0,
    time_type: "h",
    based: "date_start",
    type: 1,
    is_remind: true,
  });
  check_time();
};
const check_date_reality = (data) => {
  if (data.date_reality != null) return {};
  var re = {};
  if (data.date_theory < moment().format("YYYY-MM-DD")) {
    re["text-danger"] = true;
  }
  if (data.date_theory == moment().format("YYYY-MM-DD")) {
    re["text-primary"] = true;
  }
  return re;
};
const nhapketqua = (data) => {
  visible.value = true;
  dialog.value = data;

  // console.log(data);
};
const Capnhatketqua = async () => {
  var res = await HoldApi.SaveHoldTimeTargetModel({
    data: dialog.value.targets,
  });
  if (res.success) {
    visible.value = false;
  } else {
    toast.add({
      severity: "error",
      summary: "Lỗi",
      life: 3000,
    });
  }
};
const confirmDeleteSelected = () => {
  confirm.require({
    message: "Bạn có chắc muốn xóa những dòng đã chọn?",
    header: "Xác nhận",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      removeRow();

      // selected
    },
  });
};
const removeRow = () => {
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
};
onMounted(async () => {});
</script>
<style>
.list_target {
  max-width: 400px;
}
</style>