<template>
  <transition name="fade">
    <Modal v-if="isModalOpen">
      <div class="moveTaskModal">
        <h2>Przenieś zadanie</h2>
        <div class="buttons">
          <button
            :class="{ selected: selectedColumn && selectedColumn.id === column.id }"
            @click="selectedColumn = column"
            v-for="column in availableColumns"
            :key="column.id"
          >
            {{ column.text }}
          </button>
        </div>
        <div class="submitButtons">
          <button @click="toggleModal"><i class="fas fa-times" /></button>
          <button @click="moveTask"><i class="fas fa-exchange-alt"></i> Przenieś</button>
        </div>
      </div>
    </Modal>
  </transition>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Modal from "@/components/Modal.vue";
import tasks from "@/store/modules/tasks";

interface Column {
  id: number;
  text: string;
}

@Component({ components: { Modal } })
export default class MoveTaskModal extends Vue {
  @Prop() isModalOpen!: boolean;
  @Prop() currentColumnName!: string;
  @Prop() columnOrder!: number;
  @Prop() taskOrder!: number;
  @Prop() toggleModal!: Function;
  @Prop() updateTask!: Function;

  availableColumns: Array<object> = [];
  selectedColumn: Column | null = null;

  created() {
    tasks.allTasks.forEach(column => {
      if (column.text !== this.currentColumnName) this.availableColumns.push({ id: column.id, text: column.text });
    });
  }
  moveTask() {
    if (this.selectedColumn) {
      tasks.moveTask({ columnOrder: this.columnOrder, taskOrder: this.taskOrder, columnId: this.selectedColumn.id });
      this.updateTask();
    }
    this.toggleModal();
  }
}
</script>

<style lang="scss" scoped>
.moveTaskModal {
  & h2 {
    text-align: center;
    margin-bottom: 1rem;
  }
  & .buttons {
    display: flex;
    flex-wrap: wrap;

    & button {
      flex: 0 0 50%;
      padding: 0.5rem 0;
      border: 1px solid black;
      font-size: 1rem;
      cursor: pointer;

      &.selected {
        color: white;
        background-color: green;
      }
    }
  }

  & .submitButtons {
    margin: 1rem;
    display: flex;
    justify-content: center;

    & button {
      padding: 0.5rem;
      font-size: 1rem;
      cursor: pointer;
      margin-left: 1rem;
      background-color: green;
      color: white;
      border: 1px solid black;

      &:first-child {
        padding: 0.5rem 1rem;
        background-color: red;
      }
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
