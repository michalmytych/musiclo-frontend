import React from 'react';

import ArtistForm from '../components/ArtistForm';

import { render, cleanup } from '@testing-library/react';
import { shallow } from 'enzyme';


afterEach(cleanup);

const artistInstance = {
    "id"            : "somefakeidTestTestTest",
    "name"          : "Metallica",
    "albums_names"  : ["Antheil Ballet"],
    "albums_ids"    : ["2QkfFdcgTH2tHMi9cTu51q"],  
    "description"   : "Amerykański zespół thrashmetalowy z Los Angeles",
    "country"       : "US",
    "spotify_link"  : "https://open.spotify.com/artist/2ye2Wgw4gimLv2eAKyk1NB?si=uo9QgEVOR8ywfuvE73kFAQ"
};


it('Inserts instance object into form when editing', () => {    
    const artistForm = render(
        <ArtistForm 
            _editing={true}
            category={"artists"}
            instance={artistInstance}/>
    );

    const nameInput         = artistForm.getByLabelText("Nazwa wykonawcy");    
    const descriptionInput  = artistForm.getByLabelText("Opis");        
    const countryInput      = artistForm.getByLabelText("Kraj");        
    const spotifyLinkInput  = artistForm.getByLabelText("Artysta w Spotify");   

    expect(nameInput.value)         .toBe(artistInstance.name);        
    expect(descriptionInput.value)  .toBe(artistInstance.description);
    expect(spotifyLinkInput.value)  .toBe(artistInstance.spotify_link);        
    /* 
        Country is selected from fetched countries data by iso_code. At componentDidMount() async api call
        somehow refreshes component state which causes render() call without full form being completed.
    */
    expect(countryInput.value)      .toBe(artistInstance.country);

    /*
        Albums ids should be tested in SelectSearch component.
    */
})


it('Submits data from form correctly', () => {
    const getEditedArtist = jest.fn(args => args);
    
    const wrapper = shallow(
        <ArtistForm 
            _editing={true}
            getEditedArtist={getEditedArtist}
            category={"artists"}
            instance={artistInstance}/>
    );

    wrapper.find('form').simulate('submit', { preventDefault: jest.fn() });
    
    expect(getEditedArtist).toBeCalledTimes(1);
    
    expect(getEditedArtist).toBeCalledWith({
        id          : "somefakeidTestTestTest",
        category    : "artists",
        obj         : {
            "name"          : "Metallica",
            /* 
                getSelectedAlbums() implementation must be mocked to check
                if ALBUMS and albums_ids arrays are submitted properly 
            */
            "albums_ids"    : [],
            "ALBUMS"        : [],
            
            //"albums_ids"    : ["2QkfFdcgTH2tHMi9cTu51q"],
            //"ALBUMS"        : [{id: "2QkfFdcgTH2tHMi9cTu51q", name: "Antheil Ballet"}],            

            "description"   : "Amerykański zespół thrashmetalowy z Los Angeles",
            "country"       : "US",
            "spotify_link"  : "https://open.spotify.com/artist/2ye2Wgw4gimLv2eAKyk1NB?si=uo9QgEVOR8ywfuvE73kFAQ"            
        }
    });
})





