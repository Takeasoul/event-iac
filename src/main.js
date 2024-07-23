import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style/style.css';
// Required styles for carousel and bottom scroll indicator
import 'gitart-scroll-carousel/dist/index.css';
// Arrows styles if you want to use default arrows
import 'gitart-scroll-carousel/dist/GSArrow.css';
// Styles of the layout you want to use
import 'gitart-scroll-carousel/dist/GSLayoutNumeric.css';

import 'quill/dist/quill.snow.css'; // Quill CSS

import VueTheMask from 'vue-the-mask';
import Quill from 'quill';
import CKEditor from '@ckeditor/ckeditor5-vue';


createApp(App).use(CKEditor).use(router).use(VueTheMask).mount('#app');

export const apiUrl = 'http://localhost:8080';