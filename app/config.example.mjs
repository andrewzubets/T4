const dbConfig = {
    host: "localhost",
    user: "root",
    port: 3306,
    password: "",
    database: "db",
    namedPlaceholders: true,
}

const sessionConfig = {
    secret: '85cfse98c94d473c',
    saveUninitialized: false,
    resave: false,
    store: {
        db: 'sessions.sqlite',
        dir: 'D:\\www\\itransition\\task4\\T4\\app\\storage'
    }
}

const frontendConfig = {
    app_css: '/css/app.min.css',
    app_js: '/js/app.min.js',
}

export {
    dbConfig,
    sessionConfig,
    frontendConfig
}