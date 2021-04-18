import React, { Component } from 'react'

import { getSearchResultsRequest } from '../requests';
import { 
    uniqueArrayOfObjects, 
    validateItems 
} from '../constants';
import { viewAlert } from '../display';


export default class SearchSelect extends Component {
    constructor() {
        super();
        this.state = {
            "results"           : [],
            "search_input"      : "",
            "category_name"     : "",
            "selected_options"  : []
            
        };
        this.handleChange       = this.handleChange.bind(this);
        this.getSelectedOptions = this.getSelectedOptions.bind(this);
        this._getSearchResults  = this._getSearchResults.bind(this);
        this.setSearchCategory  = this.setSearchCategory.bind(this);
    }

    async _getSearchResults(category, search_input) {
        await getSearchResultsRequest({
            c : category,
            p : search_input
        })
        .then(results => this.setState({ "results" : results }))        
    }

    setSearchCategory = () => {
        switch(this.props.category) {
            case 'songs':
                this.setState({ "category_name" : "piosenkę" }); break;
            case 'albums':
                this.setState({ "category_name" : "album" }); break;
            case 'artists':
                this.setState({ "category_name" : "wykonawcę" }); break;
            default:
                this.setState({ "category_name" : "piosenkę" });
        }
    }

    getSelectedOptions = (e) => {
        var failed = false;
        let selected_values = Array.from(
            e.target.selectedOptions, option => {
                if (option.attributes.name) {
                    var obj = {
                        name: option.attributes.name.textContent, 
                        id: option.value 
                    }
                    if (this.props.category === 'songs') {
                        var chosen = this.state.results.filter((r) => (r.id === obj.id));
                        if (!chosen[0].album_id) { return obj; } 
                        else {
                            viewAlert('Ten utwór ma już przypisany album!', false); 
                            failed = true;
                        }
                    } else { return obj; }
                }                 
            } 
        );
        if (failed) { return; }
        this.setState({ "selected_options" : selected_values });
        this.props.getValues(selected_values);
    }

    setInitialValues = () => { this.props._getInitialValue([]); } 

    handleChange(event) {        
        this._getSearchResults(this.props.category, event.target.value);
        this.setState({ [event.target.name] : event.target.value });
    }

    componentDidMount = () => {
        this.setSearchCategory();
        this.setInitialValues();
    }

    render() {
        var _results = uniqueArrayOfObjects(this.state.results, "id");
        _results = validateItems(_results);

        return (
            <div>
                <input 
                    onChange={this.handleChange} 
                    type="text" 
                    placeholder={"Znajdź..."}></input>
                <div>
                    {
                        this.props.multiple_choice ?
                        <select 
                            value={this.state.selected_options}
                            id="search_select" multiple onChange={this.getSelectedOptions}>                           
                        {
                        _results && _results.length ?
                            _results.map(result => (
                                <option 
                                    name={result.name}
                                    value={result.id} 
                                    key={result.id} >
                                    {result.name}
                                </option>                        
                            )) : <option>{"Wybierz..."}</option>
                        }
                        </select>
                        :
                        <select 
                        value={this.state.selected_options}
                        id="search_select" onChange={this.getSelectedOptions}>                           
                        {
                        _results && _results.length ?
                            _results.map(result => (
                                    <option 
                                        name={result.name}
                                        value={result.id} key={result.id} >
                                        {result.name}
                                    </option>                              
                            )) : <option>{"Wybierz..."}</option>
                        }
                        </select>
                    }
                    
                </div>
            </div>
        )
    }
}
