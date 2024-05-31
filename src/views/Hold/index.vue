<template>
  <div class="row clearfix">
    <div class="col-12">
      <h5 class="card-header drag-handle">
        <RouterLink to="Hold/add">
          <Button
            label="Tạo mới"
            icon="pi pi-plus"
            class="p-button-success p-button-sm mr-2"
          ></Button>
        </RouterLink>
      </h5>
      <section class="card card-fluid">
        <div class="card-body" style="overflow: auto; position: relative">
          <DataTable
            class="p-datatable-customers"
            showGridlines
            :value="datatable"
            :lazy="true"
            ref="dt"
            v-model:selection="selectedProducts"
            :paginator="true"
            :rowsPerPageOptions="[10, 50, 100]"
            :rows="rows"
            :totalRecords="totalRecords"
            @page="onPage($event)"
            :rowHover="true"
            :loading="loading"
            responsiveLayout="scroll"
            :resizableColumns="true"
            columnResizeMode="expand"
            v-model:filters="filters"
            filterDisplay="menu"
          >
            <template #header>
              <div style="width: 200px">
                <TreeSelect
                  :options="columns"
                  v-model="showing"
                  multiple
                  :limit="0"
                  :limitText="(count) => 'Hiển thị: ' + count + ' cột'"
                >
                </TreeSelect>
              </div>
            </template>

            <template #empty> Không có dữ liệu. </template>
            <Column
              v-for="col of selectedColumns"
              :field="col.data"
              :header="col.label"
              :key="col.data"
              :showFilterMatchModes="false"
            >
              <template #body="slotProps">
                <template v-if="col.data == 'id'">
                  <RouterLink :to="'/Hold/edit/' + slotProps.data[col.data]">
                    <i class="fas fa-pencil-alt mr-2"></i>
                    {{ slotProps.data[col.data] }}
                  </RouterLink>
                </template>
                <template v-else-if="col.data == 'stage_id'">
                  {{ slotProps.data.stage.name }}
                </template>
                <template v-else-if="col.data == 'date_start'">
                  {{ formatDate(slotProps.data[col.data]) }}
                </template>
                <template v-else-if="col.data == 'date_manufacture'">
                  {{ formatDate(slotProps.data[col.data]) }}
                </template>
                <div
                  v-else
                  v-html="slotProps.data[col.data]"
                  style="white-space: break-spaces; word-wrap: break-word"
                ></div>
              </template>
              <template
                #filter="{ filterModel, filterCallback }"
                v-if="col.filter == true"
              >
                <template v-if="col.data == 'stage_id'">
                  <div style="width: 200px">
                    <StageTreeSelect
                      v-model="filterModel.value"
                    ></StageTreeSelect>
                  </div>
                </template>
                <InputText
                  type="text"
                  v-model="filterModel.value"
                  @keydown.enter="filterCallback()"
                  class="p-column-filter"
                  v-else
                />
              </template>
            </Column>
            <Column style="width: 1rem">
              <template #body="slotProps">
                <a
                  class="p-link text-danger font-16"
                  @click="confirmDelete(slotProps.data['id'])"
                  ><i class="pi pi-trash"></i
                ></a>
              </template>
            </Column>
          </DataTable>
        </div>
      </section>
    </div>
    <Loading :waiting="waiting"></Loading>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import HoldApi from "../../api/HoldApi";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import { FilterMatchMode } from "primevue/api";
import Column from "primevue/column"; ////Datatable
import InputText from "primevue/inputtext";
import { useConfirm } from "primevue/useconfirm";
import Loading from "../../components/Loading.vue";
import { useHold } from "../../stores/Hold";
import { storeToRefs } from "pinia";
import { formatDate } from "../../utilities/util";
import { useRouter } from "vue-router";
import Api from "../../api/Api";
import StageTreeSelect from "../../components/TreeSelect/StageTreeSelect.vue";
import { useGeneral } from "../../stores/general";
///Form
const store_Hold = useHold();
const { model, headerForm, visibleDialog } = storeToRefs(store_Hold);
const router = useRouter();
const confirm = useConfirm();
const datatable = ref();
const columns = ref([
  {
    id: 0,
    label: "ID",
    data: "id",
    className: "text-center",
    filter: true,
  },
  {
    id: 1,
    label: "Công đoạn",
    data: "stage_id",
    className: "text-center",
    filter: true,
  },
  {
    id: 2,
    label: "Tên sản phẩm",
    data: "tensp",
    className: "text-center",
    filter: true,
  },
  {
    id: 3,
    label: "Mã sản phẩm",
    data: "masp",
    className: "text-center",
    filter: true,
  },
  {
    id: 4,
    label: "Số lô",
    data: "malo",
    className: "text-center",
    filter: true,
  },
  {
    id: 5,
    label: "Mã nghiên cứu",
    data: "manghiencuu",
    className: "text-center",
    filter: true,
  },
  {
    id: 6,
    label: "Số phân tich",
    data: "maphantich",
    className: "text-center",
    filter: true,
  },
  {
    id: 7,
    label: "Số đề cương",
    data: "madecuong",
    className: "text-center",
    filter: true,
  },
  {
    id: 8,
    label: "Ngày bắt đầu",
    data: "date_start",
    className: "text-center",
  },
  {
    id: 9,
    label: "Ngày sản xuất",
    data: "date_manufacture",
    className: "text-center",
  },
]);
const filters = ref({});

const totalRecords = ref(0);
const loading = ref(true);
const showing = ref([]);
const column_cache = "columns_Hold"; ////
const first = ref(0);
const rows = ref(10);
const draw = ref(0);
const selectedProducts = ref();
const selectedColumns = computed(() => {
  return columns.value.filter((col) => showing.value.includes(col.id));
});
const lazyParams = computed(() => {
  let data_filters = {};
  for (let key in filters.value) {
    data_filters[key] = filters.value[key].value;
  }
  return {
    draw: draw.value,
    start: first.value,
    length: rows.value,
    filters: data_filters,
  };
});
const dt = ref(null);

////Data table
const loadLazyData = () => {
  loading.value = true;
  HoldApi.table(lazyParams.value).then((res) => {
    // console.log(res);
    datatable.value = res.data;
    totalRecords.value = res.recordsFiltered;
    loading.value = false;
  });
};
const onPage = (event) => {
  first.value = event.first;
  rows.value = event.rows;
  draw.value = draw.value + 1;
  loadLazyData();
};

const confirmDelete = (id) => {
  confirm.require({
    message: "Bạn có muốn xóa row này?",
    header: "Xác nhận",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      HoldApi.delete(id).then((res) => {
        loadLazyData();
      });
    },
  });
};
const getFilters = () => {
  filters.value = Object.fromEntries(
    columns.value
      .filter((item) => item.filter == true)
      .map((item) => [
        item.data,
        { value: null, matchMode: FilterMatchMode.CONTAINS },
      ])
  );
};
onMounted(() => {
  let cache = localStorage.getItem(column_cache);
  if (!cache) {
    showing.value = columns.value.map((item) => {
      return item.id;
    });
  } else {
    showing.value = JSON.parse(cache);
  }
  loadLazyData();
  getFilters();
});
const waiting = ref();
watch(filters, async (newa, old) => {
  first.value = 0;
  loadLazyData();
});
</script>
