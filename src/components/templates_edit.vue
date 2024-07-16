<template>
  <div>
    <!-- Form for selecting a template -->
    <select v-model="selectedTemplateId">
      <option v-for="template in templates" :key="template" :value="template">{{ template }}</option>
    </select>
    <button @click="loadTemplate">Load Template</button>

    <!-- TinyMCE Editor for editing HTML content -->
    <div v-if="htmlContent !== null">
      <Editor
          v-model="editedHtmlContent"
          :init="editorOptions"
          style="height: 300px;"
      ></Editor>

      <!-- Buttons for saving and downloading -->
      <button @click="saveChanges">Save Changes</button>
      <button @click="downloadTemplate">Download Template</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-vue'; // Ensure correct import path
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {
  components: {
    Editor,
    QuillEditor
  },
  data() {
    return {
      templates: [],           // List of available templates
      selectedTemplateId: null, // Selected template ID
      htmlContent: null,       // Current HTML content of the template
      editedHtmlContent: '',   // Edited HTML content in the TinyMCE Editor
      editorOptions: {         // TinyMCE Editor options
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar:
            'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
        height: 300,
        menubar: false
      }
    };
  },
  mounted() {
    // Fetch list of available templates when the component is mounted
    this.fetchTemplates();
  },
  methods: {
    // Fetches the list of available templates from the server
    fetchTemplates() {
      axios.get('http://localhost:8080/api/templates')
          .then(response => {
            this.templates = response.data;
          })
          .catch(error => {
            console.error('Error fetching templates', error);
          });
    },
    // Loads the selected template's HTML content into the editor
    loadTemplate() {
      if (!this.selectedTemplateId) {
        alert('Select a template to load');
        return;
      }

      axios.get(`http://localhost:8080/api/templates/${this.selectedTemplateId}`)
          .then(response => {
            this.htmlContent = response.data;
            this.editedHtmlContent = response.data; // Load HTML content for editing
            console.log('Loaded content:', this.editedHtmlContent);
          })
          .catch(error => {
            console.error('Error loading template', error);
          });
    },
    // Saves changes made in the editor back to the server
    saveChanges() {
      if (!this.selectedTemplateId) {
        alert('Select a template to save changes');
        return;
      }

      axios.post(`http://localhost:8080/api/templates/save/${this.selectedTemplateId}`, this.editedHtmlContent, {
        headers: {
          'Content-Type': 'text/plain'
        }
      })
          .then(response => {
            console.log('Changes saved');
            this.htmlContent = this.editedHtmlContent; // Update current content after saving
          })
          .catch(error => {
            console.error('Error saving changes', error);
          });
    },
    // Downloads the edited template as an HTML file
    downloadTemplate() {
      if (!this.selectedTemplateId) {
        alert('Select a template to download');
        return;
      }

      axios.get(`http://localhost:8080/api/templates/download/${this.selectedTemplateId}`, { responseType: 'blob' })
          .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${this.selectedTemplateId}.html`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          })
          .catch(error => {
            console.error('Error downloading template', error);
          });
    }
  }
};
</script>

<style>
/* Optional styles for the editor */
.quill-editor {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 10px;
  background-color: #f9f9f9;
}
</style>
