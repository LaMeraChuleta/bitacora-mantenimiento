<template>
  <div>
    <v-container class="pa-0" fluid>
      <v-row>
        <v-col cols="6" class="pa-0">
          <v-card height="1000">
            <v-card-text>
              <h1 class="mt-5 mb-16 mt-16 text-center">Bitacora de Mantenimiento</h1>
              <v-row>
                <v-col cols="12" class="pa-10">
                  <v-text-field
                    class="mt-16"
                    v-model="title"
                    rounded
                    label="Usuario"
                    outlined
                  ></v-text-field>
                  <v-text-field
                    v-model="title"
                    rounded
                    label="Contraseña"
                    outlined
                  ></v-text-field>
                  <v-row>
                    <v-col class="d-flex justify-center">
                      <v-btn @click="login" large rounded width="600" color="primary">Ingresar</v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" class="pa-0">
          <v-img src="../assets/login.jpg" height="1000"></v-img>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
export default {
    methods:{
        login(){
            this.$router.push('/')
        }
    }
};
</script>