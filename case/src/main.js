const urlParams = new URLSearchParams(window.location.search);
const refererValue = urlParams.get("referer") || "未定义来源";

var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?b75c308fa828895bc8ccbb85d8cd5868";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();

_hmt.push(["_trackEvent", "zzq", "referer", refererValue, 1]);
