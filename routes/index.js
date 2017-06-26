var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.token) {
        return res.redirect('/users/vote?token=' + req.session.token);
    }
    res.render('index', {
        title: '欢迎进入',
        message: req.flash('message', '')
    });
});

router.post('/', function (req, res, next) {
    req.getConnection(function (err, conn) {
        if (err) return next(err);
        conn.query('select * from tokens where token = ? limit 1', [req.body.token], function (err, result) {
            if (err) return next(err);
            if (result.length > 0 && result[0].status == 0) {
                conn.query('update tokens set status = 1 where token = ?', [result[0].token], function (err, update) {
                    if (err) return next(err);
                    req.session.token = result[0].token;
                    res.redirect('/users/vote?token=' + result[0].token);
                });
            } else if (result.length > 0 && result[0].status == 1) {
                req.flash('message', '该Token已被使用');
                res.redirect('/');
            } else {
                req.flash('message', '该Token不存在');
                res.redirect('/');
            }
        });
    });
});

module.exports = router;