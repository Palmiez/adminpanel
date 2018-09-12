/// <reference path="../typings/jquery/jquery.d.ts"/>
$.fn.dataTable.ext.search.push(
    (settings, data, dataIndex) => {

        var ret = false;
        const [, publisherColumn,,, themeColumn] = data;
        if (isPublisherSelected()) {

            ret = filterByPublisher(publisherColumn, themeColumn);
        }
        else if (isThemeSelected()) {
            return filterByThemes(themeColumn);            
        } else {
            return true;
        }
        return ret;
    }
);

function isPublisherSelected(): boolean {
    const publisherCount = $("#publishers input:checkbox:checked").length;
    return publisherCount > 0;
}

function isThemeSelected() : boolean {
    let checkedCount = $("#themes input:checkbox:checked").length;
    checkedCount += $("#tasks input:checkbox:checked").length;
    checkedCount += $("#uncategorised input:checkbox:checked").length;
    return checkedCount > 0;
}

function filterByPublisher(publisherColValue : string, themeColValue : string): boolean {
    let ret = false;
    const selectedPublisher = $("#publishers li");
    $.each(selectedPublisher,
        (i, key) => {
            if ($(key).find("input").is(":checked")) {
                const publisherName = $(key).attr("data-name");
                if (publisherColValue.indexOf(publisherName) >= 0) {
                    if (isThemeSelected()) {
                        ret = filterByThemes(themeColValue);
                    } else {
                        ret = true;
                    }                    
                    return ret;
                }
            }
        });
    return ret;
}

function filterByThemes(themeCol : string) : boolean {
    let ret = false;
    const selectedThemes = $("#themes li");
    const selectedTasks = $("#tasks li");
    const selectedUncategorised = $("#uncategorised li");

    
    ret = checkThemes(selectedThemes, themeCol);
    if (!ret) {
        ret = checkThemes(selectedTasks, themeCol);
        if (!ret) {
            ret = checkThemes(selectedUncategorised, themeCol);
        }
    }
    return ret;
}

function checkThemes(selectedThemes : JQuery, themeCol : string): boolean {
    let ret = false;
    $.each(selectedThemes,
        (i, key) => {
            if ($(key).find("input").is(":checked")) {
                var themeUri = $(key).attr("data-uri");
                if (themeCol.indexOf(themeUri) >= 0) {
                    const themes = themeCol.split(",");
                    $.each(themes,
                        (j, theme) => {
                            if (theme === themeUri)
                                ret = true;
                                return  ret;
                        });

                }
            }
           
        });
    return ret;
}