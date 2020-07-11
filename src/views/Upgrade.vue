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
  <v-alert type="warning" dark>
    There is an upgraded version of NZV's Flight Logger available. Please upgrade!
    <p>
      Installed Version: {{ $route.params.installed }}<br />Current Available:
      {{ $route.params.current }}
    </p>
  </v-alert>
</template>
