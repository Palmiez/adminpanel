class GraphInfoEngine {
    graphInfos: IGraphInfo[];
    private readonly publisherEngine: PublisherEngine;

    constructor(publisherEngine: PublisherEngine) {
        this.graphInfos = new Array<IGraphInfo>();
        this.publisherEngine = publisherEngine;
    }

    fetchGraphInfos(executeFunc) {      

        const webApiUrl = $("#WebApiBaseUrl").val() + "/GetGraphInfos";
        const ret = $.getJSON(webApiUrl,
            c => {
                this.graphInfos = new Array<IGraphInfo>();
                for (let item of c) {
                    const graphInfo = (item as IGraphInfo);
                    const graphInfoObj = new GraphInfo(graphInfo);
                    this.graphInfos.push(graphInfoObj as IGraphInfo);

                }
                //executeFunc();
                return true;
            })            
            .fail((jqXmlHttpRequest, textStatus, errorThrown) => {
                $("#warning").show();
                return false;
            })
            .then(() => executeFunc());
        return ret;

    };

    applyTitleFilter(title: string) {
        const filterResult = this.graphInfos.filter((el) => {
            if (el.title.indexOf(title) >= 0)
                return true;
            return false;
        });
        return filterResult;
    }

    applyKeywordFilter(keyword: string) {
        const filteredResult = this.graphInfos.filter((el) => {
            var keywords = keyword.split(" ");
            for (var idx in keywords) {
                if (el.keyword.indexOf(keywords[idx]) >= 0)
                    return true;
            }
        });
        return filteredResult;
    }

    applyPublisherFilter(publisher: string) {
        publisher = publisher.trim();
        const filteredResult = this.graphInfos.filter((el) => {
            
            if (publisher.indexOf(" ") > 0) {
                const publishers = publisher.split(" ");
                let ret = false;
                $.each(publishers,
                    i => {
                        if (el.publisher === publishers[i]) {
                            ret = true;
                            return true;
                        } else {                           
                            //return false;
                        }
                        
                    });
                return ret;
            } else {
                if (el.publisher === publisher) {
                    return true;
                }
                return false;
            }
        });
        return filteredResult;
    }

    applyThemeFilter(themeFilter: string) {
        const filteredResult = this.graphInfos.filter((el) => {
            if (el.themeUri === themeFilter) {
                return true;
            } else {
                const themes = el.themeUri.split(";");
                for (let idx in themes) {
                    if (themeFilter.trim() === themes[idx].trim())
                        return true;
                }
            }
            return false;
        });
        this.renderList(filteredResult);
        return filteredResult;
    }

    

    applySortFilter(sortFilterId: number) {
        const sortFilter = sortFilterId;
        if (sortFilter === 0) {
            this.graphInfos = this.graphInfos.sort(((obj1, obj2) => {
                return this.compare(obj1.title, obj2.title);
            }) as any);
        } else if (sortFilter === 1) {
            this.graphInfos = this.graphInfos.sort(((obj1, obj2) => {
                return this.compare(obj1.publisher, obj2.publisher);
            }) as any);
        } else if (sortFilter === 2) {
            this.graphInfos = this.graphInfos.sort(((obj1, obj2) => {
                return this.compare(obj1.theme, obj2.theme);
            }) as any);
        } else if (sortFilter === 3) {
            this.graphInfos = this.graphInfos.sort(((obj1, obj2) => {
                return this.compare(obj1.PublishedDisplayDate, obj2.PublishedDisplayDate, true);
            }) as any);
        } else if (sortFilter === 4) {
            this.graphInfos = this.graphInfos.sort(((obj1, obj2) => {
                return this.compare(obj1.UpdatedDisplayDate, obj2.UpdatedDisplayDate, true);
            }) as any);
        }
    }

    private compare(val1: string, vals2: string, isReversed: boolean = false) {
        if (isReversed) {
            if (val1 > vals2)
                return -1;
            if (val1 < vals2)
                return 1;
        } else {
            if (val1 < vals2)
                return -1;
            if (val1 > vals2)
                return 1;
        }

        return 0;
    };

    renderListForThemes(themeUris: string[]) {
        let graphInfos = new Array<IGraphInfo>();
        $.each(this.graphInfos,
            i => {

                const uri = this.graphInfos[i].themeUri;
                if (uri) {
                    if (uri.indexOf(";") > 0) {
                        var uris = uri.split(";");
                        $.each(uris,
                            idx => {
                                const uriVal = uris[idx].trim();
                                if ($.inArray(uriVal, themeUris) > -1) {
                                    graphInfos.push(this.graphInfos[i]);
                                }
                            });
                    }
                    else if ($.inArray(uri, themeUris) > -1) {
                        graphInfos.push(this.graphInfos[i]);
                    }
                } else {
                    this.graphInfos[i].themeCategory = "uncategorised";
                    this.graphInfos[i].themeUri = "uncategorised";
                    this.graphInfos[i].themeName = "uncategorised";
                    graphInfos.push(this.graphInfos[i]);
                }

            });
        this.renderList(graphInfos);
    }

    renderList(list: IGraphInfo[]) {
        var dataSetList = $("#result");
        dataSetList.empty();
        $.each(list,
            i => {
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

                var publisherDisplayValObj = this.publisherEngine.publishers.filter(x => x.uri === uri);
                var publisherDisplayVal = "Unknown";
                if (publisherDisplayValObj.length > 0) {
                    publisherDisplayVal = publisherDisplayValObj[0].name;
                }
                var smallField = $("<small/>")
                    .addClass("text-muted")
                    .text(`Publisher: ${publisherDisplayVal}`);

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


}