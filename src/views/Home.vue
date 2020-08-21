<template>
  <Draggable
    v-model="array"
    v-bind="dragOptions"
    @start="start"
    @end="end"
    tag="div"
    handle=".listName"
    class="listsContainer"
  >
    <div class="list" v-for="el in array" :key="el.id">
      <h2 class="listName">{{ el.text }}</h2>
      <div class="tasksContainer">
        <Draggable
          @start="start"
          @end="end"
          :list="el.list"
          v-bind="dragOptions"
          group="tasks"
        >
          <div class="task" v-for="task in el.list" :key="task.id">
            {{ task.text }}
          </div>
        </Draggable>
      </div>
      <div class="addTask">+</div>
    </div>
  </Draggable>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Draggable from "vuedraggable";

@Component({ components: { Draggable } })
export default class Home extends Vue {
  get dragOptions() {
    return {
      animation: 300
    };
  }
  array: Array<object> = [
    {
      id: 0,
      text: "text1",
      list: [
        { id: 0, text: "list1-0" },
        { id: 1, text: "list1-1" },
        { id: 2, text: "list1-2" },
        { id: 3, text: "list1-3" },
        { id: 4, text: "list1-4" },
        { id: 5, text: "list1-5" }
      ]
    },
    {
      id: 1,
      text: "text2",
      list: [
        { id: 6, text: "list2-0" },
        { id: 7, text: "list2-1" },
        { id: 8, text: "list2-2" },
        { id: 9, text: "list2-3" },
        { id: 10, text: "list2-4" },
        { id: 11, text: "list2-5" }
      ]
    },
    {
      id: 2,
      text: "text3",
      list: [
        { id: 12, text: "list3-0" },
        { id: 13, text: "list3-1" },
        { id: 14, text: "list3-2" },
        { id: 15, text: "list3-3" },
        { id: 16, text: "list3-4" },
        { id: 17, text: "list3-5" }
      ]
    },
    {
      id: 3,
      text: "text4",
      list: [
        { id: 18, text: "list4-0" },
        { id: 19, text: "list4-1" },
        { id: 20, text: "list4-2" },
        { id: 21, text: "list4-3" },
        { id: 22, text: "list4-4" },
        { id: 23, text: "list4-5" }
      ]
    }
  ];
  start(e: any) {
    e.item.classList.add("hide");
  }
  end(e: any) {
    e.item.classList.remove("hide");
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/config.scss";

.listsContainer {
  display: flex;
  align-items: flex-start;

  & .list {
    margin: 1rem;
    width: 250px;
    border-radius: 6px;
    background-color: $color-light;

    & .listName {
      cursor: grab;
    }

    & .tasksContainer {
      min-height: 50px;
      background-color: gray;
      padding: 1rem 0;

      & .task {
        background-color: $color-light;
        padding: 1rem;
        margin: 1rem;
        border-radius: 6px;
      }
    }
  }
}
.hide {
  opacity: 0;
}
</style>
