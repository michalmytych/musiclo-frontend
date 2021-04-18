import React, { Component, Fragment } from 'react';

import InfiniteScroll from "react-infinite-scroll-component";
import Item from './Item';
import ItemForm from './ItemForm';
import { 
    getItemsListRequest,
    createItemRequest,
    getSearchResultsRequest,
    getCountriesDataRequest,
    getItemsCountDataRequest
} from '../requests';
import { 
    handleCategoryViewChange,
    setActiveCategoryStyles,
    viewAlert
} from '../display';
import { uniqueArrayOfObjects, validateItems } from '../constants';
import loadingSpinner from '../assets/loading.svg';
import addIcon from '../assets/add.svg';
import artistIcon from '../assets/artist.svg';
import albumIcon from '../assets/cd.svg';
import trackIcon from '../assets/tune.svg';
import { validateItemBeforePost } from '../validators';
import '../styles/Search.css';
import '../styles/List.css';



const AddItemButton = (props) => {
    return (
        <div className="add-item-wrapper" onClick={props.handler}>
            <img className="crud-icon add-item-icon" src={addIcon} alt="Przycisk dodawania."/>
        </div>
    )
}


export default class List extends Component {
    constructor() {
        super();
        this.state = {
            category            : 'songs',
            songs               : {"category": 'songs', "items": []},
            albums              : {"category": 'albums', "items": []},
            artists             : {"category": 'artists', "items": []},            
            items_limit         : 7,
            page                : 0,
            phrase              : "",
            hasMoreItems        : true,
            dbRecordsCount      : false,
            nothingFound        : false,
            show_creation_box   : false,
            item_deleted        : false,
            COUNTRIES           : []
        };
        this.handleChange               = this.handleChange.bind(this);
        this._getItemsList              = this._getItemsList.bind(this);
        this.refreshListAfterEdit       = this.refreshListAfterEdit.bind(this);
        this._createItem                = this._createItem.bind(this);
        this._getMoreItems              = this._getMoreItems.bind(this);
        this.toggleCreationFormDisplay  = this.toggleCreationFormDisplay.bind(this);
        this.updateListAfterDelete      = this.updateListAfterDelete.bind(this);
        this.handleCategorySwitch       = this.handleCategorySwitch.bind(this);
        this._getCountriesData          = this._getCountriesData.bind(this);
        this._getItemsCountData         = this._getItemsCountData.bind(this);
    }
 
    /*
        CRUD method for list view
    */
    async _getItemsList(args) {
        await getItemsListRequest({ 
            c : args.category, 
            p : args.page,
            l : this.state.items_limit
        }).then(items => {
                if (!items) return;
                if (items.length < this.state.items_limit) {
                    this.setState({ hasMoreItems: false });
                }
                this.setState({
                    [args.category] : {
                        "category" : args.category, 
                        "items" : this.state[args.category].items.concat(items)
                    }
                });
            }        
        )        
    }

    async _getSearchResults(args) {
        let LIST = await getSearchResultsRequest({
            c    : args.category, 
            p    : args.phrase
        }).then(list => validateItems(list))
        if (!LIST.length) { this.setState({ nothingFound: true }) } 
        else {
            this.setState({ hasMoreItems: false, nothingFound: false });
            this.setState({
                [args.category] : {
                    "category"  : args.category, 
                    "items"     : this.state[args.category].items.concat(LIST)
                }
            });
        }        
    }    

    refreshListAfterEdit = () => {
        if (this.state.page !== 0) { this.setState({ page : 0 }) }
        this._getItemsList({ category : this.state.category, page : 0 }); 
    }   

    async _createItem(args) {
        var validArgs = validateItemBeforePost(args);
        if (!validArgs) { viewAlert("Niepoprawne dane!", false); return; }
        await createItemRequest(validArgs).then( res => {
            if (res===201 || res===200) {                  
                this._getItemsList({category: this.state.category, page: 0}); 
                viewAlert("Dodano!", true); return; 
            } 
            viewAlert("Request nie powiódł się!", false);
        })
    }

    async _getCountriesData() {
        getCountriesDataRequest().then(data => this.setState({ "COUNTRIES" : data }));
    }

    async _getItemsCountData() { 
        getItemsCountDataRequest().then(data => this.setState({ dbRecordsCount: data }));
    }

    _getMoreItems = () => {
        var page = this.state.page;
        this.setState({ page : this.state.page+1 });
        this._getItemsList({category: this.state.category, page: page+1});
    }

    toggleCreationFormDisplay = () => {
        this.setState({ "show_creation_box" : !this.state.show_creation_box });
    }

    updateListAfterDelete = (item_id) => {
        var list = this.state[this.state.category].items;
        var index = list.map(e => e.id).indexOf(item_id);
        list.splice(index, 1);
        this.setState({
            [this.state.category]   : { category: this.state.category, items: list},
            item_deleted            : !this.state.item_deleted
        });
    }

