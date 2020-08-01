<template>
  <div class="main">
    <van-tabs v-model="active">
      <van-tab title="首页">
        <!-- 轮播图 -->
        <div class="swiper">
          <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item v-for="(item,index) in banner" :key="index">
              <img class="auto_img" :src="item.imageUrl" />
            </van-swipe-item>
          </van-swipe>
        </div>

        <!-- 导航栏 -->
        <div class="navBar">
          <ul class="clearfix">
            <li
              class="navBarList fl"
              @click="goPage(item.name)"
              v-for="(item,index) in navBar"
              :key="index"
            >
              <div class="navBarList_img">
                <img :src="require('../assets/images/'+item.src)" />
              </div>
              <span>{{item.title}}</span>
            </li>
          </ul>
        </div>

        <!-- 推荐歌单 -->
        <div class="recommend_song_sheet">
          <div class="recommendTitle">推荐歌单</div>
          <div class="clearfix recommendMore">
            <div class="fl recommendMoreLeft">为你精挑细选</div>
            <div class="fr recommendMoreRight" @click="goPage('GoodSongList')">查看更多</div>
          </div>
          <div class="recommendList clearfix">
            <div
              class="fl recommendListBox"
              @click="goSongListDetails(item)"
              v-for="(item,index) in boutiqueMusic"
              :key="index"
            >
              <div class="recommendListImg">
                <img class="auto_img" :src="item.picUrl" />
              </div>
              <div class="recommendListDes">{{item.name}}</div>
            </div>
          </div>
        </div>

        <!-- 最新歌曲 -->
        <div class="newMusic">
          <h2 class="newMusicTil">最新音乐</h2>
          <div
            class="newMusicList clearfix"
            @click="changePlayShow"
            v-for="(item,index) in newMusic"
            :key="index"
          >
            <div @click="getSongItemUrl(item,index)">
              <div class="fl musicDsc">
                <div class="musicName">{{item.name}}</div>
                <div class="musicPeople">
                  <i class="bgImg"></i>
                  {{item.song.artists[0].name}}
                </div>
              </div>
              <div class="fr play">
                <span class="bgImg"></span>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="搜索">
        <van-search v-model="keywords" show-action placeholder="请输入搜索关键词">
          <template #action>
            <div @click="searchSong(keywords)">搜索</div>
          </template>
        </van-search>

        <div class="searchHistory">
          <div>
            <div class="clearfix">
              <div class="fl">
                <h3>历史记录</h3>
              </div>
              <div class="fr delete">
                <div class="delImg" @click="removeHistory">
                  <img class="auto_img" src="../assets/images/delete.png" />
                </div>
              </div>
            </div>

            <div class="clearfix historyList">
              <div
                class="fl historyItem"
                v-for="(historyNav,index) in searchHistoryNav"
                :key="index"
              >{{historyNav}}</div>
            </div>
          </div>
        </div>

        <div class="hotSearch">
          <div class="hotSearchTitle">热搜榜</div>
          <div class="hotSearchList">
            <div
              class="hotSearchItem clearfix"
              @click="searchSong(item.searchWord)"
              v-for="(item,index) in searchHotDetail"
              :key="index"
            >
              <div class="fl hotSearchNo" :class="index < 3 ? 'active' : ''">{{index+1}}</div>
              <div class="fl hotSearchInfo">
                <div class="clearfix hotSearchName">
                  <div class="fl">{{item.searchWord}}</div>
                  <div class="fl upSearchIcon" v-if="item.iconType==5">
                    <img class="auto_img" :src="item.iconUrl" />
                  </div>
                  <div class="fl hotSearchIcon" v-else>
                    <img class="auto_img" :src="item.iconUrl" />
                  </div>
                </div>
                <div class="hotSearchDesc">{{item.content}}</div>
              </div>
              <div class="fl hotSearchNum">{{item.score}}</div>
            </div>
          </div>
        </div>

        <div>
          <div></div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import "../assets/less/main.less";
import lyric from "../assets/js/lyric";
import axios from "@/plugins/axios.js";

