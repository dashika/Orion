var express = require('express');
var router = express.Router();
var pool = require('../../config/mysql');

router.get('/:id/delete', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        connection.query('call delete_req(?);', [req.param('id')],
            function (err, rows) {
                if (err) {
                    connection.rollback(function () {
                        connection.release();
                        err.status = 500;
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