import Vue from "vue";

import "@wwawing/styles/output/wwa.css";

export default Vue.component('wwa-parts-message', {
  props: {
    partsMessage: {
      type: String,
      required: true
    }
  },
  template: `
    <div class="parts-message wwa-size-box wwa-message-window">
      <div class="parts-message__content">
        <div class="parts-message__line" v-for="(messageLine, messageIndex) in partsMessageEachLine">
          {{ messageLine }}
        </div>
      </div>
    </div>
  `,
  computed: {
    /**
     * @returns {array}
     */
    partsMessageEachLine: function() {
      return this.partsMessage.split("\n");
    }
  }
});
