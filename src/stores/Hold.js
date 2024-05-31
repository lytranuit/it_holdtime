import { ref, computed } from "vue";
import { defineStore } from "pinia";
import moment from "moment/moment";

export const useHold = defineStore("Hold", () => {
  const visibleDialog = ref(false);
  const headerForm = ref("Tạo mới");
  const datatable = ref([]);
  const list_delete = ref([]);
  const list_target_time = ref([]);
  const waiting = ref();
  const model = ref({});
  const startEvent = ref(false);

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
    list_target_time.value = [];
    startEvent.value = false;
  };
  const check_time = () => {
    for (var data of datatable.value) {
      if (data.based == "date_start") {
        if (model.value.date_start) {
          let date_theory = moment(model.value.date_start).add(
            data.time,
            data.time_type
          );
          data.date_theory = date_theory.format("YYYY-MM-DD");
        } else {
          data.date_theory = null;
        }
      } else if (data.based == "date_manufacture") {
        console.log(model.value.date_manufacture);
        if (model.value.date_manufacture) {
          let date_theory = moment(model.value.date_manufacture).add(
            data.time,
            data.time_type
          );
          data.date_theory = date_theory.format("YYYY-MM-DD");
        } else {
          data.date_theory = null;
        }
      } else {
      }
    }
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
    list_target_time,
    startEvent,
    reset,
    check_time
  };
});
