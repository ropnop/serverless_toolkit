FROM mhart/alpine-node:latest
RUN apk add g++ make
RUN wget https://github.com/blechschmidt/massdns/archive/master.zip && unzip master.zip && rm master.zip
WORKDIR /massdns-master/
RUN make && make install

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
