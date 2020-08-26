<template>
  <div>
    <div class="userContainer">
      <div class="userInfo">
        <div class="userData"></div>
        <div class="userMap">
          <l-map :zoom="zoom" :center="center" :options="mapOptions" @update:zoom="zoomUpdate">
            <l-tile-layer :url="url" :attribution="attribution" />
            <l-marker :lat-lng="userLng"> </l-marker>
          </l-map>
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
import * as L from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from "vue2-leaflet";
import UserModel from "@/store/models/UserModel";

type D = L.Icon.Default & {
  _getIconUrl: string;
};

delete (L.Icon.Default.prototype as D)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

@Component({ components: { LMap, LMarker, LPopup, LTooltip, LTileLayer } })
export default class User extends Vue {
  user: UserModel | null = null;
  zoom = 3;
  center = L.latLng(47.41322, -1.219482);
  url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
  userLng = L.latLng(47.41322, -1.219482);
  currentZoom = 11.5;
  currentCenter = L.latLng(47.41322, -1.219482);
  showParagraph = false;
  mapOptions = {
    zoomSnap: 0.5
  };

  zoomUpdate(zoom: number) {
    this.currentZoom = zoom;
  }

  async mounted() {
    const id = parseInt(this.$route.params.id);
    this.user = await getUser(id);
    if (this.user) {
      this.center = L.latLng(this.user.lng, this.user.lat);
      this.currentCenter = L.latLng(this.user.lng, this.user.lat);
      this.userLng = L.latLng(this.user.lng, this.user.lat);
    } else this.$router.push("/");
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
  box-shadow: 0px 6px 12px rgba($color: #000000, $alpha: 0.25);
  height: 85vh;
  background-color: $color-light;

  & .userInfo {
    flex: 0 0 70%;
    display: flex;
    flex-direction: column;

    & .userData {
      flex: 0 0 35%;
      background-color: royalblue;
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
      box-shadow: 0px 6px 12px rgba($color: #000000, $alpha: 0.25);
      transition: 0.2s;

      &:hover {
        box-shadow: 0px 6px 12px rgba($color: #000000, $alpha: 0.5);
      }
    }
  }
}
</style>
