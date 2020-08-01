<template>
  <div class="rank">
    <van-nav-bar
      title="排行榜"
      left-text="返回"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="goBack"
    />
    <!-- 排行榜 -->
    <div class="rankCont">
      <!-- 官方排行榜 -->
      <div class="official">

        <!-- 标题 -->
        <div class="officialTile">
          官方榜
        </div>

        <!-- 榜单 -->
        <div class="officialList clearfix" v-for="(item,index) in list1" :key="index" @click="goSongListDetails(item)">
          <div class="fl officialImg">
            <img class="auto_img" :src="item.coverImgUrl" >
          </div>
          <div class="fl officialInfo">
            <div class="officialInfoList" v-for="(v,i) in item.tracks" :key="i">{{i+1}}.{{v.first}}-{{v.second}}</div>
            
          </div>
        </div>

        
      </div>

      <!-- 推荐榜 -->
      <div class="recommend">
        <div class="recommendTitle">推荐榜</div>

        <van-grid :border="false" :column-num="3">
          <van-grid-item v-for="(item,index) in list2" :key="index" @click="goSongListDetails(item)">
            <img class="auto_img recommendImg" :src="item.coverImgUrl" >
            <div class="recommendName">{{item.name}}</div>
          </van-grid-item>
          
        </van-grid>
      </div>

      <!-- 全球排行榜 -->
      <div class="global">
        <div class="recommendTitle">全球榜</div>

        <van-grid :border="false" :column-num="3">
          <van-grid-item @click="goSongListDetails(item)" v-for="(item,index) in list3" :key="index">
            <img class="auto_img recommendImg" :src="item.coverImgUrl" alt="">
            <div class="recommendName">{{item.name}}</div>
          </van-grid-item>
          
        </van-grid>
      </div>
    </div>
  </div>

</template>

<script>
import axios from '@/plugins/axios.js' 

  export default {
    data(){
      return {
        //官方榜
        list1:[],
        //推荐榜
        list2:[],
        //全球榜
        list3:[],

        boutiqueMusic:[]
      }
    },

    created(){
      this.getTopList()
    },

    methods:{

      //返回
      goBack(){
        this.$router.go(-1)
      },

      //获取榜单
      getTopList(){
        
        this.axios({
          method:'GET',
          url:'/toplist/detail',
        }).then(result => {
          
          if(result.data.code == 200){
            this.list1 = result.data.list.slice(0,4)
            this.list2 = result.data.list.slice(4,10)
            this.list3 = result.data.list.slice(10,16)
          }
        }).catch(err => {
          
        })
      },

      //歌单详情页
      goSongListDetails(item){

        //点击歌单缓存歌单信息
        
        this.axios({
          method:'GET',
          url:'/playlist/detail',
          params:{
            id:item.id
          }
        }).then(result => {
          // 
          if(result.data.code==200){
            let songId = []
            for(let i=0; i<result.data.playlist.tracks.length; i++){
              songId.push(result.data.playlist.tracks[i].id)
            }
            // this.changeData({
            //   key:'songIds',
            //   value:songId.join(',')
            // })
            
            this.$router.push({
              name:'SongListDetails',
              query:{
                songImg:result.data.playlist.coverImgUrl,
                ids:songId.join(','),
                title:result.data.playlist.name
              }
            })
          
            // this.songIds = songId.join(',')
            // 
          }
        }).catch(err => {
          
        })

      },
      
    }
  }
</script>

<style lang="less" scoped>
.rank{
  .rankCont{
    width: 100%;
    overflow-y: auto;
    padding-bottom: 60px;
    // background-color: skyblue;
  }
  .official{
    padding: 10px;
  }
  .officialTile{
    font-size: 16px;
    height: 30px;
    line-height: 30px;
    margin-bottom: 5px;
  }
  .officialList{
    padding: 10px;
    width: calc(~"100% - 20px");
    margin-bottom: 5px;
  }
  .officialImg{
    width: 100px;
    height: 100px;
    background-color: #eee;
    margin-right: 10px;
  }
  .officialInfo{
    width: calc(~"100% - 110px");
    font-size: 16px;
  }
  .officialInfoList{
    width: calc(~"100% - 40px");
    height: 33px;
    line-height: 33px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
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
  .global{
    padding: 10px;
  }
}
</style>