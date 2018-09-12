var PublisherEngine = /** @class */ (function () {
    function PublisherEngine() {
        this.fetchPublishers();
    }
    PublisherEngine.prototype.fetchPublishers = function () {
        var _this = this;
        var webApiUrl = $("#WebApiBaseUrl").val() + "/GetPublishers";
        this.publishers = new Array();
        var ret = $.getJSON(webApiUrl, function (c) {
            for (var _i = 0, c_1 = c; _i < c_1.length; _i++) {
                var item = c_1[_i];
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
//# sourceMappingURL=PublisherEngine.js.map