FROM node:20.5.1-alpine as builder

RUN mkdir /app

WORKDIR /app 

COPY package*.json  .

COPY prisma ./prisma

# install dependencies 
RUN npm install 

# copy all dev files 
COPY . .

RUN npm run build 

#RUN npx prisma generate

FROM node:20.5.1-alpine as build

EXPOSE 8000

RUN mkdir -p /var/www/html/app/

WORKDIR /var/www/html/app

COPY --from=builder /app/node_modules 	./node_modules
COPY --from=builder /app/dist 			./dist
COPY --from=builder /app/prisma 		./prisma

# run project on dev mode
CMD ["npm", "run", "start:migrate:prod"]
