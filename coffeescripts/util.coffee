class @CssUtil
    constructor: () ->
    putCSSRule : (id, style_text) ->
        document.getElementById(id).innerHTML = style_text

    deleteRule : (id) -> @putCSSRule(id, "")

    makeStyleRule : (selector, props) ->
        temp = _.template("{{selector}} { \n    {{style}} \n}\n")
        temp({ selector: selector , style: props})