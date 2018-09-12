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
//# sourceMappingURL=GraphInfoEngine.js.map