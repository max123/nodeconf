    var d = require('dtrace-provider');

    var dtp = d.createDTraceProvider("nodeapp");
    var p1 = dtp.addProbe("probe1", "int", "int");
    var p2 = dtp.addProbe("probe2", "char *");
    dtp.enable();           

    dtp.fire("probe1", function(p) {
        return [1, 2];
    });
    dtp.fire("probe2", function(p) { 
        return ["hello, dtrace via provider", "foo"];
    });

    p1.fire(function(p) {
      return [1, 2, 3, 4, 5, 6];
    });
    p2.fire(function(p) {
      return ["hello, dtrace via probe", "foo"];
    });
