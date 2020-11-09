<template>
       <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="20"
        />

        Prosis
      </div>

      <v-spacer></v-spacer>

      <v-btn
        @click="salir"
        target="_blank"
        text
      >
        <span class="mr-2">Salir</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
</template>
<script>
export default {
    
    methods:{

        salir(){
            this.$router.push('/login')
        }
    }
}
</script>