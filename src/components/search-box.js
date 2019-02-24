import Vue from "vue";
import * as PartsType from "../partsType";

export default Vue.component('search-box', {
  template: `
    <div>
      <input v-model="query" type="text">

      <input v-model="type" id="search-type-no" type="radio" :value="partsType.PARTSTYPE_UNDEFINED">
        <label for="search-type-no">指定なし</label>
      <input v-model="type" id="search-type-object" type="radio" :value="partsType.PARTSTYPE_OBJECT">
        <label for="search-type-object">物体パーツ</label>
      <input v-model="type" id="search-type-map" type="radio" :value="partsType.PARTSTYPE_MAP">
        <label for="search-type-map">背景パーツ</label>

      <input v-model="onlyPartsMessage" id="search-only-parts-message" type="checkbox">
        <label for="search-only-parts-message">パーツのメッセージのみ</label>

      <button @click="searchEvent" type="button">検索</button>
    </div>
  `,
  data: function() {
    return {
      query: '',
      type: PartsType.PARTSTYPE_UNDEFINED,
      onlyPartsMessage: false
    }
  },
  methods: {
    /**
     * 以下の情報を格納する配列で search イベントを発生します。
     *   query: テキスト
     *   type: 種類
     *   onlyPartsMessage: パーツに紐づけされてないメッセージを除く
     */
    searchEvent: function() {
      this.$emit('search', {
        query: this.query,
        type: this.type,
        onlyPartsMessage: this.onlyPartsMessage
      });
    }
  },
  computed: {
    partsType: function() {
      return PartsType;
    }
  }
});
