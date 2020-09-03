<template>
  <transition name="fade">
    <Modal v-if="isModalOpen">
      <div class="assignUserModal">
        <div class="header">
          <h2>Przydziel użytkownika do zadania</h2>
        </div>
        <div class="search">
          <input class="searchbox" v-model="searchValue" placeholder="Szukaj..." type="text" />
          <p class="searchIcon"><i class="fas fa-search"></i></p>
          <transition name="searchbox">
            <div v-if="filteredUsers.length > 0" class="searchResults">
              <div @click="selectUser(user)" v-for="user in filteredUsers" :key="user.id" class="result">
                <p>{{ user.first_name + " " + user.last_name }}</p>
                <p><i class="fas fa-user"></i></p>
              </div>
            </div>
          </transition>
        </div>
        <transition name="fade" mode="out-in">
          <div :key="1" class="usersList" v-if="!selectedUser">
            <div @click="selectUser(user)" v-for="user in usersWithJob" :key="user.id" class="user">
              <p>{{ `${user.first_name} ${user.last_name}` }}</p>
              <p>{{ user.job_title }}</p>
            </div>
          </div>
          <div :key="2" class="selectedUser" v-else>
            <button @click="selectUser(null)">Wróć do listy</button>
            <div>
              <p>Wybrany użytkownik</p>
              <img :src="selectedUser.avatar" alt="avatar" />
              <p class="userName">{{ selectedUser.first_name + " " + selectedUser.last_name }}</p>
              <p>{{ selectedUser.job_title }}</p>
            </div>
          </div>
        </transition>
        <div class="footer">
          <div class="submitButtons">
            <button @click="toggleModal">Zamknij</button>
            <button @click="assignUser" v-if="selectedUser"><i class="fas fa-user"></i> Przydziel</button>
          </div>
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

  get usersWithJob() {
    return this.users.filter(user => user.job_title);
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
@import "@/styles/config.scss";
.assignUserModal {
  height: 500px;
  width: 400px;
  overflow: hidden;
  padding: 0;

  @media (max-width: 450px) {
    width: 100%;
  }

  .header {
    height: 50px;
    background-color: blue;

    h2 {
      color: white;
      font-size: 1rem;
      font-weight: normal;
      line-height: 50px;
      padding-left: 1rem;
    }
  }

  .usersList {
    margin: 0 auto;
    border-radius: 6px;
    height: 300px;
    background-color: #f3f5f8;
    width: 80%;
    overflow-y: auto;
    @include customScrollbar;

    .user {
      background-color: white;
      margin: 1rem 0.5rem;
      border-radius: 10px;
      border: 1px solid $color-light;
      transition: 0.2s;
      cursor: pointer;

      > p {
        margin: 0.3rem;
        font-size: 0.8rem;
      }
      > p:first-child {
        color: blue;
      }

      &:hover {
        box-shadow: 0px 4px 8px rgba($color: lightgray, $alpha: 0.6);
      }
    }
  }

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
      border: 1px solid blue;
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

    button {
      @include blueButton;
      font-size: 0.8rem;
      padding: 0.5rem 0.8rem;
      margin-bottom: 0.8rem;
    }

    > div {
      padding: 1rem;
      border: 1px solid $color-light;
      border-radius: 10px;
      text-align: center;
      & img {
        height: 150px;
      }

      & .userName {
        margin-top: 0.5rem;
        font-weight: bold;
      }
    }
  }

  .footer {
    background-color: #f3f5f8;
    position: absolute;
    bottom: 0;
    height: 70px;
    width: 100%;
    .submitButtons {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      & button {
        @include blueButton;
        outline: none;
        padding: 0.5rem 0.8rem;
        margin-right: 0.8rem;
      }
    }
  }
}

.searchbox-enter-active,
.searchbox-leave-active {
  transition: 0.35s;
  top: 100%;
}
.searchbox-enter,
.searchbox-leave-to {
  opacity: 0;
  top: 130%;
}

.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity 0.25s ease;
}
.fade-leave {
}
.fade-leave-active {
  transition: opacity 0.25s ease;
  opacity: 0;
}
</style>
