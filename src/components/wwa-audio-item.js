import Vue from "vue"

import wwaAudioPartsList from "./wwa-audio-parts-list";

const BGM_LB = 70;

export default Vue.component('wwa-audio-item', {
  props: {
    audioNumber: {
      type: Number,
      required: true,
    },
    objectPartsNumbers: {
      type: Array,
      default: [],
    },
    mapPartsNumbers: {
      type: Array,
      default: [],
    },
    directoryPath: {
      type: String,
      default: '.'
    },
  },
  template: `
    <div
      class="audio-list__item audio-item"
    >
      <div class="audio-item__number">
        {{audioNumber}} 番
        <span class="audio-item__is-bgm" v-if="isBGM">BGM</span>
      </div>

      <audio :src="directoryPath + '/audio/' + audioNumber + '.mp3'" controls preload="none" :loop="isBGM"></audio>

      <wwa-audio-parts-list
        title="使用されている物体パーツ"
        class="audio-item__parts-list audio-item__parts-list--object"
        :partsNumbers="objectPartsNumbers"
      ></wwa-audio-parts-list>

      <wwa-audio-parts-list
        title="使用されている背景パーツ"
        class="audio-item__parts-list audio-item__parts-list--map"
        :partsNumbers="mapPartsNumbers"
      ></wwa-audio-parts-list>

    </div>
  `,
  computed: {
    isBGM() {
      return this.audioNumber >= BGM_LB;
    }
  },
  component: {
    'wwa-audio-parts-list': wwaAudioPartsList,
  }
});
