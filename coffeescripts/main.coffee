Prop           = exports.Prop
ElmTransProp   = exports.ElmTransProp
ElmStyleProp   = exports.ElmStyleProp
TransFormProp  = exports.TransFormProp

_.templateSettings = { interpolate: /\{\{(.+?)\}\}/g }

class PropFactory
    timing:     (selector) -> new ElmStyleProp(selector, "transition-timing-function", @getVal, @setVal),
    delay:      (selector) -> new ElmStyleProp(selector, "transition-delay", @getVal, @setVal),
    duration:   (selector) -> new ElmStyleProp(selector, "transition-duration", @getVal, @setVal),
    origin :    (selector) -> new ElmStyleProp(selector, "transform-origin", @getSelectData, @setSelectData),

    translate : (selector) -> new ElmTransProp(selector, "translate", @getSelectData, @setSelectData),
    rotate :    (selector) -> new ElmTransProp(selector, "rotate", @getVal, @setVal),
    scale :     (selector) -> new ElmTransProp(selector, "scale", @getVal, @setVal)

    getSelectData   : (elm) -> elm.find('.ui-selected').first().attr("data")
    setSelectData   : (elm, val) ->
            elm.find(".ui-selected").removeClass("ui-selected")
            data_selector = 'li[data="' + val + '"]'
            elm.find(data_selector).addClass("ui-selected")
    getVal          : (elm) -> elm.val()
    setVal          : (elm, val) -> elm.val(val)

PropFactory::func_prop_map = {
    "transition-timing-function" :    "timing",
    "transition-delay"           :    "delay",
    "transition-duration"        :    "duration",
    "transform-origin"           :    "origin",
    "translate"                  :    "translate",
    "rotate"                     :    "rotate",
    "scale"                      :    "scale"
    }

PropFactory::createFromDataObj = (obj, factory) ->
    factory[PropFactory::func_prop_map[obj.prop]](obj.selector)

class @TransitionSet
    constructor: (props) ->
        @transition_prop = props.transition_prop
        @anim_trans = props.anim_trans
        @option = props.option
    toDataObj : () ->
        ret = {}
        ret.anim_trans = (e.toDataObj() for e in @anim_trans)
        ret.option = (e.toDataObj() for e in @option)
        ret.transition_prop = (e.toDataObj() for e in @transition_prop)
        ret

@TransitionSet::restore = (obj) ->
    _(obj).each (v, k) ->
        for propdata in v
            do (propdata) ->
                if propdata.selector
                    PropFactory::createFromDataObj(propdata, pfc).setValue(propdata.val)

class ApplicationData
    getTransDataJson :()->
        JSON.stringify({
            in_trans_prop: in_trans_prop.toDataObj(),
            current_trans_prop: current_trans_prop.toDataObj(),
            out_trans_prop: out_trans_prop.toDataObj()
        })
    loadTransDataJson: (json) ->
        obj = JSON.parse(json)
        _(obj).each (v, k) ->
                @TransitionSet::restore(v)

exports.appData = new ApplicationData()

pfc = new PropFactory

in_trans_prop = new TransitionSet({
    transition_prop:[
            pfc.origin("#in-origin-table"),
            new Prop("transition-duration", "0s")
        ],
        anim_trans:[
            pfc.translate("#in-translate"),
            pfc.rotate("#in-rotate"),
            pfc.scale("#in-scale")
    ], option:[new Prop("opacity", "0"),
               new Prop("z-index", "1000")]})

current_trans_prop = new TransitionSet({
    transition_prop:[
            pfc.timing("#in-transition-timing-function"),
            pfc.duration("#in-transition-duration"),
            pfc.delay("#in-transition-delay")
    ],
    anim_trans:[],
    option:[new Prop("z-index", "1000")]})

out_trans_prop =new TransitionSet(
    { transition_prop:[
            pfc.origin("#out-origin-table"),
            pfc.timing("#out-transition-timing-function"),
            pfc.duration("#out-transition-duration"),
            pfc.delay("#out-transition-delay")
        ],
        anim_trans:[
            pfc.translate("#out-translate"),
            pfc.rotate("#out-rotate"),
            pfc.scale("#out-scale"),
    ], option:[new Prop("opacity", "0"),
               new Prop("z-index", "1000")]})

