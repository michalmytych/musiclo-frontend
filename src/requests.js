/**
 * 
 * All API http requests functions.
 *
 */

const API_URL = "https://wierzba.wzks.uj.edu.pl/~19_mytych/projekt/music-db/api/";


export async function getItemsListRequest(args) { 
    var url = `${API_URL}items_list.php?limit=${args.l}&page=${args.p}&category=${args.c}`;
    
    var items = await fetch(url)
    .then(response => { return response.json(); }) 
    .catch(err => { console.log('Request failed: ', err) });

    return items;
};


export async function createItemRequest(data) {
    var url = `${API_URL}create_item.php?category=${data.category}`;
    
    let res = await fetch(url, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data.obj)
    })
    .then(response => response.status)
    .catch(err => { console.log('Request failed: ', err) });    

    return res;
};


export async function deleteItemRequest(args) {
    var url = `${API_URL}delete_item.php?id=${args.id}&category=${args.cat}`;

    let res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', }
    })
    .then(response => response.status)
    .catch(err => { console.log('Request failed: ', err) });

    return res;
};


export async function getItemRequest(args) {
    var url = `${API_URL}get_item.php?category=${args.category}&id=${args.id}`;

    let res = await fetch(url, { method: 'GET' })
    .then(response => { return response.json(); }) 
    .catch(err => { console.log('Request failed: ', err) });

    return res;
};


export async function putEditedItemRequest(data) {
    var url = `${API_URL}update_item.php?category=${data.category}&id=${data.id}`;

    var res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data.obj),
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
    .then( response => response.status ) 
    .catch(err => { console.log('Request failed: ', err) });

    return res;
};


export async function getSearchResultsRequest(args) {
    var url = `${API_URL}search_item.php?category=${args.c}&phrase=${args.p}`;
    
    var results = await fetch(url)
    .then(response => { return response.json(); }) 
    .catch(err => { console.log('Request failed: ', err) } );

    return results;    
};


export async function getSongsOfAlbumRequest(id) {    
    var url = API_URL + `songs_of_album.php?id=${id}`;

    var songs = await fetch(url)
    .then(response => { return response.json(); }) 
    .catch(err => { console.log('Request failed: ', err) });
    
    return songs;
};


export async function getCountriesDataRequest() {    
    var url = API_URL + `countries_list.php`;
    
    var countries = await fetch(url)
    .then(response => { return response.json(); }) 
    .catch(err => { console.log('Request failed: ', err) });

    return countries;
};


export async function getItemsCountDataRequest() {    
    var url = API_URL + `items_count.php`;
    
    var counts = await fetch(url)
    .then(response => { return response.json(); }) 
    .catch(err => { console.log('Request failed: ', err) });

    if (!counts || !counts.length) { return; }
    var countsByCategory = {
        so  : counts.filter(c => (c.category === 'songs'))[0].count,
        al  : counts.filter(c => (c.category === 'albums'))[0].count,
        ar  : counts.filter(c => (c.category === 'artists'))[0].count
    }

    return countsByCategory;
};

