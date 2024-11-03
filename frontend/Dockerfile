FROM node:alpine

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g @angular/cli

RUN npm install

CMD ["ng", "serve", "--host", "0.0.0.0"]


# # Step 1: Use a Node.js image to build the Angular app
# FROM node:16 AS build

# # Set the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json to install dependencies
# COPY package*.json ./
# RUN npm install

# # Copy the rest of the application source code
# COPY . .

# # Build the Angular application
# RUN npm run build --prod

# # Step 2: Use an Nginx image to serve the built app
# FROM nginx:alpine

# # Copy the Angular build output to Nginx's html directory
# COPY --from=build /app/dist/frontend /usr/share/nginx/html

# # Expose port 80 to serve the app
# EXPOSE 80

# # Start Nginx server
# CMD ["nginx", "-g", "daemon off;"]