export default {
  data() {
    return {
      value: "",
      banner: [], //轮播图
      navBar: [
        { title: "歌单广场", src: "02.png", name: "GoodSongList" },
        { title: "排行榜", src: "03.png", name: "RankingList" },
        { title: "歌手", src: "05.png", name: "Singer" },
      ], //中间导航数据
      boutiqueMusic: [], //推荐歌单
      newMusic: [], //最新音乐
      active: 0, //顶部标签栏
      lrc: [], //歌词
      songlrc: "",
      allSongList: [],
      keywords: "",
      searchHotDetail: [],
      historyNavs: [],
    };
  },
  created() {
    this.getBanner();
    this.getBoutiqueMusic();
    this.getNewMusic();
    this.searchHow();
  },
  computed: {
    searchHistoryNav() {
      return this.$store.state.searchHistoryNav;
    },
  },
  methods: {
    //跳转
    goPage(name) {
      this.$router.push({ name });
    },

    //获取轮播图
    getBanner() {
      this.axios({
        method: "get",
        url: "/banner",
      })
        .then((result) => {
          //
          if (result.data.code == 200) {
            this.banner = result.data.banners;
          }
          //
        })
        .catch((err) => {});
    },

    //推荐歌单
    getBoutiqueMusic() {
      this.axios({
        method: "GET",
        url: "/personalized/playlist",
        params: {
          limit: 30,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            this.boutiqueMusic = result.data.result;
          }
        })
        .catch((err) => {});
    },

    //新音乐
    getNewMusic() {
      this.axios({
        method: "GET",
        url: "/personalized/newsong",
      })
        .then((result) => {
          if (result.data.code == 200) {
            let arr = [];
            this.newMusic = result.data.result;

            result.data.result.forEach((v) => {
              arr.push(v.id);
            });

            this.getSongItemUrl(arr.join(","));
            //
          }
          //
        })
        .catch((err) => {});
    },

    //歌单详情页
    goSongListDetails(item) {
      //点击歌单缓存歌单信息

      this.axios({
        method: "GET",
        url: "/playlist/detail",
        params: {
          id: item.id,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            let songId = [];
            for (let i = 0; i < result.data.playlist.tracks.length; i++) {
              songId.push(result.data.playlist.tracks[i].id);
            }

            if (this.boutiqueMusic.length > 0) {
              this.$router.push({
                name: "SongListDetails",
                query: {
                  songImg: result.data.playlist.coverImgUrl,
                  ids: songId.join(","),
                  title: result.data.playlist.name,
                  nickname: result.data.playlist.creator.nickname,
                  creatorImg: result.data.playlist.creator.avatarUrl,
                },
              });
            }
            //
          }
        })
        .catch((err) => {});
    },

    //获取点击音乐的url
    getSongItemUrl(item, i) {
      //
      if (i != undefined && item != undefined) {
        this.axios({
          method: "GET",
          url: "/song/url",
          params: {
            id: item.id,
          },
        })
          .then((result) => {
            //
            if (result.data.code == 200) {
              this.$store.state.songUrl = result.data.data[0].url;
              if (!this.$store.state.isPlay) {
                this.$store.state.isPlay = !this.$store.state.isPlay;
              }
              // this.$store.state.isPlay=true
              this.$store.commit("getCcurrentPlayList", this.newMusic);
              this.$store.commit("changeNowIndex", i);
            }
          })
          .catch((err) => {});
        this.getSongDetail(item.id);

        //------------------------------------------

        //获取歌词

        this.axios({
          method: "GET",
          url: "/lyric",
          params: {
            id: item.id,
          },
        })
          .then((result) => {
            if (result.data.code == 200) {
              this.lrc = [];
              this.songlrc = result.data.lrc.lyric;
              lyric.createLrcObj(this.songlrc);
              this.lrc = lyric.songInfo.oLRC.ms;
              this.$store.commit("songLrc", this.lrc);
            }
          })
          .catch((err) => {});
      } else if (item != undefined && i == undefined) {
        this.axios({
          method: "GET",
          url: "/song/url",
          params: {
            id: item,
          },
        })
          .then((result) => {
            if (result.data.code == 200) {
              let arr = [];
              result.data.data.forEach((v) => {
                let o = {};
                o.url = v.url;
                o.id = v.id;
                arr.push(o);
              });
              this.allSongList = arr;
              // this.allSongList = result.data.data
              this.$store.commit("getAllSongUrl", this.allSongList);
            }
          })
          .catch((err) => {});
      }
    },

    //获取歌曲详情
    getSongDetail(ids) {
      this.axios({
        method: "GET",
        url: "/song/detail",
        params: {
          ids,
        },
      })
        .then((result) => {
          //
          if (result.data.code == 200) {
            this.$store.state.playerInfo = {};
            let o = {};
            o.songName = result.data.songs[0].name;
            o.singer = result.data.songs[0].ar[0].name;
            o.picUrl = result.data.songs[0].al.picUrl;
            this.$store.state.playerInfo = o;
            //
          }
        })
        .catch((err) => {});
    },

    //显示底部播放器图标
    changePlayShow() {
      this.$store.commit("getPlayIsShow", true);
    },

    //搜索歌曲
    searchSong(keywords) {
      if (!keywords) {
        this.$toast("请输入搜索内容");
        return;
      }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/search",
        params: {
          keywords,
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 200) {
            this.historyNavs.push(this.keywords);
            this.$store.commit("getSearchHistoryNav", this.historyNavs);
            this.$store.commit("getSearchList", result.data.result.songs);
            this.$store.commit("getSearchSongId", result.data.result.songs.id);
          }
          this.$router.push({ name: "Search" });
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //热搜列表
    searchHow() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/search/hot/detail",
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 200) {
            this.searchHotDetail = result.data.data;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //清空历史记录
    removeHistory() {
      this.$store.commit("getSearchHistoryNav", []);
    },
  },
};
</script>

<style lang="less" scoped>
</style>