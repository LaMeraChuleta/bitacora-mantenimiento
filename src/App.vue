<template>
  <v-app>     
    
    <router-view></router-view>
    
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {},

  data: () => ({
    //
  }),
  methods:{

    salir(){

      this.router.push('/login')
    }
  }
};
</script>
