import React from 'react'

import { CanvasJSChart } from 'canvasjs-react-charts';



export default function SpotifyFeaturesChart(props) {
    const PREPARED_DATASET = [
        { label: "Taneczność",       y: props.DATASET.danceability,      color: '#ff4d8b', },
        { label: "Energiczność",     y: props.DATASET.energy,            color: '#fbff12', },
        { label: "Akustyczność",     y: props.DATASET.acousticness,      color: '#b15bda', },
        { label: "Instrumentalność", y: props.DATASET.instrumentalness,  color: '#41ead4', },
        { label: "Pozytywność",      y: props.DATASET.valence,           color: '#2af377' }
    ];

    const CHART_CONFIG = {
		title: { text: "Statystyki utworu według Spotify" },
        axisY: { maximum: 1, },
        height: 200,
        width: 600,
        theme: "dark1",
        backgroundColor: 'transparent',
		data: [              
            { type: "column", dataPoints: PREPARED_DATASET }
		]
	}
    
    return <CanvasJSChart options={CHART_CONFIG}/>
}
