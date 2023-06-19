###################
# BUILD FOR PRODUCTION
###################

FROM node:lts-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
COPY . .
RUN yarn

# Run the build command which creates the production bundle
COPY . .
RUN yarn build

# Passing in --only=production ensures that only the production dependencies are installed.
# This ensures that the node_modules directory is as optimized as possible.
COPY . .
RUN yarn --prod
RUN ls -la

###################
# PRODUCTION
###################

FROM node:lts-alpine

# Copy the bundled code from the build stage to the production image
COPY . .
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY . .
COPY --from=build /usr/src/app/dist ./dist


EXPOSE 3006
# Start the server using the production build
CMD ["node", "dist/src/main"]
