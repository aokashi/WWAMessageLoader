import Vue from "vue";

export default Vue.component('parts', {
    props: ['number'],
    template: `
    <section>
        <h3>{{ number }} 番</h3>
        <div><slot></slot></div>
    </section>
    `
});
