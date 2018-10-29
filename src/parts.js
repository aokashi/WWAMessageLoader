import Vue from "vue";

export default Vue.component('parts', {
    template: `
    <section>
        <h3>{{ number }} 番</h3>
        <div><slot></slot></div>
    </section>
    `,
    data: function() {
        return {
            number: 0,
            message: ''
        }
    }
});
