<template>
  <transition name="fade">
    <Modal v-if="isModalOpen">
      <div class="assignUserModal">
        <h2>Przydziel użytkownika do zadania</h2>
        <div class="search">
          <input class="searchbox" v-model="searchValue" placeholder="Szukaj..." type="text" />
          <p class="searchIcon"><i class="fas fa-search"></i></p>
          <div class="searchResults">
            <div @click="selectUser(user)" v-for="user in filteredUsers" :key="user.id" class="result">
              <p>{{ user.first_name + " " + user.last_name }}</p>
              <p><i class="fas fa-user"></i></p>
            </div>
          </div>
        </div>
        <div class="selectedUser" v-if="selectedUser">
          <p>Wybrany użytkownik</p>
          <img :src="selectedUser.avatar" alt="xd" />
          <p class="userName">{{ selectedUser.first_name + " " + selectedUser.last_name }}</p>
          <p>{{ selectedUser.job_title }}</p>
        </div>
        <div class="submitButtons">
          <button @click="toggleModal"><i class="fas fa-times" /></button>
          <button @click="assignUser" v-if="selectedUser"><i class="fas fa-user"></i> Przydziel</button>
        </div>
      </div>
    </Modal>
  </transition>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { getUsers } from "@/store/api";
import UserModel from "@/store/models/UserModel";
import Modal from "@/components/Modal.vue";
import tasks from "@/store/modules/tasks";

@Component({ components: { Modal } })
export default class AssignUserModal extends Vue {
  @Prop() isModalOpen!: boolean;
  @Prop() toggleModal!: Function;
  @Prop() updateTask!: Function;
  @Prop() columnOrder!: number;
  @Prop() taskOrder!: number;

  users: Array<UserModel> = [];
  selectedUser: UserModel | null = null;
  searchValue = "";

  async created() {
    this.users = await getUsers();
  }

  get filteredUsers() {
    const matchedUsers: Array<UserModel> = [];
    const searchVal = this.searchValue.toLowerCase();

    if (searchVal.trim().length < 2) return matchedUsers;
    this.users.forEach(user => {
      if (
        (user.first_name.toLowerCase().includes(searchVal) || user.last_name.toLowerCase().includes(searchVal)) &&
        user.job_title
      )
        matchedUsers.push(user);
    });
    return matchedUsers;
  }

  selectUser(user: UserModel) {
    this.selectedUser = user;
    this.searchValue = "";
  }
  assignUser() {
    if (this.selectedUser)
      tasks.assignUserToTask({ columnOrder: this.columnOrder, taskOrder: this.taskOrder, user: this.selectedUser });
    this.updateTask();
    this.toggleModal();
  }
}
</script>

<style lang="scss" scoped>
.assignUserModal {
  height: 500px;

  & .search {
    margin: 1rem auto;
    width: 250px;
    position: relative;

    & .searchbox {
      transition: border 0.2s linear;
      font-size: 1rem;
      width: 100%;
      background: #f5f8fa;
      color: #000;
      padding: 8px 32px 8px 12px;
      height: 30px;
      border: 1px solid #e6ecf0;
      border-radius: 50px;
      outline: none;
    }

    & .searchbox:focus {
      transition: border 0.2s linear;
      border: 2px solid green;
    }

    & .searchIcon {
      position: absolute;
      font-size: 20px;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      color: #66757f;
      background-color: transparent;
    }

    & .searchResults {
      position: absolute;
      width: 100%;
      margin-top: 0.5rem;
      background-color: rgb(248, 248, 248);
      border-radius: 6px;
      box-shadow: 0px 6px 12px rgba($color: #000000, $alpha: 0.25);

      & .result {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
        height: 30px;
        border-bottom: 1px solid lightgray;
        cursor: pointer;
        transition: 0.2s;

        &:hover {
          color: blue;
        }
      }
    }
  }
  & .selectedUser {
    display: flex;
    flex-direction: column;
    align-items: center;

    & img {
      width: 70%;
    }

    & .userName {
      margin-top: 0.5rem;
      font-weight: bold;
    }
  }
  & .submitButtons {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);

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
