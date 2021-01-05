<template>
  <div class="auth-content">
      <div class="auth-modal">
          <img src="@/assets/logo.png" width="200" alt="Logo">
            <hr>
            <div class="auth-title">{{showSignup ? 'Cadastro': 'Login'}}</div>
            <!-- Name ajuda o navegador encontrar email e senhas salvas -->
            <input v-if="showSignup" v-model="user.name"  type="text" placeholder="Nome">
            <input v-model="user.email" name="email" type="text" placeholder="E-mail">
            <input v-model="user.password" name="password" type="password" placeholder="Senha">
            <input v-if="showSignup" v-model="user.confirmPassword"  type="password" placeholder="Confirme a Senha">

            <button v-if="showSignup" @click="signup" >Registrar</button>
            <button v-else @click="signin" >Entrar</button>

            <!-- prevent chamar o comportamento padrão -->
            <a href @click.prevent="showSignup = !showSignup">
                <span v-if="showSignup" >Já tem cadastro? Acesse o Login!</span>
                <span v-else >Não tem cadastro? Registre-se aqui!</span>
            </a>
      </div>
  </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from '@/global'
import axios from 'axios'
export default {
    name:'Auth',
    data: function(){
        return{
            showSignup: false, // se tiver true vai mostrar o signup se não mostrar o login
            user:{}// Armazenar senha,email
        }
    },
    methods:{
        signin(){//Fazer o login
            axios.post(`${baseApiUrl}/signin`,this.user)
                .then(res =>{
                    this.$store.commit('setUser',res.data)
                    localStorage.setItem(userKey, JSON.stringify(res.data))//Clocar a reposta do signin no localStorage
                    this.$router.push({path:'/'})
                })
                .catch(showError)
        },
        signup(){//Cadastro
            axios.post(`${baseApiUrl}/signup`,this.user)
                .then(()=>{
                    this.$toasted.global.defaultSuccess()
                    this.user={}
                    this.showSignup=false //Irar para tela de login
                })
                .catch(showError)
        }
    }

}
</script>

<style>
.auth-content{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.auth-modal{
    background-color: #fff;
    widows: 350px;
    padding: 35px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);

    display: flex;
    flex-direction: column;
    align-items: center;
}

.auth-title{
    font-size: 1.2rem;
    font-weight: 100;
    margin-top: 10px;
    margin-bottom: 15px;
}

.auth-modal input{
    border: 1px solid #bbbb;
    width: 100%;
    margin-bottom: 15px;
    padding: 3px 8px;
    outline: none;
}

.auth-modal button{
    align-self: flex-end;
    background-color: #2460ae;
    color: #fff;
    padding: 5px 15px;
}
.auth-modal a{
    margin-top: 35px;
}

</style>