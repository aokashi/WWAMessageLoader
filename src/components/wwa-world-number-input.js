import Vue from "vue";

export default Vue.component('wwa-world-number-input', {
  template: `
    <div>
      <p>暗証番号を入力してください。</p>
      <form @submit.prevent="submitWorldNumberEvent">
        <input type="password" v-model="worldNumber" />
        <button @click="submitWorldNumberEvent">送信</button>
      </form>
    </div>
  `,
  data: function() {
    return {
      worldNumber: ''
    }
  },
  methods: {
    /**
     * 暗証番号を送信します。
     *   worldNumber: 入力した暗証番号
     */
    submitWorldNumberEvent: function() {
      this.$emit('submit', {
        worldNumber: this.worldNumber
      });
    }
  }
});
