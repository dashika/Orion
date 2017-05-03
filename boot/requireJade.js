var jade = require('jade');

module.exports = function () {

    var requireJade = function (/*string*/ Path) {

        if (!arguments.callee.prototype.constructor.stack[Path]) {
            arguments.callee.prototype.constructor.stack[Path] = true;
            return jade.renderFile(Path);
        }

    };
    requireJade.stack = {};

    return requireJade;

};