import React, { Component, Fragment } from 'react'

import DeleteBtn from './DeleteBtn';
import EditBtn from './EditBtn';
import Confirm from './Confirm';
import ItemForm from './ItemForm';
import SpotifyPlugin from './SpotifyPlugin';
import YouTubeSearch from './YouTubeSearch';
import Details from './Details';
import {
    deleteItemRequest,
    putEditedItemRequest,
    getItemRequest
} from '../requests.js';
import { validateItemBeforePost } from '../validators';
import { viewAlert } from '../display';
import '../styles/Item.css';



export default class Item extends Component {
    state = {
        "item"                  : null,
        "show_confirmation_box" : false,
        "show_edition_box"      : false,
        "edited_object"         : {}
    };

    toggleConfirmationDisplay = () => {
        this.setState({"show_confirmation_box" : !this.state.show_confirmation_box});
    }

    toggleEditionFormDisplay = () => {
        this.setState({
            "show_confirmation_box" : false,
            "show_edition_box"      : !this.state.show_edition_box
        });
    }

    /*
        CRUD methods for single item instance
    */
    async _deleteItem(item_id) {
        await deleteItemRequest({
            "cat"   : this.props.category, 
            "id"    : item_id
        }).then( res => {
            if (res!==200) { viewAlert("Request nie powiódł się!", false); return; }
            this.props.popDeletedItem(item_id);
            viewAlert("Usunięto!", true);
        })        
    }

    async _editItem(args) {
        var validArgs = validateItemBeforePost(args);        
        if (!validArgs) { viewAlert("Niepoprawne dane!", false); return; }
        validArgs.id = args.id;
        let res = await putEditedItemRequest(validArgs);
        if (res!==200) { viewAlert("Request nie powiódł się!", false); return; }
        let item = await getItemRequest(args);
        this.setState({ item : item });
        viewAlert("Zapisano zmiany!", true);                    
    }

    async componentDidMount() {
        if (!this.state.item) {
            let _item = this.props.item;
            this.setState({ item : _item });
        }        
    }

    render() {
        return (
            <Fragment>
                {
                this.state.item && this.state.item.name ?
                <Fragment>
                    <div id={"item_row_" + this.state.item.id}>
                    {
                        this.state.show_confirmation_box ?
                        <Fragment>
                            <div onClick={this.toggleConfirmationDisplay} 
                                className="animate__animated animate__fadeIn blurred-form-background"></div>
                            <Confirm 
                                item={this.state.item}
                                on_ok={() => this._deleteItem(this.state.item.id)}
                                toggler={this.toggleConfirmationDisplay}                    
                                message_header={"Czy napewno chcesz usunąć?"} 
                                message_content={"Tej akcji nie będzie można cofnąć."}/>                                
                        </Fragment>                        
                        : null
                    }
                    {
                        this.state.show_edition_box ?
                        <Fragment>
                            <div onClick={this.toggleEditionFormDisplay} 
                                className="animate__animated animate__fadeIn blurred-form-background"></div>
                            <ItemForm
                                _editing={true}
                                category={this.props.category}            
                                _countries={this.props._countries}
                                instance={this.state.item}
                                onSave={(edited_object) => this._editItem(edited_object)}
                            toggler={this.toggleEditionFormDisplay} />
                            </Fragment>
                        : null
                    }
                        <div className="Item">                             
                            <div className='item-data'>
                                {
                                    this.props.category==='songs' ?
                                    <div>
                                        <p className="tiny-caption">TYTUŁ</p>
                                        <h2 className="song-name">{this.state.item.name}</h2>
                                        {
                                            this.state.item.explicit ?
                                            <div className="explicit-mark">E</div> : null
                                        }
                                        {
                                            this.state.item.album_name ?
                                            <Fragment>
                                                <p className="tiny-caption">ALBUM</p>
                                                <h4 className="album-name">{this.state.item.album_name}</h4>   
                                            </Fragment>                                        
                                            : <h5 className="album-name">SINGLE</h5>
                                        }                            
                                        {
                                            this.state.item.spotify_link ?
                                            <SpotifyPlugin 
                                                id={this.state.item.id}
                                                category={this.props.category} 
                                                link={this.state.item.spotify_link}/>
                                            : <YouTubeSearch 
                                                category={this.props.category}
                                                query={this.state.item.name}/>
                                        }
                                        <Details                                         
                                            item={this.state.item}
                                            category={this.props.category}/>                            
                                    </div> : null
                                }
                                {
                                    this.props.category==='albums' ?
                                    <div>
                                        <p className="tiny-caption">NAZWA</p>
                                        <h2 className="song-name main-album-name">
                                            {this.state.item.name}</h2>                      
                                        {
                                            this.state.item.spotify_link ?
                                            <SpotifyPlugin 
                                                id={this.state.item.id}
                                                category={this.props.category} 
                                                link={this.state.item.spotify_link}/>
                                            : <YouTubeSearch 
                                                category={this.props.category}
                                                query={this.state.item.name}/>
                                        }                      
                                        <Details 
                                            item={this.state.item}
                                            category={this.props.category}/>                              
                                    </div> : null
                                }
                                {
                                    this.props.category==='artists' ?
                                    <div>
                                        <p className="tiny-caption">NAZWA</p>
                                        <h2 className="songs-name artist-name">{this.state.item.name}</h2>                           
                                        {
                                            this.state.item.spotify_link ?
                                            <SpotifyPlugin 
                                                id={this.state.item.id}
                                                category={this.props.category} 
                                                link={this.state.item.spotify_link}/>
                                            : <YouTubeSearch 
                                                category={this.props.category}
                                                query={this.state.item.name}/>
                                        }
                                        <Details 
                                            _countries={this.props._countries}
                                            item={this.state.item}
                                            category={this.props.category}/>                                                      
                                    </div> : null
                                }   
                            </div>
                                <div className='item-crud-options'>
                                    <EditBtn handler={() => this.toggleEditionFormDisplay()}/>
                                    <DeleteBtn handler={() => this.toggleConfirmationDisplay()}/>
                                </div>
                            </div>
                        </div>
                        </Fragment> : null
                    }
            </Fragment>            
        )
    }
}
