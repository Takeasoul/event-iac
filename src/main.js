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


import '@vueup/vue-quill/dist/vue-quill.snow.css'

import VueTheMask from 'vue-the-mask'
import CKEditor from '@ckeditor/ckeditor5-vue';

const app = createApp(App)

// Import TinyMCE Editor and its styles



app.use(CKEditor);
app.use(router)
app.use(VueTheMask)
app.mount('#app')

export const apiUrl = 'http://localhost:8080'
