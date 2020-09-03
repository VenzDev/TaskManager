<template>
  <header class="header">
    <router-link tag="p" to="/"><i class="fas fa-sticky-note"></i> Task Manager</router-link>
    <div v-if="isHomeUrl" class="searchContainer">
      <span>Pokaż zadania dla użytkownika:</span>
      <div class="search">
        <input class="searchbox" v-model="searchValue" placeholder="Szukaj..." type="text" />
        <transition name="searchbox">
          <div v-if="filteredUsers.length > 0" class="searchResults">
            <div @click="selectUser(user)" v-for="user in filteredUsers" :key="user.id" class="result">
              <p>{{ `${user.first_name} ${user.last_name}` }}</p>
              <p><i class="fas fa-user"></i></p>
            </div>
          </div>
        </transition>
      </div>
      <span @click="removeUser" class="selectedUser" v-if="selectedUser"
        >{{ `${selectedUser.first_name} ${selectedUser.last_name} ` }}<i class="fas fa-times"></i
      ></span>
    </div>
  </header>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { getUsers } from "@/store/api";
import UserModel from "@/store/models/UserModel";
import searchbox from "@/store/modules/searchbox";

@Component
export default class Header extends Vue {
  searchValue = "";
  users: Array<UserModel> = [];
  selectedUser: UserModel | null = null;

  get isHomeUrl() {
    if (this.$route.path === "/") return true;
    return false;
  }

  async created() {
    this.users = await getUsers();
  }

  selectUser(user: UserModel) {
    this.selectedUser = user;
    searchbox.updateUser(user);
    this.searchValue = "";
  }

  removeUser() {
    this.selectedUser = null;
    searchbox.updateUser(null);
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
}
</script>

<style lang="scss" scoped>
@import "@/styles/config.scss";

.header {
  display: flex;
  height: 50px;
  align-items: center;
  background-color: $color-white;

  > p {
    font-weight: normal;
    color: $color-black;
    font-size: 2rem;
    margin-left: 2rem;
    line-height: 50px;
    cursor: pointer;
  }

  .searchContainer {
    display: flex;
    align-items: center;
    margin-left: 200px;

    @media (max-width: 1000px) {
      margin-left: 100px;
    }

    @media (max-width: 900px) {
      display: none;
    }

    .selectedUser {
      margin-left: 1rem;
      cursor: pointer;
    }

    .search {
      margin-left: 20px;
      width: 250px;
      position: relative;

      .searchbox {
        transition: border 0.2s linear;
        font-size: 1rem;
        width: 100%;
        background: transparent;
        padding: 8px 32px 8px 12px;
        height: 30px;
        border: 1px solid $color-body;
        border-radius: 50px;
        outline: none;

        &:focus {
          border: 1px solid $color-blue;
        }
      }

      .searchResults {
        position: absolute;
        width: 100%;
        margin-top: 0.5rem;
        background-color: $color-light;
        border-radius: 6px;
        box-shadow: 0px 6px 12px rgba($color: $color-black, $alpha: 0.25);

        .result {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
          height: 30px;
          border-bottom: 1px solid $color-light;
          cursor: pointer;
          transition: 0.2s;

          &:hover {
            color: $color-blue;
          }
        }
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
</style>
