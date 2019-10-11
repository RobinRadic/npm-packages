import Vue from 'vue';


export class Component<P = any> extends Vue {
    $props: P;
}
