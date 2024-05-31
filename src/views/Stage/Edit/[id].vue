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
import StageApi from "../../../api/StageApi";
import Form from "../../../components/Stage/Form.vue";
import { useStage } from "../../../stores/Stage";
const store_Stage = useStage();
const { model, datatable } = storeToRefs(store_Stage);
const route = useRoute();
onMounted(async () => {
  store_Stage.reset();
  var res = await StageApi.get(route.params.id);
  model.value = res;
  var list_target = await StageApi.getListTarget(route.params.id);
  model.value.list_target = list_target;
  var times = await StageApi.getTime(route.params.id);
  datatable.value = times;
});
</script>
