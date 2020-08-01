<template>
  <div class="singer">

    <van-nav-bar
      title="歌手"
      left-text="返回"
      left-arrow
      :fixed="true"
      :placeholder="true"
      :z-index="111"
      
      @click-left="goBack"
    />

    <van-list
      v-model="loadOptions.loading"
      :finished="loadOptions.finished"
      :finished-text="loadOptions.finishedText"
      @load="loadData"
      :offset="50"
    >
    
      <div class="recommend">
        <div class="recommendTitle">歌手榜</div>

        <van-grid :border="false" :column-num="3">
          <van-grid-item v-for="(item,index) in singer" :key="index" @click="getSingerSong(item.id)">
            <img class="auto_img recommendImg" :src="item.img1v1Url"  >
            <div class="recommendName">{{item.name}}</div>
          </van-grid-item>
          
        </van-grid>
      </div>
      
    </van-list>


  </div>
</template>

<script>
import axios from '@/plugins/axios.js' 

  export default {
    data(){
      return{
        allsingerData:[],
        singer:[],
        singerCount:15,
        list: [],
        loadOptions:{
          loading:true,
          finished:false,
          finishedText:"没有数据可加载了"
        },
      }
    },
    created(){
      this.getSinger()
    },
    methods:{
     
      //返回
      goBack(){
        this.$router.go(-1)
      },

      //获取歌手
      getSinger(){
        this.axios({
          method:'GET',
          url:'/toplist/artist',
          params:{
            limit:30
          }
        }).then(result => {
          
          if(result.data.code == 200){
            this.allsingerData = result.data.list.artists.splice(0,50)
            this.singer = this.allsingerData.splice(0,this.singerCount)

            if(this.allsingerData.length > 0){
              this.loadOptions.loading = false;
            }else {
              this.loadOptions.loading = true;
              this.loadOptions.finished = true;
            }
            
          }
        }).catch(err => {
          
        })
      },

      //懒加载歌手数据
      loadData(){
        setTimeout(() => {
          this.singer.push(...this.allsingerData.splice(0,this.singerCount));
          if(this.allsingerData.length == 0){
            this.loadOptions.loading = true;
            this.loadOptions.finished = true;
          }
        },1000)
      },

      //获取歌手歌曲
      getSingerSong(id){
        this.axios({
          method:'GET',
          url:'/artists',
          params:{
            id
          }
        }).then(result => {
          
          if(result.data.code == 200){
           let songId = []
            for(let i=0; i<result.data.hotSongs.length; i++){
              songId.push(result.data.hotSongs[i].id)
            }
            // this.changeData({
            //   key:'songIds',
            //   value:songId.join(',')
            // })
            
            this.$router.push({
              name:'SongListDetails',
              query:{
                songImg:result.data.hotSongs[0].al.picUrl,
                ids:songId.join(','),
                title:result.data.hotSongs[0].ar[0].name
              }
            })
            
          }
        }).catch(err => {
          
        })
      },


    }
  }
</script>

<style lang="less" scoped>
/deep/ .van-index-bar__index{
  margin-bottom: 5px;
}
.singer{
  padding-bottom: 50px;

  .recommend{
    padding: 10px;
  }
  .recommendTitle{
    height: 30px;
    line-height: 30px;
    font-size: 16px;
  }
  .recommendImg{
    width: 90px;
    height: 90px;
    background-color: #eee;
  }
  .recommendName{
    width: 90px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
}
</style>