var express = require('express');
var router = express.Router();
var pool = require('../../config/mysql');

router.get('/:id', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        connection.query('call get_request_by_id(?);', [req.param('id')],
            function (err, rows) {
                if (err) {
                    connection.rollback(function () {
                        connection.release();
                        err.status = 400;
                        next(err);
                    });
                }
                else {
                    connection.commit();
                    connection.release();
                    res.status = 200;
                    res.send();
                }
            });
    });
});

module.exports = router;