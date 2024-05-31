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

import { useStage } from "../../stores/Stage";
import Form from "../../components/Stage/Form.vue";
const store_Stage = useStage();
onMounted(() => {
  store_Stage.reset();
});
</script>
