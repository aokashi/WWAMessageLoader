import Vue from "vue";
import * as PartsType from "../partsType";
import wwaPartsMessage from "./wwa-parts-message";

export default Vue.component('wwa-parts', {
  props: {
    parts: {
      type: Object,
      required: true
    }
  },
  template: `
    <section class="parts-item" :class="elementClass">
      <h3 class="parts-item__title">
        <span v-if="parts.partsNumber !== 0">
          {{ this.partsTypeToString }}{{ parts.partsNumber }}番
        </span>
        <span v-else>
          パーツ無し
        </span>
        </h3>
      <div class="parts-item__details">
        <span class="parts-item__message-number">
          メッセージ番号: {{ parts.number }} 番
        </span>
        <span v-if="!parts.hasPartsInMap" class="parts-item__no-put-warn">
          マップ内に配置されていません
        </span>
      </div>
      <wwa-parts-message :parts-message="parts.message">
      </wwa-parts-message>
    </section>
  `,
  data: function() {
    return {
      elementClass: {
        'parts-item--object': this.parts.partsType === PartsType.PARTSTYPE_OBJECT,
        'parts-item--map': this.parts.partsType === PartsType.PARTSTYPE_MAP
      }
    }
  },
  computed: {
    hasParts: function() {
      return this.parts.partsType !== PartsType.PARTSTYPE_UNDEFINED;
    },
    partsTypeToString: function() {
      switch (this.parts.partsType) {
        case PartsType.PARTSTYPE_OBJECT:
          return '物体パーツ'
        case PartsType.PARTSTYPE_MAP:
          return '背景パーツ'
      }
      return '';
    }
  },
  components: {
    'wwa-parts-message': wwaPartsMessage
  }
});
