<template>
	<div id="app" :class="{'hide-menu': !isMenuVisible || !user}"> <!-- Se  tiver diferente de isMenuVisible ou user irar aplicar  a classe do css , ira esconder -->
		<Header title="Cod3r - Base de Conhecimento" 
			:hideToggle="!user"
			:hideUserDropdown="!user" /><!--Só ira mostrar o menu se tiver logado  -->
		<Menu v-if="user" />
		<Loading v-if="validatingToken" />
		<!-- Vai mostrar o Loading ou Content -->
		<Content v-else />
		<Footer />
	</div>
</template>

<script>
import axios from "axios"
import { baseApiUrl, userKey } from "@/global"
import { mapState } from "vuex"
import Header from "@/components/template/Header"
import Menu from "@/components/template/Menu"
import Content from "@/components/template/Content"
import Footer from "@/components/template/Footer"
import Loading from "@/components/template/Loading"
export default {
	name: "App",
	components: { Header, Menu, Content, Footer, Loading },
	computed: mapState(['isMenuVisible', 'user']),//Remover a menu em branco
	data: function() {
		return {
			validatingToken: true
		}
	},
	methods: {
		async validateToken() {// se userData não tem nada
			this.validatingToken = true
			const json = localStorage.getItem(userKey)// se tiver logado 
			const userData = JSON.parse(json)// irar converter o json
			this.$store.commit('setUser', null)// setar com null para quando user tiver validado seta na storage ja com token validado
			if(!userData) {
				this.validatingToken = false
				this.$router.push({ name: 'auth' })//irar para pagina de autenticação
				return
			}// se passar do teste e porque esta setado
			const res = await axios.post(`${baseApiUrl}/validateToken`, userData)
			if (res.data) {
				this.$store.commit('setUser', userData)
				
				if(this.$mq === 'xs' || this.$mq === 'sm') {
					this.$store.commit('toggleMenu', false)
				}
			} else {
				localStorage.removeItem(userKey)// remover a chave
				this.$router.push({ name: 'auth' })
			}
			this.validatingToken = false
		}
	},
	created() {
		this.validateToken()
	}
}
</script>

<style>
	* {
		font-family: "Lato", sans-serif;
	}
	body {
		margin: 0;
	}
	#app {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		height: 100vh;
		display: grid;
		grid-template-rows: 60px 1fr 40px;
		grid-template-columns: 300px 1fr;
		grid-template-areas:
			"header header"
			"menu content"
			"menu footer";
	}
	#app.hide-menu {
		grid-template-areas:
			"header header"
			"content content"
			"footer footer";
	}
</style>