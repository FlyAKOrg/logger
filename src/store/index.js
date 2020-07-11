/*
 * Copyright (C) 2020 Daniel A. Hawton <daniel@hawton.org>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import Vue from "vue";
import Vuex from "vuex";
import ElectronStore from "electron-store";
import getMachineId from "../utils/encrypt";

Vue.use(Vuex);

const electronstore = new ElectronStore({
  encryptionKey: getMachineId()
});

export default new Vuex.Store({
  state: {
    config: electronstore.get("config") || {
      mode: "light",
      username: "",
      password: "",
      remember: false
    },
    error: {
      message: "",
      show: false,
      recoveryRoute: ""
    },
    bookings: [],
    version: "Unknown"
  },
  mutations: {
    config(state, payload) {
      // Do we need to clear creds?
      if (state.config.remember === true && payload.remember === false) {
        electronstore.set("config", {
          ...state.config,
          ...payload,
          username: "",
          password: ""
        });
      } else if (payload.remember === true) {
        electronstore.set("config", state.config);
      }

      state.config = { ...state.config, ...payload };
    },
    version(state, version) {
      state.version = version;
    },
    error(state, payload) {
      state.error = { ...state.error, ...payload };
    },
    bookings(state, payload) {
      state.bookings = payload;
    },
    bookingByIndex(state, index, payload) {
      state.bookings[index] = payload;
    },
    bookingById(state, id, payload) {
      const index = state.bookings.map(e => e.id).indexOf(id);
      state.bookings[index] = payload;
    }
  },
  getters: {
    config: state => state.config,
    version: state => state.version,
    error: state => state.error,
    bookings: state => state.bookings
  },
  actions: {
    login({ commit }, payload) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http
          .get("/user", { auth: { username: payload.username, password: payload.password } })
          .then(response => {
            commit("bookings", response.data.bookings);
            commit("config", payload);
            resolve(true);
          })
          .catch(error => reject(error));
      });
    }
  }
});
