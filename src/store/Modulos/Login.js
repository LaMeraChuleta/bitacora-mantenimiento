import Axios from "axios";

const PATH_RUTA = 'http://prosisdev.sytes.net:88/api';
//const PATH_RUTA = "https://localhost:44358/api"

const state = {

    USER: [],
    CARRILES: []
};

const getters = {


};
const mutations = {

    USER_MUTATION: (state, value) => {
        state.USER = value
    },
    CARRILES_MUTATION: (state, value) => {
        state.CARRILES = value
    }
};
const actions = {
    //CONSULTA PARA OBTENER DTCHEADER POR ID TECNICO
    async GET_USER({ commit }, _user) {
        
        await Axios.get(`${PATH_RUTA}/login/ValidUser/${_user.name}/${_user.pass}/${true}`)
            .then(response => {   
                console.log(response)             
                if(response.status === 200){
                    commit("USER_MUTATION", response.data.result);                       
                }                    
            })
            .catch((ex) => {
                console.log('cath')
                console.log(ex)
            });  
           
    },
    async GET_CARRILES({ commit }, _plaza) {
        
        console.log(_plaza)
        console.log(`${PATH_RUTA}/squaresCatalog/lanes/${_plaza}`)
        Axios.get(`${PATH_RUTA}/squaresCatalog/lanes/${_plaza}`)
           .then(response => {   
               console.log(response)             
               if(response.status === 200){
                   commit("CARRILES_MUTATION", response.data.result);                         
               }                    
           })
           .catch((ex) => {
               console.log('cath')
               console.log(ex)
           });  
          
   }

};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