vendor_prefixs = ["-webkit-", "-moz-", "-o-"]
getTransProp = (prop) ->
    vender_props = []
    _(prop.transition_prop).each (e) -> vender_props.push(e)
    if prop.anim_trans.length > 0
        vender_props.push(new TransFormProp("transform", prop.anim_trans))
    css_props = []
    _(vendor_prefixs).each (prefix) ->
        _(vender_props).each (e) ->
             css_props.push(prefix + e.toCss())
    _(prop.option).each (e) ->
        css_props.push(e.toCss())
    css_props

getStyle = (prop) ->
    getTransProp(prop).join("\n    ")

origin_position_persent = [-50, 0 ,  50, 100, 150]
position_persent        = [-200,-100, 0, 100, 200 ]

makeCombination = (array, fn) ->
    ret = _.map(array, (e) ->
        _.map array, (e2) ->
            fn(e2, e)
        )
    _.flatten ret

SelectMovePositions = makeCombination(position_persent, (e2, e) ->
         e2 + "%, " + e + "%"
    )
SelectOriginPositions = makeCombination(origin_position_persent, (e2, e) ->
         e2 + "% " + e + "%"
    )

make = (text, background) -> {
    text:text,
    background:background
}

anim_elm_data = [
    make("1", "#FFAEAE"),
    make("2", "#FFF0AA"),
    make("3", "#B0E57C"),
    make("4", "#B4D8E7")
]

