const express = require('express');
const session = require('express-session') // middleware maker
const sessionStore = require('connect-session-knex')(session)

const projectRouter = require("./data/projectRouter");

const server = express();

server.use(express.json());
server.use(session({
    name: 'testcookie', // the cookie is encrypted
    secret: 'this should come from process.env',
    cookie: {
        maxAge: 1000 * 60,
        secure: false, // in production set to true (https is a must)
        httpOnly: true // this means the JS on the page cannot read the cookie
    },
    resave: false,
    saveUninitialized: false, // we don't want to persist the session 'by default'
    store: new sessionStore ({
        knex: require('./data/db-config.js'),
        tablename: 'sessions',
        sessionidfieldname: 'sid', //session id field name (column name for storing sessions)
        createTable: true,
        clearInterval: 1000 * 60 * 60 //time in which all sessions will be purged from the table
    })
}));

server.use("/api/users", projectRouter);
module.exports = server;
