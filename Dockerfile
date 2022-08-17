FROM node
LABEL authors="Poketube"

# update dependencies and install curl
RUN apt-get update && apt-get upgrade -y && \
    apt-get install curl -y && \
    rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# COPY package*.json ./ \
#     ./source ./

# This will copy everything from the source path 
# --more of a convenience when testing locally.
COPY . .

# update each dependency in package.json to the latest version
RUN npm update --save

# If you are building your code for production
# npm ci will install dependecies from package-lock.json
RUN npm ci --only=production

EXPOSE 30002

CMD [ "node", "server.js" ]
