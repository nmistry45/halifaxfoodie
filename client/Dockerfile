FROM  --platform=linux/amd64 node:16-alpine AS development
WORKDIR /client
COPY . .
RUN npm ci
RUN npm run build
ENV NODE_ENV development
EXPOSE 8050
CMD [ "npm", "start"]
