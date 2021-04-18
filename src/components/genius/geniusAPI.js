// Read-only access token
const GENIUS_ACCESS_TOKEN = "iqoJ-4kebY6voFsJkduc_idY13crFwhT1wOa_YIXVUMte6TIEp2ww-0xAGq48it6";


export async function geniusApiSearchRequest(query) {
    var searchUrl = `https://api.genius.com/search?q=${query}`;
    var url = searchUrl + `&access_token=${GENIUS_ACCESS_TOKEN}`;
    
    return await fetch(url)
    .then(response => response.json())
    .catch(err => { console.log('Request failed: ', err) });        
};


export async function geniusApiItemRequest(itemApiPath) {
    var songUrl = `https://api.genius.com${itemApiPath}`;
    var url = songUrl + `?access_token=${GENIUS_ACCESS_TOKEN}`;
    
    return await fetch(url)
    .then(response => response.json())
    .catch(err => { console.log('Request failed: ', err) });        
};