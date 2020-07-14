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
  <transition name="slide-fade" mode="out-in">
    <div v-if="selectedFlight !== null">
      <SelectedFlight
        :bookFlight="bookFlight"
        :cancelFlight="cancelFlight"
        :simbriefFlight="simbriefFlight"
        :flight="selectedFlight"
      />
    </div>
    <v-simple-table dense v-else>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Flt No</th>
            <th class="text-left">Dep</th>
            <th class="text-left">Arr</th>
            <th class="text-left">Equip</th>
            <th class="text-left">DepT</th>
            <th class="text-left">ArrT</th>
            <th class="text-left">Dur</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <v-text-field
                :hide-details="true"
                v-model="filter.atcIdent"
                @keyup="filteredRoutes"
                style="padding: 0 !important; margin: 0 !important; margin-bottom: 5px; width: 5rem;"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                :hide-details="true"
                v-model="filter.departure"
                @keyup="filteredRoutes"
                style="padding: 0 !important; margin: 0 !important; margin-bottom: 5px; width: 5rem;"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                :hide-details="true"
                v-model="filter.arrival"
                @keyup="filteredRoutes"
                style="padding: 0 !important; margin: 0 !important; margin-bottom: 5px; width: 5rem;"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                :hide-details="true"
                v-model="filter.equipment"
                @keyup="filteredRoutes"
                style="padding: 0 !important; margin: 0 !important; margin-bottom: 5px; width: 5rem;"
              ></v-text-field>
            </td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>
              <v-text-field
                :hide-details="true"
                v-model="filter.duration"
                @keyup="filteredRoutes"
                style="padding: 0 !important; margin: 0 !important; margin-bottom: 5px; width: 5rem;"
              ></v-text-field>
            </td>
          </tr>
          <tr v-for="flt in displayRoutes" :key="flt.id" @click="selectFlight(flt)">
            <td>{{ flt.atcIdent }}</td>
            <td>{{ flt.departure.icao }}</td>
            <td>{{ flt.arrival.icao }}</td>
            <td>{{ flt.equipment.icao }}</td>
            <td>{{ flt.departureTime }}Z</td>
            <td>{{ flt.arrivalTime }}Z</td>
            <td>{{ flt.duration }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import SelectedFlight from "../components/SelectedFlight";

export default {
  name: "Routes",
  components: {
    SelectedFlight
  },
  data() {
    return {
      success: true,
      displayRoutes: [],
      selectedFlight: null,
      filter: {
        atcIdent: "",
        departure: "",
        arrival: "",
        equipment: "",
        duration: ""
      }
    };
  },
  computed: {
    ...mapGetters(["loggedIn", "routes"])
  },
  created() {
    this.filteredRoutes();
  },
  methods: {
    selectFlight(flight) {
      this.selectedFlight = flight;
    },
    filteredRoutes() {
      let localFiltered = this.routes;
      if (this.filter.atcIdent) {
        localFiltered = localFiltered.filter(fr => fr.atcIdent.indexOf(this.filter.atcIdent) > -1);
      }
      if (this.filter.departure) {
        localFiltered = localFiltered.filter(
          fr => fr.departure.icao.indexOf(this.filter.departure) > -1
        );
      }
      if (this.filter.arrival) {
        localFiltered = localFiltered.filter(
          fr => fr.arrival.icao.indexOf(this.filter.arrival) > -1
        );
      }
      if (this.filter.equipment) {
        localFiltered = localFiltered.filter(
          fr => fr.equipment.icao.indexOf(this.filter.equipment) > -1
        );
      }
      if (this.filter.duration) {
        localFiltered = localFiltered.filter(fr => fr.duration.indexOf(this.filter.duration) > -1);
      }
      this.displayRoutes = localFiltered.sort((a, b) => {
        if (a.atcIdent < b.atcIdent) {
          return -1;
        }
        if (a.atcIdent > b.atcIdent) {
          return 1;
        }
        return 0;
      });
    },
    cancelFlight() {
      this.selectedFlight = null;
    },
    bookFlight() {
      //
    },
    simbriefFlight() {
      //
    },
    days() {
      return "Soon";
      /* let parsed;
      let ret = "";
      try {
        parsed = JSON.parse(data);
      } catch (err) {
        return "Unknown";
      }

      if (parsed.monday === true) ret += "M";
      if (parsed.teusday === true) ret += "Tu";
      if (parsed.wednesday === true) ret += "W";
      if (parsed.thursday === true) ret += "Th";
      if (parsed.friday === true) ret += "F";
      if (parsed.saturday === true) ret += "Sa";
      if (parsed.sunday === true) ret += "Su";

      return ret; */
    }
  }
};
</script>
