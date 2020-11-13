<script>
import { mapState } from "vuex";
export default {
 
  data: () => ({
    plaza: "",
    events: [],
    dialog: false,
    plazaSelect: "",
    selectedEvent: {},
    dialogPlaza: false,
    selectedOpen: false,
    selectedElement: null,
    tipoActividad: [
      { value: 0, text: "Semanal" },
      { value: 1, text: "Mensual" },
    ],
    weekday: [0, 1, 2, 3, 4, 5, 6],
    actividadSelect: "",
    carrilesSelect: "",
  }),
  ////////////////////////////////////////////////////
  //                 CICLO DE VIDA                  //
  ////////////////////////////////////////////////////
  beforeMount() {
    this.opcionesPlaza();
  },
  ////////////////////////////////////////////////////
  //                 CAPUTADAS                       //
  ////////////////////////////////////////////////////
  computed: {
    ...mapState("Login", ["CARRILES", "USER"]),

    plazas() {
      return this.USER.map((item) => ({
        value: item.squareCatalogId,
        text: item.squareName,
      }));
    },
    carriles() {
      return this.CARRILES.map((item) => ({
        value: {
          capufeLaneNum: item.capufeLaneNum,
          idGare: item.idGare,
          lane: item.lane,
        },
        text: item.lane,
      }));
    },
    titulo() {
      var meses = new Array(
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
      );
      var f = new Date();
      return `${meses[f.getMonth()]} ${f.getFullYear()}`;
    },
  },
  ////////////////////////////////////////////////////
  //                 METODOS                        //
  ////////////////////////////////////////////////////
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
    opcionesPlaza() {
      if (this.plazaSelect != "") {
        //Crear el titulo Plaza
        let id_nombre = this.USER.find(
          (item) => item.squareCatalogId == this.plazaSelect
        );
        this.plaza = `${id_nombre.squareCatalogId} ${id_nombre.squareName}`;
        //Busca los carriles por Plaza
        this.$store.dispatch("Login/GET_CARRILES", this.plazaSelect);
      } else {
        this.plazaSelect = this.USER[0].squareCatalogId;
        this.opcionesPlaza();
      }
      this.plazaSelect = "";
    },
    actualizarPlaza() {
      this.opcionesPlaza();
      this.dialogPlaza = false;
    },
    show(value) {
      let fecha = value.split("-");
      fecha = `${fecha[0]}-${fecha[1]}-${parseInt(fecha[2]) + 1}`;
      this.events.push({
        name: this.actividadSelect == 0 ? "Semanal" : "Mensual",
        color: this.actividadSelect == 0 ? "#08B838" : "#FF5252",
        start: new Date(Date.parse(fecha)),
        carriles: this.carrilesSelect,
        timed: false,
        end: "",
      });
      this.carrilesSelect = [];
      this.actividadSelect = [];
      this.dialog = false;
    },
    getEventColor(event) {
      return event.color;
    },
    eliminarActividad() {
      let index = this.events.findIndex(
        (item) => item.start == this.selectedEvent.start
      );
      this.events.splice(index, 1);
      this.selectedEvent = {};
      this.selectedOpen = false;
    },
  },
};
</script>
<template>
  <div>    
    <v-container class="pa-md-10 pa-5 mt-md-10 mt-16">
      <!-- ///////////////////////////////////////////////////////////
    //               Header Codigo de Colores                     ///
    //////////////////////////////////////////////////////////////// -->
      <v-sheet>
        <v-card elevation="1">
          <v-card-title class="justify-center">
            <h2>Calendario de Actividades</h2>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="8">
                <h3 class="ma-3">Calendario de Mantenimiento Preventivo</h3>
                <h3 class="ma-3 text-capitalize" v-if="$refs.calendar">
                  Correspondiente al mes de: {{ $refs.calendar.title }}
                </h3>
                <h3 class="ma-3 text-capitalize" v-else>
                  Correspondiente al mes de: {{ titulo }}
                </h3>
                <h3 class="ma-3">
                  Plaza de Cobro:
                  {{ plaza }}
                </h3>
                <v-btn
                  @click="dialogPlaza = true"
                  class="ma-3"
                  color="primary"
                  outlined
                  small
                  >Cambiar plaza</v-btn
                >
              </v-col>
              <v-col cols="4" >
                <h3 class="ma-2">Codigo de Colores</h3>
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
      <v-sheet tile height="70" class="d-flex justify-center">
        <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-toolbar-title class="mt-3 text-capitalize" v-if="$refs.calendar">{{
          $refs.calendar.title
        }}</v-toolbar-title>
        <v-toolbar-title class="mt-3" v-else>{{ titulo }}</v-toolbar-title>
        <v-btn icon class="ma-2" @click="$refs.calendar.next()">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-sheet>
      <!-- ///////////////////////////////////////////////////////////
    //                       Calendario                          ///
    //////////////////////////////////////////////////////////////// -->
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="value"
          color="primary"
          type="month"
          category-show-all
          :events="events"
          :weekdays="weekday"
          :event-color="getEventColor"
          event-overlap-mode="stack"
          @click:event="showEvent"
          @click:date="dialog = true"
        ></v-calendar>
        <!-- ///////////////////////////////////////////////////////////////
    //                Text Area Observaciones                    ///
    //////////////////////////////////////////////////////////////// -->
        <h5 class="mt-2">
          *El horario del mantenimiento esta comtemplado de las 9:00 a las 19:00
          hrs de cada dia.
        </h5>
        <v-sheet class="mt-10">
          <v-textarea outlined label="Observaciones Mensuales"></v-textarea>
        </v-sheet>
        <v-sheet class="mt-2 mb-10">
          <v-btn outlined color="primary">Imprimir Reporte</v-btn>
        </v-sheet>
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
              <v-toolbar-title
                >Actividad {{ selectedEvent.name }}</v-toolbar-title
              >
              <v-spacer></v-spacer>
              <v-btn @click="eliminarActividad" icon
                ><v-icon>mdi-delete</v-icon></v-btn
              >
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
              <v-btn color="primary" text @click="dialog = false"
                >Cancelar</v-btn
              >
              <v-btn color="primary" text @click="show(value)"> Guardar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <!-- ////////////////////////////////////////////////////////////
       //                   Modal de Plaza                          ///
       //////////////////////////////////////////////////////////////// -->
      <div class="text-center">
        <v-dialog v-model="dialogPlaza" width="300">
          <v-card>
            <v-card-title class="headline grey lighten-2">
              Cambiar Plaza
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" class="d-inline">
                    <v-select
                      v-model="plazaSelect"
                      :items="plazas"
                      dense
                      outlined
                      hide-details
                      class="ma-2"
                      label="Elige la Plaza"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row class="pa-0">
                  <small>*Lista de plazas que tienes asignada</small>
                </v-row>
              </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="dialogPlaza = false"
                >Cancelar</v-btn
              >
              <v-btn color="primary" text @click="actualizarPlaza()">
                Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-container>
  </div>
</template>