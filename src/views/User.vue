<template>
  <div>
    <div class="userContainer">
      <div v-if="user" class="userInfo">
        <button @click="handleRedirect"><i class="fas fa-arrow-left"></i> Wróć do listy zadań</button>
        <div class="userData">
          <div class="userDesc">
            <p>{{ user.first_name + " " + user.last_name }}</p>
            <p>{{ user.job_title }}</p>
            <p>{{ user.email }}</p>
            <p>{{ user.street + ", " + user.city }}</p>
          </div>
          <div class="userImg">
            <img :src="user.avatar" alt="avatar" />
          </div>
        </div>
        <div class="userMap">
          <UserMap :userLat="user.lat" :userLng="user.lng" />
        </div>
      </div>
      <div v-else class="userInfo">
        <div class="loadingSpinner">
          <LoadingSpinner />
        </div>
      </div>
      <div class="userTasks">
        <h2>Zadania użytkownika</h2>
        <router-link
          as="div"
          class="task"
          :to="`/task/${userTask.id}`"
          v-for="userTask in userTasks"
          :key="userTask.id"
        >
          <p>{{ userTask.text }}</p>
          <p>{{ userTask.date }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import tasks from "@/store/modules/tasks";
import { TaskModel } from "@/store/models/TaskListModel";
import { getUser } from "@/store/api";
import UserMap from "@/components/UserMap.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import UserModel from "@/store/models/UserModel";

@Component({ components: { UserMap, LoadingSpinner } })
export default class User extends Vue {
  user: UserModel | null = null;

  async created() {
    const id = parseInt(this.$route.params.id);
    this.user = await getUser(id);
    if (!this.user) this.$router.push("/");
  }

  get userTasks() {
    const userId = this.$route.params.id;
    const userTasks: Array<TaskModel> = [];
    tasks.allTasks.forEach(column => {
      column.list.forEach(task => {
        if (task.user && task.user.id === parseInt(userId)) userTasks.push(task);
      });
    });
    return userTasks;
  }

  handleRedirect() {
    this.$router.push("/");
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/config.scss";
.userContainer {
  display: flex;
  position: absolute;
  overflow: hidden;
  width: 90%;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 6px;
  box-shadow: $shadow-lt;
  height: 85vh;
  background-color: $color-light;

  & .userInfo {
    flex: 0 0 70%;
    display: flex;
    flex-direction: column;

    & > button {
      @include primaryButtonWithHover;
      position: absolute;
    }

    & .loadingSpinner {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    & .userData {
      flex: 0 0 35%;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      & .userDesc {
        flex: 0 0 50%;
      }
      & .userImg {
        & img {
          height: 200px;
        }
      }
    }

    & .userMap {
      flex: 0 0 65%;
      background-color: salmon;
    }
  }
  & .userTasks {
    flex: 0 0 30%;
    background-color: lightgray;
    padding: 1rem;
    overflow-y: auto;

    & h2 {
      margin-bottom: 1rem;
    }

    & .task {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 80%;
      height: 50px;
      background-color: white;
      margin: 1rem auto;
      padding-left: 1rem;
      border-radius: 6px;
      box-shadow: $shadow-lt;
      transition: 0.2s;

      &:hover {
        box-shadow: $shadow-md;
      }
    }
  }
}
</style>
