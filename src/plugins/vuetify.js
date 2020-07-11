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
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: "#4db6ac",
        secondary: "#42a5f5",
        accent: "#ab47bc",
        error: "#ef5350",
        info: "#cfd8dc",
        success: "#81c784",
        warning: "#f9a825"
      },
      dark: {
        primary: "#37474f",
        secondary: "#42a5f5",
        accent: "#ab47bc",
        error: "#ef5350",
        info: "#cfd8dc",
        success: "#81c784",
        warning: "#f9a825"
      }
    }
  }
});
