(function() {

    'use strict';

    var newTodoDom = document.getElementById('new-todo');

    var db = new PouchDB('links');
  
    db.changes({
        since: 'now',
        live: true
    }).on('change', showLinks);

    function addLinkItem() {
        var linkItem = {
            _id: new Date().toISOString(),
            title: document.getElementById('new-link-item-title').value,
            link: document.getElementById('new-link-item-link').value
        };

        db.put(linkItem).then(function (result) {
            document.getElementById('new-link-item-title').value = '';
            document.getElementById('new-link-item-link').value = '';

            console.log('Successfully add a link !');
        }).catch(function(err) {
            console.log(err);
        });
    }

    function showLinks() {
        db.allDocs({include_docs: true, descending: true}).then(function(doc) {
            renderLinkList(doc.rows);
        }).catch(function(err) {
            console.log(err);
        });
    }

    function createLinkListItem(linkItem) {
        var linkItemEle = document.createElement('a');
        linkItemEle.className = 'link-item';
        linkItemEle.appendChild(document.createTextNode(linkItem.link));
        linkItemEle.href = linkItem.link;

        return linkItemEle;
    }

    function renderLinkList(linkItems) {
        var div = document.getElementById('link-item-list');
        div.innerHTML = '';
        linkItems.forEach(function(linkItem) {
            div.appendChild(createLinkListItem(linkItem.doc));
        });
    }

    function addEventListeners() {
        var saveLinkItemBtn = document.getElementById('save-link-item-btn');
        saveLinkItemBtn.addEventListener('click', addLinkItem, false);
    }

    addEventListeners();
    showLinks();

})();
