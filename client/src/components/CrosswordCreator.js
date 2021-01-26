import React from 'react';
import Creator from './Creator'
import { getCookie } from '../js';
import { baseURL } from '../apis';


class CrosswordCreator extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            across: 4,
            down: 4, 
            create: false
        }
    }

    componentDidMount = () => {
        let token = getCookie("jwt_access");
        if(!token) {
            window.location.replace(`${baseURL}/login`)
        }
    }

    handleChange = e =>{
        switch(e.target.name) {
            case 'across':
                this.setState({across: e.target.value})
                break;
            case 'down':
                this.setState({down: e.target.value});
                break;
            default:
                break;
        }
    }

    handleClick = () => {
        this.setState({create: true})
    }

    render() {

        const inputs = (
            <div className="content-container"><div className="form-container">
                <label>Down</label><input 
            name="down"
            type="number"
            min="4"
            max="20"
            onChange={this.handleChange}
            value={this.state.down}
            />
            <label>Across</label>
            <input 
            name="across"
            type="number"
            min="4"
            max="20"
            onChange={this.handleChange}
            value={this.state.across}
            />
            <button className="form-button"
            name="create"
            onClick={this.handleClick}>CREATE!</button></div>
            </div>
        )
        return(
            <div className="container">
            
            {this.state.create ? <Creator across={this.state.across} down={this.state.down}/> : inputs}
            </div>
        )
    }

}

export default CrosswordCreator