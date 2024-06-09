import User from '../models/user.js';
import Admin from '../models/admin.js';
const login = (req, res, next) => {
    let msg = req.session.err || "";
    req.session.err = "";
    res.render('login', { user: req.session.user || "", message: msg })
}
const logout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/login')
}
const auth = (req, res, next) => {
    const data = {
        username: req.body.username,
        password: req.body.password,
    };
    req.session.err = "";
    User.findOne({ where: { username: data.username, password: data.password } }).then(userResult => {
        if (userResult) {
            req.session.user = userResult;
            return res.redirect('/home');
        }

        Admin.findOne({ where: { username: data.username, password: data.password } }).then(adminResult => {
            if (adminResult) {
                req.session.admin = adminResult;
                return res.redirect('/admin/index')
            }
            req.session.err = 'Username atau password salah.';
            res.redirect('/login');
        }).catch(err => {
            req.session.err = err;
            res.redirect('/login');
        });
    }).catch(err => {
        req.session.err = err;
        res.redirect('/login');
    });
}
export default { login, logout, auth };