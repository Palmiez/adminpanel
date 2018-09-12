var ApplicationError = /** @class */ (function () {
    function ApplicationError() {
    }
    Object.defineProperty(ApplicationError.prototype, "hasError", {
        get: function () { return this.errorMessage.length > 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationError.prototype, "message", {
        get: function () { return this.errorMessage; },
        enumerable: true,
        configurable: true
    });
    ApplicationError.prototype.setError = function (error) { this.errorMessage = error.message; };
    return ApplicationError;
}());
/// <reference path="./IGraphInfo.ts"/>
var GraphInfo = /** @class */ (function () {
    function GraphInfo(graphInfo) {
        if (graphInfo) {
            this.graphId = graphInfo.graphId;
            this.title = graphInfo.title;
            this.description = graphInfo.description;
            this.keyword = graphInfo.keyword;
            this.themeName = graphInfo.themeName;
            this.themeUri = graphInfo.themeUri;
            this.themeCategory = graphInfo.themeCategory;
            this.numberOfDistributions = graphInfo.numberOfDistributions;
            this.publisher = graphInfo.publisher;
            this.publishedDate = graphInfo.publishedDate;
            this.updatedDate = graphInfo.updatedDate;
        }
        this.PublishedDisplayDate = this.formatDate(this.publishedDate);
        this.UpdatedDisplayDate = this.formatDate(this.updatedDate);
    }
    GraphInfo.prototype.formatDate = function (dateVal) {
        var formattedDate;
        if (dateVal) {
            formattedDate = dateVal.substr(0, dateVal.indexOf("T"));
        }
        return formattedDate;
    };
    return GraphInfo;
}());
var GraphInfoEngine = /** @class */ (function () {
    function GraphInfoEngine(publisherEngine) {
        this.graphInfos = new Array();
        this.publisherEngine = publisherEngine;
    }
    GraphInfoEngine.prototype.fetchGraphInfos = function (executeFunc) {
        var _this = this;
        var webApiUrl = $("#WebApiBaseUrl").val() + "/GetGraphInfos";
        var ret = $.getJSON(webApiUrl, function (c) {
            _this.graphInfos = new Array();
            for (var _i = 0, c_1 = c; _i < c_1.length; _i++) {
                var item = c_1[_i];
                var graphInfo = item;
                var graphInfoObj = new GraphInfo(graphInfo);
                _this.graphInfos.push(graphInfoObj);
            }
            //executeFunc();
            return true;
        })
            .fail(function (jqXmlHttpRequest, textStatus, errorThrown) {
            $("#warning").show();
            return false;
        })
            .then(function () { return executeFunc(); });
        return ret;
    };
    ;
    GraphInfoEngine.prototype.applyTitleFilter = function (title) {
        var filterResult = this.graphInfos.filter(function (el) {
            if (el.title.indexOf(title) >= 0)
                return true;
            return false;
        });
        return filterResult;
    };
    GraphInfoEngine.prototype.applyKeywordFilter = function (keyword) {
        var filteredResult = this.graphInfos.filter(function (el) {
            var keywords = keyword.split(" ");
            for (var idx in keywords) {
                if (el.keyword.indexOf(keywords[idx]) >= 0)
                    return true;
            }
        });
        return filteredResult;
    };
    GraphInfoEngine.prototype.applyPublisherFilter = function (publisher) {
        publisher = publisher.trim();
        var filteredResult = this.graphInfos.filter(function (el) {
            if (publisher.indexOf(" ") > 0) {
                var publishers_1 = publisher.split(" ");
                var ret_1 = false;
                $.each(publishers_1, function (i) {
                    if (el.publisher === publishers_1[i]) {
                        ret_1 = true;
                        return true;
                    }
                    else {
                        //return false;
                    }
                });
                return ret_1;
            }
            else {
                if (el.publisher === publisher) {
                    return true;
                }
                return false;
            }
        });
        return filteredResult;
    };
    GraphInfoEngine.prototype.applyThemeFilter = function (themeFilter) {
        var filteredResult = this.graphInfos.filter(function (el) {
            if (el.themeUri === themeFilter) {
                return true;
            }
            else {
                var themes = el.themeUri.split(";");
                for (var idx in themes) {
                    if (themeFilter.trim() === themes[idx].trim())
                        return true;
                }
            }
            return false;
        });
        this.renderList(filteredResult);
        return filteredResult;
    };
    GraphInfoEngine.prototype.applySortFilter = function (sortFilterId) {
        var _this = this;
        var sortFilter = sortFilterId;
        if (sortFilter === 0) {
            this.graphInfos = this.graphInfos.sort((function (obj1, obj2) {
                return _this.compare(obj1.title, obj2.title);
            }));
        }
        else if (sortFilter === 1) {
            this.graphInfos = this.graphInfos.sort((function (obj1, obj2) {
                return _this.compare(obj1.publisher, obj2.publisher);
            }));
        }
        else if (sortFilter === 2) {
            this.graphInfos = this.graphInfos.sort((function (obj1, obj2) {
                return _this.compare(obj1.theme, obj2.theme);
            }));
        }
        else if (sortFilter === 3) {
            this.graphInfos = this.graphInfos.sort((function (obj1, obj2) {
                return _this.compare(obj1.PublishedDisplayDate, obj2.PublishedDisplayDate, true);
            }));
        }
        else if (sortFilter === 4) {
            this.graphInfos = this.graphInfos.sort((function (obj1, obj2) {
                return _this.compare(obj1.UpdatedDisplayDate, obj2.UpdatedDisplayDate, true);
            }));
        }
    };
    GraphInfoEngine.prototype.compare = function (val1, vals2, isReversed) {
        if (isReversed === void 0) { isReversed = false; }
        if (isReversed) {
            if (val1 > vals2)
                return -1;
            if (val1 < vals2)
                return 1;
        }
        else {
            if (val1 < vals2)
                return -1;
            if (val1 > vals2)
                return 1;
        }
        return 0;
    };
    ;
    GraphInfoEngine.prototype.renderListForThemes = function (themeUris) {
        var _this = this;
        var graphInfos = new Array();
        $.each(this.graphInfos, function (i) {
            var uri = _this.graphInfos[i].themeUri;
            if (uri) {
                if (uri.indexOf(";") > 0) {
                    var uris = uri.split(";");
                    $.each(uris, function (idx) {
                        var uriVal = uris[idx].trim();
                        if ($.inArray(uriVal, themeUris) > -1) {
                            graphInfos.push(_this.graphInfos[i]);
                        }
                    });
                }
                else if ($.inArray(uri, themeUris) > -1) {
                    graphInfos.push(_this.graphInfos[i]);
                }
            }
            else {
                _this.graphInfos[i].themeCategory = "uncategorised";
                _this.graphInfos[i].themeUri = "uncategorised";
                _this.graphInfos[i].themeName = "uncategorised";
                graphInfos.push(_this.graphInfos[i]);
            }
        });
        this.renderList(graphInfos);
    };
    GraphInfoEngine.prototype.renderList = function (list) {
        var _this = this;
        var dataSetList = $("#result");
        dataSetList.empty();
        $.each(list, function (i) {
            var card = $("<div/>")
                .addClass("col-lg-2 col-md-3 col-sm-6 box-element")
                .appendTo(dataSetList);
            var graphLink = $("<a/>")
                .addClass("list-group-item list-group-item-action flex-column align-items-start")
                .appendTo(card);
            var flexDiv = $("<div/>")
                .addClass("d-flex w-100 justify-content-between");
            graphLink.append(flexDiv);
            var h5Field = $("<h5/>")
                .addClass("mb-1")
                .text(list[i].title);
            flexDiv.append(h5Field);
            var uri = list[i].publisher;
            var publisherDisplayValObj = _this.publisherEngine.publishers.filter(function (x) { return x.uri === uri; });
            var publisherDisplayVal = "Unknown";
            if (publisherDisplayValObj.length > 0) {
                publisherDisplayVal = publisherDisplayValObj[0].name;
            }
            var smallField = $("<small/>")
                .addClass("text-muted")
                .text("Publisher: " + publisherDisplayVal);
            flexDiv.append(smallField);
            var pField = $("<p/>")
                .addClass("mb-1")
                .text(list[i].description);
            graphLink.append(pField);
            var pSmall = $("<small/>")
                .addClass("text-muted")
                .text(list[i].keyword);
            graphLink.append(pSmall);
            var pUpdated = $("<p/>")
                .addClass("text-muted")
                .text("Last Updated: " + list[i].UpdatedDisplayDate);
            graphLink.append(pUpdated);
            var pPublished = $("<p/>")
                .addClass("text-muted")
                .text("Published: " + list[i].PublishedDisplayDate);
            graphLink.append(pPublished);
        });
    };
    ;
    return GraphInfoEngine;
}());
var PublisherEngine = /** @class */ (function () {
    function PublisherEngine() {
        this.fetchPublishers();
    }
    PublisherEngine.prototype.fetchPublishers = function () {
        var _this = this;
        var webApiUrl = $("#WebApiBaseUrl").val() + "/GetPublishers";
        this.publishers = new Array();
        var ret = $.getJSON(webApiUrl, function (c) {
            for (var _i = 0, c_2 = c; _i < c_2.length; _i++) {
                var item = c_2[_i];
                _this.publishers.push(item);
            }
            ;
            return true;
        })
            .fail(function (jqXmlHttpRequest, textStatus, errorThrown) {
            $("#warning").show();
            return false;
        });
        return ret;
    };
    return PublisherEngine;
}());
var ThemesEngine = /** @class */ (function () {
    function ThemesEngine() {
        var _this = this;
        this.liTemplate = "<li id='#id' class='list-group-item' data-checked='true' data-uri='#uri' data-color='success' onclick=\"javascript:record.applyThemeFilter('#uri2');\"><div class='row'><div class='col-sm-9'>#lable</div><div class='col-sm-3'><span class='badge badge-default badge-pill'>#count</span></div></div></li>";
        this.fetchThemes = function () {
            var webApiUrl = $("#WebApiBaseUrl").val() + "/GetThemes";
            _this.themeLookup = new Array();
            $.getJSON(webApiUrl, function (c) {
                var self = _this;
                for (var _i = 0, c_3 = c; _i < c_3.length; _i++) {
                    var item = c_3[_i];
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
var DistributionEngine = /** @class */ (function () {
    function DistributionEngine() {
        var _this = this;
        this.optionTemplate = "<option value='#id'>#value</option>";
        this.fetchDistributions = function (id) {
            var webApiUrl = "/UpdateNotify/Distributions/" + id;
            _this.distributions = new Array();
            $.getJSON(webApiUrl, function (c) {
                var self = _this;
                for (var _i = 0, c_4 = c; _i < c_4.length; _i++) {
                    var item = c_4[_i];
                    self.distributions.push(item);
                }
                ;
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
        this.executeRender = this.renderDistributionSelectList;
    }
    DistributionEngine.prototype.clearDistributions = function () {
        this.distributions.length = 0;
    };
    DistributionEngine.prototype.renderDistributionSelectList = function (self) {
        var distElement = $("#distributions");
        distElement.empty();
        $.each(self.distributions, function (i) {
            var id = self.distributions[i].GraphItemId;
            var name = self.distributions[i].Title;
            if (name) {
                if (name.length === 0) {
                    name = id;
                }
            }
            else {
                name = id;
            }
            var optionElement = self.optionTemplate.replace("#id", id).replace("#value", name);
            distElement.append(optionElement);
        });
        distElement.selectpicker("refresh");
    };
    return DistributionEngine;
}());
/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="../typings/jquery/jquery.selectpicker.d.ts"/>
/// <reference path="./ISeWebData.ts"/>
/// <reference path="./ObjectConstructor.ts"/>
/// <reference path="./IDistribution.ts"/>
/// <reference path="./ITheme.ts"/>
/// <reference path="./IGraphInfo.ts"/>
/// <reference path="./GraphInfo.ts"/>
/// <reference path="./GraphInfoEngine.ts" />
/// <reference path="./PublisherEngine.ts" />
/// <reference path="./ThemesEngine.ts" />
/// <reference path="./IPublisher.ts" />
/// <reference path="./Array.ts" />
/// <reference path="./DistributionEngine.ts" />
var CreateRecord = /** @class */ (function () {
    function CreateRecord() {
        var _this = this;
        this.init = function () {
            //alert('Themes Initialised');
            // this.graphInfoEngine.executeRender - this.renderFilteredResult;        
        };
        this.renderFilteredResult = function () {
            var that = _this;
            if (that.publisherFilter) {
                if (that.publisherFilter.toLowerCase() !== "all") {
                    that.graphInfoEngine.graphInfos = that.graphInfoEngine.applyPublisherFilter(that.publisherFilter);
                }
            }
            if (that.keywordFilter) {
                that.graphInfoEngine.graphInfos = that.graphInfoEngine.applyKeywordFilter(that.keywordFilter);
            }
            if (that.sortFilter !== -1) {
                that.graphInfoEngine.applySortFilter(that.sortFilter);
            }
            that.themesEngine.clearThemes();
            var graphWithNoThemeCount = 0;
            var graphWithInvalidThemeCount = 0;
            for (var _i = 0, _a = that.graphInfoEngine.graphInfos; _i < _a.length; _i++) {
                var graphInfo = _a[_i];
                if (graphInfo.themeUri) {
                    if (!that.themesEngine.addThemes(graphInfo.themeUri)) {
                        graphWithInvalidThemeCount++;
                    }
                }
                else {
                    graphWithNoThemeCount++;
                }
            }
            that.themesEngine.setCount("INVALID", graphWithInvalidThemeCount);
            that.themesEngine.renderTaskThemes();
            that.themesEngine.renderGemetThemes();
            that.themesEngine.renderUncategorisedThemes(graphWithInvalidThemeCount + graphWithNoThemeCount);
            if (that.titleFilter) {
                var filteredList = that.graphInfoEngine.applyTitleFilter(that.titleFilter);
                that.graphInfoEngine.renderList(filteredList);
            }
            else {
                that.graphInfoEngine.renderList(that.graphInfoEngine.graphInfos);
            }
            applyCheckboxes("tasks");
            applyCheckboxes("themes");
            applyCheckboxes("uncategorised");
            applyCheckboxes("publishers");
        };
        this.themesEngine = new ThemesEngine();
        this.themesEngine.executeRender = this.init;
        this.themesEngine.fetchThemes();
        this.publisherEngine = new PublisherEngine();
        this.graphInfoEngine = new GraphInfoEngine(this.publisherEngine);
    }
    CreateRecord.prototype.fetchAllData = function (sortFilter, publisherFilter, keywordFilter, titleFilter, updatedFilter) {
        this.sortFilter = typeof (sortFilter) === "undefined" ? null : Number(sortFilter);
        this.publisherFilter = typeof (publisherFilter) === "undefined" || publisherFilter === ""
            ? null
            : publisherFilter;
        this.keywordFilter = typeof (keywordFilter) === "undefined" || keywordFilter === "" ? null : keywordFilter;
        this.titleFilter = typeof (titleFilter) === "undefined" || titleFilter === "" ? null : titleFilter;
        this.updatedFilter = typeof (updatedFilter) === "undefined" || updatedFilter === "" ? null : updatedFilter;
        var that = this;
        if (this.graphInfoEngine.fetchGraphInfos(this.renderFilteredResult)) {
        }
    };
    CreateRecord.prototype.applyThemeFilter = function (uri) {
        //const theme = this.themesEngine.getTheme(uri);
        //this.themesEngine.toggleTheme(uri);
        //const uriList = this.themesEngine.getThemeUris();
        //this.graphInfoEngine.renderListForThemes(uriList);
    };
    CreateRecord.prototype.dateToString = function (dateval) {
        var dateStr;
        if (dateval) {
            dateStr = dateval.day + "/" + dateval.month + "/" + dateval.year;
        }
        else {
            dateStr = null;
        }
        return dateStr;
    };
    CreateRecord.prototype.fetchInputData = function (id) {
        var _this = this;
        var webApiUrl = $("#WebApiBaseUrl").val() + "/" + id;
        $.getJSON(webApiUrl, function (c) {
            _this.seWebData = c;
            $("#DataStoreUri").val("http://data.sepa.org.uk/id/dataset/" + _this.seWebData.title);
            $("#Id").val(_this.seWebData.id);
            $("#GraphId").val(_this.seWebData.graphId);
            $("#Title").val(_this.seWebData.title);
            $("#Description").val(_this.seWebData.description);
            var modifiedDate = _this.dateToString(_this.seWebData.updatedDate);
            $("#LastModified").val(modifiedDate);
            var publishedDate = _this.dateToString(_this.seWebData.publishedDate);
            $("#LastModified").val(publishedDate);
            $("#Publisher").val(_this.seWebData.publisher);
            var orgId = _this.seWebData.orgId;
            $("#publisher option").each(function () {
                if ($(_this).attr("value") === orgId) {
                    $(_this).attr("selected", "selected");
                }
            });
            var keywordSelect = $("#keywords");
            keywordSelect.empty();
            var keywords = _this.seWebData.searchTags;
            $.each(keywords, function (val, text) {
                keywordSelect.append($("<option selected></option>").val(text).html(text));
            });
            keywordSelect.selectpicker("refresh");
            var themeSelect = $("#themes");
            themeSelect.empty();
            var themes = _this.seWebData.theme;
            $.each(themes, function (val, text) {
                themeSelect.append($("<option selected></option>").val(text).html(text));
            });
            themeSelect.selectpicker("refresh");
            $("#GraphItemId").val(_this.seWebData.distributionId);
            $("#Legend").val(_this.seWebData.legendUrl);
            $("#MapLayer").val(_this.seWebData.serviceLayer);
            $("#AccessUrl").val(_this.seWebData.accessUrl);
            $("#MediaType").val(_this.seWebData.mediaType);
            $("#serviceLayer").val(_this.seWebData.serviceLayer);
            $("#Ssdi").val(_this.seWebData.ssdiId);
            $("#SsdiXml").val(_this.seWebData.ssdiIdXml);
            $("#MaxScale").val(_this.seWebData.maxScale);
            $("#MinScale").val(_this.seWebData.minScale);
            var identityFieldsSelect = $("#identityFields");
            var identityFields = _this.seWebData.fieldNames;
            $.each(identityFields, function (val, alias) {
                identityFieldsSelect.append($("<option selected></option>").val(val + "-" + alias)
                    .html(alias));
            });
            identityFieldsSelect.selectpicker("refresh");
            $("#Keywords").val();
            $("Themes").val(_this.seWebData.theme);
            $("#IdentityFields").val(Object.keys(_this.seWebData.fieldNames));
            $("#RecordTitle").html("<strong>" + _this.seWebData.title + "</strong>");
            return false;
        })
            .fail(function (jqXmlHttpRequest, textStatus, errorThrown) {
            $("#warning").show();
            return false;
        });
        return false;
    };
    return CreateRecord;
}());
;
function applyCheckboxes(listId) {
    $("#" + listId + " li").each(function () {
        // Settings
        //var $widget = $(this),
        var $widget = $($(this).find(".row div")[0]), $checkbox = $('<input type="checkbox" class="hidden" />'), color = ($widget.data("color") ? $widget.data("color") : "primary"), style = ($widget.data("style") == "button" ? "btn-" : "list-group-item-"), settings = {
            on: {
                icon: "glyphicon glyphicon-check"
            },
            off: {
                icon: "glyphicon glyphicon-unchecked"
            }
        };
        $widget.css("cursor", "pointer");
        $widget.append($checkbox);
        // Event Handlers
        $widget.on("click", function () {
            $checkbox.prop("checked", !$checkbox.is(":checked"));
            $checkbox.triggerHandler("change");
            updateDisplay();
            $("#themes").trigger("contentChanged");
        });
        $checkbox.on("change", function () {
            updateDisplay();
        });
        // Actions
        function updateDisplay() {
            var isChecked = $checkbox.is(":checked");
            // Set the button's state
            $widget.data("state", (isChecked) ? "on" : "off");
            // Set the button's icon
            $widget.find(".state-icon")
                .removeClass()
                .addClass("state-icon " + settings[$widget.data("state")].icon);
            // Update the button's color
            if (isChecked) {
                $widget.addClass(style + color + " active");
            }
            else {
                $widget.removeClass(style + color + " active");
            }
        }
        // Initialization
        function init() {
            if ($widget.data("checked") == true) {
                $checkbox.prop("checked", !$checkbox.is(":checked"));
            }
            updateDisplay();
            // Inject the icon if applicable
            if ($widget.find(".state-icon").length == 0) {
                $widget.prepend('<span class="state-icon ' +
                    settings[$widget.data("state")].icon +
                    '"></span>');
            }
        }
        init();
    });
    $("#get-checked-data").on("click", function (event) {
        event.preventDefault();
        var checkedItems = {}, counter = 0;
        $("#check-list-box li.active").each(function (idx, li) {
            checkedItems[counter] = $(li).text();
            counter++;
        });
        $("#display-json").html(JSON.stringify(checkedItems, null, "\t"));
    });
}
$("#findDataStoreRecordBtn").on("click", function () {
    try {
        var dataStoreId = $("#DataStoreId").val();
        $("#warning").hide();
        $("input [type='text'").val("");
        $("input [type='number'").val(0);
        $("#DataStoreId").val(dataStoreId);
        var dataHandler = new CreateRecord();
        dataHandler.fetchInputData(dataStoreId);
    }
    catch (ex) {
        $("#error").show();
        $("#error").append("<p>" + ex.message + "</p>");
    }
    return false;
});
/// <reference path="../typings/jquery/jquery.d.ts"/>
$.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
    var ret = false;
    var publisherColumn = data[1], themeColumn = data[4];
    if (isPublisherSelected()) {
        ret = filterByPublisher(publisherColumn, themeColumn);
    }
    else if (isThemeSelected()) {
        return filterByThemes(themeColumn);
    }
    else {
        return true;
    }
    return ret;
});
function isPublisherSelected() {
    var publisherCount = $("#publishers input:checkbox:checked").length;
    return publisherCount > 0;
}
function isThemeSelected() {
    var checkedCount = $("#themes input:checkbox:checked").length;
    checkedCount += $("#tasks input:checkbox:checked").length;
    checkedCount += $("#uncategorised input:checkbox:checked").length;
    return checkedCount > 0;
}
function filterByPublisher(publisherColValue, themeColValue) {
    var ret = false;
    var selectedPublisher = $("#publishers li");
    $.each(selectedPublisher, function (i, key) {
        if ($(key).find("input").is(":checked")) {
            var publisherName = $(key).attr("data-name");
            if (publisherColValue.indexOf(publisherName) >= 0) {
                if (isThemeSelected()) {
                    ret = filterByThemes(themeColValue);
                }
                else {
                    ret = true;
                }
                return ret;
            }
        }
    });
    return ret;
}
function filterByThemes(themeCol) {
    var ret = false;
    var selectedThemes = $("#themes li");
    var selectedTasks = $("#tasks li");
    var selectedUncategorised = $("#uncategorised li");
    ret = checkThemes(selectedThemes, themeCol);
    if (!ret) {
        ret = checkThemes(selectedTasks, themeCol);
        if (!ret) {
            ret = checkThemes(selectedUncategorised, themeCol);
        }
    }
    return ret;
}
function checkThemes(selectedThemes, themeCol) {
    var ret = false;
    $.each(selectedThemes, function (i, key) {
        if ($(key).find("input").is(":checked")) {
            var themeUri = $(key).attr("data-uri");
            if (themeCol.indexOf(themeUri) >= 0) {
                var themes = themeCol.split(",");
                $.each(themes, function (j, theme) {
                    if (theme === themeUri)
                        ret = true;
                    return ret;
                });
            }
        }
    });
    return ret;
}
/// <reference path="./DataStore.ts"/>
var record = new CreateRecord();
$("#filterBtn").on("click", function () {
    getFilteredResult();
});
$("#searchBtn").on("click", function (e) {
    e.preventDefault();
    getFilteredResult();
});
function getFilteredResult() {
    var sf = $("#sortFilter option:selected").val();
    // const pf = $("#publisherFilter option:selected").val();
    var pf = "";
    var kf = $("#keywordFilter").val();
    var tf = $("#titleFilter").val();
    var p = "";
    $("#publisherFilter :selected").each(function (i, selected) {
        p += $(selected).text().toUpperCase() + " ";
        pf += $(selected).val() + " ";
    });
    if (pf.length === 0)
        pf = "ALL";
    pf = pf.trim();
    p = p.trim();
    p = p.replace(" ", ", ");
    //const p = $("#publisherFilter option:selected").text();
    if (p && p.length > 0) {
        $("#themesTitle").empty().append("Result filtered on Publisher ( " + p.toUpperCase().replace(/ /g, ", ") + " )");
    }
    if (kf) {
        $("#themesTitle").append(" and the keywords: " + kf.replace(/ /g, ", "));
    }
    record.fetchAllData(sf, pf, kf, tf, null);
}
//# sourceMappingURL=SepaClientApp.js.map