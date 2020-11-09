import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

import es from 'vuetify/es5/locale/es'

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: es ,
    current: 'es',
  },
  theme: {
    themes: {
      light: {
        primary: '#0972FF',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      },
    },
  },
});
