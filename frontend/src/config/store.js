import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{//Estado de visible true/false
        isMenuVisible:false,
        user:null
    },
    mutations:{
        toggleMenu(state, isVisible){
            if(!state.user){//Se não tiver logado não ira mostrar o menu, não irar mostrar ira retorna
                state.isMenuVisible=false
                return
            }

            if(isVisible === undefined){// se isVisible for ingual a undefined
                state.isMenuVisible = !state.isMenuVisible // o state de isMenuVisible e false
            }else{//se passou true ou false
                 state.isMenuVisible = isVisible   
            }    
        },

        //Authorization logar
        setUser(state,user){
            state.user=user
            if(user){// se user tiver logado
                axios.defaults.headers.common['Authorization']= `bearer ${user.token}`
                state.isMenuVisible=true // o estado munda para menu visivel
            }else{
                delete axios.defaults.headers.common['Authorization']
                state.isMenuVisible=false
            }
        }
    }

})
//arquivo importa para main.js para ser compartilhada entre os componentes