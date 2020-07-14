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
  <v-list nav dense>
    <v-list-item @click="route('Home')" v-if="!loggedIn">
      <v-list-item-icon><v-icon>mdi-home</v-icon></v-list-item-icon>
      <v-list-item-title>Home</v-list-item-title>
    </v-list-item>
    <v-list-item @click="route('Dashboard')" v-if="loggedIn">
      <v-list-item-icon><v-icon>mdi-home</v-icon></v-list-item-icon>
      <v-list-item-title>Home</v-list-item-title>
    </v-list-item>
    <v-list-item @click="route('Routes')" v-if="loggedIn">
      <v-list-item-icon><v-icon>mdi-calendar-month</v-icon></v-list-item-icon>
      <v-list-item-title>Routes</v-list-item-title>
    </v-list-item>
    <v-list-item v-if="loggedIn">
      <v-list-item-icon><v-icon>mdi-book</v-icon></v-list-item-icon>
      <v-list-item-title>Bookings</v-list-item-title>
    </v-list-item>
    <v-list-item v-if="loggedIn">
      <v-list-item-icon><v-icon>mdi-airplane</v-icon></v-list-item-icon>
      <v-list-item-title>Tracker</v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-icon><v-icon>mdi-cog</v-icon></v-list-item-icon>
      <v-list-item-title>Settings</v-list-item-title>
    </v-list-item>
    <v-list-item @click="handleAbout">
      <v-list-item-icon><v-icon>mdi-help-circle</v-icon></v-list-item-icon>
      <v-list-item-title>About</v-list-item-title>
    </v-list-item>
    <v-list-item @click="handleClose">
      <v-list-item-icon><v-icon>mdi-exit-run</v-icon></v-list-item-icon>
      <v-list-item-title>Exit</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapGetters } from "vuex";
import { ipcRenderer } from "electron";
import EventBus from "../utils/EventBus";

export default {
  computed: {
    ...mapGetters(["loggedIn"])
  },
  methods: {
    route(name) {
      this.$router.push({ name });
    },
    handleAbout() {
      EventBus.$emit("set-menu", false);
      ipcRenderer.send("show-about");
    },
    handleClose() {
      ipcRenderer.send("close");
    }
  }
};
</script>

<style></style>
