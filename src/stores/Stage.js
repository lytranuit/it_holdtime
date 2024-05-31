import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useStage = defineStore("Stage", () => {
  const visibleDialog = ref(false);
  const headerForm = ref("Tạo mới");
  const datatable = ref([]);
  const list_delete = ref([]);
  const waiting = ref();
  const model = ref({});

  const list_add = computed(() => {
    return datatable.value.filter((item) => {
      return item.ids;
    });
  });
  const list_update = computed(() => {
    return datatable.value.filter((item) => {
      return !item.ids;
    });
  });
  const reset = () => {
    model.value = {};
    datatable.value = [];
    list_delete.value = [];
  };
  return {
    model,
    headerForm,
    visibleDialog,
    datatable,
    list_delete,
    list_add,
    list_update,
    waiting,
    reset
  };
});
