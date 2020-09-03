<template>
  <div>
    <div class="userContainer">
      <div v-if="user" class="userInfo">
        <button @click="handleRedirect"><i class="fas fa-arrow-left"></i> Wróć do listy zadań</button>
        <div class="userData">
          <div class="userDesc">
            <p><i class="far fa-user"></i>{{ `${user.first_name} ${user.last_name}` }}</p>
            <p><i class="fas fa-user-md"></i>{{ user.job_title }}</p>
            <p><i class="far fa-envelope-open"></i>{{ user.email }}</p>
            <p><i class="far fa-building"></i>{{ `${user.city}, ${user.street}` }}</p>
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
import { UserMap } from "@/components/userView";
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
  background-color: white;
  box-shadow: $shadow-lt;
  height: 85vh;

  @media (max-width: 1000px) {
    width: 100%;
  }

  @media (max-width: 850px) {
    flex-direction: column;
    height: auto;
  }

  & .userInfo {
    flex: 0 0 70%;
    display: flex;
    flex-direction: column;

    & > button {
      @include blueButton;
      outline: none;
      border: none;
      padding: 0.5rem 0.8rem;
      margin: 1rem;
      position: absolute;
    }

    & .loadingSpinner {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    & .userData {
      flex: 0 0 40%;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      border: 1px solid $color-light;

      @media (max-width: 850px) {
        padding-top: 2rem;
      }

      @media (max-width: 500px) {
        font-size: 0.8rem;
      }

      & .userDesc {
        flex: 0 0 50%;

        @media (max-width: 500px) {
          flex: 0 0 60%;
        }

        i {
          width: 30px;
        }
        > p:first-child {
          color: $color-blue;
          margin-bottom: 0.5rem;
        }
        > p {
          margin-bottom: 0.2rem;
        }
      }
      & .userImg {
        & img {
          height: 200px;

          @media (max-width: 500px) {
            height: 150px;
          }
        }
      }
    }

    & .userMap {
      flex: 0 0 60%;
      z-index: 1;

      @media (max-width: 850px) {
        height: 300px;
      }
    }
  }
  & .userTasks {
    flex: 0 0 30%;
    background-color: white;
    border-left: 1px solid $color-light;
    box-shadow: 2px 8px 16px rgba($color: #000000, $alpha: 0.4);
    z-index: 10;
    padding: 1rem;
    overflow-y: auto;

    & h2 {
      font-weight: normal;
      text-align: center;
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
      border: 1px solid $color-light;
      transition: 0.2s;

      > p:last-child {
        font-size: 0.8rem;
      }

      &:hover {
        box-shadow: $shadow-lt;
      }
    }
  }
}
</style>
