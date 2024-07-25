FROM nginx:latest

# Копируем собранные файлы Vue
COPY dist /var/www/public_html

VOLUME ./www /var/www/public_html

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]