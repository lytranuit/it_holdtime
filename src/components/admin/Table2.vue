<template>
  <div class="col-lg-6">
    <div class="card">
      <div class="card-header text-danger">
        <b class="text-uppercase">Quá ngày lấy mẫu</b>
      </div>
      <div class="card-body">
        <div class="mt-2">
          <DataTable
            class="dt-responsive-table"
            showGridlines
            :value="datatable"
            :lazy="true"
            ref="dt"
            size="small"
            :paginator="true"
            :rowsPerPageOptions="[10, 50, 100]"
            :rows="rows"
            :totalRecords="totalRecords"
            @page="onPage($event)"
            :rowHover="true"
            responsiveLayout="scroll"
            :resizableColumns="true"
            columnResizeMode="expand"
            v-model:filters="filters"
            filterDisplay="menu"
          >
            <template #empty>
              <div class="text-center">Không có dữ liệu.</div>
            </template>
            <Column
              v-for="col in columns"
              :field="col.data"
              :header="col.label"
              :key="col.data"
              :showFilterMatchModes="false"
              :class="col.data"
              :className="col.className"
            >
              <template #body="slotProps">
                <template v-if="col.data == 'tensp'">
                  <RouterLink
                    class="text-primary"
                    :to="'Hold/edit/' + slotProps.data.hold_id"
                    >{{ slotProps.data[col.data] }}
                  </RouterLink></template
                >
                <template v-else> {{ slotProps.data[col.data] }}</template>
              </template>
            </Column>
          </DataTable>
        </div>
        <!--end /div-->
      </div>
      <!--end card-body-->
    </div>
    <!--end card-->
  </div>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import adminApi from "../../api/adminApi.js";
import { FilterMatchMode } from "primevue/api";

const datatable = ref();
const columns = ref([
  {
    label: "Tên sản phẩm",
    data: "tensp",
    className: "text-center",
  },
  {
    label: "Mã sản phẩm",
    data: "masp",
    className: "text-center",
  },
  {
    label: "Số lô",
    data: "malo",
    className: "text-center",
  },
  {
    label: "Công đoạn",
    data: "stage",
    className: "text-center",
  },
  {
    label: "Mẫu",
    data: "name",
    className: "text-center",
  },
  {
    label: "Ngày lấy mẫu",
    data: "date_theory",
    className: "text-center",
  },
]);
const filters = ref({
  id: { value: null, matchMode: FilterMatchMode.CONTAINS },
  code: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const totalRecords = ref(0);
const loading = ref(true);
const showing = ref([]);
const first = ref(0);
const rows = ref(10);
const draw = ref(0);
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
  adminApi.table2(lazyParams.value).then((res) => {
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

onMounted(() => {
  loadLazyData();
});
</script>