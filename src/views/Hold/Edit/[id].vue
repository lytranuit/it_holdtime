<template>
  <div class="row clearfix">
    <div class="col-12">
      <form method="POST" id="form">
        <section class="card card-fluid">
          <div class="card-body">
            <Form></Form>
          </div>
        </section>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import HoldApi from "../../../api/HoldApi.js";
import Form from "../../../components/Hold/Form.vue";
import { useHold } from "../../../stores/Hold.js";
import moment from "moment/moment";
const store_Hold = useHold();
const { model, datatable, startEvent } = storeToRefs(store_Hold);
const route = useRoute();
onMounted(async () => {
  store_Hold.reset();
  var res = await HoldApi.get(route.params.id);
  res.date_start = res.date_start
    ? moment(res.date_start).format("YYYY-MM-DD")
    : null;
  res.date_manufacture = res.date_manufacture
    ? moment(res.date_manufacture).format("YYYY-MM-DD")
    : null;
  model.value = res;

  var list_user = await HoldApi.getListAlert(route.params.id);
  model.value.list_user = list_user;
  var times = await HoldApi.getTime(route.params.id);
  for (var data of times) {
    data.date_theory = data.date_theory
      ? moment(data.date_theory).format("YYYY-MM-DD")
      : null;
    data.date_reality = data.date_reality
      ? moment(data.date_reality).format("YYYY-MM-DD")
      : null;
    data.list_target = data.targets.map((x) => x.target_id);
    // list_target_time.value = list_target_time.value.concat(data.targets);
    // delete data.targets;
  }
  // console.log(list_target_time.value);
  datatable.value = times;
  startEvent.value = true;
});
</script>
