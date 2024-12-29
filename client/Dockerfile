FROM node:lts AS development

ENV CI=true

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm ci

COPY . /app

CMD [ "npm", "run", "dev" ]

FROM development AS build

RUN npm run build

FROM nginx:1.27-alpine

COPY --from=build /app/.nginx/nginx.conf /etc/nginx/templates/default.conf.template

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /app/dist .

# Containers run nginx with global directives and daemon off
CMD ["nginx", "-g", "daemon off;"]