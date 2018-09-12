var DistributionEngine = /** @class */ (function () {
    function DistributionEngine() {
        var _this = this;
        this.optionTemplate = "<option value='#id'>#value</option>";
        this.fetchDistributions = function (id) {
            var webApiUrl = "/UpdateNotify/Distributions/" + id;
            _this.distributions = new Array();
            $.getJSON(webApiUrl, function (c) {
                var self = _this;
                for (var _i = 0, c_1 = c; _i < c_1.length; _i++) {
                    var item = c_1[_i];
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
//# sourceMappingURL=DistributionEngine.js.map