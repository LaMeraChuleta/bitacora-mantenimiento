<script>
import { mapState } from "vuex";
import Axios from "axios";
import fechaService from "../service/fechaService.js";
import saveAs from "file-saver";

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
    carrilesDisable: true,
    INSERT_UPDATE: true,
    insertarEventosValidacionBoton: false 
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
    titulo() {
      var f = new Date();
      return `${fechaService.numero_to_nombre(
        f.getMonth() + 1
      )} ${f.getFullYear()}`;
    }
  },
  ////////////////////////////////////////////////////
  //                 METODOS                        //
  ////////////////////////////////////////////////////
  methods: {
    next() {
      this.$refs.calendar.next();
      let _fecha_actual = this.value.split("-");
      this.getEventos(_fecha_actual[1], _fecha_actual[0]);
    },
    prev() {
      this.$refs.calendar.prev();
      let _fecha_actual = this.value.split("-");
      this.getEventos(_fecha_actual[1], _fecha_actual[0]);
    },
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

      Axios.post(`${PATH_RUTA}/Calendario/getComentario/CALENDARIO`, item)
        .then((response) => {
          if (response.status == 200)
            this.comentario = response.data.result.table[0].comment;
        })
        .catch((ex) => {
          this.comentario = "";
          console.log(ex);
        });

      Axios.post(`${PATH_RUTA}/Calendario/ActividadMesYear/CALENDARIO`, item)
        .then((response) => {
          this.INSERT_UPDATE = response.data.result.length == 0 ? true : false;
          if (response.status === 200) {
            var i = 1;
            let _eventos = [];
            console.log(response.data.result);
            while (i < 31) {
               let query = response.data.result.filter(
                  (item) => item.day == i
                );
              for (let actividad of this.tipoActividad) {               
                let _itemFilter = query.filter(itemfilter => itemfilter.frequencyId == actividad.value)

                if (_itemFilter.length > 0) {
                  _eventos.push(_itemFilter);
                }
              }
              i++;
            }
            console.log(_eventos);
            for (let item of _eventos) {
              let carriles = [];
              for (let item2 of item) {
                carriles.push({
                  lane: item2.lane,
                  capufeLaneNum: item2.capufeLaneNum,
                  idGare: item2.idGare,
                });
              }
              let fecha = `${año}-${mes}-${item[0].day}`;
              let colorName = this.codigoColores(item[0].frequencyId);
              this.events.push({
                name: colorName.name,
                color: colorName.color,
                start: fecha,
                day: parseInt(item[0].day),
                month: mes,
                year: año,
                carriles: carriles,
                timed: false,
                end: "",
              });
            }
          }
        })
        .catch((ex) => {
          console.log(ex);
        });
    },
    getPDF() {
      let mes,
        año = "";
      if (this.value == "") {
        let fecha = new Date();
        mes = fecha.getMonth() + 1;
        año = fecha.getFullYear();
      } else {
        let fecha = this.value.split("-");
        mes = fecha[1];
        año = fecha[0];
      }
      const idPlaza = this.plaza.slice(0, 3);
      const idUser = this.USER[0].userId;
      const referenceSquare = this.USER[0].referenceSquare

      var oReq = new XMLHttpRequest();
      let urlTopdf = `${PATH_RUTA}/Calendario/Mantenimiento/${referenceSquare}/${mes}/${año}/${idUser}/${idPlaza}`;      
      let namePdf = `REPORTE-${fechaService.numero_to_nombre(mes)}.pdf`;
      // Configure XMLHttpRequest
      oReq.open("GET", urlTopdf, true);
      // Important to use the blob response type
      oReq.responseType = "blob";
      // When the file request finishes
      // Is up to you, the configuration for error events etc.
      oReq.onload = function () {
        // Once the file is downloaded, open a new window with the PDF
        // Remember to allow the POP-UPS in your browser
        var file = new Blob([oReq.response], {
          type: "application/pdf",
        });
        // Generate file download directly in the browser !
        saveAs(file, namePdf);
      };
      oReq.send();
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
      //Formato YYYY-MM-DD
      fecha = `${fecha[0]}-${fecha[1]}-${parseInt(fecha[2])}`;
      let colorName = this.codigoColores(this.actividadSelect);
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
        (item) => item.start == this.selectedEvent.start && item.name == this.selectedEvent.name
      );
      this.events.splice(index, 1);
      this.selectedEvent = {};
      //this.guardarInfo();
      this.selectedOpen = false;
      alert('borrado evento')
    },
    codigoColores(_idSemanal) {
      let obj = {};
      switch (parseInt(_idSemanal)) {
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
    async guardarInfo() {
      this.insertarEventosValidacionBoton = true
      const idPlaza = this.plaza.slice(0, 3);
      const idUser = this.USER[0].userId;
      console.log(this.value)
      let mes_comodin = ""
      let año_comodin = ""
      if(this.value == ""){
        let _date = new Date()
        mes_comodin = _date.getMonth() + 1
        año_comodin =  _date.getFullYear()
      }
      else{
        let fecha_comodin = this.value.split('-')
        año_comodin = fecha_comodin[0]
        mes_comodin = fecha_comodin[1]
      }            
      let _ruta_eliminar_pdf = this.events.length == 0 
      ? `${PATH_RUTA}/Calendario/DeleteCalendar/CALENDARIO/${mes_comodin}/${año_comodin}/${idUser}/${idPlaza}`
      : `${PATH_RUTA}/Calendario/DeleteCalendar/CALENDARIO/${this.events[0].month}/${this.events[0].year}/${idUser}/${idPlaza}`            
        await Axios.delete(_ruta_eliminar_pdf)
          .then((response) => {            
            console.log(response);
          })
          .catch((ex) => {
            console.log("cath");
            console.log(ex);
          });

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
          (obj["comment"] = this.comentario === null ? "" : this.comentario);
        return obj;
      });

      let map_nuevo = [];
      for (let item2 of this.events) {
        let obj = {};
        (obj["frequencyId"] = this.tipoActividad.find(
          (actividad) => actividad.text === item2.name
        ).value),
          (obj["capufeLaneNums"] = item2.carriles.map(
            (carril) => carril.capufeLaneNum
          ));
        obj["idGares"] = item2.carriles.map((gare) => gare.idGare);
        obj["squareId"] = idPlaza;
        (obj["userId"] = idUser),
          (obj["day"] = item2.day),
          (obj["month"] = item2.month),
          (obj["year"] = item2.year),
          (obj["FinalFlag"] = false),
          (obj["comment"] = this.comentario === null ? "" : this.comentario);

        map_nuevo.push(obj);
      }
      console.log(map)
            
      let _activitiComent = {}
      if(map.length == 0){   
        let obj = {};       
        obj["frequencyId"] = 0,
        obj["capufeLaneNums"] = [],
        obj["idGares"] = [],
        obj["squareId"] = "",
        obj["userId"] = 0,
        obj["day"] = 0,
        obj["month"] = 0,
        obj["year"] = 0,
        obj["FinalFlag"] = false,
        obj["comment"] = "";
        _activitiComent = obj
        this.comentario = ""
      }
      else{
        _activitiComent  = { ...map};
        for (let item of map) {
        let full_path = "Calendario/Actividad/CALENDARIO"          
        await Axios.post(`${PATH_RUTA}/${full_path}`, item)
          .then((response) => {
            _activitiComent = item;
            console.log(response);
          })
          .catch((ex) => {
            console.log("cath");
            console.log(ex);
          });
      }
       
      }
       console.log(_activitiComent)     
      await Axios.post(
        `${PATH_RUTA}/Calendario/ObservacionesInsert/CALENDARIO`,
        _activitiComent
      )
        .then(() => {          
          this.insertarEventosValidacionBoton = false
          alert('SE INSERTARON LAS ACTIVIDADES Y EL CALENDARIO')
        })
        .catch((ex) => {
          console.log("cath");
          console.log(ex);
        });
    },
    openDialogEvent({ date }) {
      console.log(date);
      //let fecha = date.split("-");
      // this.guardarInfo()
      // this.getEventos(fecha[1], fecha[0]);
      this.carrilesDisable = true;
      this.dialog = true;
    },
    carriles() {
      if (this.actividadSelect == "") {
        this.carrilesDisable = true;
      } else if (this.actividadSelect == 1) {
        this.carrilesDisable = false;
        return this.CARRILES.map((item) => ({
          value: {
            capufeLaneNum: item.capufeLaneNum,
            idGare: item.idGare,
            lane: item.lane,
          },
          text: item.lane,
        }));
      } else if (this.actividadSelect > 1) {
        let _rolUser = this.USER[0].rollId
        console.log(_rolUser)
        let _carriles_prohibidos = [];
        for (let evento of this.events) {
          if (evento.name != "Semanal") {
            for (let carril of evento.carriles) {                                                     
                if(_rolUser == 1){
                  _carriles_prohibidos.push(carril);
                }
                else{
                  if(carril.lane != 'Plaza' && carril.lane != "Plaza-M"){
                    _carriles_prohibidos.push(carril);
                  }                                  
                }                                
            }
          }
        }
        let _carriles = [];
        for (let carrilesFull of this.CARRILES) {
          let map = _carriles_prohibidos.findIndex(
            (item) =>
              item.capufeLaneNum == carrilesFull.capufeLaneNum &&
              item.idGare == carrilesFull.idGare
          );
          if (map == -1) {
            _carriles.push({
              value: {
                capufeLaneNum: carrilesFull.capufeLaneNum,
                idGare: carrilesFull.idGare,
                lane: carrilesFull.lane,
              },
              text: carrilesFull.lane,
            });
          }
        }
        this.carrilesDisable = false;
        return _carriles;
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
        <v-btn icon class="ma-2" @click="prev">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-toolbar-title class="mt-3 text-capitalize" v-if="$refs.calendar">{{
          $refs.calendar.title
        }}</v-toolbar-title>
        <v-toolbar-title class="mt-3" v-else>{{ titulo }}</v-toolbar-title>
        <v-btn icon class="ma-2" @click="next">
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
          @click:date="openDialogEvent"
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
          <v-btn @click="guardarInfo" outlined color="primary" class="ma-2" :disabled="insertarEventosValidacionBotonlisto"
            >Guardar Cambios</v-btn
          >
          <v-btn @click="getPDF()" outlined color="red" class="ma-2"
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
              <v-list-item class="flex d-block text-center">
                <v-list-item-content
                  v-for="(carril, key) in selectedEvent.carriles"
                  :key="key"
                >
                  <v-list-item-title
                    >Carril: {{ carril.lane }}</v-list-item-title
                  >
                  <v-list-item-subtitle>
                    IdGare: {{ carril.idGare }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
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
                      :items="carriles()"
                      dense
                      :disabled="carrilesDisable"
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
