import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{//Estado de visible true/false
        isMenuVisible:true,
        user:{
            name:'Usuário Mock',
            email:'juninhomend@gmail.com'
        }
    },
    mutations:{
        toggleMenu(state, isVisible){
            if(isVisible === undefined){// se isVisible for ingual a undefined
                state.isMenuVisible = !state.isMenuVisible // o state de isMenuVisible e false
            }else{//se passou true ou false
                 state.isMenuVisible = isVisible   
            }

            
        }
    }

})
//arquivo importa para main.js para ser compartilhada entre os componentes