<template>
  <div>
    <v-container class="pa-0" fluid>
      <v-row>
        <v-col cols="6" class="pa-0">
          <v-card height="1000">
            <v-card-text>
              <h1 class="mt-5 mb-16 mt-16 text-center">
                Bitacora de Mantenimiento
              </h1>
              <v-row>
                <v-col cols="12" class="pa-10">
                  <v-text-field
                    v-model="user.name"
                    class="mt-16"
                    rounded
                    label="Usuario"
                    outlined
                  ></v-text-field>
                  <v-text-field
                    v-model="user.pass"
                    rounded
                    label="Contraseña"
                    type="password"
                    outlined
                  ></v-text-field>
                  <v-row>
                    <v-col class="d-flex justify-center">
                      <v-btn
                        @click="login()"
                        large
                        rounded
                        width="600"
                        color="primary"
                        >Ingresar</v-btn
                      >
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
import Axios from "axios";
const PATH_RUTA = "http://prosisdev.sytes.net:88/api";
export default {
  data: function () {
    return {
      user: {
        name: "",
        pass: "",
      },
    };
  },
  methods: {
    login: async function () {
      Axios.get(`${PATH_RUTA}/login/ValidUser/${this.user.name}/${this.user.pass}/${true}`
      )
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            this.$store.commit("Login/USER_MUTATION", response.data.result);            
            this.$router.push("/home");
          }
        })
        .catch((ex) => {
          console.log("cath");
          console.log(ex);
        });
    },
  },
};
</script>