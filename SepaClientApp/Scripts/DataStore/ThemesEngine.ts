
type PropertyFunction<T> = () => T;

class ThemesEngine {
        readonly themes: ITheme[];
        themeLookup: IThemeLookup[];
        applicationError: ApplicationError;
        executeRender: (themesEngine: ThemesEngine) => any;


        liTemplate = "<li id='#id' class='list-group-item' data-checked='true' data-uri='#uri' data-color='success' onclick=\"javascript:record.applyThemeFilter('#uri2');\"><div class='row'><div class='col-sm-9'>#lable</div><div class='col-sm-3'><span class='badge badge-default badge-pill'>#count</span></div></div></li>";

        constructor() {
            this.themes = new Array<ITheme>();
        }

        clearThemes() {
            this.themes.length = 0;
        }

        public fetchThemes = () => {            
            const webApiUrl = $("#WebApiBaseUrl").val() + "/GetThemes";
            this.themeLookup = new Array<IThemeLookup>();

            $.getJSON(webApiUrl,
                    c => {
                        var self = this;
                        for (let item of c) {
                            self.themeLookup.push(item as IThemeLookup);
                        };
                        this.themeLookup = self.themeLookup;
                    })
                .fail((jqXmlHttpRequest, textStatus, errorThrown) => {
                    $("#warning").show();
                    return false;
                })
                .then(() => {
                    this.executeRender(this);
                })
                ;
            return false;
        }

        addThemes(theme: string): boolean {
            let ret = false;
            if (theme) {
                if (theme.indexOf(";") > -1) {
                    const themes = theme.split(";");

                    for (let themeItem of themes) {

                        const uri = themeItem.trim();
                        if (this.addThemeToList(uri)) {
                            ret = true;
                        }
                    };
                } else {
                    const uri = theme.trim();
                    ret = this.addThemeToList(uri);
                }
            }
            return ret;
        };

        private addThemeToList(uri): boolean {
            let ret = false;
            const themeLookupObj = this.themeLookup.filter(x => x.uri === uri);
            if (themeLookupObj.length > 0) {
                const name = themeLookupObj[0].theme;
                const category = themeLookupObj[0].category;
                ret = this.appendThemes(name, category, uri);
            } else {
                this.appendThemes("uncategorised","uncategorised", uri);                
            }
            return ret;
        }

        private appendThemes(name: string, category: string, uri: string) : boolean {
            try {
                const themeObj = (new Object as ITheme);
                themeObj.uri = uri;
                themeObj.name = name;
                themeObj.category = category;
                themeObj.count = 1;
                themeObj.visible = true;
                if (!this.containsTheme(themeObj, this.themes)) {
                    this.themes.push(themeObj);
                }
            } catch (ex) {
                this.applicationError = new ApplicationError();
                this.applicationError.setError(ex);
                return false;
            }
            return true;
        }

        private containsTheme(obj, list) {
            let i: number;
            for (i = 0; i < list.length; i++) {
                if (list[i].name === obj.name) {
                    list[i].count++;
                    return true;
                }
            }

            return false;
        }

        sortByName(val1 : ITheme, val2 : ITheme) {
            const val1Name = val1.name.toLowerCase();
            const val2Name = val2.name.toLowerCase();
            const val1Category = val1.category.toLowerCase();
            const val2Category = val1.category.toLowerCase();
            if (val1Category < val2Category) {
                return -1;
            }
            else if (val1Category > val2Category) {
                return 1;
            } else {
                return ((val1Name < val2Name) ? -1 : (val1Name > val2Name ? 1 : 0));
            }            
        }

        renderTaskThemes() {
            const dataSetList = $("#themes");
            var themesListElement = $("#tasks");
            dataSetList.empty();

            const themeDivSmall = $("#themes-small");
            themeDivSmall.empty();
            const themeSelect = $("<select/>");
            themeSelect.appendTo(themeDivSmall);
            let invalidThemes;
            this.themes.sort(this.sortByName);

            var taskThemes = this.themes.filter(x => x.category.toLowerCase() === "task");
            $.each(taskThemes,
                i => {
                    var theme = taskThemes[i];
                    let label = theme.name;

                    if (this.themes[i].name === "INVALID")
                        label = "No Theme";
                    

                    let liElement = this.liTemplate.replace("#uri", theme.uri)
                        .replace("#uri2", theme.name);

                    liElement = liElement.replace("#id", `theme_${label}`);
                    liElement = liElement.replace("#count", theme.count.toString());
                    liElement = liElement.replace("#lable", label);
                    themesListElement.append(liElement);

                    //Mobile 
                    var themeOption = $("<option/>");
                    themeOption.attr("value", theme.uri);
                    themeOption.text(label);
                    themeOption.appendTo(themeSelect);

                });
        }

        renderGemetThemes() {
            const dataSetList = $("#themes");
            var themesListElement = $("#themes");
            dataSetList.empty();

            const themeDivSmall = $("#themes-small");
            
            const themeSelect = $("<select/>");
            themeSelect.appendTo(themeDivSmall);
            this.themes.sort(this.sortByName);
            var gemetThemes = this.themes.filter(x => x.category.toLowerCase() === "gemet");

            $.each(gemetThemes,
                i => {
                    var theme = gemetThemes[i];
                    let label = this.themes[i].name;

                    if (this.themes[i].name === "INVALID")
                        label = "No Theme";
                    

                    let liElement = this.liTemplate.replace("#uri", theme.uri)
                        .replace("#uri2", theme.name);

                    liElement = liElement.replace("#id", `theme_${label}`);
                    liElement = liElement.replace("#count", theme.count.toString());
                    liElement = liElement.replace("#lable", label);
                    themesListElement.append(liElement);

                    //Mobile 
                    var themeOption = $("<option/>");
                    themeOption.attr("value", theme.uri);
                    themeOption.text(label);
                    themeOption.appendTo(themeSelect);
                    
                });            
        }

        renderUncategorisedThemes(uncategorisedCount: number) {
            const themesListElement = $("#uncategorised");
            let liElement = this.liTemplate.replace("#uri", "uncategorised")
                .replace("#uri2", "uncategorised");


            liElement = liElement.replace("#id", `theme_${"uncategorised"}`);
            liElement = liElement.replace("#count", uncategorisedCount.toString());
            liElement = liElement.replace("#lable", "uncategorised");
            themesListElement.append(liElement);


        }

        getTheme(uri: string) :ITheme {
            const theme = this.themes.find(x => x.uri === uri);
            return theme;
    }

    toggleTheme(uri: string) {
        //const theme = this.themes.find(x => x.uri === uri);
        //theme.visible = !theme.visible;
        if ($(`.panel-heading:contains("${uri}")`).parent().parent().parent().is(":visible")) {
            $(`.panel-heading:contains("${uri}")`).parent().parent().parent().hide();
        } else {
            $(`.panel-heading:contains("${uri}")`).parent().parent().parent().show();
        }
        
        $.each(this.themes,
                i => {
                    if (this.themes[i].name === uri) {
                        this.themes[i].visible = !this.themes[i].visible;
                    }
                });

        }

    getThemeUris() : string[] {
        let uriLIst: string[] = new Array<string>();
        $.each(this.themes,
            i => {

                if (this.themes[i].visible) {
                    uriLIst.push(this.themes[i].uri);
                }
            });
        return uriLIst;
    }

    setCount(name: string, count: number) {

        const themeItems = this.themes.filter(x => x.name === name);
        if (themeItems.length > 0) {            
            themeItems[0].count = count;
        }

    }

}
