FROM node:8

VOLUME /var/www/node

# COPY . /var/www/node
WORKDIR /var/www/node

ENV NODE_ENV production
ENV PORT 3200

# RUN npm install

CMD ["node", "bin/www"]

EXPOSE 3200
