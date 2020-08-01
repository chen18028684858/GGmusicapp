<template>
  <div class="goodsongList"> 
    <van-nav-bar
      title="歌单广场"
      left-text="返回"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="goBack"
    />
    
    <van-tabs @click="highquality" @rendered="highquality">
      <van-tab v-for="(item,index) in catlist" :title="item" :key="index">
        <!-- 热门推荐 -->
        <div class="recommend_song_sheet">
          <div class="recommendList clearfix">
            <div class="fl recommendListBox" @click="goSongListDetails(v)" v-for="(v,i) in listShow" :key="i">
              <div class="recommendListImg">
                <img class="auto_img" :src="v.coverImgUrl">
              </div>
              <div class="recommendListDes">{{v.name}}</div>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>

  </div>
</template>

<script>
  export default {
    data(){
      return {
        recommend:[],
        catlist:['流行','影视原声','华语','摇滚','欧美','ACG','民谣','电子','粤语','说唱'],
        listShow:[]
      }
    },
    created(){
      this.resource()
      
    },
  
    
    methods:{
      //返回
      goBack(){
        this.$router.go(-1)
      },

      //获取每日推荐歌单
      resource(){
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
          duration: 0
        });

        this.axios({
          method:'GET',
          url:'/recommend/resource',
        }).then(res => {
          this.$toast.clear();
          
          if(res.data.code == 200){
            this.recommend = res.data.recommend
          }
        }).catch(err => {
          this.$toast.clear();
          
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
            
            if(this.recommend.length > 0){
              this.$router.push({
                name:'SongListDetails',
                query:{
                  songImg:result.data.playlist.coverImgUrl,
                  ids:songId.join(','),
                  title:result.data.playlist.name
                }
              })
            }
            // this.songIds = songId.join(',')
            // 
          }
        }).catch(err => {
          
        })

      },


      //获取对应类型的歌单
      highquality(name,title){
        
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
          duration: 0
        });

        this.axios({
          method:'GET',
          url:'/top/playlist/highquality',
          params:{
            cat:title,
            limit:12
          }
        }).then(res => {
          this.$toast.clear();
          if(res.data.code == 200){
            this.listShow = res.data.playlists
          }
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

    }
    
  }
</script>

<style lang="less" scoped>
.goodsongList{
  .recommend_song_sheet{
    
    .recommendMoreLeft{
      font-weight: 700;
      font-size: 14px;
    }
    .recommendMoreRight{
      padding: 0 5px;
      font-size: 12px;
      color: #555;
      border-radius: 15px;
      border: 1px solid #ddd;
    }
    .recommendList{
      position: relative;
      height: 100%; 
      
    }
    
    .recommendListBox{
      width: calc(~"100% / 3");
      text-align: center;
      margin-top: 20px;
      .recommendListDes{
        width: 100%;
        font-size: 12px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
    .recommendListImg{
      width: 100px;
      height: 100px;
      margin: 0 auto;
      >img{
        border-radius: 10px;
      }
    }
  }
  /deep/ .van-tabs__line{
    background-color: skyblue;
  }
}
</style>