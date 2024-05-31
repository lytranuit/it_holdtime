<template>
  <TreeSelect
    :options="stages"
    :multiple="multiple"
    :modelValue="modelValue"
    :normalizer="normalizer"
    :flat="flat"
    :name="name"
    :required="required"
    :value-consists-of="valueConsistsOf"
    :append-to-body="true"
    @update:modelValue="emit('update:modelValue', $event)"
    :disable-branch-nodes="true"
    :default-expand-level="Infinity"
  ></TreeSelect>
</template>

<script setup>
// import TreeSelect from "vue3-acies-treeselect";
import { useGeneral } from "../../stores/general";
import { storeToRefs } from "pinia";
import { computed, onMounted } from "vue";
import Api from "../../api/Api";
const props = defineProps({
  modelValue: {
    type: [String, Array, Number],
  },
  valueConsistsOf: String, //ALL_WITH_INDETERMINATE
  multiple: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: "location",
  },
  flat: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["update:modelValue"]);
const store = useGeneral();
const { stages } = storeToRefs(store);
const normalizer = (node) => {
  return {
    id: node.id,
    label: node.name,
  };
};
onMounted(() => {
  store.fetchStages();
});
</script>
