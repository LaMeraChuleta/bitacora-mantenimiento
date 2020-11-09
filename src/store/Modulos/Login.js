import Axios from "axios";

const PATH_RUTA = 'http://prosisdev.sytes.net:88/api';

const state = {

    USER: []
};

const getters = {


};
const mutations = {

    USER_MUTATION: (state, value) => {
        state.USER = value
    }
};
const actions = {
    //CONSULTA PARA OBTENER DTCHEADER POR ID TECNICO
    async GET_USER({ commit }, value) {
        
         Axios.get(`${PATH_RUTA}/login/ValidUser/${value.name}/${value.pass}/${true}`)
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
           
    }

};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
