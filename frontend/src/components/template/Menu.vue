<template>
  <aside class="menu" v-show="isMenuVisible">
      <div class="menu-filter">
          <i class="fa fa-search fa-lg"></i>
          <input type="text" 
                 placeholder="Digite para filtrar"
                 v-model="treeFilter"
                 class="filter-field">
      </div>
      <Tree :data="treeData" :options="treeOptions"
          :filter="treeFilter"  ref="tree"/>
  </aside>
</template>

<script>
import {mapState} from 'vuex'
import Tree from 'liquor-tree'
import {baseApiUrl} from '@/global'
import axios from 'axios'

export default {
    name:'Menu',
    components:{Tree},
    computed: mapState(['isMenuVisible']), //Maperar o state de isMenuVisible, remover o menu
    data:function(){
        return{
            treeFilter:'',
            treeData:this.getTreeData(),
            treeOptions:{
                propertyNames:{'text':'name'},
                filter:{emptyText:'Categoria não encontrada'}//Quando não estiver resutado na pesquisa
            }
        }
    },
    methods:{
        getTreeData(){
            const url = `${baseApiUrl}/categories/tree`
            return axios.get(url).then(res => res.data)
        },
        onNodeSelect(node){//link
            this.$router.push({
                name:'articlesByCategory',
                params:{id:node.id}
            })

                // se menu tiver xs ou sm chama o toggleMenu
            if(this.$mq === 'xs' || this.$mq ==='sm'){
                this.$store.commit('toggleMenu',false)//Menu feichar
            }
        }
    },
    mounted(){
        // para utilizar um referencia  ref
        this.$refs.tree.$on('node:selected',this.onNodeSelect) //chamando a função onNodeSelect ira retorna uma nova rotar
    }

}
</script>

<style>
    .menu{
        grid-area: menu;
        background: linear-gradient(to right, #232526, #414345);
    
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
    }

    .menu a, .menu a:hover{
        color: #fff;
        text-decoration: none;
    }

    .menu .tree-node.selected > .tree-content,
    .menu .tree-node .tree-content:hover{
        background-color:  rgba(255, 255, 255, 0.2);
    }

    .tree-arrow.has-child{
        filter: brightness(2);
    }

    .menu .menu-filter{
        display: flex;
        justify-content: center;
        align-items: center;

        margin: 20px;
        padding-bottom: 8px;
        border-bottom: 1px solid #aaa;
    }

    .menu .menu-filter i{
        color: #aaa;
        margin-right: 10px;
    }

    .menu input{
        color: #ccc;
        font-size: 1.3rem;
        border: 0;
        outline: 0;
        width: 100%;
        background: transparent;
    }

    .tree-filter-empty {
        color: #CCC;
        font-size: 1.3rem;
        margin-left: 20px;
    }
</style>