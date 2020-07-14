<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
        <b>Flight Number:</b> {{ this.flight.airline.icao }}{{ this.flight.flightNumber }}<br />
        <b>ATC Identifier:</b> {{ this.flight.atcIdent }}<br />
        <b>Equipment:</b> {{ this.flight.equipment.icao }}<br />
        <b>Route:</b> {{ this.flight.departure.icao }} - {{ this.flight.arrival.icao }}<br />
        <b>Planned Departure Time:</b> {{ this.flight.departureTime }}<br />
        <b>Planned Arrival Time:</b> {{ this.flight.arrivalTime }}<br />
        <b>Planned Duration:</b> {{ this.flight.duration }}
      </v-col>
      <v-col cols="6">
        <l-map :options="mapOptions" :bounds="bounds">
          <l-tile-layer
            :url="mapTiles"
            :subdomains="mapTileSubdomains"
            :attribution="mapAttribution"
          />
          <l-marker :lat-lng="departureLatLng"></l-marker>
          <l-marker :lat-lng="destinationLatLng"></l-marker>
          <l-polyline :lat-lngs="[departureLatLng, destinationLatLng]" />
        </l-map>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" class="text-center">
        <v-btn color="primary" @click="bookFlight">Book Flight</v-btn>
      </v-col>
      <v-col cols="4" class="text-center">
        <v-btn color="accent" @click="simbriefFlight">Open SimBrief</v-btn>
      </v-col>
      <v-col cols="4" class="text-center">
        <v-btn color="error" @click="cancelFlight">Cancel</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable global-require */
import { Icon, latLng, latLngBounds } from "leaflet";
import { LMap, LTileLayer, LMarker, LPolyline } from "vue2-leaflet";

// eslint-disable-next-line no-underscore-dangle
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default {
  name: "SelectedFlight",
  props: {
    cancelFlight: Function,
    bookFlight: Function,
    simbriefFlight: Function,
    flight: Object
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPolyline
  },
  data() {
    return {
      mapOptions: {},
      mapTiles: "",
      mapTileSubdomains: "",
      mapAttribution: "",
      departureLatLng: 0,
      destinationLatLng: 0,
      bounds: 0
    };
  },
  created() {
    this.departureLatLng = latLng(this.flight.departure.lat, this.flight.departure.lon);
    this.destinationLatLng = latLng(this.flight.arrival.lat, this.flight.arrival.lon);
    this.bounds = latLngBounds([this.departureLatLng, this.destinationLatLng]);
    if (this.$vuetify.theme.dark) {
      this.mapTiles =
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}{r}.png";
      this.mapAttribution =
        // eslint-disable-next-line prettier/prettier
        "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> &copy; <a href=\"http://cartodb.com/attributions\">CartoDB</a>";
      this.mapTileSubdomains = "abcd";
    } else {
      this.mapTiles =
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      this.mapAttribution =
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community";
      this.mapTileSubdomains = "";
    }
  }
};
</script>

<style>
.leaflet-control-attribution {
  font-size: 4pt !important;
}
</style>
