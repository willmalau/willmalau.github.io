var dbPromise = idb.open('gilaBola', 1, function (upgradeDb) {
upgradeDb.createObjectStore('favorites', { keyPath: 'id' })
})

function addToFavorites(team) {
dbPromise
    .then(function (db) {
    var tx = db.transaction(['favorites'], 'readwrite')
    var store = tx.objectStore('favorites')
    store.add(team)
    return tx.complete
    })
    .then(() => console.log('Tim berhasil ditambahkan ke favorite.'))
}

function getAll() {
return new Promise(function (resolve, reject) {
    dbPromise
    .then(function (db) {
        var tx = db.transaction(['favorites'], 'readonly')
        var store = tx.objectStore('favorites')
        return store.getAll()
    })
    .then((teams) => resolve(teams))
})
}

function getById(id) {
return new Promise(function (resolve, reject) {
    dbPromise
    .then(function (db) {
        var tx = db.transaction(['favorites'], 'readonly')
        var store = tx.objectStore('favorites')
        return store.get(parseInt(id))
    })
    .then((team) => resolve(team))
})
}

function removeFromFavorites(id) {
return new Promise(function (resolve, reject) {
    dbPromise
    .then(function (db) {
        var tx = db.transaction(['favorites'], 'readwrite')
        var store = tx.objectStore('favorites')
        store.delete(parseInt(id))
        location.reload()
        return tx.complete
    })
})
}
