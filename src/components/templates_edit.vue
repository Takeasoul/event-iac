<template>
  <div class="template-editor">
    <!-- Template Selector -->
    <div class="template-selector">
      <select v-model="selectedTemplateId" @change="loadTemplate">
        <option v-for="template in templates" :key="template" :value="template">{{ template }}</option>
      </select>
      <button @click="loadTemplate">Load Template</button>
    </div>

    <!-- Editor and Preview -->
    <div class="editor-preview" v-if="templateContent !== null">
      <ckeditor :editor="editor" v-model="content"></ckeditor>
      <div class="html-preview" v-html="compiledContent"></div>
    </div>

    <!-- Actions: Save Changes and Download Template -->
    <div class="actions">
      <button @click="saveChanges">Save Changes</button>
      <button @click="downloadTemplate">Download Template</button>
    </div>
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';

export default {
  data() {
    return {
      templates: [],               // Список доступных шаблонов
      selectedTemplateId: null,    // Выбранный ID шаблона
      templateContent: null,       // Текущий HTML контент шаблона
      content: '',                 // Отредактированный контент в редакторе
      editor: ClassicEditor,       // Используемый редактор CKEditor 5
    };
  },
  computed: {
    compiledContent() {
      return this.content;
    }
  },
  methods: {
    // Fetches the list of available templates from the server
    async fetchTemplates() {
      try {
        const response = await axios.get('http://localhost:8080/api/templates');
        console.log('Templates fetched:', response.data); // Логирование ответа сервера
        this.templates = response.data;
      } catch (error) {
        console.error('Error fetching templates', error);
      }
    },
    // Loads the selected template's HTML content into the editor
    async loadTemplate() {
      if (!this.selectedTemplateId) {
        alert('Select a template to load');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/templates/${this.selectedTemplateId}`);
        console.log('Template content fetched:', response.data); // Логирование ответа сервера
        this.templateContent = response.data;
        this.content = this.templateContent; // Load HTML content for editing
      } catch (error) {
        console.error('Error loading template', error);
      }
    },
    // Saves changes made in the editor back to the server
    async saveChanges() {
      if (!this.selectedTemplateId) {
        alert('Select a template to save changes');
        return;
      }

      try {
        await axios.post(`http://localhost:8080/api/templates/save/${this.selectedTemplateId}`, { content: this.content }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Changes saved');
        this.templateContent = this.content; // Update current content after saving
      } catch (error) {
        console.error('Error saving changes', error);
      }
    },
    // Downloads the edited template as an HTML file
    async downloadTemplate() {
      if (!this.selectedTemplateId) {
        alert('Select a template to download');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/templates/download/${this.selectedTemplateId}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${this.selectedTemplateId}.html`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading template', error);
      }
    }
  },
  mounted() {
    // Fetch list of available templates when the component is mounted
    this.fetchTemplates();
  }
};
</script>

<style>
.template-editor {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px;
}

.template-selector {
  display: flex;
  gap: 10px;
}

.editor-preview {
  display: flex;
  gap: 20px;
}

.html-editor {
  width: 50%;
  height: 400px;
}

.html-preview {
  width: 50%;
  border: 1px solid #ccc;
  padding: 10px;
  background-color: #f9f9f9;
}

.actions {
  display: flex;
  gap: 10px;
}
</style>
