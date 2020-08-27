<template>
  <transition name="fade">
    <Modal v-if="isModalOpen">
      <div class="moveTaskModal">
        <h2>Przenieś zadanie</h2>
        <div class="buttons">
          <button
            :class="{ selected: selectedColumn && selectedColumn.id === column.id }"
            @click="handleSelectColumn(column)"
            v-for="column in availableColumns"
            :key="column.id"
          >
            {{ column.text }}
          </button>
        </div>
        <p v-if="error">{{ error }}</p>
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
import { PROJECT_MANAGER, list } from "@/store/initTasks";
import { TaskModel } from "@/store/models/TaskListModel";

interface Column {
  id: number;
  text: string;
}

@Component({ components: { Modal } })
export default class MoveTaskModal extends Vue {
  @Prop() task!: TaskModel;
  @Prop() isModalOpen!: boolean;
  @Prop() currentColumnName!: string;
  @Prop() columnOrder!: number;
  @Prop() taskOrder!: number;
  @Prop() toggleModal!: Function;
  @Prop() updateTask!: Function;

  availableColumns: Array<Column> = [];
  selectedColumn: Column | null = null;
  error: string | null = null;

  handleSelectColumn(column: Column) {
    if (column.id === list.DONE && this.task.user && this.task.user.job_title !== PROJECT_MANAGER) {
      this.error = "Przypisany użytkownik nie jest project managerem";
      return;
    }
    this.error = "";
    this.selectedColumn = column;
  }

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
@import "@/styles/config.scss";
.moveTaskModal {
  & h2 {
    text-align: center;
    margin-bottom: 1rem;
  }

  & p {
    color: red;
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
      @include submitButton;
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
