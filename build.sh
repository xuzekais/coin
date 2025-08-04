rm -rf web/dist

rm -rf src/public/*

npm run build:web

cp -r web/dist/public/* src/public

cp -f web/dist/index.html view/

# npm run build:midway

