<template>
  <l-map :zoom="zoom" :center="center" :options="mapOptions" @update:zoom="zoomUpdate">
    <l-tile-layer :url="url" :attribution="attribution" />
    <l-marker :lat-lng="userGeo"> </l-marker>
  </l-map>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import * as L from "leaflet";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";

//typescript support
type D = L.Icon.Default & {
  _getIconUrl: string;
};

delete (L.Icon.Default.prototype as D)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

@Component({ components: { LMap, LMarker, LTileLayer } })
export default class UserMap extends Vue {
  @Prop() userLat!: number;
  @Prop() userLng!: number;
  zoom = 3;
  center = L.latLng(47.41322, -1.219482);
  url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
  currentZoom = 11.5;
  currentCenter = L.latLng(47.41322, -1.219482);
  showParagraph = false;
  mapOptions = {
    zoomSnap: 0.5
  };

  get userGeo() {
    this.currentCenter = L.latLng(this.userLat, this.userLng);
    this.center = L.latLng(this.userLat, this.userLng);
    return L.latLng(this.userLat, this.userLng);
  }

  zoomUpdate(zoom: number) {
    this.currentZoom = zoom;
  }
}
</script>

<style lang="scss" scoped></style>
