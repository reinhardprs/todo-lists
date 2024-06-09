import express from 'express';
import Product from './models/product.js';
import User from './models/user.js';
import Admin from './models/admin.js';
import user_controller from './controllers/user.js'
import session from 'express-session';

User.sync()
Product.sync()
Admin.sync()

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'ini adalah kode secret###',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

app.set('view engine', 'ejs');
app.get("/login", user_controller.login);
app.get("/logout", user_controller.logout);
app.post("/login", user_controller.auth);

const isAuthenticated = (req, res, next) => {
    if (req.session.user || req.session.admin) {
        return next();
    } else {
        res.redirect('/');
    }
};

const isUser = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.send('No Access');
    }
};

const isAdmin = (req, res, next) => {
    if (req.session.admin) {
        return next();
    } else {
        res.send('No Access');
    }
};


app.get('/', (req, res) => {
    res.render('home');
}
)
app.get('/daftar', (req, res) => {
    res.render('register');
}
)
app.get('/home', isAuthenticated, isUser,(req, res) => {
    Product.findAll().then((results) => {
        res.render('index', { products: results, user: req.session.user || "" });
    });
})

app.get('/admin/index', isAuthenticated, isAdmin, (req, res) => {
    User.findAll().then((results) => {
        res.render('admin/index', { users: results || '', user: req.session.user || '', admin: req.session.admin || "" });
    });
})

app.get('/create', isAuthenticated, isUser, (req, res) => {
    res.render('create');
})

app.get('/edit/:id', isAuthenticated, isUser, (req, res) => {
    Product.findOne({ where: { id: req.params.id } }
    ).then((results) => {
        res.render('edit', { product: results });
    })
})

app.post('/api/users',  (req, res) => {
    console.log(req.body.no_telepon);
    User.create({ username: req.body.name, password: req.body.password, no_telepon: req.body.no_telepon }
    ).then((results) => {
        res.json({ status: 200, error: null, Response: results });
    }).catch(err => {
        res.json({ status: 502, error: err });
    })
})

app.post('/api/products',  (req, res) => {
    Product.create({ todo: req.body.name, deadline: req.body.price }
    ).then((results) => {
        res.json({ status: 200, error: null, Response: results });
    }).catch(err => {
        res.json({ status: 502, error: err });
    })
})

app.put('/api/product/:id', (req, res) => {
    Product.update({ todo: req.body.name, deadline: req.body.price },
        { where: { id: req.params.id } }
    ).then((results) => {
        res.json({ status: 200, error: null, Response: results });
    }).catch(err => {
        res.json({ status: 502, error: err });
    })
})

app.delete('/api/product/:id', (req, res) => {
    Product.destroy({ where: { id: req.params.id } }
    ).then(() => {
        res.json({ status: 200, error: null, Response: results });
    }).catch(err => {
        res.json({ status: 500, error: err, Response: {} });
    })
})

app.listen(port, () => {
    console.log(`Server Running`);
})