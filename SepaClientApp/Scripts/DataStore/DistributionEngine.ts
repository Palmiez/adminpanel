class DistributionEngine {
    distributions: IDistribution[];
    executeRender: (distributionEngine: DistributionEngine) => any;

    optionTemplate = "<option value='#id'>#value</option>";

    constructor() {
        this.executeRender = this.renderDistributionSelectList;
    }

    clearDistributions() {
        this.distributions.length = 0;
    }

    public fetchDistributions = (id:string) => {
        const webApiUrl = `/UpdateNotify/Distributions/${id}`;
        this.distributions = new Array<IDistribution>();

        $.getJSON(webApiUrl,
                c => {
                    var self = this;
                    for (let item of c) {
                        self.distributions.push(item as IDistribution);
                    };
                })
            .fail((jqXmlHttpRequest, textStatus, errorThrown) => {
                $("#warning").show();
                return false;
            })
            .then(() => {
                this.executeRender(this);
            });
        return false;

    }

    renderDistributionSelectList(self) {
        var distElement = $("#distributions");
        distElement.empty();
        $.each(self.distributions,
            i => {
                var id = self.distributions[i].GraphItemId;
                var name = self.distributions[i].Title;
                if (name) {
                    if (name.length === 0) {
                        name = id;
                    }
                } else {
                    name = id;
                }

                let optionElement = self.optionTemplate.replace("#id", id).replace("#value", name);
                distElement.append(optionElement);

            });
        distElement.selectpicker("refresh");
    }

}