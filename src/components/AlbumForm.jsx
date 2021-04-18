import React, { Component } from 'react';

import SearchSelect from './SearchSelect';
import { onlyUniqueFilter,uniqueArrayOfObjects } from '../constants';
import { setDateInputValue } from '../display';
import { getSongsOfAlbumRequest } from '../requests';
import popItemIcon from '../assets/pop_item.svg';
import "../styles/ItemForm.css";



export default class AlbumForm extends Component {
    constructor() {
        super();
        this.state = {
            "name"          : "",
            "release_date"  : "",
            "spotify_link"  : "",
            "artists_ids"   : [],
            "artists_names" : [],
            "songs_ids"     : [],
            "ARTISTS"       : [],
            "SONGS"         : [],
        };
        this.handleChange       = this.handleChange.bind(this);
        this.handleSubmit       = this.handleSubmit.bind(this);
        this.getSelectedArtists = this.getSelectedArtists.bind(this);
        this.getSelectedSongs   = this.getSelectedSongs.bind(this);
        this._getSongsOfAlbum   = this._getSongsOfAlbum.bind(this);
        this._mountInstance     = this._mountInstance.bind(this);        
    }

    getSelectedArtists(selections) {
        var _ARTISTS = this.state.ARTISTS.concat(selections);
        var _disctinct = uniqueArrayOfObjects(_ARTISTS, "id");
        this.setState({ ARTISTS : _disctinct });
    }

    getSelectedSongs(selections) {
        var _SONGS = this.state.SONGS.concat(selections);
        var _disctinct = uniqueArrayOfObjects(_SONGS, "id");
        this.setState({ SONGS : _disctinct });
    }

    handleChange(event) {
        this.setState({ [event.target.name] : event.target.value });
    }

    popArtist(id) {
        let artists = this.state.ARTISTS;
        let updated_artists = artists.filter( artists => (artists.id !== id ));
        this.setState({ ARTISTS : updated_artists }); 
    }

    popSong(id) {
        let songs = this.state.SONGS;
        let updated_songs = songs.filter( songs => (songs.id !== id ));
        this.setState({ SONGS : updated_songs }); 
    }

    async _getSongsOfAlbum(album_id) {
        await getSongsOfAlbumRequest(album_id).then(songs => 
            this.setState({ "SONGS" : songs })
        );
    }

    handleSubmit(event) {
        if (this.props._editing) {
            this.props.getEditedAlbum({
                obj         : this.state,
                category    : 'albums',
                id          : this.props.instance.id
            });
        } else {
            this.props.getEditedAlbum({
                obj         : this.state,
                category    : 'albums'               
            });
        }
        event.preventDefault();
    }

    async _mountInstance(instance) {
        var _artists = [];         
        if (instance._artist_ids && instance._artist_ids !== "[null]") {
            var _artists_ids    = JSON.parse(instance._artist_ids).filter(onlyUniqueFilter);
            var _artists_names  = JSON.parse(instance._artist_names).filter(onlyUniqueFilter);
            if (_artists_names.length===_artists_ids.length) {
                var _artists = [];
                _artists_names.forEach((a, i) => {
                    _artists[i] = {id: _artists_ids[i], name: a}
                });
            } 
        }
        this.setState({
            "name"              : instance.name,
            "spotify_link"      : instance.spotify_link,
            "release_date"      : instance.release_date,
            "artists_ids"       : _artists_ids,
            "artists_names"     : _artists_names,
            "ARTISTS"           : _artists
        });
    }

    componentDidMount() {
        if (this.props._editing) {
            this._mountInstance(this.props.instance);
            this._getSongsOfAlbum(this.props.instance.id);
        } else {
            this.setState({ "release_date" : setDateInputValue() });
        }
    }

    render() {
        return (
            <form
                className="animate__animated animate__fadeInDown" 
                onSubmit={this.handleSubmit}>
                <label id="lab_name" className="input-label">Nazwa albumu</label>
                <input aria-labelledby="lab_name"
                    onChange={this.handleChange}
                    type="text" 
                    name="name" 
                    value={this.state.name}
                    placeholder="Nazwa..."/>
                <p className="input-label">Artyści</p>
                {
                    this.state.ARTISTS ?
                        this.state.ARTISTS.length ?
                        this.state.ARTISTS.map((a) => (
                            <li className="select-srch-li">
                                <div
                                    className="selected-search-select-item" 
                                    onClick={()=>this.popArtist(a.id)}>
                                    <img className="pop-item-btn" src={popItemIcon} alt="Ikona usuwania artysty."></img>{
                                    a.name.length > 20 ? a.name.slice(0,17) + "..." : a.name
                                    }</div>
                            </li>                                
                        )) : <p>Brak wykonawców.</p>
                    : null
                }      
                <SearchSelect 
                    multiple_choice={true}
                    _getInitialValue={(p) => this.getSelectedArtists(p)}
                    getValues={(p) => this.getSelectedArtists(p)} 
                    category={"artists"} />
                <p className="input-label">Utwory</p>
                {
                    this.state.SONGS ?
                        this.state.SONGS.length ?
                        this.state.SONGS.map((a) => (
                            <li className="select-srch-li">
                                <div
                                    className="selected-search-select-item" 
                                    onClick={()=>this.popSong(a.id)}>
                                    <img className="pop-item-btn" src={popItemIcon} alt="Ikona usuwania piosenki."></img>{
                                    a.name.length > 20 ? a.name.slice(0,17) + "..." : a.name
                                    }</div>
                            </li>                                
                        )) : <p>Brak piosenek.</p>
                    : null
                }                      
                <SearchSelect 
                    multiple_choice={true}
                    _getInitialValue={(s) => this.getSelectedSongs(s)}
                    getValues={(s) => this.getSelectedSongs(s)}
                    category={"songs"} />
                <label id="rel_date_name" className="input-label">Data wydania</label>
                <input aria-labelledby="rel_date_name"
                    onChange={this.handleChange} 
                    id="release_date_input"
                    type="date"
                    value={this.state.release_date}
                    name="release_date"></input>
                <label id="lab_spotl" className="input-label">Link do albumu w Spotify</label>
                <input aria-labelledby="lab_spotl"
                    onChange={this.handleChange} 
                    id="spotify_link"
                    type="text" 
                    value={this.state.spotify_link}
                    placeholder="Wklej link..."
                    name="spotify_link"></input>                                                     
                <button 
                    className="form-submit-btn"
                    type={"submit"}>Zapisz</button>                    
            </form>
        )
    }
}
