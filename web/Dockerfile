FROM node:20.5.1-alpine as builder

RUN mkdir -p /app/web/

WORKDIR /app/web

COPY package*.json ./

RUN npm install 

COPY . . 

RUN npm run build

FROM builder as production

WORKDIR /app/web/

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/web/.next ./.next
COPY --from=builder /app/web/node_modules ./node_modules
COPY --from=builder /app/web/public ./public

EXPOSE 3000

# run project on prod mode
CMD ["npm", "run", "start"]
