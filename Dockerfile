FROM alpine:latest as base

RUN apk add --update --no-cache nodejs npm

WORKDIR /code

RUN npm cache clean --force

COPY . .

RUN npm install
RUN npm run build


FROM nginx:latest

COPY --from=base /code/dist/altus-client /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4200

# FROM nginx
# COPY --from=base /code/dist/altus-client /usr/share/nginx/html
# EXPOSE 4200:80