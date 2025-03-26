Java.perform(function() {
  var libName = "libapp.so";
  var lib = Module.findBaseAddress(libName);

  if (lib) {
    console.log("[+] Found " + libName + " at " + lib);

    var exports = Module.enumerateExports(libName);
    exports.forEach(function(exp) {
      console.log(
        "[EXPORT] " + exp.type + " " + exp.name + " at " + exp.address
      );
    });

    var symbols = Module.enumerateSymbols(libName);
    symbols.forEach(function(sym) {
      console.log("[SYMBOL] " + sym.name + " at " + sym.address);
    });
  } else {
    console.log("[-] Library not found");
  }
});
