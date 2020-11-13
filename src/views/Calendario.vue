<script>
import FormCalendario from "../components/Calendario.vue";
import NavBar from "../components/NavBar.vue";

export default {
  components: {
    FormCalendario,
    NavBar
  },
};
</script>

<template>
  <div>
    <NavBar></NavBar>    
    <FormCalendario></FormCalendario>
  </div>
</template>
