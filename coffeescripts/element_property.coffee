class Prop
    constructor: (@prop_name, @value) ->
    getPropName: () -> @prop_name
    getProp: () ->
        ret = {}
        ret[@getPropName()] = @getValue()
        ret
    getValue : () -> @value
    toCss: () ->
        @getPropName()  + ":" +@getValue() + ";"

class ElmStyleProp extends Prop
    constructor: (@elm, @prop_name, @getfn) ->
    getValue : () -> @getfn($(@elm))

class ElmTransProp extends ElmStyleProp
    toCss: () ->
        @getPropName() + "(" + @getValue() + ")"

# for transform property
class TransFormProp extends Prop
    constructor: (@prop_name, @props) ->
    getValue: () ->
        propvalues = (prop.toCss() for prop in @props)
        propvalues.join(" ")

exports?.Prop = Prop
exports?.ElmTransProp = ElmTransProp
exports?.ElmStyleProp = ElmStyleProp
exports?.TransFormProp = TransFormProp


