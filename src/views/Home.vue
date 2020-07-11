<!--
Copyright (C) 2020 Daniel A. Hawton <daniel@hawton.org>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
-->

<template>
  <v-container>
    <v-row align="start">
      <v-col cols="12">
        <v-progress-linear
          :active="true"
          height="25"
          indeterminate
          rounded
          value="0"
          color="accent"
          v-model="stageText"
        >
          <strong>{{ stageText }}</strong>
        </v-progress-linear>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ipcRenderer } from "electron";
import { mapState } from "vuex";
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      stage: 0,
      stageText: "Loading..."
    };
  },
  created() {
    ipcRenderer.send("app_version");
    ipcRenderer.on("app_version", (event, arg) => {
      this.$store.commit("version", arg.version);
      this.stage = 1;
      this.nextStage();
      ipcRenderer.removeAllListeners();
    });
  },
  computed: mapState({
    version: state => state.version
  }),
  mounted() {},
  methods: {
    nextStage() {
      if (this.stage === 1) {
        this.stageText = "Checking current version...";
        axios
          .get("https://apps.nzvirtual.org/woban/version.json")
          .then(response => {
            if (response.data.current !== this.version) {
              this.$router.push({
                name: "Upgrade",
                params: { current: response.data.current, installed: this.version }
              });
            } else {
              this.stage = 2;
              this.nextStage();
            }
          })
          .catch(err => {
            this.$store.commit("error", {
              message: "There was an error checking for a new version of Woban.",
              show: true,
              recoveryRoute: ""
            });
            this.$router.push({ name: "Error" });
            console.log(err);
          });
      } else if (this.stage === 2) {
        // Check if username/password null... but for now...
        this.$router.push({ name: "Login" });
      }
    }
  }
};
</script>

<style lang="scss">
html {
  overflow-y: auto !important; // Vuetify fix
}
</style>
