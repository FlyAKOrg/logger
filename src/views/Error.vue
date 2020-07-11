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
  <v-container class="fill-height" fluid>
    <v-row>
      <v-col cols="12">
        <v-alert border="top" color="error" prominent icon="mdi-alert">
          {{ error.message }}
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col style="text-align: right;">
        <v-btn color="error" @click="recover">Retry</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: mapGetters(["error"]),
  methods: {
    recover() {
      this.$store.commit("error", { show: false });
      this.$router.push({ name: this.error.recoveryRoute });
    }
  }
};
</script>
