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

import { useHold } from "../../stores/Hold";
import Form from "../../components/Hold/Form.vue";
import { storeToRefs } from "pinia";
const store_Hold = useHold();
const { startEvent } = storeToRefs(store_Hold);
onMounted(() => {
  store_Hold.reset();
  startEvent.value = true;
});
</script>
