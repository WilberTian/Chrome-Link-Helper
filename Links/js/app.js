(function () {

    'use strict';

    var newTodoDom = document.getElementById('new-todo');

    var db = new PouchDB('links');

    var selectedLinkItem = {};

    db.changes({
        since: 'now',
        live: true
    }).on('change', searchLinkList);

    function addLinkItem() {
        var linkItem = {
            _id: new Date().toISOString(),
            title: document.getElementById('new-link-item-title').value,
            link: document.getElementById('new-link-item-link').value
        };

        db.put(linkItem).then(function (result) {
            document.getElementById('new-link-item-title').value = '';
            document.getElementById('new-link-item-link').value = '';

            document.getElementById('new-link-item-container').style.display = 'none';
            console.log('Successfully add a link !');
        }).catch(function (err) {
            console.log(err);
        });
    }

    function saveLinkItem() {
        selectedLinkItem.title = document.getElementById('edit-link-item-title').value;
        selectedLinkItem.link = document.getElementById('edit-link-item-link').value;

        db.put(selectedLinkItem).then(function (result) {
            document.getElementById('edit-link-item-title').value = '';
            document.getElementById('edit-link-item-link').value = '';

            document.getElementById('edit-link-item-container').style.display = 'none';

            console.log('Successfully save a link !');
        }).catch(function (err) {
            console.log(err);
        });
    }

    function editLinkItem(linkItem) {
        selectedLinkItem = linkItem;

        document.getElementById('edit-link-item-container').style.display = 'block';
        document.getElementById('edit-link-item-title').value = selectedLinkItem.title;
        document.getElementById('edit-link-item-link').value = selectedLinkItem.link;

    }

    function deleteLinkItem(linkItem) {
        db.remove(linkItem).then(function (doc) {
            console.log('Successfully removed a link !');
        }).catch(function (err) {
            console.log(err);
        });
    }

    function createLinkListItem(linkItem) {
        var linkItemContainerDiv = document.createElement('div');
        linkItemContainerDiv.className = 'link-item';

        var linkItemEle = document.createElement('a');
        linkItemEle.target = '_blank';
        linkItemEle.appendChild(document.createTextNode(linkItem.title));
        linkItemEle.href = linkItem.link;

        var linkItemEditBtn = document.createElement('input');
        linkItemEditBtn.type = 'button';
        linkItemEditBtn.value = 'Edit';
        linkItemEditBtn.addEventListener('click', editLinkItem.bind(this, linkItem), false);

        var linkItemDeleteBtn = document.createElement('input');
        linkItemDeleteBtn.type = 'button';
        linkItemDeleteBtn.value = 'Del';
        linkItemDeleteBtn.addEventListener('click', deleteLinkItem.bind(this, linkItem), false);


        linkItemContainerDiv.appendChild(linkItemEle);
        linkItemContainerDiv.appendChild(linkItemEditBtn);
        linkItemContainerDiv.appendChild(linkItemDeleteBtn);
        return linkItemContainerDiv;
    }

    function renderLinkList(linkItems) {
        var div = document.getElementById('link-item-list');
        div.innerHTML = '';
        linkItems.forEach(function (linkItem) {
            div.appendChild(createLinkListItem(linkItem.doc));
        });
    }

    function searchLinkList() {
        function map(doc) {
            if(doc.title.indexOf(document.getElementById('search-box').value) > -1) {
                emit(doc._id);
            }
        }

        db.query(map, {include_docs : true}).then(function (result) {
           renderLinkList(result.rows);
        }).catch(function (err) {
            console.log(err);
        });

    }

    function addEventListeners() {
        var addLinkItemBtn = document.getElementById('add-link-item-btn');
        addLinkItemBtn.addEventListener('click', addLinkItem, false);

        document.getElementById('save-link-item-btn').addEventListener('click', saveLinkItem, false)

        document.getElementById('search-box').addEventListener('keyup', searchLinkList, false);
    }

    window.onload = function () {
        addEventListeners();
        searchLinkList();

        chrome.tabs.getSelected(null, function (tab) {
            document.getElementById('new-link-item-title').value = tab.title;
            document.getElementById('new-link-item-link').value = tab.url;
        });

        document.getElementById('new-link-item-container').style.display = 'block';
    }


})();
