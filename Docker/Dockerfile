# Dockerfile

# استخدام إصدار Node.js المناسب
FROM node:18 AS build

# تعيين مسار العمل
WORKDIR /app

# نسخ ملفات package.json و package-lock.json
COPY package*.json ./

# تثبيت التبعيات
RUN npm install

# نسخ بقية ملفات المشروع
COPY . .

# بناء المشروع
RUN npm run build --prod

# اختيار الصورة المناسبة بعد البناء (يمكنك تخصيصها حسب الحاجة)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html


# Expose the default NGINX port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
