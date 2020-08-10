import Vue from "vue";

import wwaAudioPartsList from "./wwa-audio-parts-list";

const ATTR_TYPE = 3;
const OBJECT_RANDOM = 16;
const ATTR_SOUND = 19;
const BGM_LB = 70;
const NO_SOUND = 99;

export default Vue.component('wwa-audio-list', {
  props: {
    wwaData: {
      type: Object,
      required: true
    }
  },
  template: `
    <div class="audio-list">
      <div class="audio-list__title">サウンド一覧</div>
      <p>サウンドファイルを再生する際は audio ディレクトリに入れる必要があります。</p>
      <div class="audio-list__list">
        <div
          class="audio-list__item audio-item"
          v-for="audioItem in audioList"
          :key="audioItem.number"
        >
          <div class="audio-item__number">{{audioItem.number}} 番</div>

          <audio :src="'audio/' + audioItem.number + '.mp3'" controls :loop="isBGM(audioItem.number)"></audio>

          <wwa-audio-parts-list
            title="使用されている物体パーツ"
            class="audio-item__parts-list audio-item__parts-list--object"
            :partsNumbers="audioItem.objectParts"
          ></wwa-audio-parts-list>

          <wwa-audio-parts-list
            title="使用されている背景パーツ"
            class="audio-item__parts-list audio-item__parts-list--map"
            :partsNumbers="audioItem.mapParts"
          ></wwa-audio-parts-list>

        </div>
      </div>
    </div>
  `,
  computed: {
    /**
     * @returns {array} 以下の情報を格納する配列
     *   number: サウンド番号
     *   objectParts: 使用されている物体パーツ番号一覧
     *   mapParts: 使用されている背景パーツ番号一覧
     */
    audioList: function() {
      // usedSoundNumbers は使用されているサウンド番号を一時的にメモするための配列です。
      let usedSoundNumbers = [];
      let usedSounds = [];

      const getSoundNumber = function (addItemFn) {
        return (partsAttribute, partsNumber) => {
          if (partsAttribute[ATTR_TYPE] === OBJECT_RANDOM) {
            return;
          }

          const soundNumber = partsAttribute[ATTR_SOUND];
          if (soundNumber === 0 || soundNumber === NO_SOUND || partsNumber === 0) {
            return;
          }

          let usedSoundNumberIndex = usedSoundNumbers.indexOf(soundNumber);
          if (usedSoundNumberIndex === -1) {
            usedSounds.push({
              number: soundNumber,
              objectParts: [],
              mapParts: [],
            });
            usedSoundNumbers.push(soundNumber);

            usedSoundNumberIndex = usedSoundNumbers.length - 1;
          }

          addItemFn(partsNumber, usedSoundNumberIndex);
        };
      };

      this.wwaData['objectAttribute'].forEach(getSoundNumber((partsNumber, usedSoundNumberIndex) => {
        usedSounds[usedSoundNumberIndex].objectParts.push(partsNumber);
      }));
      this.wwaData['mapAttribute'].forEach(getSoundNumber((partsNumber, usedSoundNumberIndex) => {
        usedSounds[usedSoundNumberIndex].mapParts.push(partsNumber);
      }));
      
      return usedSounds;
    }
  },
  methods: {
    isBGM: function(soundNumber) {
      return soundNumber >= BGM_LB;
    }
  },
  component: {
    'wwa-audio-parts-list': wwaAudioPartsList
  }
});
