const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const { create } = require('express-handlebars');
const User = require('./models/User');
require('dotenv').config()
require('./database/db')

const app = express()

app.use(
    session({
        secret: 'my backend',
        resave: false,
        saveUninitialized: false,
        name: 'secret-name-yes-yes-yes'
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
app.use("/", require('./routes/home'))
app.use("/auth", require('./routes/auth'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log("servidor corriendo en el puerto " + PORT))