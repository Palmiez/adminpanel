/// <reference path="./DataStore.ts"/>
var record = new CreateRecord();
$("#filterBtn").on("click", () => {
    getFilteredResult();
   
});

$("#searchBtn").on("click", e => {
    e.preventDefault();
    getFilteredResult();
});

function getFilteredResult() {
    const sf = $("#sortFilter option:selected").val();
   // const pf = $("#publisherFilter option:selected").val();
    let pf = "";
    const kf = $("#keywordFilter").val();
    const tf = $("#titleFilter").val();
    let p = "";
    $("#publisherFilter :selected").each((i, selected) => {
        p += $(selected).text().toUpperCase() + " ";
        pf += $(selected).val() + " ";
    });
    if (pf.length === 0)
        pf = "ALL";
    pf = pf.trim();
    p = p.trim();
    p = p.replace(" ", ", ");
    //const p = $("#publisherFilter option:selected").text();
    if (p && p.length > 0) {
        
        $("#themesTitle").empty().append(`Result filtered on Publisher ( ${p.toUpperCase().replace(/ /g, ", ")} )`);
        
    }
    
    if (kf) {
        $("#themesTitle").append(` and the keywords: ${kf.replace(/ /g, ", ")}`);
    }
    record.fetchAllData(sf, pf, kf, tf, null);
}