    handleCategorySwitch = (category) => {
        if (this.state.category !== category) {
            this.setState({ "category": category });
            this._getItemsList({category: category, page: 0});
            handleCategoryViewChange(category);
        }        
    }

    handleChange(event) {        
        this.setState({ [event.target.name] : event.target.value });

        if (!event.target.value) {
            this.setState({ 
                hasMoreItems        : true,
                songs               : {"category": 'songs', "items": []},
                albums              : {"category": 'albums', "items": []},
                artists             : {"category": 'artists', "items": []},
            });
            this._getItemsList({category: this.state.category, page: 0});
        } else {
            this.setState({ 
                songs               : {"category": 'songs', "items": []},
                albums              : {"category": 'albums', "items": []},
                artists             : {"category": 'artists', "items": []},
            });            
            this._getSearchResults({
                category    : this.state.category, 
                phrase      : event.target.value,
            });
        }
    }

    componentDidMount() {
        this._getItemsList({category: this.state.category, page: this.state.page});
        this._getCountriesData();        
        this._getItemsCountData();
        setActiveCategoryStyles('songs-swt');
    }

    render() {
        var dbCount = this.state.dbRecordsCount;
        const loader = <div className="loader-wrapper"><img alt="" className="loader" src={loadingSpinner}/></div>
        var _ITEMS_LIST;
        switch (this.state.category) {
            case 'songs':
                _ITEMS_LIST = this.state.songs; break;
            case 'albums':
                _ITEMS_LIST = this.state.albums; break;
            case 'artists':
                _ITEMS_LIST = this.state.artists; break;
            default:            
                _ITEMS_LIST = [];
        }
        
        var _dataLength = this.state[_ITEMS_LIST.category].items.length;
        _ITEMS_LIST.items = uniqueArrayOfObjects(_ITEMS_LIST.items, "id");

        return (
            <div className="List">
                {
                    this.state.show_creation_box ?
                    <Fragment>
                        <div
                            onClick={this.toggleCreationFormDisplay} 
                            className="animate__animated animate__fadeIn blurred-form-background"></div>                           
                        <ItemForm
                            _editing={false}     
                            _countries={this.state.COUNTRIES}
                            category={_ITEMS_LIST.category}
                            onSave={(created_object) => this._createItem(
                                created_object
                            )}
                            toggler={this.toggleCreationFormDisplay} />                            
                    </Fragment> : null
                }                
                <div className="category-switch">
                    <div id="songs-swt"
                        onClick={() => this.handleCategorySwitch('songs')}
                        className="songs-switch-btn">
                        <img alt="Ikona piosenek." src={trackIcon} className="category-icon"></img>
                        <div className="cat-text-name">Piosenki</div>
                    </div>
                    <div id="albums-swt"
                        onClick={() => this.handleCategorySwitch('albums')} 
                        className="albums-switch-btn">
                        <img alt="Ikona albumów." src={albumIcon} className="category-icon"></img>
                        <div className="cat-text-name">Albumy</div>
                    </div>
                    <div id="artists-swt"
                        onClick={() => this.handleCategorySwitch('artists')} 
                        className="artists-switch-btn">
                        <img alt="Ikona artystów." src={artistIcon} className="category-icon"></img>
                        <div className="cat-text-name">Artyści</div>         
                    </div>
                </div>
                <div className="items-wrapper">
                    <div className="add-and-search-wrapper">
                        <AddItemButton 
                            handler={() => this.toggleCreationFormDisplay()}/>
                        <div className="Search">
                            <input
                                spellCheck="false"
                                autoComplete="off"
                                contentEditable="true" 
                                value={this.state.phrase}
                                onChange={this.handleChange}
                                placeholder={"Znajdź..."}
                                className="search-bar-input"
                                name="phrase" ></input>
                        </div>
                    </div>
                    {
                        dbCount ? 
                        <div className="count-capt">Baza danych zawiera <div className="c-capt so">{dbCount.so}</div> 
                        utworów, <div className="c-capt al">{dbCount.al}</div> albumów i 
                        <div className="c-capt ar">{dbCount.ar}</div> artystów.</div> : null
                    }                    
                    <ul>
                        {
                            _ITEMS_LIST.items && _ITEMS_LIST.items.length ?
                            <InfiniteScroll
                                dataLength={_dataLength}
                                next={() => this._getMoreItems()}
                                hasMore={this.state.hasMoreItems}
                                loader={loader}>
                                {this.state[_ITEMS_LIST.category].items.map((item) => (
                                    <li key={item.id}>
                                        <Item
                                            _countries={this.state.COUNTRIES}
                                            popDeletedItem={(id) => this.updateListAfterDelete(id)}
                                            refreshAfterEdit={() => this.refreshListAfterEdit()}
                                            category={_ITEMS_LIST.category}                                    
                                            item={item}/>
                                    </li>
                                ))}
                            </InfiniteScroll> 
                            : this.state.nothingFound ? <h3 className="NoData">Nic tu nie ma</h3> : loader                                
                        }
                    </ul>
                </div>                
            </div>
        )
    }
}