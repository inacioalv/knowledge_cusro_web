import Vue from 'vue'

export const baseApiUrl = 'http://localhost:3000'

export function showError(e){
    if(e && e.response && e.response.data){
        Vue.toasted.global.defaultError({msg : e.response.data}) //Erro generico
    }else if(typeof e === 'string'){//Se for um string
        Vue.toasted.global.defaultError({msg:e})
    }else{// se não é string
        Vue.toasted.global.defaultError()
    }
}

export default {baseApiUrl,showError}