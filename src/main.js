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

import Vue from 'vue'
import Vuex from 'vuex'
import Vueditor from 'vueditor'

import 'vueditor/dist/style/vueditor.min.css'

// your config here
let config = {
    toolbar: [
        'removeFormat', 'undo', '|', 'elements', 'fontName', 'fontSize', 'foreColor', 'backColor'
    ],
    fontName: [
        {val: 'arial black'},
        {val: 'times new roman'},
        {val: 'Courier New'}
    ],
    fontSize: ['12px', '14px', '16px', '18px', '0.8rem', '1.0rem', '1.2rem', '1.5rem', '2.0rem'],
    uploadUrl: ''
};

createApp(App).use(CKEditor).use(VueTheMask).use(router).mount('#app');

export const apiUrl = 'http://77.222.38.40:8080';