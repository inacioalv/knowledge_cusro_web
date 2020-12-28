<template>
<div class="home">
    <PageTitle icon="fa fa-home" main="Dashboard"
                sub="Base de Conhecimento"/>
            <div class="stats">
            <Stat title="Categorias" :value="stat.categories"
                icon="fa fa-folder" color="#d54d50" />
            <Stat title="Artigos" :value="stat.articles"
                icon="fa fa-file" color="#3bc480" />
            <Stat title="Usuários" :value="stat.users"
                icon="fa fa-user" color="#3282cd" />
        </div>
</div>
  
</template>

<script>
import PageTitle from '../template/PageTitle'
import Stat from './State'
import axios from 'axios'
import {baseApiUrl} from '@/global'

export default {
    name:'Home',
    components:{PageTitle,Stat},
    data:function(){
        return{
            stat:{}
        }
    },
    methods:{
        getStats(){
            axios.get(`${baseApiUrl}/stats`)
                .then(res => this.stat= res.data)
        }
    },
    mounted(){
        this.getStats()
    },
    


}
</script>

<style>

.stats{
    display:flex;
    justify-content:space-between;
    flex-wrap:wrap; 
    }
.stat-icon i{
    font-size:5rem;
}

.stat-info{
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.stat-title{
    font-size: 1.2rem;
}

.stat-value{
    font-size: 3rem;
}

</style>
