(function() {

  this.CssUtil = (function() {

    function CssUtil() {}

    CssUtil.prototype.putCSSRule = function(id, style_text) {
      return document.getElementById(id).innerHTML = style_text;
    };

    CssUtil.prototype.deleteRule = function(id) {
      return this.putCSSRule(id, "");
    };

    CssUtil.prototype.makeStyleRule = function(selector, props) {
      var temp;
      temp = _.template("{{selector}} { \n    {{style}} \n}\n");
      return temp({
        selector: selector,
        style: props
      });
    };

    return CssUtil;

  })();

}).call(this);
