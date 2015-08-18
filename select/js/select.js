;(function ($) {
    //模拟下拉框插件
    //定义下拉框的构造函数
    var Select = function (element, opt) {
        this.$element = element;
        this.defaults = {
            //隐藏表单的名称
            inputName: "select", 
            //下拉框的宽度
            width:"" ,
            height:"",
            //默认选中项
            defaultItem: "",
            //选中后回调函数
            callback: function(){}
        };
        this.settings = $.extend({}, this.defaults, opt);
        this.settings.curItem = this.settings.defaultItem;
        this.settings.template = '<div class="select-box"><div class="select-top"><span class="select-left"></span><span class="select-right"></span></div><div class="select-bottom"></div></div>';
    };

    Select.prototype = {
        init: function () {
            var _this = this;
            var options = this.$element.find("ul:eq(0)");
            if(options.length == 0){
                return false;
            }
            this.settings.options = options;
            this.$element.append(this.settings.template);
            this.appendList().createInput().changeValue().toggleSelList().keyboard();
            $(document).on("click", function(){
                if(_this.$element.hasClass("open")){                
                    _this.closeSelect(_this.$element);
                }
            });
            
            return this;
        },
        setPosition: function(){
            this.$element.find(".select-top").css({"height": this.settings.height+"px","line-height": this.settings.height+"px"});
            this.$element.find(".select-left").css({"width": this.settings.width+"px"});
            var top = this.$element.find(".select-top").outerHeight();
            this.$element.find(".select-bottom").css({"top": top});
            return this;
        },
        appendList: function(){
            var _this = this;
            if(this.settings.options){
                this.$element.find(".select-bottom").append(this.settings.options);
                //文字显示区域
                this.settings.showText = this.$element.find(".select-left");
                //列表内容区域
                this.settings.selList = this.$element.find(".select-bottom");
                
                _this.setPosition();
            }
            return this;
        },
        createInput: function(){
            var inputName = this.settings.inputName;
            var hideInput = $('<input name="'+inputName+'" type="hidden">');
            this.settings.hideInput = hideInput;
            hideInput.appendTo(this.$element[0]);
            //设置当前项
            this.setCurItem();
            return this;
        },
        setCurItem: function(){
            //设置当前项(如果当前项为空，默认选择第一项,如果不为空，选择data-value值为curitem选项)
            if(this.settings.curItem == ""){
                this.settings.curItem = this.settings.selList.find("li").eq(0);
            }else{
                this.settings.curItem = this.settings.selList.find("li[data-value='"+this.settings.curItem+"']");
            }
            return this;
        },
        changeValue: function(){
            var _this = this;
            _this.settings.curItem.addClass('selected').siblings().removeClass();
            var v = _this.settings.curItem.attr('data-value'),s = _this.settings.curItem.text();
            _this.settings.showText.text(s); 
            _this.settings.hideInput.val(v);
            return this;
        },
        toggleSelList: function(){
            var _this = this;
            this.$element.on("click",function(e){
                if(_this.$element.hasClass("open")){
                    _this.closeSelect($(this));
                }else{
                    $(this).addClass("open");
                    _this.settings.selList.show();
                }
                var src = e.target;
                if(src.tagName.toLowerCase() == "li"){
                    _this.settings.curItem = $(src);
                    _this.changeValue();
                    var v = _this.settings.curItem.attr("data-value");
                    //选中后回调函数
                    if(_this.settings.callback && _this.settings.callback instanceof Function){
                        _this.settings.callback(v);
                    }
                }
                e.stopPropagation();
            });
            this.$element.on("mouseleave",function(){
                _this.closeSelect($(this));
            });
            return this;
        },
        closeSelect : function(obj){
            this.settings.selList.hide();
            obj.removeClass('open');
            return this;
        },
        keyboard : function(){       //注册键盘事件
            var _this = this;
            $('body').on('keydown',function(e){    //这块要用body，不然不兼容ie7,8
                switch(e.keyCode) {
                    case 38:                          
                        _this.prevItem();
                        break;

                    case 40:
                        _this.nextItem();
                        break;                           
                    default:
                    return;
                }
            });
        },
        prevItem :function(){
            var _this = this;
            if(_this.$element.hasClass('open')){
                if(_this.settings.curItem.prev().length > 0){
                    _this.settings.curItem = _this.settings.curItem.prev();
                    _this.changeValue();
                }
            }
            return this;

        },
        nextItem :function(){
            var _this = this;
            if(_this.$element.hasClass('open')){
                if(_this.settings.curItem.next().length > 0){
                    _this.settings.curItem = _this.settings.curItem.next();
                    _this.changeValue();
                }
            }
            return this;
        }
    };

    //插件中使用Select对象
    $.fn.select = function (options) {
        if($(this).length==0) return false;
        var selectObj = new Select(this, options);
        selectObj.init();
    };
})(jQuery);
