var ThemesEngine = /** @class */ (function () {
    function ThemesEngine() {
        var _this = this;
        this.liTemplate = "<li id='#id' class='list-group-item' data-checked='true' data-uri='#uri' data-color='success' onclick=\"javascript:record.applyThemeFilter('#uri2');\"><div class='row'><div class='col-sm-9'>#lable</div><div class='col-sm-3'><span class='badge badge-default badge-pill'>#count</span></div></div></li>";
        this.fetchThemes = function () {
            var webApiUrl = $("#WebApiBaseUrl").val() + "/GetThemes";
            _this.themeLookup = new Array();
            $.getJSON(webApiUrl, function (c) {
                var self = _this;
                for (var _i = 0, c_1 = c; _i < c_1.length; _i++) {
                    var item = c_1[_i];
                    self.themeLookup.push(item);
                }
                ;
                _this.themeLookup = self.themeLookup;
            })
                .fail(function (jqXmlHttpRequest, textStatus, errorThrown) {
                $("#warning").show();
                return false;
            })
                .then(function () {
                _this.executeRender(_this);
            });
            return false;
        };
        this.themes = new Array();
    }
    ThemesEngine.prototype.clearThemes = function () {
        this.themes.length = 0;
    };
    ThemesEngine.prototype.addThemes = function (theme) {
        var ret = false;
        if (theme) {
            if (theme.indexOf(";") > -1) {
                var themes = theme.split(";");
                for (var _i = 0, themes_1 = themes; _i < themes_1.length; _i++) {
                    var themeItem = themes_1[_i];
                    var uri = themeItem.trim();
                    if (this.addThemeToList(uri)) {
                        ret = true;
                    }
                }
                ;
            }
            else {
                var uri = theme.trim();
                ret = this.addThemeToList(uri);
            }
        }
        return ret;
    };
    ;
    ThemesEngine.prototype.addThemeToList = function (uri) {
        var ret = false;
        var themeLookupObj = this.themeLookup.filter(function (x) { return x.uri === uri; });
        if (themeLookupObj.length > 0) {
            var name_1 = themeLookupObj[0].theme;
            var category = themeLookupObj[0].category;
            ret = this.appendThemes(name_1, category, uri);
        }
        else {
            this.appendThemes("uncategorised", "uncategorised", uri);
        }
        return ret;
    };
    ThemesEngine.prototype.appendThemes = function (name, category, uri) {
        try {
            var themeObj = new Object;
            themeObj.uri = uri;
            themeObj.name = name;
            themeObj.category = category;
            themeObj.count = 1;
            themeObj.visible = true;
            if (!this.containsTheme(themeObj, this.themes)) {
                this.themes.push(themeObj);
            }
        }
        catch (ex) {
            this.applicationError = new ApplicationError();
            this.applicationError.setError(ex);
            return false;
        }
        return true;
    };
    ThemesEngine.prototype.containsTheme = function (obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].name === obj.name) {
                list[i].count++;
                return true;
            }
        }
        return false;
    };
    ThemesEngine.prototype.sortByName = function (val1, val2) {
        var val1Name = val1.name.toLowerCase();
        var val2Name = val2.name.toLowerCase();
        var val1Category = val1.category.toLowerCase();
        var val2Category = val1.category.toLowerCase();
        if (val1Category < val2Category) {
            return -1;
        }
        else if (val1Category > val2Category) {
            return 1;
        }
        else {
            return ((val1Name < val2Name) ? -1 : (val1Name > val2Name ? 1 : 0));
        }
    };
    ThemesEngine.prototype.renderTaskThemes = function () {
        var _this = this;
        var dataSetList = $("#themes");
        var themesListElement = $("#tasks");
        dataSetList.empty();
        var themeDivSmall = $("#themes-small");
        themeDivSmall.empty();
        var themeSelect = $("<select/>");
        themeSelect.appendTo(themeDivSmall);
        var invalidThemes;
        this.themes.sort(this.sortByName);
        var taskThemes = this.themes.filter(function (x) { return x.category.toLowerCase() === "task"; });
        $.each(taskThemes, function (i) {
            var theme = taskThemes[i];
            var label = theme.name;
            if (_this.themes[i].name === "INVALID")
                label = "No Theme";
            var liElement = _this.liTemplate.replace("#uri", theme.uri)
                .replace("#uri2", theme.name);
            liElement = liElement.replace("#id", "theme_" + label);
            liElement = liElement.replace("#count", theme.count.toString());
            liElement = liElement.replace("#lable", label);
            themesListElement.append(liElement);
            //Mobile 
            var themeOption = $("<option/>");
            themeOption.attr("value", theme.uri);
            themeOption.text(label);
            themeOption.appendTo(themeSelect);
        });
    };
    ThemesEngine.prototype.renderGemetThemes = function () {
        var _this = this;
        var dataSetList = $("#themes");
        var themesListElement = $("#themes");
        dataSetList.empty();
        var themeDivSmall = $("#themes-small");
        var themeSelect = $("<select/>");
        themeSelect.appendTo(themeDivSmall);
        this.themes.sort(this.sortByName);
        var gemetThemes = this.themes.filter(function (x) { return x.category.toLowerCase() === "gemet"; });
        $.each(gemetThemes, function (i) {
            var theme = gemetThemes[i];
            var label = _this.themes[i].name;
            if (_this.themes[i].name === "INVALID")
                label = "No Theme";
            var liElement = _this.liTemplate.replace("#uri", theme.uri)
                .replace("#uri2", theme.name);
            liElement = liElement.replace("#id", "theme_" + label);
            liElement = liElement.replace("#count", theme.count.toString());
            liElement = liElement.replace("#lable", label);
            themesListElement.append(liElement);
            //Mobile 
            var themeOption = $("<option/>");
            themeOption.attr("value", theme.uri);
            themeOption.text(label);
            themeOption.appendTo(themeSelect);
        });
    };
    ThemesEngine.prototype.renderUncategorisedThemes = function (uncategorisedCount) {
        var themesListElement = $("#uncategorised");
        var liElement = this.liTemplate.replace("#uri", "uncategorised")
            .replace("#uri2", "uncategorised");
        liElement = liElement.replace("#id", "theme_" + "uncategorised");
        liElement = liElement.replace("#count", uncategorisedCount.toString());
        liElement = liElement.replace("#lable", "uncategorised");
        themesListElement.append(liElement);
    };
    ThemesEngine.prototype.getTheme = function (uri) {
        var theme = this.themes.find(function (x) { return x.uri === uri; });
        return theme;
    };
    ThemesEngine.prototype.toggleTheme = function (uri) {
        var _this = this;
        //const theme = this.themes.find(x => x.uri === uri);
        //theme.visible = !theme.visible;
        if ($(".panel-heading:contains(\"" + uri + "\")").parent().parent().parent().is(":visible")) {
            $(".panel-heading:contains(\"" + uri + "\")").parent().parent().parent().hide();
        }
        else {
            $(".panel-heading:contains(\"" + uri + "\")").parent().parent().parent().show();
        }
        $.each(this.themes, function (i) {
            if (_this.themes[i].name === uri) {
                _this.themes[i].visible = !_this.themes[i].visible;
            }
        });
    };
    ThemesEngine.prototype.getThemeUris = function () {
        var _this = this;
        var uriLIst = new Array();
        $.each(this.themes, function (i) {
            if (_this.themes[i].visible) {
                uriLIst.push(_this.themes[i].uri);
            }
        });
        return uriLIst;
    };
    ThemesEngine.prototype.setCount = function (name, count) {
        var themeItems = this.themes.filter(function (x) { return x.name === name; });
        if (themeItems.length > 0) {
            themeItems[0].count = count;
        }
    };
    return ThemesEngine;
}());
//# sourceMappingURL=ThemesEngine.js.map