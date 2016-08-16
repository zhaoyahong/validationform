var validationForm = function (form, formStruct, tipStruct) {
    this.form = form;
    this.formStruct = formStruct;
    this.tipStruct = (tipStruct == undefined ? new Object() : tipStruct);

    this.vaildateInput = function (elem, inputStruct, tips) {
        var val = elem.val();
        if (tips == undefined)
            tips = new Object();
        for (k in inputStruct) {
            var v = inputStruct[k];
            switch (k) {
                case 'noEmpty':
                    if (v == true && val.length == 0) {
                        var tip = tips['noEmpty'] || 'The field is required.';
                        showTooltip(elem, tip);
                        return false;
                    }
                    break;
                case 'minLength':
                    if (val.length < v) {
                        var tip = tips['minLength'] || 'The field must be at least %s characters in length.';
                        tip = sprintf(tip, v);
                        showTooltip(elem, tip);
                        return false;
                    }
                    break;
                case 'maxLength':
                    if (val.length > v) {
                        var tip = tips['maxLength'] || 'The field must not exceed %s characters in length.';
                        tip = sprintf(tip, v);
                        showTooltip(elem, tip);
                        return false;
                    }
                    break;
                case 'email':
                    var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
                    if (!reg.test(val)) {
                        var tip = tips['email'] || 'The field must contain a valid email address.'
                        showTooltip(elem, tip);
                        return false;
                    }
                    break;
                case 'equalTo':
                    if (val != this.form.find("input[name=" + v + "]").prop("value")) {
                        var tip = tips['equalTo'] || 'The two fileds are not euqal.'
                        showTooltip(elem, tip);
                        return false;
                    }
            }
        }
        return true;
    }
    this.vaildate = function () {
        var b = true;
        for (k in this.formStruct) {
            var elem = this.form.find("input[name=" + k + "]");
            var r = this.vaildateInput(elem, this.formStruct[k], this.tipStruct[k]);
            if (r) hideTooltip(elem);
            b = r && b;
        }
        return b;
    }
    this.listen = function () {
        if (arguments.length == 0)
            return;
        var ths = this;
        for (var i = 0; i < arguments.length; i++) {
            for (name in this.formStruct) {
                var elem = this.form.find("input[name=" + name + "]");
                elem.on(arguments[i], function () {
                    var n = $(this).attr('name');
                    if (ths.vaildateInput($(this), ths.formStruct[n], ths.tipStruct[n]))
                        hideTooltip($(this));
                });
            }
        }
    }

    function showTooltip(elem, txt) {
        elem.tooltip('destroy');
        elem.tooltip({ title: txt });
        elem.tooltip('show');
    }
    function hideTooltip(elem) {
        elem.tooltip('destroy');
    }
    function sprintf() {
        if (arguments.length == 0)
            return "";
        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            str = str.replace("%s", arguments[i]);
        }
        return str;
    }
}