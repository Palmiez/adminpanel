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
//# sourceMappingURL=DataStore.js.map