<script>
export default {
  data() {
    return {
      e6: 1,
      files: [],
      edit: true,
      headers: [
        {
          text: "Carril",
          align: "start",
          value: "carril",
        },
        { text: "Fecha", value: "status" },
      ],
      desserts: [
        {
          carril: "A01",
          status: "11/01/2020",
        },
        {
          carril: "A02",
          status: "11/01/2020",
        },
        {
          carril: "A03",
          status: "11/01/2020",
        },
        {
          carril: "A01",
          status: "11/01/2020",
        },
        {
          carril: "A02",
          status: "11/01/2020",
        },
        {
          carril: "A03",
          status: "11/01/2020",
        },
        {
          carril: "A01",
          status: "11/01/2020",
        },
        {
          carril: "A02",
          status: "11/01/2020",
        },
        {
          carril: "A03",
          status: "11/01/2020",
        },
      ],
      page: 1,
      pageCount: 0,
      itemsPerPage: 3,
    };
  },
  methods: {
    verFiles() {
      console.log(this.files[0]);
    },
  },
};
</script>

<template>
  <v-container class="pa-5">
    <v-sheet>
      <v-card elevation="1">
        <v-card-title class="justify-center">
          <h2>Seguimiento de Mantenimiento</h2>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <h3 class="ma-3">Calendario de Mantenimiento Preventivo</h3>
              <h3 class="ma-3 text-capitalize" v-if="$refs.calendar">
                Correspondiente al mes de: {{ $refs.calendar.title }}
              </h3>
              <h3 class="ma-3 text-capitalize" v-else>
                Correspondiente al mes de: {{ titulo }}
              </h3>
              <h3 class="ma-3">Plaza de Cobro: {{ "001 Tlalpan" }}</h3>
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
            <v-btn @click="verFiles" color="primary" outlined>Siguiente</v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>

      <v-stepper-step editable="" :complete="e6 > 2" step="2">
        Reporte del Servicio
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-card color="" class="mb-12" height="500px">
          <v-card-title>Suba sus Archivos</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="">
                <v-bottom-navigation :value="value" color="primary" grow>
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
                </v-data-table>
                <div class="text-center pt-2">
                  <v-pagination
                    v-model="page"
                    :length="pageCount"
                  ></v-pagination>
                  <!-- <v-text-field
                    :value="itemsPerPage"
                    label="Items per page"
                    type="number"
                    min="-1"
                    max="15"
                    @input="itemsPerPage = parseInt($event, 10)"
                  ></v-text-field> -->
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="flexd justify-end">
            <v-btn text> Cancelar</v-btn>
            <v-btn @click="verFiles" color="primary" outlined>Siguiente</v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>

      <v-stepper-step editable :complete="e6 > 3" step="3">
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
            <v-btn @click="verFiles" color="primary" outlined>Siguiente</v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>
    </v-stepper>
  </v-container>
</template>