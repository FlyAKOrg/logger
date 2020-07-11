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

import axios from "axios";
import store from "../store";
import router from "../router";

const ajax = axios.create({
  baseURL: "https://api.dev.nzvirtual.org/"
});

ajax.interceptors.request.use(
  request => {
    const req = request;
    if (store.getters.config.username !== "") {
      req.headers.Authorization = `Basic ${btoa(
        `${store.getters.config.username}:${store.getters.config.password}`
      )}`;
    }
    req.headers["Content-Type"] = "application/json";

    return req;
  },
  error => Promise.reject(error)
);

ajax.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const status = parseInt(error.response.status, 10);
    if (router.currentRoute.name !== "Login" && [401, 403].includes(status)) {
      store.commit("error", {
        message: "Your login session has expired.",
        show: true,
        recoveryRoute: "Home"
      });
      router.push({ name: "Error" });
      return false;
    }

    if ([404, 500, 501, 503].includes(status)) {
      store.commit("error", {
        message: "There is a problem with the API. Please try again.",
        show: true,
        recoveryRoute: "Home"
      });
      router.push({ name: "Error" });
      return false;
    }
    return Promise.reject(error);
  }
);

export default ajax;
