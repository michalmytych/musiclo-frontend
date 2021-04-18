import React from 'react'

import editIcon from '../assets/edit.svg';



export default function EditBtn(props) {
    return (
        <div onClick={props.handler}>
            <img src={editIcon} alt="Przycisk edycji." className="crud-icon"/>
        </div>
    )
}
