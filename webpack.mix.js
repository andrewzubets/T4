let mix = require('laravel-mix');
const {join} = require("node:path");
mix.alias({
    '@bs': join(__dirname, 'node_modules/bootstrap/scss'),
    '@bsjs': join(__dirname, 'node_modules/bootstrap/js')
});

const suffix = process.env.NODE_ENV === 'production' ? '.min': '';
mix.sass('resources/sass/app.scss', 'public/css/app' + suffix + '.css');
mix.js('resources/js/app.js', 'public/js/app' + suffix + '.js');
mix.js('resources/js/dashboard/app.jsx', 'public/js/dashboard' + suffix + '.js').react();