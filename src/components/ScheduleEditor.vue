<template>
  <n-modal v-model:show="showEditModal">
    <n-card style="width: 320px; border-radius: 10px" :bordered="false" size="small" aria-modal="true">
      <n-grid :cols="4" y-gap="2">
        <n-gi :span="1" style="display: flex; justify-content:right;">
          <div class="sm-schedule-item-header">{{ scheduleCategoryText }}</div>
        </n-gi>
        <n-gi :span="3">
          <n-select v-model:value="selectedCategory" size="tiny" label-field="name" value-field="name"
            :options="globalData.scheduleCategories.categories" />
        </n-gi>
  
        <n-gi :span="1" style="display: flex; justify-content:right;">
          <div class="sm-schedule-item-header" style="margin-top: 3px;">{{ scheduleNameText }}</div>
        </n-gi>
        <n-gi :span="3">
          <n-input v-model:value="scheduleName" size="small" type="text" v-model:placeholder="inputScheduleNameText" />
        </n-gi>

        <n-gi style="display: flex; justify-content:right;">
          <div class="sm-schedule-item-header" style="margin-top: 3px;">{{ allDayText }}</div>
        </n-gi>
        <n-gi>
          <n-switch v-model:value="isAllDaySchedule" size="small"/>
        </n-gi>

        <n-gi style="display: flex; justify-content:right;">
          <div class="sm-schedule-item-header" style="margin-top: 3px;">{{ recurringText }}</div>
        </n-gi>
        <n-gi>
          <n-switch v-model:value="isRecurringSchedule" size="small"/>
        </n-gi>

        <!--周期性日程参数-->
        <!--<n-gi :span="2" style="display: flex; justify-content:right;" v-if="isRecurringSchedule">
          <n-radio :checked="calendarTypeCheckedValue === 'Gregorian_calendar'" value="Gregorian_calendar" name="basic-demo" @change="handleCalendarTypeChange">{{ gregorianCalendarText }}</n-radio>
        </n-gi>
        <n-gi :span="2" style="display: flex; justify-content:right;" v-if="isRecurringSchedule">
          <n-radio :checked="calendarTypeCheckedValue === 'Lunar_calendar'" value="Lunar_calendar" name="basic-demo" @change="handleCalendarTypeChange">{{ lunarCalendarText }}</n-radio>
        </n-gi>-->
        <n-gi :span="1" style="display: flex; justify-content:right;" v-if="isRecurringSchedule">
          <div class="sm-schedule-item-header" style="margin-top: 3px;">{{ cycleText }}</div>
        </n-gi>
        <n-gi :span="3" v-if="isRecurringSchedule && calendarTypeCheckedValue === 'Gregorian_calendar'">
          <n-select v-model:value="selectedFreq" size="tiny" :options="freqs" @update:value="handleUpdateSelectedFreq" />
        </n-gi>
        <n-gi :span="3" v-if="isRecurringSchedule && calendarTypeCheckedValue === 'Lunar_calendar'">
          <n-select v-model:value="selectedFreq" size="tiny" :options="freqsLunar" @update:value="handleUpdateSelectedFreq" />
        </n-gi>
        <n-gi :span="4" v-if="isRecurringSchedule && selectedFreq === 'weekly'">
          <n-select v-model:value="selectedWeekday" multiple :options="weekdays" size="tiny"/>
        </n-gi>
        <n-gi :span="4" v-if="isRecurringSchedule && selectedFreq === 'monthly'">
          <n-select v-model:value="selectedMonthday" multiple :options="monthdays" size="tiny"/>
        </n-gi>
        <n-gi :span="4" v-if="isRecurringSchedule && selectedFreq === 'yearly' && calendarTypeCheckedValue === 'Gregorian_calendar'">
          <n-select v-model:value="selectedYearday" multiple :options="yeardays" size="tiny"/>
        </n-gi>
        <n-gi :span="1" v-if="isRecurringSchedule && selectedFreq === 'yearly' && calendarTypeCheckedValue === 'Lunar_calendar'">
          <n-select v-model:value="selectedMonthday" multiple :options="monthdays" size="tiny"/>
        </n-gi>
        <n-gi :span="1" v-if="isRecurringSchedule && selectedFreq === 'yearly' && calendarTypeCheckedValue === 'Lunar_calendar'">
          <div class="sm-schedule-item-header">{{ monthText }}</div>
        </n-gi>
        <n-gi :span="1" v-if="isRecurringSchedule && selectedFreq === 'yearly' && calendarTypeCheckedValue === 'Lunar_calendar'">
          <n-select v-model:value="selectedMonthday" multiple :options="monthdays" size="tiny"/>
        </n-gi>

        <n-gi :span="1" style="display: flex; justify-content:right;" v-if="isRecurringSchedule">
          <div class="sm-schedule-item-header" style="margin-top: 3px;">{{ intervalText }}</div>
        </n-gi>
        <n-gi :span="3" v-if="isRecurringSchedule">
          <n-input-number v-model:value="scheduleInterval" size="small"/>
        </n-gi>

        <n-gi :span="1" style="display: flex; justify-content:right;">
          <div class="sm-schedule-item-header" style="margin-top: 3px;">{{ startTimeText }}</div>
        </n-gi>
        <n-gi :span="3" v-if="isAllDaySchedule">
          <n-date-picker v-model:value="startTime" size="small" type="date" clearable />
        </n-gi>
        <n-gi :span="3" v-if="!isAllDaySchedule">
          <n-date-picker v-model:value="startTime" size="small" type="datetime" format="yyy-MM-dd HH:mm" clearable />
        </n-gi>

        <n-gi :span="1" style="display: flex; justify-content:right;">
          <div class="sm-schedule-item-header" style="margin-top: 3px;">{{ endTimeText }}</div>
        </n-gi>
        <n-gi :span="3" v-if="isAllDaySchedule">
          <n-date-picker v-model:value="endTime" size="small" type="date" clearable />
        </n-gi>
        <n-gi :span="3" v-if="!isAllDaySchedule">
          <n-date-picker v-model:value="endTime" size="small" type="datetime" format="yyy-MM-dd HH:mm" clearable />
        </n-gi>

        <n-gi :span="1" style="display: flex; justify-content:right;">
          <div class="sm-schedule-item-header" style="margin-top: 3.5px;">{{ attendeesText }}</div>
        </n-gi>
        <n-gi :span="3">
          <n-space vertical>
            <n-space v-for="(attendee, index) in attendees" :key="index">
              <n-input v-model:value="attendee.name" type="text" :placeholder="attendeePlaceholder" size="small" style="width: 120px"/>
              <n-button circle quaternary size="small" @click="removeAttendee(index)">
                <template #icon>
                  <n-icon :component="DeleteOutlined" />
                </template>
              </n-button>
            </n-space>
            <n-button quaternary size="small" @click="addAttendee">
              <template #icon>
                <n-icon :component="PlusOutlined" />
              </template>
              {{ addAttendeeText }}
            </n-button>
          </n-space>
        </n-gi>

        <n-gi :span="1" style="display: flex; justify-content:right;">
          <div class="sm-schedule-item-header" style="margin-top: 3.5px;">{{ scheduleContentText }}</div>
        </n-gi>
        <n-gi :span="2">
          <n-input v-model:value="scheduleContentBlockId" type="text" placeholder="" size="small" />
        </n-gi>
        <n-gi>
          <n-button quaternary circle size="small" @click="handleJumpToBlock()">
              <template #icon>
                <n-icon :component="ArrowRightOutlined" color="#18a058" />
              </template>
            </n-button>
        </n-gi>
        <n-gi :offset="1" :span="3">
          <n-input v-model:value="scheduleContent" type="textarea" placeholder="" :autosize="{ maxRows: 7 }" size="small" />
        </n-gi>

        <n-gi :span="1" style="display: flex; justify-content:right;">
          <div class="sm-schedule-item-header">{{ statusText }}</div>
        </n-gi>
        <n-gi :span="3">
          <n-select v-model:value="selectedScheduleStatus" size="tiny" :options="scheduleStatusList" />
        </n-gi>
        <n-gi :span="4">
          <n-space justify="end" size="small">
            <n-button quaternary circle size="small" v-if="isSubmitButtonVisible" @click="handleSubmitSchedule()">
              <template #icon>
                <n-icon :component="CheckOutlined" color="#18a058" />
              </template>
            </n-button>
            <n-button quaternary circle size="small" v-if="isClearButtonVisible" @click="handleClearInfo()">
              <template #icon>
                <n-icon :component="ClearOutlined" color="#D60D0D" />
              </template>
            </n-button>
            <n-button quaternary circle size="small" v-if="isDeleteButtonVisible" @click="handleDeleteSchedule()">
              <template #icon>
                <n-icon :component="DeleteOutlined" color="#D60D0D" />
              </template>
            </n-button>
          </n-space>
        </n-gi>
      </n-grid>
    </n-card>
  </n-modal>

  <n-modal
    v-model:show="showDeleteScheduleConfirmModal"
    preset="dialog"
    type="warning"
    v-model:title="confirmText"
    v-model:content="confirmRemoveScheduleText"
    style="width:600px"
    :closable="modalClosable"
    v-model:positive-text="confirmText"
    v-model:negative-text="cancelText"
    @positive-click="submitDeleteSchedule"
  />
