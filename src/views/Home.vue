<template>
  <div>
    <NavBar></NavBar>
    <v-container class="pa-16 mt-10">
      <v-row align="center" justify="space-around">
        <v-col cols="6"><v-btn @click="calendario" elevation="20" rounded  outlined color="#22B00B" width="500" height="600">Mantenimiento Preventivo</v-btn></v-col>
        <v-col cols="6"><v-btn elevation="20" rounded  outlined color="#FC5A5A" width="500" height="600">Mantenimiento Correctivo</v-btn></v-col>
        
        <!-- <v-col cols="6"><v-btn elevation="20" rounded  outlined color="primary" width="500" height="300">Bitacora Electronica</v-btn></v-col> -->
        <!-- <v-col cols="6"><v-btn elevation="20" rounded  outlined color="#F9BD28" width="500" height="300">Configuracion</v-btn></v-col> -->
      </v-row>
    </v-container>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
export default {
  components: {
    NavBar,
  },
  methods:{
    calendario(){

      this.$router.push('/preventivo')
    }
  }
};
</script>

<style>
</style>