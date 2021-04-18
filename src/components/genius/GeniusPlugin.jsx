import React, { Component } from 'react'

import ScriptTag from 'react-script-tag';
import { geniusApiSearchRequest, geniusApiItemRequest } from './geniusAPI';
import smallerSpinner from '../../assets/smaller-loader.svg';
import { viewAlert } from '../../display';
import '../../styles/GeniusPlugin.css';


const prepareGeniusSearchQuery = (text) => {
    if (!text) return;
    text = text.replace(/[^a-zA-Z0-9 ]/g, "");
    text = text.split(" ");
    if (text.length > 7) {
        text = text.slice(0, 7);
        text = text.join(" ");
    }
    return encodeURIComponent(text);
}


const GeniusEmbedScript = (props) => (
    /**
     * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Is being blocked because:                         *
     * "Failed to execute 'write' on 'Document':         *
     * It isn't possible to write into a document        *
     * from an asynchronously-loaded external script     *
     * unless it is explicitly opened" (Inspect->Sources)*
     * * * * * * * * * * * * * * * * * * * * * * * * * * *
     */
    <ScriptTag 
        crossOrigin="true" 
        type="text/javascript" 
        src={props.scriptURL} />
)


export default class GeniusPlugin extends Component {
    state = {
        searchResults     : [],
        viewedResultIndex : 0,
        viewedItem        : null,  
        showQuestion      : true,
        viewedItemEmbed   : false,
        nothingFound      : false
    };

    async _getGeniusSearchResults(query) {
        return await geniusApiSearchRequest(query).then(res => {
            if (!res || res.meta.status!==200) { viewAlert("Request nie powiódł się !", false); return; }
            if (!res.response.hits.length) { this.setState({nothingFound : true}); return; }
            this.setState({ searchResults : res.response.hits });
            return res.response.hits;
        });
    }

    async _getGeniusItem(itemApiPath) {
        return await geniusApiItemRequest(itemApiPath).then(res => {
            if (!res || res.meta.status!==200) { viewAlert("Request nie powiódł się !", false); return; }
            return res;
        });
    }

    async createGeniusMarkup(results, index) {
        var itemPath = results[index].result.api_path;
        if (!itemPath) { return; };
        
        await this._getGeniusItem(itemPath).then(item => {
            if (item && item.response.song) {
                this.setState({
                    viewedItem : item.response.song,
                }); 
            }
        });            
    }

    handleBadLyrics = () => {
        this.setState({viewedItem : null });
        var index = this.state.viewedResultIndex;
        if (this.state.searchResults[index + 1]) {
            viewAlert("Znalazłem coś jeszcze...", true, 0.8);
            this.createGeniusMarkup(this.state.searchResults, index + 1);
            this.setState({viewedResultIndex : index + 1}); return;
        }
        this.setState({showQuestion : false});
        viewAlert("Wiem, trochę to słabo działa ale ta nuta też nie jest hitem!", false, 2);
    }

    async componentDidMount() {       
        var searchQuery = prepareGeniusSearchQuery(this.props.searchQuery);
        var items = await this._getGeniusSearchResults(searchQuery);
        if (items && items.length) { 
            this.createGeniusMarkup(items, this.state.viewedResultIndex);
        }
    }
    
    render() {
        return (
            <div className="genius-embed-wrapper">   
                {
                    !this.state.nothingFound && this.state.viewedItem && this.state.viewedItem.id ?                
                    <div className="genius-embed animate__animated animate__fadeIn">
                        <a 
                            rel="noreferrer"
                            target="_blank"
                            href={this.state.viewedItem.url}>
                            <div className="beta-f-sign">BETA XD</div>
                            <img 
                                className="genius-album-cover"
                                alt="Okładka piosenki" 
                                src={this.state.viewedItem.song_art_image_thumbnail_url}></img>
                            <p className="genius-item-name">
                            { this.state.viewedItem.full_title.length && this.state.viewedItem.full_title.length>35 ? 
                            this.state.viewedItem.full_title.slice(0,35)+"..." : this.state.viewedItem.full_title}
                            </p>
                        </a>
                        <div                         
                            id={`rg_embed_link_${this.state.viewedItem.id}`} 
                            className='rg_embed_link' 
                            data-song-id={`${this.state.viewedItem.id}`}>
                            Znalazłem <a 
                                rel="noreferrer"
                                target="_blank" 
                                href={this.state.viewedItem.url}>
                            słowa piosenki</a> w serwisie <div className="genius-logo">GENIUS</div></div> 
                            <GeniusEmbedScript scriptURL={`https://genius.com/songs/${this.state.viewedItem.id}/embed.js`} />                        

                        {
                            this.state.showQuestion ?
                            <div className="genius-search-qst" onClick={this.handleBadLyrics}>
                                To nie jest tekst piosenki o którą mi chodziło!
                            </div> 
                            : <div className="genius-search-qst">To wszystko co znalazłem</div>
                        }          

                    </div> 
                    :         
                    //!this.state.nothingFound &&            
                    this.state.viewedResultIndex<this.state.searchResults.length-1 ?
                        <img alt="Ikona ładowania."
                            className="smaller-loader" 
                            src={smallerSpinner}/>  
                    : this.state.viewedResultIndex ? 
                    <div className="NoData mt">Nic więcej nie znalazłem</div>
                    : <div className="NoData mt">Nie znaleziono w serwisie Genius</div>         
                }                            
            </div>
        )
    }
}

