define([], initModule);

function initModule() {

    return {
        Document: Document
    };

    function Document(files, pageCount) {
        var me = this;
        var pageName = "", index = 0;
        var list = typeof files === "string" ? [files] : files;
        var pdfname = list[0].replace('.jpg', '.pdf');
        pageCount = pageCount || 1;
        me.DocumentName = list[0];
        me.OrgGUID = '10f0ea03-1d4b-41fa-99aa-c455196a050a';
        if (pageCount>0) {
            me.OrgURL = "js/mock/images/" + pdfname;
            me.DocumentName = pdfname;
        } else {
            me.OrgURL = "js/mock/images/" + list[0];
        }
        me.Pages = [];
        if (pageCount>0) {
            for (var i = 1; i <= pageCount; i++) {
                pageName = list[0];
                if (pageCount > 1) {
                    pageName = pageName.replace('.', '_page' + i + '.');
                }
                me.Pages.push({
                    Pagenumber: i,
                    PageURL: 'js/mock/images/' + pageName,
                    PageGUID: i + 'efd96a8-b7a6-45de-8e39-8cfd65a871a7'
                });
            }
        }
    }


}