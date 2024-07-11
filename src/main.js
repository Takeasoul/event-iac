import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// required styles for carousel and bottom scroll indicator
import 'gitart-scroll-carousel/dist/index.css'
// arrows styles if you want use default arrows..
import 'gitart-scroll-carousel/dist/GSArrow.css'
// styles of the layout you want to use.
// read more in the layouts section.
import 'gitart-scroll-carousel/dist/GSLayoutNumeric.css'

import VueTheMask from 'vue-the-mask';

createApp(App).use(router).use(VueTheMask).mount('#app')