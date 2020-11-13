<script>
import NavBar from "../components/NavBar.vue";
import { mapState } from "vuex";
export default {
  components: {
    NavBar,
  },
  data() {
    return {
      plaza: "",
      plazaSelect: "",
    };
  },
  ////////////////////////////////////////////////////
  //                 CICLO DE VIDA                  //
  ////////////////////////////////////////////////////
  beforeMount() {
    this.opcionesPlaza();
  },
  computed: {
    ...mapState("Login", ["CARRILES", "USER"]),
  },
  ////////////////////////////////////////////////////
  //                 METODOS                        //
  ////////////////////////////////////////////////////
  methods: {
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
  },
};
</script>


<template>
  <div>
    <NavBar></NavBar>
    <v-container class="pa-10 mt-16">
      <!--///////////////////////////////////////////////////////////////////
    //                Header de Seguimiento Mantenimiento               ///
    ////////////////////////////////////////////////////////////////////// -->
      <v-sheet>
        <v-card elevation="1">
          <v-card-title class="justify-center">
            <h2>Mantenimiento Preventivo</h2>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="8">
                <h3 class="ma-3">No. De Reporte: {{ "POL_202403" }}</h3>
                <h3 class="ma-3">Plaza de Cobro: {{ plaza }}</h3>
                <h3 class="ma-3">
                  Persona de Prosis que realiza: {{ "Arturo Guerra" }}
                </h3>
                <h3 class="ma-3">
                  Persona de Capufe que recibe: {{ "Ernesto Perez Dominguez" }}
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
                <h3 class="ma-3">Fecha: {{ "28/08/2020" }}</h3>
                <h3 class="ma-3">Hora Inicio: {{ "13:00 HRS" }}</h3>
                <h3 class="ma-3">Hora Fin: {{ "13:30 HRS" }}</h3>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-sheet>
    </v-container>
  </div>
</template>