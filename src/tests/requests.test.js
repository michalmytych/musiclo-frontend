import {
    getItemsListRequest,
    getSongsOfAlbumRequest,
    getItemRequest,
    getItemsCountDataRequest,
    getSearchResultsRequest,
    createItemRequest
} from '../requests';

import { getRandomInt } from '../constants';


let song_properties = [
    'id',
    'name',
    'explicit',
    'key',
    'mode',
    'danceability',
    'energy',
    'acousticness',
    'instrumentalness',
    'release_date',
    'valence',
    'spotify_link',
    'album_name',
    'album_id',
    '_artists_names',
    '_artists_ids'
]

let album_properties = [
    'id',
    'name',
    'release_date',
    'spotify_link',
    '_artist_names',
    '_artist_ids'
]

let artist_properties = [
    'id',
    'name',
    'description',
    'spotify_link',
    '_albums_names',
    '_albums_ids',
    '_country_name'
]

const checkIfObjectsHaveProperties = (objects, properties) => {
    for(let i = 0; i < objects.length; i++){
        for(let x = 0; x < properties.length; x++){
            expect(objects[i]).toHaveProperty(properties[x]);
        }          
    } 
}

const getRandomItemId = (category) => {
    return getItemsListRequest({c:category, l:1, p:getRandomInt(0,100)})
        .then(list => { list[0].id });        
}

test('Get Items List of Songs request', () => {
    var args = {l : getRandomInt(1, 30), p : getRandomInt(0, 100), c : "songs"};

    return getItemsListRequest(args).then(
        list => {
            expect(list).toBeTruthy();
            expect(list.length).toBeGreaterThan(0);                        
        
            checkIfObjectsHaveProperties(list, song_properties);
        }
    );   
});


test('Get Items List of Albums request', () => {
    var args = {l : getRandomInt(0, 30), p : getRandomInt(0,100), c : "albums"};

    return getItemsListRequest(args).then(
        list => {
            expect(list).toBeTruthy();
            expect(list.length).toBeGreaterThan(1);                        
        
            checkIfObjectsHaveProperties(list, album_properties);
        }
    );   
});


test('Get Items List of Artists request', () => {
    var args = {l : getRandomInt(0, 30), p : getRandomInt(0,100), c : "artists"};

    return getItemsListRequest(args).then(
        list => {
            expect(list).toBeTruthy();
            expect(list.length).toBeGreaterThan(1);                        
        
            checkIfObjectsHaveProperties(list, artist_properties);
        }
    );   
});


test('Get Songs List of Album by its ID request', () => {
    var id = "02IWlpaz5c17t21cs0PW9L";
    return getSongsOfAlbumRequest(id).then(
        result => {
            expect(result).toBeTruthy()
            expect(result.length).toBeGreaterThan(0);
        }
    )
});


test('Get Song request', () => {
    var args = {id: "00I5FQwV6QKSMF8Sa9Uy4x", category: "songs"};

    return getItemRequest(args).then(
        result => {
            expect(result).toBeTruthy();            
            checkIfObjectsHaveProperties([result], song_properties);
        }
    )
})


test('Get Album request', () => {
    var args = {id: "03QC8nHq1ZKgqOdM7DHkpM", category: "albums"};

    return getItemRequest(args).then(
        result => {
            expect(result).toBeTruthy();            
            checkIfObjectsHaveProperties([result], album_properties);
        }
    )
})


test('Get Artist request', () => {
    var args = {id: "01lysLifxXLWUGSGYm1VER", category: "artists"};

    return getItemRequest(args).then(
        result => {
            expect(result).toBeTruthy();            
            checkIfObjectsHaveProperties([result], artist_properties);
        }
    )
})


test('Get random Song request', () => {
    var args = {id: getRandomItemId("songs"), category: "songs"};

    return getItemRequest(args).then(
        result => {
            expect(result).toBeTruthy();            
            checkIfObjectsHaveProperties([result], song_properties);
        }
    )
})


test('Get random Album request', () => {
    var args = {id: getRandomItemId("albums"), category: "albums"};

    return getItemRequest(args).then(
        result => {
            expect(result).toBeTruthy();            
            checkIfObjectsHaveProperties([result], album_properties);
        }
    )
})


test('Get random Artist request', () => {
    var args = {id: getRandomItemId("artists"), category: "artists"};

    return getItemRequest(args).then(
        result => {
            expect(result).toBeTruthy();            
            checkIfObjectsHaveProperties([result], artist_properties);
        }
    )
})


test('Get database items count request', () => {
    var dbItemsCountProps = ["al", "ar", "so"];

    return getItemsCountDataRequest().then(
        result => {
            expect(result).toBeTruthy();            
            checkIfObjectsHaveProperties([result], dbItemsCountProps);
        }
    )
})


test('Get songs search results request', () => {
    var args = {c: "songs",p: "Sing"};
    
    return getSearchResultsRequest(args).then(
        results => {
            expect(results).toBeTruthy();
            checkIfObjectsHaveProperties(results, song_properties);
        }
    )
})


test('Get albums search results request', () => {
    var args = {c: "albums",p: "kick"};
    
    return getSearchResultsRequest(args).then(
        results => {
            expect(results).toBeTruthy();
            checkIfObjectsHaveProperties(results, album_properties);
        }
    )
})


test('Get artists search results request', () => {
    var args = {c: "artists",p: "joe"};
    /* At search artist object has no description because its not needed */
    var search_artist_properties = artist_properties.filter(a => ( a !== "description"));
    
    return getSearchResultsRequest(args).then(
        results => {
            expect(results).toBeTruthy();
            checkIfObjectsHaveProperties(results, search_artist_properties);
        }
    )
})
