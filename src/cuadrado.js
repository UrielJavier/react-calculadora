import React from 'react';
import './index.css';

export class Cuadrado extends React.Component {
    render(){
        return <div id={'cuadrado_'+this.props.id}>{this.props.id}</div>
    }
}
