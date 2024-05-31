<template>
  <li class="dd-item" :data-id="node.id" :id="'menuItem_' + node.id">
    <div class="dd-handle">
      <div>
        <span
          class="showhide"
          v-if="node.children && node.children.length > 0 && node.is_expand"
          @click="node.is_expand = !node.is_expand"
          >-</span
        >
        <span
          class="showhide"
          v-else-if="
            node.children && node.children.length > 0 && !node.is_expand
          "
          @click="node.is_expand = !node.is_expand"
          >+</span
        >
        <a href="#" @click="edit(node)">{{ node.name }}</a>
      </div>
      <div class="dd-nodrag btn-group ml-auto">
        <button class="btn btn-sm btn-outline-light">
          <i class="far fa-edit"></i>
        </button>
        <button
          class="btn btn-sm btn-outline-light ml-2"
          @click="remove(node.id)"
        >
          <i class="far fa-trash-alt"></i>
        </button>
      </div>
    </div>
    <ol class="dd-list" v-show="node.is_expand">
      <TreeLocation
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        @edit="edit"
        @remove="remove"
      />
    </ol>
  </li>
</template>

<script setup>
const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["edit", "remove"]);
const edit = (n) => {
  emit("edit", n);
};
const remove = (id) => {
  emit("remove", id);
};
</script>
