<template>
  <div class="text-center section">

    <v-calendar
      class="custom-calendar max-w-full"
      :masks="masks"
      :attributes="events"
      disable-page-swipe
      is-expanded
      mode="range"
      drag
    >
      <template v-slot:day-content="{ day, attributes }">
        <div class="flex flex-col h-full z-10 overflow-hidden">
          <span class="day-label text-sm text-gray-900">{{ day.day }}</span>
          <div class="flex-grow overflow-auto">
            <p
              v-for="attr in attributes"
              class="text-xs leading-tight rounded-sm p-1 mt-0 mb-1"
              :class="attr.customData.class"
            >
              <el-popover
                placement="top-start"
                title="标题"
                width="200"
                trigger="hover"
                content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                <span slot="reference"> {{ attr.customData.title }}</span>
              </el-popover>

            </p>
          </div>
        </div>
      </template>
    </v-calendar>
  </div>
</template>

<script>
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  export default {
    name: "index",
    props:{
      events:{
        default:[{
          key: 1,
          customData: {
            title: 'Lunch with mom.',
            class: 'bg-red-600 text-white',
          },
          dates: [new Date('2020-11-09'),new Date('2020-11-10')],
        },
          {
            key: 2,
            customData: {
              title: 'Take Noah to basketball practice',
              class: 'bg-blue-500 text-white',
            },
            dates: new Date(year, month, 1),
          },
          {
            key: 3,
            customData: {
              title: "Noah's basketball game.",
              class: 'bg-blue-500 text-white',
            },
            dates: new Date(year, month, 1),
          },
          {
            key: 4,
            customData: {
              title: 'Take car to the shop',
              class: 'bg-indigo-500 text-white',
            },
            dates: new Date(year, month, 1),
          },
          {
            key: 4,
            customData: {
              title: 'Meeting with new client.',
              class: 'bg-teal-500 text-white',
            },
            dates: new Date(year, month, 7),
          },
          {
            key: 5,
            customData: {
              title: "Mia's gymnastics practice.",
              class: 'bg-pink-500 text-white',
            },
            dates: new Date(year, month, 11),
          },
          {
            key: 6,
            customData: {
              title: 'Cookout with friends.',
              class: 'bg-orange-500 text-white',
            },
            dates: { months: 5, ordinalWeekdays: { 2: 1 } },
          },
          {
            key: 7,
            customData: {
              title: "Mia's gymnastics recital.",
              class: 'bg-pink-500 text-white',
            },
            dates: new Date(year, month, 22),
          },
          {
            key: 8,
            customData: {
              title: 'Visit great grandma.',
              class: 'bg-red-600 text-white',
            },
            dates: new Date(year, month, 25),
          },
        ]
      }
    },
    data(){
      return{
        masks: {
          weekdays: 'WWW',
        },
        attributes: [
          {
            key: 1,
            customData: {
              title: 'Lunch with mom.',
              class: 'bg-red-600 text-white',
            },
            dates: new Date(year, month, 1),
          },
          {
            key: 2,
            customData: {
              title: 'Take Noah to basketball practice',
              class: 'bg-blue-500 text-white',
            },
            dates: new Date(year, month, 2),
          },
          {
            key: 3,
            customData: {
              title: "Noah's basketball game.",
              class: 'bg-blue-500 text-white',
            },
            dates: new Date(year, month, 5),
          },
          {
            key: 4,
            customData: {
              title: 'Take car to the shop',
              class: 'bg-indigo-500 text-white',
            },
            dates: new Date(year, month, 5),
          },
          {
            key: 4,
            customData: {
              title: 'Meeting with new client.',
              class: 'bg-teal-500 text-white',
            },
            dates: new Date(year, month, 7),
          },
          {
            key: 5,
            customData: {
              title: "Mia's gymnastics practice.",
              class: 'bg-pink-500 text-white',
            },
            dates: new Date(year, month, 11),
          },
          {
            key: 6,
            customData: {
              title: 'Cookout with friends.',
              class: 'bg-orange-500 text-white',
            },
            dates: { months: 5, ordinalWeekdays: { 2: 1 } },
          },
          {
            key: 7,
            customData: {
              title: "Mia's gymnastics recital.",
              class: 'bg-pink-500 text-white',
            },
            dates: new Date(year, month, 22),
          },
          {
            key: 8,
            customData: {
              title: 'Visit great grandma.',
              class: 'bg-red-600 text-white',
            },
            dates: new Date(year, month, 25),
          },
        ],
      }
    },
    // components:{
    //   vCalendar
    // }
  }
</script>

<style lang="scss" scoped>
/*  ::-webkit-scrollbar {*/
/*  width: 0px;*/
/*}*/
/*::-webkit-scrollbar-track {*/
/*  display: none;*/
/*}*/
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius   : 10px;
  background-color: skyblue;
  background-image: -webkit-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
  );
}
::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
  background   : #ededed;
  border-radius: 10px;
}
/deep/ .custom-calendar.vc-container {
  --day-border: 1px solid #b8c2cc;
  --day-border-highlight: 1px solid #b8c2cc;
  --day-width: 90px;
  --day-height: 90px;
  --weekday-bg: #f8fafc;
  --weekday-border: 1px solid #eaeaea;
  border-radius: 0;
  width: 100%;
& .vc-header {
    background-color: #f1f5f8;
    padding: 10px 0;
  }
& .vc-weeks {
    padding: 0;
  }
& .vc-weekday {
    background-color: var(--weekday-bg);
    border-bottom: var(--weekday-border);
    border-top: var(--weekday-border);
    padding: 5px 0;
  }
& .vc-day {
    padding: 0 5px 3px 5px;
    text-align: left;
    height: var(--day-height);
    min-width: var(--day-width);
    background-color: white;
&.weekday-1,
&.weekday-7 {
   background-color: #eff8ff;
 }
&:not(.on-bottom) {
   border-bottom: var(--day-border);
&.weekday-1 {
   border-bottom: var(--day-border-highlight);
 }
}
&:not(.on-right) {
   border-right: var(--day-border);
 }
}
& .vc-day-dots {
    margin-bottom: 5px;
  }
}
  .overflow-auto{
    overflow: auto;
  }
  .flex{
    display: flex;
    flex-direction: column;
  }
  .flex-grow{
    flex: 1;
  }
  .h-full{
    height: 100%;
  }
  .text-xs{
    background-color: #fcf4db;
    border-radius: 2px;
    cursor: pointer;
  }
.text-xs:hover{
  background-color: #ffd9b9;
  border-radius: 2px;
}
</style>
