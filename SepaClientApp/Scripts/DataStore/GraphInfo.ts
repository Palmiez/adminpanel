/// <reference path="./IGraphInfo.ts"/>
class GraphInfo implements IGraphInfo {
    graphId: string;
    title: string;
    description: string;
    keyword: string;
    themeName: string;
    themeUri: string;
    themeCategory: string;
    numberOfDistributions: number;
    publisher: string;
    publishedDate: string;
    updatedDate: string;

    PublishedDisplayDate: string;
    UpdatedDisplayDate: string;

    constructor();
    constructor(graphInfo: IGraphInfo);
    constructor(graphInfo?: IGraphInfo) {
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

    formatDate(dateVal: string) {
        let formattedDate: string;
        if (dateVal) {
            formattedDate = dateVal.substr(0,dateVal.indexOf("T"));
        }
        return formattedDate;
    }
}