</template>

<style scoped lang="scss">
:deep(.n-input .n-input__border, .n-input .n-input__state-border) {
  border-radius: 0px;
  border: none;
  padding: 0px;
}

.sm-schedule-item-header {
  font-size: 14px;
  font-weight: bold;
  margin-right: 5px;
}
</style>

<script>
  import { defineComponent, ref } from 'vue';
  import { i18n, globalData, smColor, setFCApi } from "../utils/utils";
  import { DeleteOutlined, EditOutlined, CheckOutlined, ClearOutlined, ArrowRightOutlined, PlusOutlined } from '@vicons/antd'
  import EventAggregator from "../utils/EventAggregator";
  import * as moment from "moment";
  import { format, parseISO, getTime } from 'date-fns';
  import { showMessage } from "siyuan";
  import { Schedule } from "../Schedule";

export default defineComponent({
  components: {
    
  },

  setup() {
    return {
      DeleteOutlined,
      EditOutlined,
      CheckOutlined,
      ClearOutlined,
      ArrowRightOutlined,
      PlusOutlined,
      monthText: i18n.month,
      scheduleCategoryText: i18n.scheduleCategory,
      selectScheduleCategoryText: i18n.selectScheduleCategory,
      selectScheduleRangeText: i18n.selectScheduleRange,
      scheduleNameText: i18n.scheduleName,
      inputScheduleNameText: i18n.inputScheduleName,
      scheduleContentText: i18n.scheduleContent,
      statusText: i18n.status,
      cancelText: i18n.cancel,
      confirmText: i18n.confirm,
      confirmRemoveScheduleText: i18n.confirmRemoveSchedule,
      startTimeText: i18n.startTime,
      endTimeText: i18n.endTime,
      allDayText: i18n.allDay,
      recurringText: i18n.recurring,
      cycleText: i18n.cycle,
      intervalText: i18n.interval,
      onlyAllowNumberText: i18n.onlyAllowNumber,
      gregorianCalendarText: i18n.gregorianCalendar,
      lunarCalendarText: i18n.lunarCalendar,
      attendeesText: i18n.attendees,
      addAttendeeText: i18n.addAttendee,
      attendeePlaceholder: i18n.attendeePlaceholder,
      selectedDate: "",
      canNewSchedule: false,
      modalClosable: false,
      modalShowIcon: false,
      isDeleteButtonVisible: false,
      selectedCategory: ref(null),
      startTime: ref(null),
      endTime: ref(null),
      scheduleStartTime: ref(null),
      scheduleEndTime: ref(null),
      scheduleName: ref(null),
      scheduleContentBlockId: ref(null),
      scheduleContent: ref(null),
      selectedScheduleStatus: ref(null),
      isAllDaySchedule: ref(false),
      isRecurringSchedule: ref(null),
      scheduleInterval: ref(1),
      selectedWeekday: ref([]),
      selectedMonthday: ref([]),
      selectedYearday: ref([]),
      attendees: ref([]),
      scheduleStatusList: [
        {
          value: 1,
          label: '☕ ' + i18n.todo
        },
        {
          value: 2,
          label: '🏃‍♂️ ' + i18n.doing
        },
        {
          value: 3,
          label: '✅ ' + i18n.done
        },
        {
          value: 4,
          label: '📦 ' + i18n.archive
        }
      ],
      freqs: [
        {
          value: 'daily',
          label: i18n.day
        },
        {
          value: 'weekly',
          label: i18n.week
        },
        {
          value: 'monthly',
          label: i18n.month
        },
        {
          value: 'yearly',
          label: i18n.year
        }
      ],
      freqsLunar: [
        {
          value: 'monthly',
          label: i18n.month
        },
        {
          value: 'yearly',
          label: i18n.year
        }
      ],
      weekdays: [
        {
          value: 'mo',
          label: i18n.monday
        },
        {
          value: 'tu',
          label: i18n.tuesday
        },
        {
          value: 'we',
          label: i18n.wednesday
        },
        {
          value: 'th',
          label: i18n.thursday
        },
        {
          value: 'fr',
          label: i18n.friday
        },
        {
          value: 'sa',
          label: i18n.saturday
        },
        {
          value: 'su',
          label: i18n.sunday
        }
      ],
      months: ref([]),
      monthdays: ref([]),
      yeardays: ref([]),
      selectedFreq: ref(null),
      selectedEvent: null,
      calendarTypeCheckedValue: ref("Gregorian_calendar"),
    };
  },

  data() {
      return {
        globalData,
        showEditModal: false,
        isSubmitButtonVisible: true,
        isClearButtonVisible: true,
        isDeleteButtonVisible: false,
        showDeleteScheduleConfirmModal: false
      }
    },

  methods: {
    createRecurringDays() {
      if(this.selectedFreq === 'monthly') {
        this.monthdays = [];
        for(let i = 0; i < 31; i++) {
          let monthday = { value: i+1, label: (i+1).toString() }
          this.monthdays.push(monthday);
        }
      }
      else if(this.selectedFreq === 'yearly') {
        this.yeardays = [];
        for(let i = 0; i < 366; i++) {
          let yearday = { value: i+1, label: (i+1).toString() }
          this.yeardays.push(yearday);
        }
      }
    },

    handleUpdateSelectedFreq() {
      this.createRecurringDays();
    },

    handleCalendarTypeChange(e) {
      this.calendarTypeCheckedValue = e.target.value;
    },

    newSchedule(param) {
      let diff = 1
        if(param.view.type == 'dayGridMonth') { // 在月视图单击某个格子，则 end-start 刚好是24小时，由于设计的是双击触发日程新增界面，因此要排除这个情况
            diff = 86400000
        }

        if((getTime(param.end) - getTime(param.start)) !== diff || this.selectedDate !== "") {
            this.canNewSchedule = true;
        } else {
            this.canNewSchedule = false;
            this.selectedDate = param.startStr;
        }
          
        if(this.canNewSchedule === true) {
            this.selectedDate = "";
            this.startTime = getTime(param.start)
            this.endTime = getTime(param.end)
            this.selectedScheduleStatus = this.scheduleStatusList[0].value;
            this.isSubmitButtonVisible = true;
            this.isClearButtonVisible = true;
            this.isDeleteButtonVisible = false;
            this.showEditModal = true;
            this.createRecurringDays();
        }
    },

    updateSchedule(param) {
      if(param.extendedProps.rrule === undefined) {
        this.updateScheduleInternal(param.id, param.extendedProps.category, param.title.substring(param.title.indexOf(' ') + 1), param.allDay,
                                    false, '', '', [], [], [], 1,
                                    param.startStr, param.endStr, param.extendedProps.refBlockId, param.extendedProps.content,
                                    param.extendedProps.status);
      } else {
        this.updateScheduleInternal(param.id, param.extendedProps.category, param.title.substring(param.title.indexOf(' ') + 1), param.allDay,
                                    true, param.extendedProps.calendarType, param.extendedProps.rrule.freq, param.extendedProps.rrule.byweekday, param.extendedProps.rrule.bymonthday,
                                    param.extendedProps.rrule.byyearday, param.extendedProps.rrule.interval, param.extendedProps.rrule.dtstart,
                                    param.extendedProps.rrule.until, param.extendedProps.refBlockId, param.extendedProps.content, param.extendedProps.status);
      }
      
    },

    updateScheduleKanban(cindex, sindex) {
      this.cindex = cindex;
      this.sindex = sindex;
      let schedule = this.globalData.scheduleCategories.categories[cindex].schedules[sindex];
      this.updateScheduleInternal(schedule.id, schedule.category, schedule.title, schedule.isAllDay,
                                  schedule.isRecurringSchedule, schedule.calendarType, schedule.frequency, schedule.weekdays, schedule.monthdays, schedule.yeardays,
                                  schedule.interval, schedule.start, schedule.end,
                                  schedule.refBlockId, schedule.content, schedule.status);
    },

    updateScheduleInternal(id, category, title, isAllDay,
                           isRecurringSchedule, calendarType, frequency, weekdays, monthdays, yeardays, interval,
                           startTime, endTime, refBlockId, content, status) {
      this.isSubmitButtonVisible = true;
      this.isClearButtonVisible = true;
      this.isDeleteButtonVisible = true;
      if(category.length >= 4) {
        let same = category.substring(category.length - 4, category.length) == "Subs";
        this.isSubmitButtonVisible = !same;
        this.isClearButtonVisible = !same;
        this.isDeleteButtonVisible = !same;
      }

      this.selectedCategory = category;
      this.scheduleName = title;
      if (this.startTime == null)
        this.startTime = Date.now();

      if (this.endTime == null)
        this.endTime = this.startTime + 1;
      
      let date = parseISO(startTime);
      this.startTime = getTime(date);
      date = parseISO(endTime);
      this.endTime = isAllDay === true ? getTime(date) - 86400000 : getTime(date);
      this.scheduleContentBlockId = refBlockId;
      this.scheduleContent = content;
      this.selectedScheduleStatus = status;

      this.category = this.globalData.scheduleCategories.getCategoryByName(this.selectedCategory);
      this.scheduleStatus = this.scheduleStatusList[this.selectedScheduleStatus - 1].label;
      
      this.isAllDaySchedule = isAllDay;
      this.isRecurringSchedule = isRecurringSchedule;
      this.selectedFreq = frequency;
      this.selectedWeekday = weekdays;
      this.selectedMonthday = monthdays;
      this.selectedYearday = yeardays;
      this.scheduleInterval = interval;
      
      this.selectedSchedule = new Schedule(id, '', isAllDay, isRecurringSchedule, calendarType, frequency, weekdays, monthdays, yeardays, interval, '', '', category, '', '', 1);

      // 清空参会人员列表
      this.attendees = [];
      
      this.showEditModal = true;
      this.createRecurringDays();
    },

    handleSubmitSchedule() {
        this.showEditModal = false;
        if((this.isAllDaySchedule === true) ? (this.startTime > this.endTime) : (this.startTime >= this.endTime)) {
          showMessage(i18n.scheduleRangeError, 6000, "error");
        } else {
          if(this.isDeleteButtonVisible === false) {
            // 提交新日程
            let schedule = this.createNewSchedule();
            this.globalData.scheduleCategories.addSchedule(schedule);
            EventAggregator.emit('addSchedule', schedule);
          } else {
            // 更新已有日程
            let oldCategory = this.selectedSchedule.category;
            let schedule = this.createUpdateSchedule();
            this.globalData.scheduleCategories.updateSchedule(oldCategory, schedule);
            EventAggregator.emit('updateSchedule', {
              old: oldCategory,
              new: schedule });
          }
          
          this.clearEventInfo();
        }
      },

      handleClearInfo() {
        this.clearEventInfo();
      },

      handleDeleteSchedule() {
        this.showEditModal = false;
        this.showDeleteScheduleConfirmModal = true;
      },

      submitDeleteSchedule() {
        this.globalData.scheduleCategories.removeSchedule(this.selectedSchedule);
        EventAggregator.emit('deleteSchedule', this.selectedSchedule);
        this.clearEventInfo();
      },

      createNewSchedule() {
        return this.createSchedule(new Date().getTime().toString());
      },

      createUpdateSchedule() {
        return this.createSchedule(this.selectedSchedule.id);
      },

      createSchedule(id) {
        let start = "", end = "";

        if(this.isAllDaySchedule) {
          start = format(this.startTime, "yyyy-MM-dd");
          end = format(this.endTime + 86400000, 'yyyy-MM-dd');
        } else {
          start = format(this.startTime, "yyyy-MM-dd'T'HH:mm:ss");
          end = format(this.endTime, "yyyy-MM-dd'T'HH:mm:ss");
        }

        if(this.selectedFreq === 'weekly') {
          this.selectedMonthday = [];
          this.selectedYearday = [];
        }
        else if(this.selectedFreq === 'monthly') {
          this.selectedWeekday = [];
          this.selectedYearday = [];
        }
        else if(this.selectedFreq === 'yearly') {
          this.selectedMonthday = [];
          this.selectedWeekday = [];
        }

        let newSchedule = new Schedule(id, this.scheduleName, this.isAllDaySchedule,
                            this.isRecurringSchedule, this.calendarTypeCheckedValue, this.selectedFreq, this.selectedWeekday, this.selectedMonthday, this.selectedYearday,
                            this.scheduleInterval, start, end,
                            this.selectedCategory, this.scheduleContentBlockId, this.scheduleContent, this.selectedScheduleStatus,
                            this.attendees.map(a => a.name)
                           );
        if(this.selectedScheduleStatus == 3)
          newSchedule.setDoneTime(moment().valueOf());
        return newSchedule;
      },

      clearEventInfo() {
        this.selectedCategory = "";
        this.startTime = null;
        this.endTime = null;
        this.scheduleName = null;
        this.scheduleContent = null;
        this.selectedScheduleStatus = null;
      },

      handleJumpToBlock() {
        this.showEditModal = false;
        if(this.scheduleContentBlockId !== null && this.scheduleContentBlockId !== undefined) {
          EventAggregator.emit('openBlockFloatLayer', this.scheduleContentBlockId);
        }
      },

      addAttendee() {
        this.attendees.push({ name: '' });
      },

      removeAttendee(index) {
        this.attendees.splice(index, 1);
      },
  }
})
</script>