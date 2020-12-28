<template>
  <div class="user-dropdown">
      <!-- Dentro da div temos o button -->
      <div class="user-button">
        <!-- No button temos o name o img e icon -->
       
        <span class="d-none d-sm-block">{{user.name}}</span> <!-- Name -->
       
        <div class="user-dropdown-img"> <!-- Img -->
            <Gravatar :email="user.email" alt="User" />
         </div>
            <i class="fa fa-angle-down"></i>
      </div>
      <div class="user-dropdown-content">
          <router-link to="/admin">
              <i class="fa fa-cogs">Administração</i>
          </router-link>
          <router-link to="/">
              <i class="fa fa-sign-out">Sair</i>
          </router-link>
      </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Gravatar from 'vue-gravatar' //Colocar img no menu

export default {
    name:'UserDropdown',
    components:{Gravatar},
    computed: mapState(['user'])

}
</script>

<style>
    .user-dropdown{
        position: relative;
        height: 100%;
    }

    .user-button{
        display: flex;
        align-items: center;
        color: #fff;
        font-weight: 100;
        height: 100%;
        padding: 0px 20px;
    }

    .user-dropdown:hover{
        background-color: rgba(0, 0, 0, 0.2);
    }
    .user-dropdown-img{
        margin: 0px 10px;;
    }

    .user-dropdown-img > img{
        max-height: 37px;
        border-radius: 5px;
    }

    .user-dropdown-content{
        position: absolute;
        right: 0px;
        background-color: #f9f9f9;
        min-width: 170px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;

        display: flex;
        flex-direction: column;
        flex-wrap: wrap;

        visibility: hidden;
        opacity: 0;
        transition:  visibility 0s, opacity 0.5s linear;
    
    }

    /* quando estiver com hover ira aplicar outra regra */
    .user-dropdown:hover .user-dropdown-content{
        visibility: visible;
        opacity: 1;
    }

    .user-dropdown-content a{
        text-decoration: none;
        color: #000;
        padding: 10px;
    }

    .user-dropdown-content a:hover{
        text-decoration: none;
        color: #000;
        background-color: #ededed;
    }

</style>
// Ira colocar em header