const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')//config para heroku
const flash = require('connect-flash')
const passport = require('passport')
const mongoSanitize = require('express-mongo-sanitize');//config para heroku
const cors = require('cors')//config para heroku
const { create } = require('express-handlebars');
const csrf = require("csurf");


const User = require('./models/User');
require('dotenv').config()
//config para herokux
//require('./database/db') ya no porque esta config. para subir a heroku y se trae clientDB
const clientDB = require('./database/db')//config para herokux

//config para heroku
const app = express()
const corsOptions = {
    credentials: true,
    origin: process.env.PATHHEROKU || "*",
    methods: ['GET', 'POST']

}
app.use(cors()) //config para heroku

app.use(
    session({
        secret: process.env.SECRETSESSION,
        resave: false,
        saveUninitialized: false,
        name: 'session-user',
        store: MongoStore.create({   //config para heroku
            clientPromise: clientDB, //config para heroku
            dbName: process.env.DBNAME, //config para heroku  dbName: 'DBurls' se puede omitir
        }),
        cookie: {
            secure: process.env.MODO === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        },

    })
)
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

//preguntas
passport.serializeUser((user, done) =>
    done(null, { id: user._id, userName: user.userName })) //req.user
passport.deserializeUser(async (user, done) => {
    // es necesario revisar la base de datos
    const userBD = await User.findById(user.id)
    return done(null, { id: userBD._id, userName: userBD.userName })
})


const hbs = create({
    extname: ".hbs",
    partialsDir: ["views/components"],
});

//console.log('hola soy el backend');

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({ extended: true }))

app.use(csrf());
app.use(mongoSanitize());//config para herokux

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    res.locals.mensajes = req.flash("mensajes")
    next()

})

app.use("/", require('./routes/home'))
app.use("/auth", require('./routes/auth'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log("servidor corriendo en el puerto " + PORT))