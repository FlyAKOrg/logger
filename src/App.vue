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
  <v-app
    id="mainapp"
    class="applight"
    :class="{ applight: !$vuetify.theme.dark, appdark: $vuetify.theme.dark }"
  >
    <v-navigation-drawer temporary absolute v-model="showmenu">
      <Menu />
    </v-navigation-drawer>
    <v-app-bar
      app
      color="primary"
      dense
      :dark="!$vuetify.theme.dark"
      :class="{ draggable: !showmenu }"
    >
      <v-app-bar-nav-icon
        @click="showmenu = true"
        style="-webkit-app-region: no-drag"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>New Zealand Virtual Flight Logger</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn @click="changeTheme" style="-webkit-app-region: no-drag">
        <span class="mr-2">Change Theme</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <transition name="slide-fade" mode="out-in">
          <router-view />
        </transition>
      </v-container>
    </v-main>

    <div
      style="margin: 0; padding: 0; position: absolute; bottom: 0px; right: 0px; font-size: 6pt;"
    >
      Version: {{ version }}
    </div>
  </v-app>
</template>

<script>
import { ipcRenderer } from "electron";
import { mapState } from "vuex";
import Menu from "./components/Menu";
import EventBus from "./utils/EventBus";

export default {
  name: "App",

  components: {
    Menu
  },

  data: () => ({
    showmenu: false,
    routerTimer: null
  }),

  mounted() {
    this.$vuetify.theme.dark = this.theme === "dark";
    ipcRenderer.send("logger-ready");
    EventBus.$on("toggle-menu", () => {
      this.showmenu = !this.showmenu;
    });
    EventBus.$on("set-menu", value => {
      this.showmenu = value;
    });
  },

  computed: mapState({
    theme: state => state.config.mode,
    version: state => state.version,
    loggedIn: state => state.loggedIn
  }),

  watch: {
    theme(newTheme) {
      this.$vuetify.theme.dark = newTheme === "dark";
    },
    loggedIn(newValue, oldValue) {
      if (newValue && !oldValue) {
        this.$store.dispatch("routes");
        this.routerTimer = setInterval(() => this.$store.dispatch("routes"), 60 * 60 * 1000); // Update once per hour
      } else if (oldValue && !newValue) {
        // Logged out.
        clearInterval(this.routerTimer);
        this.routerTimer = null;
      }
    }
  },

  methods: {
    changeTheme() {
      let theme = "light";
      if (!this.$vuetify.theme.dark) theme = "dark";

      this.$store.commit("config", { mode: theme });
    }
  }
};
</script>

<style lang="scss">
.applight {
  background-image: url("./assets/background_light.png") !important;
}
.appdark {
  background-image: url("./assets/background_dark.png") !important;
}
#mainapp {
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.slide-fade-enter-active {
  transition: all 0.1s ease;
}
.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}
.draggable {
  -webkit-app-region: drag;
}
</style>
