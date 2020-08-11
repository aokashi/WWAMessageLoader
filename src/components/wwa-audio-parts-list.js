import Vue from "vue";

export default Vue.component('wwa-audio-parts-list', {
  props: {
    title: {
      type: String
    },
    partsNumbers: {
      type: Array,
      isRequired: true
    }
  },
  template: `
    <div class="audio-parts-list">
      <div v-if="partsNumbers.length > 0">
        <div class="audio-parts-list__title" v-if="title">{{ title }}</div>
        <span
          class="audio-parts-list__item"
          v-for="partsNumber in partsNumbers"
          :key="partsNumber"
        >
          {{partsNumber}}
        </span>
      </div>
    </div>
  `,
});
