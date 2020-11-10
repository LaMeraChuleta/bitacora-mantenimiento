<script>

import NavBar from '../components/NavBar.vue'
export default {
  components:{
    NavBar
  },
  data: () => ({
    type: "month",
    mode: "stack",
    weekday: [0, 1, 2, 3, 4, 5, 6],
    selectedEvent: {},
    dialog: false,
    selectedElement: null,
    selectedOpen: false,
    value: "",
    events: [
      {
        name: ["A01"].toString(),
        start: new Date(Date.parse("2020/11/01")),
        end: "",
        color: "#FF5252",
        timed: false,
      },
      {
        name: ["A01"].toString(),
        start: new Date(Date.parse("2020/11/09")),
        end: "",
        color: "#FF5252",
        timed: false,
      },
      {
        name: ["A01"].toString(),
        start: new Date(Date.parse("2020/11/11")),
        end: "",
        color: "#FF5252",
        timed: false,
      },
    ],
    tipoActividad: [
      { value: 0, text: "Semanal" },
      { value: 1, text: "Mensual" },
    ],
    carriles: ["A01", "A02", "A03"],
    actividadSelect: "",
    carrilesSelect: "",
  }),
  methods: {
    getEvents({ start, end }) {
      console.log(start);
      console.log(end);
    },
    showEvent({ nativeEvent, event }) {
      console.log(event);
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => {
          this.selectedOpen = true;
        }, 10);
      };
      open();
      nativeEvent.stopPropagation();
    },
    show(value) {
      let fecha = value.split("-");
      fecha = `${fecha[0]}-${fecha[1]}-${parseInt(fecha[2]) + 1}`;

      this.events.push({
        name: this.actividadSelect == 0 ? "Semanal" : "Mensual",
        start: new Date(Date.parse(fecha)),
        end: "",
        color: this.actividadSelect == 0 ? "#08B838" : "#FF5252",
        timed: false,
        carriles: this.carrilesSelect,
      });
      this.carrilesSelect = [];
      this.actividadSelect = [];
      this.dialog = false;
    },
    getEventColor(event) {
      return event.color;
    },
  },
};
</script>
<template>
  <div>
    <NavBar></NavBar>
  <div class="pa-16 mt-10">
    <!-- ///////////////////////////////////////////////////////////
    //               Header Codigo de Colores                     ///
    //////////////////////////////////////////////////////////////// -->
    <v-sheet>
      <v-card class="" elevation="1">
        <v-card-title class="justify-center">
          <h2>Calendario de Actividades</h2>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <h3 class="font-weight-regular ma-3">
                Calendario de Mantenimiento Preventivo
              </h3>
              <h3 class="font-weight-regular ma-3">
                Correspondiente al mes de: {{ "Noviembre 2020" }}
              </h3>
              <h3 class="font-weight-regular ma-3">
                Plaza de Cobro: {{ "001 Tlalpan" }}
              </h3>
            </v-col>
            <v-col cols="6" class="text-center">
              <h3 class="font-weight-medium ma-2">Codigo de Colores</h3>
              <div class="ml-16">
                <p class="d-inline green--text">° Verde -</p>
                <p class="d-inline">Semanal</p>
              </div>
              <div class="ml-16">
                <p class="d-inline red--text">° Rojo -</p>
                <p class="d-inline">Mensual</p>
              </div>
              <div class="ml-16">
                <p class="d-inline blue--text">° Azul -</p>
                <p class="d-inline">Trimestral</p>
              </div>
              <div class="ml-16">
                <p class="d-inline pink--text">° Rosa -</p>
                <p class="d-inline">Semestral</p>
              </div>
              <div class="ml-16">
                <p class="d-inline orange--text">° Naranja -</p>
                <p class="d-inline">Anual</p>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-sheet>
    <!-- ///////////////////////////////////////////////////////////
    //               Cabecera del Calendario                     ///
    //////////////////////////////////////////////////////////////// -->
    <v-sheet tile height="70" width="1300" class="d-flex justify-center">
      <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn icon class="ma-2" @click="$refs.calendar.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <!-- ///////////////////////////////////////////////////////////
    //                       Calendario                          ///
    //////////////////////////////////////////////////////////////// -->
    <v-sheet height="600" width="1300">
      <v-calendar
        ref="calendar"
        v-model="value"
        :weekdays="weekday"
        :type="type"
        :events="events"
        :event-overlap-mode="mode"
        @click:event="showEvent"
        @click:date="dialog = true"
        :event-color="getEventColor"
      ></v-calendar>
      <!-- ///////////////////////////////////////////////////////////
    //                       Modal Actividad                     ///
    //////////////////////////////////////////////////////////////// -->
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-y
      >
        <v-card color="grey lighten-4" min-width="350px" flat>
          <v-toolbar :color="selectedEvent.color" dark>
            <v-btn icon><v-icon>mdi-pencil</v-icon></v-btn>
            <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon><v-icon>mdi-heart</v-icon></v-btn>
            <v-btn icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
          </v-toolbar>
          <v-card-text>
            <span v-html="selectedEvent.carriles"></span>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="secondary" @click="selectedOpen = false">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-sheet>
    <h5 class="mt-2">
      *El horario del mantenimiento esta comtemplado de las 9:00 a las 19:00 hrs
      de cada dia.
    </h5>
    <v-sheet class="mt-10">
      <v-textarea outlined label="Observaciones"></v-textarea>
    </v-sheet>
       <v-sheet class="mt-2">
      <v-btn outlined color="primary">Imprimir Reporte</v-btn>
    </v-sheet>
    <!-- ////////////////////////////////////////////////////////////
    //                   Modal de Actividades                    ///
    //////////////////////////////////////////////////////////////// -->
    <div class="text-center">
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2">
            Actividades
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="6" class="d-inline">
                  <v-select
                    v-model="actividadSelect"
                    :items="tipoActividad"
                    dense
                    outlined
                    hide-details
                    class="ma-2"
                    label="Tipo de Actividad"
                  ></v-select>
                </v-col>
                <v-col cols="6" class="d-inline">
                  <v-select
                    v-model="carrilesSelect"
                    :items="carriles"
                    dense
                    outlined
                    multiple
                    hide-details
                    class="ma-2"
                    label="Carriles"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
            
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">Cancelar</v-btn>
            <v-btn color="primary" text @click="show(value)"> Guardar </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
  </div>
</template>