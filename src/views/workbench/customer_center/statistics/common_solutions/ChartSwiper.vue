<template>
  <div style="display: flex;justify-content: flex-start">
    <div class="ctrl-btn" @click="slidePrev">
      <span class="el-icon-arrow-left"></span>
    </div>
    <swiper
      ref="swiperRef"
      :options="swiperOption"
      :style="{width: panelTypeList.length * 150 + 'px'}"
      class="swiper"
    >
      <swiper-slide class="slide" v-for="(id, index) in panelTypeList" :key="index">
        <div style="cursor: pointer;display: flex;flex-direction: column;padding: 3px 3px 0 3px"
             @click="clickSwiper(id, allList.find(item => item.id == id).graphType)" :style="{border: chartId == id ? '1px solid #52A0F5' : 'none'}">
          <img :style="{border: id > 4 ? '1px solid #E9E9E9' : 'none'}" :src="require('../../../../../assets/chartTypeId' + id + '.png')" style="object-fit: contain"
               height="80px" width="130px" alt="">
          <span style="text-align: center;font-size: 12px;color: #7F7F7F;">{{allList.find(item => item.id == id).graphName}}</span>
        </div>
      </swiper-slide>
    </swiper>
    <div class="ctrl-btn">
      <span class="el-icon-arrow-right" @click="slideNext"></span>
    </div>
  </div>
</template>

<script>
  import {getAllgraph} from "../../../../../api/customerList";

  export default {
    name: "ChartSwiper",
    props: {
      panelTypeList: {
        type: Array,
        default: () => []
      },
      allList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        chartId: '',
        swiperOption: {
          slidesPerView: '1',
          centeredSlides: false,
          spaceBetween: 10,
          loop: false,
          observer: false, //修改swiper自己或子元素时，自动初始化swiper
          observeParents: true,
          direction: 'horizontal',
          speed: 300, //config参数同swiper4,与官网一致
          navigation: {
            nextEl: '.swiper-button-next2',
            prevEl: '.swiper-button-prev2'
          }
        },
      }
    },
    watch: {
      chartId: {
        handler(n) {
          // n && this.$emit('changeChart', this.allList.find(item => item.id == n).graphType)
        },
        immediate: true
      },
      panelTypeList: {
        handler(n) {
          if (n.length) {
            this.$set(this.swiperOption, 'slidesPerView', n.length > 6 ? 6 : n.length)
            this.$refs.swiperRef && this.$refs.swiperRef.swiper.updateSize();
          }
        },
        immediate: true
      }
    },
    created() {
      this.chartId = this.panelTypeList[0]
    },
    methods: {
      changeChartId(type) {
        this.chartId = this.allList.find(item => item.graphType == type).id
      },
      clickSwiper(index, type) {
        this.chartId = index
        this.$emit('changeChart', type)
      },
      slidePrev() {
        this.$refs.swiperRef.swiper.slidePrev()
      },
      slideNext() {
        this.$refs.swiperRef.swiper.slideNext()
      },
    }
  }
</script>

<style lang="scss" scoped>
  .swiper {
    max-width: 70%;
    margin: 0 10px;

    .slide {
      height: 116px;
      width: 140px!important;
      /*border: 1px solid #E8E8E8;*/
    }

  }

  .ctrl-btn {
    margin-top: 3px;
    display: flex;
    align-items: center;
    height: 80px;
    width: 15px;
    border: 1px solid #E8E8E8;
    color: #52A0F5;
    font-size: 16px;
    cursor: pointer;

    span {
      font-weight: 800;
    }
  }

</style>
