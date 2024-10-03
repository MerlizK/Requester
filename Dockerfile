FROM node:22

WORKDIR /usr/var/app

COPY . .

RUN npm install

RUN npx expo install

CMD ["npx","expo","start"]