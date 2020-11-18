<script>
import { mapState } from "vuex";
import Axios from "axios";
const PATH_RUTA = "http://prosisdev.sytes.net:88/api";
//const PATH_RUTA = "https://localhost:44358/api"
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
      { value: 1, text: "Semanal" },
      { value: 2, text: "Mensual" },
      { value: 3, text: "Trimestral" },
      { value: 4, text: "Semestral" },
      { value: 5, text: "Anual" },
    ],
    weekday: [0, 1, 2, 3, 4, 5, 6],
    actividadSelect: "",
    carrilesSelect: "",
    comentario: "",
    value: "",
  }),
  ////////////////////////////////////////////////////
  //                 CICLO DE VIDA                  //
  ////////////////////////////////////////////////////
  beforeMount() {
    this.opcionesPlaza();
    this.getEventos(undefined, undefined);
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
    getEventos(mes, año) {
      if (mes === undefined || año === undefined) {
        let fecha = new Date();
        mes = fecha.getMonth() + 1;
        año = fecha.getFullYear();
      }
      const idPlaza = this.plaza.slice(0, 3);
      const idUser = this.USER[0].userId;

      this.events = [];
      let item = {
        userId: idUser,
        squareId: idPlaza,
        month: mes,
        year: año,
      };

      Axios.post(`${PATH_RUTA}/Calendario/ActividadMesYear`, item)
        .then((response) => {
          console.log(response.data.result);
          if (response.status === 200) {
            var i = 1;
            let _eventos = [];
            while (i < 31) {
              let query = response.data.result.filter((item) => item.day == i);
              if (query.length > 0) {
                _eventos.push(query);
              }
              i++;
            }
            for (let item of _eventos) {
              let carriles = [];
              for (let item2 of item) {
                carriles.push({
                  lane: item2.lane,
                  capufeLaneNum: item2.capufeLaneNum,
                  idGare: item2.idGare,
                });
              }
              let fecha = `${año}-${mes}-${parseInt(item[0].day) + 1}`;
              let colorName = this.codigoColores(item[0].frequencyId)              
              this.events.push({
                name: colorName.name,
                color: colorName.color,
                start: new Date(Date.parse(fecha)),
                carriles: carriles,
                timed: false,
                end: "",
              });
            }
          }
        })
        .catch((ex) => {
          console.log("cath");
          console.log(ex);
        });
    },
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
        let id_nombre = this.USER.find(
          (item) => item.squareCatalogId == this.plazaSelect
        );
        this.plaza = `${id_nombre.squareCatalogId} ${id_nombre.squareName}`;
        this.$store.dispatch("Login/GET_CARRILES", this.plazaSelect);
      } else {
        this.plazaSelect = this.USER[0].squareCatalogId;
        this.opcionesPlaza();
      }
      this.plazaSelect = "";
    },
    actualizarPlaza() {
      this.opcionesPlaza();
      this.getEventos();
      this.dialogPlaza = false;
    },
    agregarEvent(value) {
      let fecha = value.split("-");
      let _fecha = fecha;
      //Formato YYYY-/
      fecha = `${fecha[0]}-${fecha[1]}-${parseInt(fecha[2])}`;
      let colorName = this.codigoColores(this.actividadSelect)
      console.log(colorName)
      this.events.push({
        name: colorName.name,
        color: colorName.color,
        start: fecha,
        day: parseInt(_fecha[2]),
        month: parseInt(_fecha[1]),
        year: parseInt(_fecha[0]),
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
      codigoColores(_idSemanal) {
      let obj = {};
      switch (_idSemanal) {
        case 1:
          obj = { name: "Semanal", color: "green" };
          break;
        case 2:
          obj = { name: "Mensual", color: "red" };
          break;
        case 3:
          obj = { name: "Trimestral", color: "blue" };
          break;
        case 4:
          obj = { name: "Semestral", color: "pink" };
          break;
        case 5:
          obj = { name: "Anual", color: "orange" };
          break;
        default:
          console.log("mal");
      }

      return obj;
    },
    guardarInfo() {
      const idPlaza = this.plaza.slice(0, 3);
      const idUser = this.USER[0].userId;

      let map = this.events.map((item) => {
        let obj = {};
        (obj["frequencyId"] = this.tipoActividad.find(
          (actividad) => actividad.text === item.name
        ).value),
          (obj["capufeLaneNums"] = item.carriles.map(
            (item) => item.capufeLaneNum
          ));
        obj["idGares"] = item.carriles.map((item) => item.idGare);
        obj["squareId"] = idPlaza;
        (obj["userId"] = idUser),
          (obj["day"] = item.day),
          (obj["month"] = item.month),
          (obj["year"] = item.year),
          (obj["FinalFlag"] = false),
          (obj["comment"] = this.comentario);
        return obj;
      });

      console.log(map);
      for (let item of map) {
        console.log(item);
        Axios.post(`${PATH_RUTA}/Calendario/Actividad`, item)
          .then((response) => {
            console.log(response);
          })
          .catch((ex) => {
            console.log("cath");
            console.log(ex);
          });
      }
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
              <v-col cols="4">
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
          locale="es"
          category-show-all
          :masks="{ input: ['L', 'YYYY-MM-DD'] }"
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
          <v-textarea
            v-model="comentario"
            outlined
            label="Observaciones Mensuales"
          ></v-textarea>
        </v-sheet>
        <v-sheet class="mt-2 mb-10">
          <v-btn @click="guardarInfo" outlined color="primary"
            >Imprimir Reporte</v-btn
          >
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
              <v-btn color="primary" text @click="agregarEvent(value)">
                Guardar
              </v-btn>
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