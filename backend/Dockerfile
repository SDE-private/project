# Usa un'immagine di base con Node.js
FROM node:20.8.1

# Crea una directory di lavoro
WORKDIR /app

# Copia il file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install
RUN apt update && apt install ffmpeg -y

# Copia i file dell'applicazione nell'immagine Docker
COPY . .

# Esponi la porta in cui il server Express.js ascolterà
EXPOSE 3000
EXPOSE 3001


# Avvia l'applicazione
CMD ["npm", "run", "plugandplay"]
