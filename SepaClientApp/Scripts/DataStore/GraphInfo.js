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
//# sourceMappingURL=GraphInfo.js.map