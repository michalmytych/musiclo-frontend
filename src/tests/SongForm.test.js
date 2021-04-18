import React from 'react';

import SongForm from '../components/SongForm';

import { render, screen, cleanup } from '@testing-library/react';


afterEach(cleanup);

it('Inserts instance object into form when editing', () => {
    const instance = {
        'id'                : "00qzixGEPA7WFtbDn0fi15",
        'name'              : "Eternity",
        'explicit'          : "1",
        'key'               : 1,
        'mode'              : "1",
        'danceability'      : 0.87,
        'energy'            : "0.87",
        'acousticness'      : 0.87,
        'instrumentalness'  : "0.87",
        'release_date'      : "2008-01-06",
        'valence'           : "0.87",
        'spotify_link'      : "https://open.spotify.com/embed/track/00qzixGEPA7WFtbDn0fi15",
        'album_name'        : "Wrong Way to Salvation",
        'album_id'          : "6MmlyPnDHhoQ2WiQf5Mpbj",
        '_artists_names'    : "[\"Silentrain\"]",
        '_artists_ids'      : "[\"5nqBpBwv9SysHcqqkKs3hS\"]"
    };
    
    render(
        <SongForm 
            _editing={true}
            category={"songs"}
            instance={instance}/>
    );

    const nameInput             = screen.getByLabelText("Tytuł");
    const energyInput           = screen.getByLabelText("Energia");
    const acousticnessInput     = screen.getByLabelText("Akustyczność");        
    const instrumentalnessInput = screen.getByLabelText("Żywe instrumenty");        
    const danceabilityInput     = screen.getByLabelText("Taneczność");
    const valenceInput          = screen.getByLabelText("Pozytywność");        
    const releaseDateInput      = screen.getByLabelText("Data wydania");        
    const spotifyLinkDateInput  = screen.getByLabelText("Utwór w Spotify");   
    const explicitInput         = screen.getByLabelText("EXPLICIT");    
    const keyInput              = screen.getByLabelText("Klucz");
    const modeInput             = screen.getByLabelText("Tryb");

    expect(nameInput.value)             .toBe(instance.name);        
    expect(energyInput.value)           .toBe(instance.energy.toString());
    expect(acousticnessInput.value)     .toBe(instance.acousticness.toString());
    expect(instrumentalnessInput.value) .toBe(instance.instrumentalness.toString());
    expect(valenceInput.value)          .toBe(instance.valence.toString());
    expect(danceabilityInput.value)     .toBe(instance.danceability.toString());
    expect(releaseDateInput.value)      .toBe(instance.release_date);
    expect(spotifyLinkDateInput.value)  .toBe(instance.spotify_link);        
    
    expect(explicitInput.checked).toBeTruthy();
    
    expect(keyInput.value).toBe(instance.key.toString());
    expect(modeInput.value).toBe(instance.mode.toString());

    /*
        Artists ids and albums ids should be tested
        in SelectSearch component.
    */
})
