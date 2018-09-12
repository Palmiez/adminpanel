interface ISeWebData {
    id: number;
    graphId: string;
    title: string;
    description: string;
    publisher: string;
    distributionId: string;
    ssdiId: string;
    ssdiIdXml: string;
    serviceUrl: string;
    serviceLayer: string;
    orgId: string;
    minScale: number;
    maxScale: number;
    legendUrl: string;
    searchDescription: string;
    searchTags: string;
    fieldNames: Array<string>;
    accessUrl: string;
    mediaType: string;
    theme: string;
    updatedDate: IDate;
    publishedDate: IDate;
}

interface IDate {
    day: number;
    month: number;
    year: number;
}