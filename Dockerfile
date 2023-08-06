FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN rm -rf node_modules
RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

ARG host
ARG symbol

ENV HOST ${host}
ENV SYMBOL ${symbol}

RUN echo $host
RUN echo $symbol

CMD node examples/SimpleChart.js ${SYMBOL} ${HOST}