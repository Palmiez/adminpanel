class PublisherEngine {
    publishers: IPublisher[];

    constructor() {
        this.fetchPublishers();
    }

    fetchPublishers() {
        const webApiUrl = $("#WebApiBaseUrl").val() + "/GetPublishers";
        this.publishers = new Array<IPublisher>();

        const ret = $.getJSON(webApiUrl,
                c => {
                    for (let item of c) {
                        this.publishers.push(item as IPublisher);
                    };
                    return true;
                })
            .fail((jqXmlHttpRequest, textStatus, errorThrown) => {
                $("#warning").show();
                return false;
            });
        return ret;
    }
}