import { ref, computed } from "vue";
import { defineStore } from "pinia";
import Api from "../api/Api";

export const useGeneral = defineStore("General", () => {
  const targets = ref([]);
  const stages = ref([]);
  const fetchTargets = () => {
    if (targets.value.length) return;
    Api.targets().then((res) => {
      targets.value = res;
    });
  }
  const fetchStages = () => {
    if (stages.value.length) return;
    Api.stages().then((res) => {
      stages.value = res;
    });
  }
  return {
    fetchTargets,
    fetchStages,
    targets,
    stages
  };
});
