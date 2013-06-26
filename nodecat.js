var fs = require('fs');
var dtp = require('dtrace-provider').createDTraceProvider('nodecat');

dtp.addProbe('fs-read-start', 'char *');
dtp.addProbe('fs-read-done', 'char *', 'char *', 'int');

function readFile(file) {
    dtp.fire('fs-read-start', function () {
        return [file]
    });
    fs.readFile(file, 'utf8', function (e, data) {
        dtp.fire('fs-read-done', function () {
            return [file, e && e.code ? e.code : null, data ? data.length : 0];
        });
        if (e)
            throw e;
        process.stdout.write(data);
    });
}

dtp.enable();
process.argv.slice(2).forEach(function (f) {
    return readFile(f);
});
          