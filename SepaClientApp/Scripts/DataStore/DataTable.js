/// <reference path="../typings/jquery/jquery.d.ts"/>
$.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
    var ret = false;
    var publisherColumn = data[1], themeColumn = data[4];
    if (isPublisherSelected()) {
        ret = filterByPublisher(publisherColumn, themeColumn);
    }
    else if (isThemeSelected()) {
        return filterByThemes(themeColumn);
    }
    else {
        return true;
    }
    return ret;
});
function isPublisherSelected() {
    var publisherCount = $("#publishers input:checkbox:checked").length;
    return publisherCount > 0;
}
function isThemeSelected() {
    var checkedCount = $("#themes input:checkbox:checked").length;
    checkedCount += $("#tasks input:checkbox:checked").length;
    checkedCount += $("#uncategorised input:checkbox:checked").length;
    return checkedCount > 0;
}
function filterByPublisher(publisherColValue, themeColValue) {
    var ret = false;
    var selectedPublisher = $("#publishers li");
    $.each(selectedPublisher, function (i, key) {
        if ($(key).find("input").is(":checked")) {
            var publisherName = $(key).attr("data-name");
            if (publisherColValue.indexOf(publisherName) >= 0) {
                if (isThemeSelected()) {
                    ret = filterByThemes(themeColValue);
                }
                else {
                    ret = true;
                }
                return ret;
            }
        }
    });
    return ret;
}
function filterByThemes(themeCol) {
    var ret = false;
    var selectedThemes = $("#themes li");
    var selectedTasks = $("#tasks li");
    var selectedUncategorised = $("#uncategorised li");
    ret = checkThemes(selectedThemes, themeCol);
    if (!ret) {
        ret = checkThemes(selectedTasks, themeCol);
        if (!ret) {
            ret = checkThemes(selectedUncategorised, themeCol);
        }
    }
    return ret;
}
function checkThemes(selectedThemes, themeCol) {
    var ret = false;
    $.each(selectedThemes, function (i, key) {
        if ($(key).find("input").is(":checked")) {
            var themeUri = $(key).attr("data-uri");
            if (themeCol.indexOf(themeUri) >= 0) {
                var themes = themeCol.split(",");
                $.each(themes, function (j, theme) {
                    if (theme === themeUri)
                        ret = true;
                    return ret;
                });
            }
        }
    });
    return ret;
}
//# sourceMappingURL=DataTable.js.map