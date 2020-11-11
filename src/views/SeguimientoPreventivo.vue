<script>
import NavBar from "../components/NavBar.vue";
import { mapState } from "vuex";
export default {
  components: {
    NavBar,
  },
  data() {
    return {
      dialogPlaza: false,
      plazaSelect: "",
      plaza: "",
      carrilesSelect: "",
      e6: 1,
      files: [],
      edit: true,
      tipoReporte: [
        { value: 0, text: "Reporte Semanal" },
        { value: 1, text: "Reporte Mensual" },
      ],
      dialogReporte: false,
      headers: [
        {text: "Carril", value: "carril", align: "center"},
        { text: "Nombre Archivo", value: "nombrefile", align: "center" },
        { text: 'Acciones', value: 'actions', align: "center" }
      ],
      desserts: [
        {
          carril: "A01",
          nombrefile: "Reporte_01.pdf",          
        },
        {
          carril: "A02",
          nombrefile: "Reporte_01.pdf",
        },
        {
          carril: "A03",
          nombrefile: "Reporte_01.pdf",
        },
        {
          carril: "A01",
          nombrefile: "Reporte_01.pdf",
        },
        {
          carril: "A02",
          nombrefile: "Reporte_01.pdf",
        },
        {
          carril: "A03",
          nombrefile: "11/01/2020",
        },
        {
          carril: "A01",
          nombrefile: "11/01/2020",
        },
        {
          carril: "A02",
          nombrefile: "11/01/2020",
        },
        {
          carril: "A03",
          nombrefile: "11/01/2020",
        },
      ],
      page: 1,
      pageCount: 0,
      itemsPerPage: 3,
    };
  },
  ////////////////////////////////////////////////////
  //                 CICLO DE VIDA                  //
  ////////////////////////////////////////////////////
  beforeMount() {
    this.OpcionesPlaza();
  },
  ////////////////////////////////////////////////////
  //                 COMPUTADOS                     //
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
  methods: {
    OpcionesPlaza() {
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
        this.OpcionesPlaza();
      }
      this.plazaSelect = "";
    },
    actualizarPlaza() {
      this.OpcionesPlaza();
      this.dialogPlaza = false;
    },
    verFiles() {
      console.log(this.files[0]);
    },
  },
};
</script>

<template>
  <div>
    <NavBar></NavBar>
    <v-container class="pa-5 mt-16">
      <v-sheet>
        <v-card elevation="1">
          <v-card-title class="justify-center">
            <h2>Seguimiento de Mantenimiento</h2>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                

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
              <v-col cols="6" class="text-center">
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
      <v-stepper class="mt-10" v-model="e6" vertical>
        <v-stepper-step :editable="edit" :complete="e6 > 1" step="1">
          Calendario Actividades
          <small>Espacio para subir evidencia</small>
        </v-stepper-step>

        <v-stepper-content step="1">
          <v-card color="grey lighten-2" class="mb-12" height="230">
            <v-card-title>Suba sus Archivos</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="4">
                  <v-file-input
                    v-model="files"
                    placeholder="Upload your documents"
                    label="File input"
                    multiple
                    prepend-icon="mdi-paperclip"
                  >
                    <template v-slot:selection="{ text }">
                      <v-chip small label color="primary">
                        {{ text }}
                      </v-chip>
                    </template>
                  </v-file-input>
                </v-col>
                <v-col> </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="flexd justify-end">
              <v-btn text> Cancelar</v-btn>
              <v-btn @click="verFiles" color="primary" outlined
                >Siguiente</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-stepper-content>

        <v-stepper-step editable="" :complete="e6 > 2" step="2">
          Reporte del Servicio
        </v-stepper-step>

        <v-stepper-content step="2">
          <v-card color="" class="mb-12" height="520px">
            <v-card-title>Suba sus Archivos</v-card-title>
            <v-card-subtitle class="mt-1">
              <v-btn @click="dialogReporte = true" color="green" outlined
                >Agregar Reporte<v-icon class="ml-1"
                  >mdi-folder-plus-outline</v-icon
                ></v-btn
              ></v-card-subtitle
            >
            <v-card-text>
              <v-row>
                <v-col cols="">
                  <v-bottom-navigation :value="0" color="primary" grow>
                    <v-btn>
                      <span>Reportes Semanal</span>
                    </v-btn>
                    <v-btn>
                      <span>Reporte Mensual</span>
                    </v-btn>
                  </v-bottom-navigation>
                  <v-data-table
                    :headers="headers"
                    :items="desserts"
                    :page.sync="page"
                    :items-per-page="itemsPerPage"
                    hide-default-footer
                    class="elevation-1"
                    @page-count="pageCount = $event"
                  >
                    <template v-slot:item.actions>
                      <v-icon  class="mr-2" @click="editItem(item)">
                        <small>Evidencia</small>
                        mdi-arrow-down-bold-circle-outline
                        
                      </v-icon>
                   
                    </template>
                  </v-data-table>
                  <div class="text-center pt-2">
                    <v-pagination
                      v-model="page"
                      :length="pageCount"
                    ></v-pagination>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="flexd justify-end">
              <v-btn text> Cancelar</v-btn>
              <v-btn @click="verFiles" color="primary" outlined
                >Siguiente</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-stepper-content>

        <!-- <v-stepper-step editable :complete="e6 > 3" step="3">
          Evidencia Fotografica
        </v-stepper-step>

        <v-stepper-content step="3">
          <v-card color="grey lighten-2" class="mb-12" height="230px">
            <v-card-title>Suba sus Archivos</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="4">
                  <v-file-input
                    v-model="files"
                    placeholder="Upload your documents"
                    label="File input"
                    multiple
                    prepend-icon="mdi-paperclip"
                  >
                    <template v-slot:selection="{ text }">
                      <v-chip small label color="primary">
                        {{ text }}
                      </v-chip>
                    </template>
                  </v-file-input>
                </v-col>
                <v-col> </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="flexd justify-end">
              <v-btn text @click="e6 = 2"> Cancelar</v-btn>
              <v-btn @click="verFiles" color="primary" outlined
                >Siguiente</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-stepper-content> -->
      </v-stepper>
      <!-- ////////////////////////////////////////////////////////////
    //                   Modal de Reporte                    ///
    //////////////////////////////////////////////////////////////// -->
      <div class="text-center">
        <v-dialog v-model="dialogReporte" width="350">
          <v-card>
            <v-card-title class="headline grey lighten-2">
              Nuevo Reporte
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row class="flexd justify-center">
                  <v-col class="d-inline">
                    <v-select
                      v-model="actividadSelect"
                      :items="tipoReporte"
                      dense
                      outlined
                      hide-details
                      class="ma-2"
                      label="Tipo de Actividad"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row class="flexd justify-center">
                  <v-col class="d-inline">
                    <v-select
                      v-model="carrilesSelect"
                      :items="carriles"
                      dense
                      outlined
                      hide-details
                      class="ma-2"
                      label="Selecciona el Carril"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row class="flexd justify-center">
                  <v-col cols="11">
                    <v-file-input
                      v-model="files"
                      label="Archivo"
                      placeholder="Sube tu reporte"
                      outlined
                    >
                      <template v-slot:selection="{ text }">
                        <v-chip small label color="primary">
                          {{ text }}
                        </v-chip>
                      </template>
                    </v-file-input>
                  </v-col>
                </v-row>
                <small>*Llenar todos los campos</small>
              </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="dialogReporte = false"
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