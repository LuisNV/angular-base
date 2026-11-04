FROM harbor-uat.vietinbank.vn/library/node:22-alpine AS build
WORKDIR /app
COPY .npmrc package*.json ./
RUN npm ci --no-audit --no-fund
COPY angular.json tsconfig*.json ./
COPY public ./public
COPY src ./src
RUN npm run build:prod

FROM harbor-uat.vietinbank.vn/library/nginxinc/nginx-unprivileged:stable-alpine
COPY --from=build /app/dist/angular-base/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
