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
    <v-row align="center" justify="center">
      <v-col md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text v-if="processing" style="text-align: center;">
            <v-progress-circular
              :size="70"
              :width="7"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </v-card-text>
          <v-card-text v-if="!processing">
            <v-form @keyup.native.enter="login" v-on:submit.prevent="login">
              <v-text-field
                label="Email"
                name="username"
                prepend-icon="mdi-account"
                type="text"
                v-model="username"
              ></v-text-field>
              <v-text-field
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                v-model="password"
              ></v-text-field>
              <v-switch v-model="remember" class="ma-2" label="Remember Login"></v-switch>
            </v-form>
          </v-card-text>
          <v-card-actions v-if="!processing">
            <v-spacer></v-spacer>
            <v-btn type="submit" color="primary" @click="login">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="error" align="center" justify="center">
      <v-col cols="12">
        <v-alert type="error" dismissible>
          Username or password incorrect. Please try again.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      remember: false,
      error: false,
      processing: false
    };
  },
  mounted() {
    const { username, password, remember } = this.$store.getters.config;
    this.username = username;
    this.password = password;
    this.remember = remember;
    this.$store.commit("loggedIn", false);
    if (this.remember && this.password !== null) this.login();
  },
  methods: {
    login() {
      this.processing = true;
      this.$store
        .dispatch("login", {
          username: this.username,
          password: this.password,
          remember: this.remember
        })
        .then(() => {
          this.$router.push({ name: "Dashboard" });
        })
        .catch(() => {
          this.error = true;
          this.processing = false;
        });
    }
  }
};
</script>
