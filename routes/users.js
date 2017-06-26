var express = require('express');
var router = express.Router();
var config = require('../config.json');

/* GET users listing. */
router.get('/', function (req, res, next) {
    if (req.query.token != config.token) {
        return res.redirect('/');
    }
    req.getConnection(function (err, conn) {
        if (err) return next(err);
        conn.query('select * from users', [], function (err, result) {
            if (err) return next(err);
            res.render('users', {
                title: "评分",
                users: result
            });
        })
    });
});

router.get('/voters', function (req, res, next) {
    if (req.query.token != config.token) {
        return res.json({
            error: 302,
            message: "无权访问"
        });
    }
    req.getConnection(function (err, conn) {
        if (err) return next(err);
        conn.query('select *, date_format(`updated_at`,"%m-%d %H:%m:%S") as updated_at from tokens where status = 1', [], function (err, result) {
            if (err) return next(err);
            res.json({
                error: 0,
                voters: result
            });
        })
    });
});

router.get('/start', function (req, res, next) {
    if (req.query.token != config.token) {
        return res.json({
            error: 302,
            message: "无权访问"
        });
    }
    req.getConnection(function (err, conn) {
        if (err) return next(err);
        conn.query('update users set status = 1 where id = ?', [req.query.uid], function (err, result) {
            if (err) return next(err);
            res.json({
                error: 0,
                message: '开始投票吧'
            });
        })
    });
});

router.get('/vote', function (req, res, next) {
    if (!req.session.token || req.session.token != req.query.token) {
        return res.redirect('/');
    }
    req.getConnection(function (err, conn) {
        if (err) return next(err);
        conn.query('select * from users', [], function (err, result) {
            if (err) return next(err);
            res.render('vote', {
                title: "评分",
                users: result,
                message: req.flash('message', '')
            });
        })
    });
});

router.post('/vote', function (req, res, next) {
    if (!req.session.token || req.session.token != req.body.token) {
        return res.json({
            error: 302,
            message: "无权访问"
        });
    }
    req.getConnection(function (err, conn) {
        if (err) return next(err);
        conn.query('select * from users where id = ? and status = 1', [req.body.uid], function (err, result) {
            if (err) return next(err);
            if (result.length > 0) {
                conn.query('select * from user_votes where token = ? and user_id = ?', [req.body.token, req.body.uid], function (err, ret) {
                    if (err) return next(err);
                    if (ret.length > 0) {
                        res.json({
                            error: 1,
                            message: "您已对该用户打分"
                        });
                    } else {
                        conn.query('insert into user_votes (token, user_id, score) values (?, ?, ?)', [req.body.token, req.body.uid, req.body.score], function (err, insert) {
                            if (err) return next(err);
                            res.json({
                                error: 0,
                                message: "打分成功"
                            });
                        });
                    }
                });
            } else {
                res.json({
                    error: 1,
                    message: "该用户的投票还未开始"
                });
            }
        });
    });
});

module.exports = router;