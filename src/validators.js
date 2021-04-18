/**
 * 
 * Functions for validation of objects coming from
 * forms to requests functions.
 * 
 */

const validateSong = (song) => {    
    if (!song.name) { alert("Nie wypełniono wymaganego pola!"); return false; }
    
    var validSong = {};
    validSong.name = song.name;
    
    validSong.album_id = null;
    if (song.ALBUM) { validSong.album_id = song.ALBUM.id; } 
    
    validSong.artists_ids = []; 
    if (song.ARTISTS && song.ARTISTS.length > 0) {
        validSong.artists_ids = Array.from(song.ARTISTS, a => a.id); 
    }
    
    validSong.danceability = 0;
    if (song.danceability) { validSong.danceability = parseFloat(song.danceability); };
    if (!song.explicit || song.explicit==='false' || song.explicit==='NaN') {
        validSong.explicit = 0;
    } else {
        validSong.explicit = parseInt(song.explicit);
    }     
    
    validSong.energy = 0;
    if (song.energy) { validSong.energy = parseFloat(song.energy); };
    
    validSong.instrumentalness = 0;
    if (song.instrumentalness) { validSong.instrumentalness = parseFloat(song.instrumentalness); };
    
    validSong.acousticness = 0;
    if (song.acousticness) { validSong.acousticness = parseFloat(song.acousticness); };
    
    validSong.valence = 0;
    if (song.valence) { validSong.valence = parseFloat(song.valence); };
    
    validSong.spotify_link = null;
    if (song.spotify_link) { validSong.spotify_link = song.spotify_link };
    
    validSong.key = null;
    if (song.key || song.key===0) { validSong.key = parseInt(song.key); }
    
    validSong.mode = null;
    if (song.mode || song.mode===0) { validSong.mode = parseInt(song.mode); }
    
    validSong.release_date = null;
    if (song.release_date) { validSong.release_date = song.release_date; };

    return { category : 'songs', obj : validSong };
}


const validateAlbum = (album) => {
    if (!album.name) { alert("Nie wypełniono wymaganego pola!"); return false; }

    var validAlbum = {};
    validAlbum.name = album.name;
    validAlbum.artists_ids = [];

    if (album.ARTISTS && album.ARTISTS.length > 0) {
        validAlbum.artists_ids = Array.from(album.ARTISTS, a => a.id); 
    }

    validAlbum.songs_ids = [];
    if (album.SONGS && album.SONGS.length > 0) {
        validAlbum.songs_ids = Array.from(album.SONGS, a => a.id); 
    }

    validAlbum.explicit = 0;
    if (!album.explicit || album.explicit==='false' || album.explicit==='NaN') {
        validAlbum.explicit = 0;
    } else {
        validAlbum.explicit = parseInt(album.explicit);
    }    
    
    validAlbum.release_date = null;
    if (album.release_date) { validAlbum.release_date = album.release_date}
    
    validAlbum.spotify_link = null;
    if (album.spotify_link) { validAlbum.spotify_link = album.spotify_link}

    return { category : 'albums', obj : validAlbum };
}


const validateArtist = (artist) => {    
    if (!artist.name) { alert("Nie wypełniono wymaganego pola!"); return false; }
    
    var validArtist = {};
    validArtist.name = artist.name; 
        
    validArtist.albums_ids = [];
    if (artist.ALBUMS && artist.ALBUMS.length > 0) {
        validArtist.albums_ids = Array.from(artist.ALBUMS, a => a.id); 
    }

    validArtist.description = null;
    if (artist.description) { validArtist.description = artist.description; };

    validArtist.country = null;
    if (artist.country) { validArtist.country = artist.country; };
        
    validArtist.spotify_link = null;
    if (artist.spotify_link) { validArtist.spotify_link = artist.spotify_link; };
    
    return { category : 'artists', obj : validArtist };
}


export const validateItemBeforePost = (args) => {
    switch (args.category) {
        case 'songs':
            return validateSong(args.obj); 
        case 'albums':
            return validateAlbum(args.obj); 
        case 'artists':
            return validateArtist(args.obj); 
        default:
            alert("Niepoprawna kategoria publikowanego obiektu!");
    }
}