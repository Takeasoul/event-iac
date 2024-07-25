<template>
  <div class="template-editor">
    <!-- Template Selector -->
    <div class="template-selector">
      <select v-model="selectedTemplateId" @change="loadTemplate">
        <option v-for="template in templates" :key="template" :value="template">{{ template }}</option>
      </select>
    </div>

    <div class="outer-container">
      <div class="main-container">
        <div class="editor-container editor-container_classic-editor" ref="editorContainerElement">
          <div class="editor-container__editor">
            <div ref="editorElement">
              <ckeditor
                  v-if="templateContent !== null"
                  v-model="content"
                  :editor="editor"
                  :config="config"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions: Save Changes and Download Template -->
    <div class="actions">
      <input v-model="newTemplateName" placeholder="Enter template name" />
      <select v-model="selectedTemplateType">
        <option v-for="(type, key) in templateTypeMap" :key="key" :value="key">{{ type }}</option>
      </select>
      <button @click="saveChanges">Сохранить изменения</button>
      <button @click="downloadTemplate">Скачать шаблон</button>
      <button @click="goBack()">Назад</button>
    </div>
  </div>
</template>

<script>
import {
  ClassicEditor,
  AccessibilityHelp,
  Autoformat,
  AutoLink,
  Autosave,
  Bold,
  Code,
  CodeBlock,
  Essentials,
  GeneralHtmlSupport,
  Heading,
  HtmlComment,
  FullPage,
  SourceEditing,
  HtmlEmbed,
  Italic,
  Link,
  Paragraph,
  SelectAll,
  ShowBlocks,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextPartLanguage,
  TextTransformation,
  Undo,
  Alignment,
  AutoImage,
  BlockQuote,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Highlight,
  HorizontalLine,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  LinkImage,
  List,
  ListProperties,
  PasteFromOffice,
  SimpleUploadAdapter,
  SpecialCharacters,
  Strikethrough,
  Style,
  Subscript,
  Superscript,
  Underline,
} from 'ckeditor5';
import juice from 'juice';
import 'ckeditor5/ckeditor5.css';
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
import router from "@/router.js";
import config from "@/configApi.js";
export default {

  name: 'App',
  data() {
    return {
      templates: [],               // Список доступных шаблонов
      selectedTemplateId: null,    // Выбранный ID шаблона
      templateContent: null,       // Текущий HTML контент шаблона
      content: '',                 // Отредактированный контент в редакторе
      newTemplateName: '',         // Новое имя шаблона
      selectedTemplateType: '',    // Выбранный тип шаблона
      isLayoutReady: false,
      config: null, // CKEditor needs the DOM tree before calculating the configuration.
      editor: ClassicEditor

    };
  },

    mounted() {
      this.config = {
        toolbar: {
          items: [
            'undo',
            'redo',
            '|',
            'sourceEditing',
            'showBlocks',
            'selectAll',
            '|',
            'heading',
            'style',
            '|',
            'fontSize',
            'fontFamily',
            'fontColor',
            'fontBackgroundColor',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'subscript',
            'superscript',
            '|',
            'specialCharacters',
            'horizontalLine',
            'link',
            'insertImage',
            'insertTable',
            'highlight',
            'blockQuote',
            'htmlEmbed',
            '|',
            'alignment',
            '|',
            'bulletedList',
            'numberedList',
            'indent',
            'outdent',
            '|',
            'accessibilityHelp'
          ],
          shouldNotGroupWhenFull: false
        },
        plugins: [
          AccessibilityHelp,
          Alignment,
          Autoformat,
          AutoImage,
          AutoLink,
          Autosave,
          BlockQuote,
          Bold,
          Essentials,
          FontBackgroundColor,
          FontColor,
          FontFamily,
          FontSize,
          FullPage,
          GeneralHtmlSupport,
          Heading,
          Highlight,
          HorizontalLine,
          HtmlComment,
          HtmlEmbed,
          ImageBlock,
          ImageCaption,
          ImageInline,
          ImageInsert,
          ImageInsertViaUrl,
          ImageResize,
          ImageStyle,
          ImageTextAlternative,
          ImageToolbar,
          ImageUpload,
          Indent,
          IndentBlock,
          Italic,
          Link,
          LinkImage,
          List,
          ListProperties,
          Paragraph,
          PasteFromOffice,
          SelectAll,
          ShowBlocks,
          SimpleUploadAdapter,
          SourceEditing,
          SpecialCharacters,
          Strikethrough,
          Style,
          Subscript,
          Superscript,
          Table,
          TableCaption,
          TableCellProperties,
          TableColumnResize,
          TableProperties,
          TableToolbar,
          TextTransformation,
          Underline,
          Undo
        ],
        fontFamily: {
          supportAllValues: true
        },
        fontSize: {
          options: [10, 12, 14, 'default', 18, 20, 22],
          supportAllValues: true
        },
        fontColor:{
          colors: [{
            color: '#E64C4C',
            label: 'Red'
          },
            {
              color: '#E6994C',
              label: 'Orange'
            },
            {
              color: '#E6E64C',
              label: 'Yellow'
            },
          ]
        },
        heading: {
          options: [
            {
              model: 'paragraph',
              title: 'Paragraph',
              class: 'ck-heading_paragraph'
            },
            {
              model: 'heading1',
              view: 'h1',
              title: 'Heading 1',
              class: 'ck-heading_heading1'
            },
            {
              model: 'heading2',
              view: 'h2',
              title: 'Heading 2',
              class: 'ck-heading_heading2'
            },
            {
              model: 'heading3',
              view: 'h3',
              title: 'Heading 3',
              class: 'ck-heading_heading3'
            },
            {
              model: 'heading4',
              view: 'h4',
              title: 'Heading 4',
              class: 'ck-heading_heading4'
            },
            {
              model: 'heading5',
              view: 'h5',
              title: 'Heading 5',
              class: 'ck-heading_heading5'
            },
            {
              model: 'heading6',
              view: 'h6',
              title: 'Heading 6',
              class: 'ck-heading_heading6'
            }
          ]
        },
        htmlSupport: {
          allow: [
            {
              name: /^.*$/,
              styles: true,
              attributes: true,
              classes: true
            }
          ]
        },
        image: {
          toolbar: [
            'toggleImageCaption',
            'imageTextAlternative',
            '|',
            'imageStyle:inline',
            'imageStyle:wrapText',
            'imageStyle:breakText',
            '|',
            'resizeImage'
          ]
        },
        initialData:
            '<h2>Congratulations on setting up CKEditor 5! 🎉</h2>\n<p>\n    You\'ve successfully created a CKEditor 5 project. This powerful text editor will enhance your application, enabling rich text editing\n    capabilities that are customizable and easy to use.\n</p>\n<h3>What\'s next?</h3>\n<ol>\n    <li>\n        <strong>Integrate into your app</strong>: time to bring the editing into your application. Take the code you created and add to your\n        application.\n    </li>\n    <li>\n        <strong>Explore features:</strong> Experiment with different plugins and toolbar options to discover what works best for your needs.\n    </li>\n    <li>\n        <strong>Customize your editor:</strong> Tailor the editor\'s configuration to match your application\'s style and requirements. Or even\n        write your plugin!\n    </li>\n</ol>\n<p>\n    Keep experimenting, and don\'t hesitate to push the boundaries of what you can achieve with CKEditor 5. Your feedback is invaluable to us\n    as we strive to improve and evolve. Happy editing!\n</p>\n<h3>Helpful resources</h3>\n<ul>\n    <li>📝 <a href="https://orders.ckeditor.com/trial/premium-features">Trial sign up</a>,</li>\n    <li>📕 <a href="https://ckeditor.com/docs/ckeditor5/latest/installation/index.html">Documentation</a>,</li>\n    <li>⭐️ <a href="https://github.com/ckeditor/ckeditor5">GitHub</a> (star us if you can!),</li>\n    <li>🏠 <a href="https://ckeditor.com">CKEditor Homepage</a>,</li>\n    <li>🧑‍💻 <a href="https://ckeditor.com/ckeditor-5/demo/">CKEditor 5 Demos</a>,</li>\n</ul>\n<h3>Need help?</h3>\n<p>\n    See this text, but the editor is not starting up? Check the browser\'s console for clues and guidance. It may be related to an incorrect\n    license key if you use premium features or another feature-related requirement. If you cannot make it work, file a GitHub issue, and we\n    will help as soon as possible!\n</p>\n',
        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: 'https://',
          decorators: {
            toggleDownloadable: {
              mode: 'manual',
              label: 'Downloadable',
              attributes: {
                download: 'file'
              }
            }
          }
        },
        list: {
          properties: {
            styles: true,
            startIndex: true,
            reversed: true
          }
        },
        placeholder: 'Type or paste your content here!',
        style: {
          definitions: [
            {
              name: 'Article category',
              element: 'h3',
              classes: ['category']
            },
            {
              name: 'Title',
              element: 'h2',
              classes: ['document-title']
            },
            {
              name: 'Subtitle',
              element: 'h3',
              classes: ['document-subtitle']
            },
            {
              name: 'Info box',
              element: 'p',
              classes: ['info-box']
            },
            {
              name: 'Side quote',
              element: 'blockquote',
              classes: ['side-quote']
            },
            {
              name: 'Marker',
              element: 'span',
              classes: ['marker']
            },
            {
              name: 'Spoiler',
              element: 'span',
              classes: ['spoiler']
            },
            {
              name: 'Code (dark)',
              element: 'pre',
              classes: ['fancy-code', 'fancy-code-dark']
            },
            {
              name: 'Code (bright)',
              element: 'pre',
              classes: ['fancy-code', 'fancy-code-bright']
            }
          ]
        },
        table: {
          contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
        }
      };

    this.isLayoutReady = true;

    if (this.evId) {
      this.fetchTemplates();
    } else {
      console.error('Event ID is missing from the route'); // Логирование ошибки
    }
  },

  computed: {
    templateTypeMap() {           // Добавьте здесь
      return {
        GREETINGS: 'Шаблон приветственного письма',
        APPROVED: 'Шаблон письма после подтверждения',
        QR_PDF: 'Шаблон файла электронного билета'
      };
    }
  },
  setup() {
    const route = useRoute();
    const evId = route.params.evId; // Получаем параметр маршрута
    const router = useRouter();  // Определяем router здесь
    return {
      evId
    };
  },
  methods: {
    async fetchTemplates() {
      if (!this.evId) {
        console.error('Event ID is required');
        return;
      }

      try {
        const response = await axios.get(`${config.url}/api/templates/get/${this.evId}`);
        this.templates = response.data;
      } catch (error) {
        console.error('Error fetching templates', error);
      }
    },
    async loadTemplate() {
      if (!this.selectedTemplateId || !this.evId) {
        alert('Select a template and ensure an event ID is set');
        return;
      }

      try {
        const response = await axios.get(`${config.url}/api/templates/${this.selectedTemplateId}/${this.evId}`);
        this.templateContent = response.data;
        this.content = response.data;
      } catch (error) {
        console.error('Error loading template', error);
      }
    },
    async saveChanges() {
      if (!this.newTemplateName.trim()) {
        alert('Please enter a template name');
        return;
      }

      if (this.selectedTemplateType === '') {
        alert('Please select a template type');
        return;
      }

      if (!this.evId) {
        alert('Event ID is required');
        return;
      }

      try {
        const contentToSave = { content: this.content }; // Убедитесь, что `content` включает весь HTML, включая стили
        const typeLabel = this.selectedTemplateType;

        await axios.post(`${config.url}/api/templates/save`, contentToSave, {
          params: {
            templateName: this.newTemplateName,
            eventId: this.evId,
            type: typeLabel
          },
          headers: { 'Content-Type': 'application/json' }
        });
        this.templateContent = this.content;
      } catch (error) {
        console.error('Error saving changes', error);
      }
    },
    async downloadTemplate() {
      if (!this.selectedTemplateId || !this.evId) {
        alert('Select a template and ensure an event ID is set');
        return;
      }

      try {
        const response = await axios.get(`${config.url}/api/templates/download/${this.selectedTemplateId}/${this.evId}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${this.selectedTemplateId}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading template', error);
      }
    },
    getInlineStyles(htmlContent) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const elements = doc.body.getElementsByTagName('*');
      const inlineStyles = [];

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.style.cssText) {
          inlineStyles.push({
            element: element.tagName,
            styles: element.style.cssText
          });
        }
      }

      return inlineStyles;
    },

    goBack() {
      router.back();
    }
  },
};
</script>

<style scoped>
.template-editor {
  font-family: Arial, sans-serif;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.template-selector {
  margin-bottom: 20px;
}

.template-selector select {
  padding: 5px;
  font-size: 16px;
}

.template-selector button {
  padding: 5px 10px;
  font-size: 16px;
  margin-left: 10px;
}

.main-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.editor-container {
  margin-bottom: 20px;
  width: 80%;
}


.editor-container_classic-editor {
  min-height: 600px;
  border: 1px solid #ccc;
  width: 100%;
}

.actions {
  margin-top: 20px;
}

.actions input,
.actions select {
  padding: 5px;
  font-size: 16px;
  margin-right: 10px;
}

.actions button {
  padding: 5px 10px;
  font-size: 16px;
}
</style>