generateSelectItem = ->
 base = $("#select-animation")
 temp = _.template(
            '<li style="background:{{background}}" value="anim{{index}}">
               <div value="anim{{index}}">{{text}}</div>
            </li>')
 index = 0
 _(anim_elm_data).each (e) ->
    index  += 1
    base.append temp(_.extend(e, {index:index}))

generateTransitionItem = ->
 base = $(".transition-space")
 temp = _.template(
        '<div id="anim{{index}}" class="transition-wrap" >
             <div class="transition-item"  style="background:{{background}}">
                     <div><p>{{text}}</p></div>
              </div>
         </div>')
 index = 0
 _(anim_elm_data).each (e) ->
    index  += 1
    base.append temp(_.extend(e, {index:index}))

setSelectUi = () ->
  generateTransitionItem()
  generateSelectItem()

  _.each SelectOriginPositions, (e) ->
    templi = _.template('<li class="ui-widget-content" data="{{val}}"></li>')
    $(".select-origin").append templi(val: e)

  _.each SelectMovePositions, (e) ->
    templi = _.template('<li class="ui-widget-content" data="{{val}}"></li>')
    $(".select-translate").append templi(val: e)

  $(".selectable-wrap").selectable()
  $(".transition-space-wrap").resizable({handles:"se", aspectRatio:true})

  rotate_range = _.map(_.range(-360, 361), (e) -> e )
  scale_range = _.map(_.range(0, 30), (e) -> 0.1 * e )
  _.each(_.range(1,10), (e) -> scale_range.push(e * 5))
  _.each(_.range(5,10), (e) -> scale_range.push(e * 10))

  _.each rotate_range, (e) ->
    temp = _.template('<option value="{{val +"deg"}}"> {{val}}</option>')
    $(".select-rotate").append temp(val: e)

  _.each scale_range, (elm) ->
    e = Math.round(elm * 10)/10
    temp = _.template('<option value="{{val}}""> {{name}}</option>')
    $(".scale-select").append temp(name: e, val: (e + ", " + e))
    $(".select-duration").append temp (name: e + "s", val: e + "s" )
    $(".select-delay").append temp (name: e + "s", val: e + "s" )

  _.each easing_table , (v, k) ->
    temp = _.template("<option value=\"{{v}}\" name=\"{{k}}\"> {{k}}</option>")
    $(".select-timing").append temp({k:k, v:v})

  $(".select-duration").val("1s")
  $(".select-delay").val("0s")
  $(".select-rotate").val("0deg")
  $(".scale-select").val("1, 1")
  $("#fade").val("on")
  _([".select-translate",
     ".select-origin"]).each (selector) ->
        _($(selector)).each (e) ->
            $($(e).children()[12]).addClass("ui-selected")

selected_anim_id = undefined

setSampleDataUi = () ->
    select = $("#select-sample")
    templi = _.template("<li><a href='#' data='{{name}}'>{{name}}</a></li>")
    for name, json of exports.sampleData
        select.append(templi({name:name}))

    $("#select-sample a").click((e) ->
        e.preventDefault()
        key = $(this).attr("data")
        loadSampleData(key)
    )

loadSampleData = (key) ->
    exports.appData.loadTransDataJson(exports.sampleData[key])
    makeStyle()
    applyStyle()
    selectItem("#anim1")

makeStyle = () ->
    css = new CssUtil()
    selector = (e) -> ".transition-space " + e + " .transition-item"
    in_style = css.makeStyleRule(selector(".in"), getStyle(in_trans_prop))
    out_style = css.makeStyleRule(selector(".out"), getStyle(out_trans_prop))
    current_style = css.makeStyleRule(selector(".current"), getStyle(current_trans_prop))
    $("#styleText").val(in_style + out_style + current_style)

applyStyle = () ->
    selected_anim_id = undefined
    $(".transition-wrap").removeClass("current").removeClass("out").addClass("in")
    css = new CssUtil()
    css.putCSSRule("animate-style", $("#styleText").val())

selectItem = (anim_id) ->
    if (selected_anim_id != undefined && selected_anim_id == anim_id)
       return
    if selected_anim_id
        $(".out").addClass("in")
        $(".out").removeClass("out")
        $(selected_anim_id).removeClass("current")
        $(selected_anim_id).addClass("out")
    setTimeout(->
        $(anim_id).removeClass("in")
        $(anim_id).addClass("current")
        selected_anim_id = anim_id
    , 1)

$(document).ready ->
  setSelectUi()
  setSampleDataUi()

  $("#select-animation li div").click (e) ->
    anim_id = "#" + $(this).attr("value")
    selectItem(anim_id)

  $("#makeButton").click (e) ->
    e.preventDefault();
    makeStyle()

  $("#applyButton").click (e) ->
    e.preventDefault();
    applyStyle()
    selectItem("#anim1")
  loadSampleData("crossFade")

#Copy From Move.js https://github.com/visionmedia/move.js
easing_table =
    'in':                'ease-in'
    'out':               'ease-out'
    'in-out':            'ease-in-out'
    'snap':              'cubic-bezier(0,1,.5,1)'
    'linear':            'cubic-bezier(0.250, 0.250, 0.750, 0.750)'
    'ease-in-quad':      'cubic-bezier(0.550, 0.085, 0.680, 0.530)'
    'ease-in-cubic':     'cubic-bezier(0.550, 0.055, 0.675, 0.190)'
    'ease-in-quart':     'cubic-bezier(0.895, 0.030, 0.685, 0.220)'
    'ease-in-quint':     'cubic-bezier(0.755, 0.050, 0.855, 0.060)'
    'ease-in-sine':      'cubic-bezier(0.470, 0.000, 0.745, 0.715)'
    'ease-in-expo':      'cubic-bezier(0.950, 0.050, 0.795, 0.035)'
    'ease-in-circ':      'cubic-bezier(0.600, 0.040, 0.980, 0.335)'
    'ease-in-back':      'cubic-bezier(0.600, -0.280, 0.735, 0.045)'
    'ease-out-quad':     'cubic-bezier(0.250, 0.460, 0.450, 0.940)'
    'ease-out-cubic':    'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
    'ease-out-quart':    'cubic-bezier(0.165, 0.840, 0.440, 1.000)'
    'ease-out-quint':    'cubic-bezier(0.230, 1.000, 0.320, 1.000)'
    'ease-out-sine':     'cubic-bezier(0.390, 0.575, 0.565, 1.000)'
    'ease-out-expo':     'cubic-bezier(0.190, 1.000, 0.220, 1.000)'
    'ease-out-circ':     'cubic-bezier(0.075, 0.820, 0.165, 1.000)'
    'ease-out-back':     'cubic-bezier(0.175, 0.885, 0.320, 1.275)'
    'ease-out-quad':     'cubic-bezier(0.455, 0.030, 0.515, 0.955)'
    'ease-out-cubic':    'cubic-bezier(0.645, 0.045, 0.355, 1.000)'
    'ease-in-out-quart': 'cubic-bezier(0.770, 0.000, 0.175, 1.000)'
    'ease-in-out-quint': 'cubic-bezier(0.860, 0.000, 0.070, 1.000)'
    'ease-in-out-sine':  'cubic-bezier(0.445, 0.050, 0.550, 0.950)'
    'ease-in-out-expo':  'cubic-bezier(1.000, 0.000, 0.000, 1.000)'
    'ease-in-out-circ':  'cubic-bezier(0.785, 0.135, 0.150, 0.860)'
    'ease-in-out-back':  'cubic-bezier(0.680, -0.550, 0.265, 1.550)' ;

