# Usa un'immagine Nginx di base
FROM nginx:latest

# Copia i file della web app Flutter nella directory /usr/share/nginx/html
COPY build/web/ /usr/share/nginx/html/app

# Copia il file di configurazione personalizzato per Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Esponi la porta 80 per il traffico HTTP
EXPOSE 80

# Comando di avvio per Nginx
CMD ["nginx", "-g", "daemon off;"]
