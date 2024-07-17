<template>
  <div>
    <!-- Вывод списка шаблонов -->
    <ul>
      <li v-for="template in templates" :key="template.name">
        <button @click="selectTemplate(template.name)">Выбрать</button>
        <span>{{ template.name }}</span>
      </li>
    </ul>

    <!-- Блок для отображения и редактирования HTML содержимого -->
    <div class="html-editor" v-if="htmlContent !== null">
      <!-- Рендеринг текущего HTML содержимого -->
      <div v-html="htmlContent"></div>

      <!-- Поле для редактирования -->
      <textarea v-model="editedHtmlContent" rows="10" cols="50"></textarea>

      <!-- Кнопки для сохранения и скачивания -->
      <button @click="saveChanges">Сохранить изменения</button>
      <button @click="downloadTemplate">Скачать шаблон</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      templates: [],           // Список доступных шаблонов
      selectedTemplateName: '', // Имя выбранного шаблона
      htmlContent: null,       // Текущее HTML содержимое шаблона
      editedHtmlContent: ''    // Редактируемое HTML содержимое
    };
  },
  mounted() {
    // Получаем список доступных шаблонов при загрузке компонента
    this.fetchTemplates();
  },
  methods: {
    // Получение списка доступных шаблонов
    fetchTemplates() {
      axios.get('http://localhost:8080/api/templates')
          .then(response => {
            this.templates = response.data.map(name => ({name}));
          })
          .catch(error => {
            console.error('Ошибка при получении списка шаблонов', error);
          });
    },
    // Выбор шаблона для редактирования
    selectTemplate(templateName) {
      this.selectedTemplateName = templateName;
      this.editedHtmlContent = ''; // Очищаем редактируемое содержимое перед загрузкой нового шаблона

      axios.get(`http://localhost:8080/api/templates/${templateName}`)
          .then(response => {
            this.htmlContent = response.data;
            this.editedHtmlContent = response.data; // Загружаем HTML содержимое для редактирования
          })
          .catch(error => {
            console.error('Ошибка при загрузке шаблона', error);
          });
    },
    // Сохранение изменений в шаблоне
    saveChanges() {
      if (!this.selectedTemplateName) {
        alert('Выберите шаблон для сохранения изменений');
        return;
      }

      axios.post(`http://localhost:8080/api/templates/save/${this.selectedTemplateName}`, {htmlContent: this.editedHtmlContent})
          .then(response => {
            console.log('Изменения сохранены');
            this.htmlContent = this.editedHtmlContent; // Обновляем текущее содержимое после сохранения
          })
          .catch(error => {
            console.error('Ошибка сохранения изменений', error);
          });
    },
    // Скачивание отредактированного шаблона
    downloadTemplate() {
      if (!this.selectedTemplateName) {
        alert('Выберите шаблон для скачивания');
        return;
      }

      axios.get(`http://localhost:8080/api/templates/download/${this.selectedTemplateName}`, {responseType: 'blob'})
          .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${this.selectedTemplateName}.html`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          })
          .catch(error => {
            console.error('Ошибка скачивания шаблона', error);
          });
    }
  }
};
</script>

<style>
.html-editor {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 10px;
  background-color: #f9f9f9;
}

.html-editor textarea {
  margin-top: 10px;
  width: 100%;
}
</style>
