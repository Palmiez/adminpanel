
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

class CreateRecord {
    private id: string;
    private url: string;
    private seWebData: ISeWebData;
    private dataSets: ISeWebData[];
    //private graphInfos: IGraphInfo[];
    private sortFilter: number;
    private publisherFilter: string;
    private keywordFilter: string;
    private titleFilter: string;
    private updatedFilter: string;

    private readonly themesEngine: ThemesEngine;
    private readonly graphInfoEngine: GraphInfoEngine;
    private readonly publisherEngine: PublisherEngine;


    constructor() {
        this.themesEngine = new ThemesEngine();
        this.themesEngine.executeRender = this.init;
        this.themesEngine.fetchThemes();

        this.publisherEngine = new PublisherEngine();    
        this.graphInfoEngine = new GraphInfoEngine(this.publisherEngine);    
    }

    init = () => {
        //alert('Themes Initialised');
        // this.graphInfoEngine.executeRender - this.renderFilteredResult;        
    }

    fetchAllData(sortFilter: number,
        publisherFilter: string,
        keywordFilter: string,
        titleFilter: string,
        updatedFilter: string) {
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
    }

    public renderFilteredResult = () => {
        var that = this;
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
        let graphWithNoThemeCount = 0;
        let graphWithInvalidThemeCount = 0;
        for (let graphInfo of that.graphInfoEngine.graphInfos) {
            if (graphInfo.themeUri) {
                if (!that.themesEngine.addThemes(graphInfo.themeUri)) {
                    graphWithInvalidThemeCount++;
                }
            } else {
                graphWithNoThemeCount++;
            }
        }
        that.themesEngine.setCount("INVALID", graphWithInvalidThemeCount);
        that.themesEngine.renderTaskThemes();
        that.themesEngine.renderGemetThemes();
        that.themesEngine.renderUncategorisedThemes(graphWithInvalidThemeCount + graphWithNoThemeCount);
        

        if (that.titleFilter) {
            const filteredList = that.graphInfoEngine.applyTitleFilter(that.titleFilter);
            that.graphInfoEngine.renderList(filteredList);
        } else {
            that.graphInfoEngine.renderList(that.graphInfoEngine.graphInfos);
        }

        applyCheckboxes("tasks");
        applyCheckboxes("themes");
        applyCheckboxes("uncategorised");
        applyCheckboxes("publishers");
    }


    applyThemeFilter(uri: string) {
        //const theme = this.themesEngine.getTheme(uri);
        //this.themesEngine.toggleTheme(uri);
        //const uriList = this.themesEngine.getThemeUris();
        //this.graphInfoEngine.renderListForThemes(uriList);
        

    }



        private dateToString(dateval: IDate) {
            let dateStr: string;
            if (dateval) {
                dateStr = dateval.day + "/" + dateval.month + "/" + dateval.year;
            } else {
                dateStr = null;
            }
            return dateStr;
        }

        fetchInputData(id: string) {

            const webApiUrl = $("#WebApiBaseUrl").val() + "/" + id;
            $.getJSON(webApiUrl,
                    c => {

                        this.seWebData = (c as ISeWebData);

                        $("#DataStoreUri").val(`http://data.sepa.org.uk/id/dataset/${this.seWebData.title}`);

                        $("#Id").val(this.seWebData.id);
                        $("#GraphId").val(this.seWebData.graphId);
                        $("#Title").val(this.seWebData.title);
                        $("#Description").val(this.seWebData.description);
                        let modifiedDate = this.dateToString(this.seWebData.updatedDate);
                        $("#LastModified").val(modifiedDate);
                        let publishedDate = this.dateToString(this.seWebData.publishedDate);
                        $("#LastModified").val(publishedDate);


                        $("#Publisher").val(this.seWebData.publisher);
                        var orgId = this.seWebData.orgId;
                        $("#publisher option").each(() => {
                            if ($(this).attr("value") === orgId) {
                                $(this).attr("selected", "selected");
                            }
                        });

                        var keywordSelect = $("#keywords");
                        keywordSelect.empty();
                        var keywords = this.seWebData.searchTags;
                        $.each(keywords,
                            (val, text) => {
                                keywordSelect.append($("<option selected></option>").val(text).html(text));
                            });
                        keywordSelect.selectpicker("refresh");


                        var themeSelect = $("#themes");
                        themeSelect.empty();
                        var themes = this.seWebData.theme;
                        $.each(themes,
                            (val, text) => {
                                themeSelect.append($("<option selected></option>").val(text).html(text));
                            });
                        themeSelect.selectpicker("refresh");

                        $("#GraphItemId").val(this.seWebData.distributionId);
                        $("#Legend").val(this.seWebData.legendUrl);
                        $("#MapLayer").val(this.seWebData.serviceLayer);
                        $("#AccessUrl").val(this.seWebData.accessUrl);
                        $("#MediaType").val(this.seWebData.mediaType);

                        $("#serviceLayer").val(this.seWebData.serviceLayer);
                        $("#Ssdi").val(this.seWebData.ssdiId);
                        $("#SsdiXml").val(this.seWebData.ssdiIdXml);

                        $("#MaxScale").val(this.seWebData.maxScale);
                        $("#MinScale").val(this.seWebData.minScale);


                        var identityFieldsSelect = $("#identityFields");
                        var identityFields = this.seWebData.fieldNames;

                        $.each(identityFields,
                            (val, alias) => {
                                identityFieldsSelect.append($("<option selected></option>").val(val + "-" + alias)
                                    .html(alias));
                            });
                        identityFieldsSelect.selectpicker("refresh");


                        $("#Keywords").val();
                        $("Themes").val(this.seWebData.theme);
                        $("#IdentityFields").val(Object.keys(this.seWebData.fieldNames));

                        $("#RecordTitle").html(`<strong>${this.seWebData.title}</strong>`);
                        return false;
                    })
                .fail((jqXmlHttpRequest, textStatus, errorThrown) => {
                    $("#warning").show();
                    return false;
                });
            return false;
        }
    };


    

    function applyCheckboxes(listId : string) {
        $(`#${listId} li`).each(function () {

            // Settings
            //var $widget = $(this),
            var $widget = $($(this).find(".row div")[0]),
                $checkbox = $('<input type="checkbox" class="hidden" />'),
                color = ($widget.data("color") ? $widget.data("color") : "primary"),
                style = ($widget.data("style") == "button" ? "btn-" : "list-group-item-"),
                settings = {
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
            $widget.on("click",
                () => {
                    $checkbox.prop("checked", !$checkbox.is(":checked"));
                    $checkbox.triggerHandler("change");
                    updateDisplay();
                    $("#themes").trigger("contentChanged");
                });
            $checkbox.on("change",
                () => {
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
                } else {
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


        $("#get-checked-data").on("click",
            event => {
                event.preventDefault();
                var checkedItems = {}, counter = 0;
                $("#check-list-box li.active").each((idx, li) => {
                    checkedItems[counter] = $(li).text();
                    counter++;
                });
                $("#display-json").html(JSON.stringify(checkedItems, null, "\t"));
            });
    }

    

    $("#findDataStoreRecordBtn").on("click",
        () => {

            try {
                const dataStoreId = $("#DataStoreId").val();
                $("#warning").hide();

                $("input [type='text'").val("");
                $("input [type='number'").val(0);
                $("#DataStoreId").val(dataStoreId);


                const dataHandler = new CreateRecord();
                dataHandler.fetchInputData(dataStoreId);
            } catch (ex) {
                $("#error").show();
                $("#error").append(`<p>${(ex as Error).message}</p>`);
            }
            return false;
        }
    );

   

