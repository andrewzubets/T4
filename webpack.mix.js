let mix = require('laravel-mix');
const {join} = require("node:path");
mix.alias({
    '@bs': join(__dirname, 'node_modules/bootstrap/scss')
});

const suffix = process.env.NODE_ENV === 'production' ? '.min': '';
mix.sass('resources/scss/app.scss', 'app/public/css/app' + suffix + '.css');
mix.js('resources/reactjs/app.jsx', 'app/public/js/app' + suffix + '.js').react();
