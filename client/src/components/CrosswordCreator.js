import React from 'react';
import Creator from './Creator'

class CrosswordCreator extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            across: 4,
            down: 4, 
            create: false,
            error: '',
            header: 'Select the size of your crossword! Minimum is 4x4 and Maximum is 20x20'
        }
    }

    handleChange = e =>{
        this.setState({error: ''})
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
        if(this.state.across > 3 && this.state.across < 21 && this.state.down > 3 && this.state.down < 21) {
        this.setState({create: true})
        this.setState({header: 'Create your crossword!'})
        } else {
            this.setState({error: 'Size of rows and columns should be between 4 and 20!'})
        }
    }

    render() {

        const inputs = (
            <div className="content-container">
                <div className="form-container">
                <label>Down</label><input 
            name="down"
            type="number"
            min="4"
            max="20"
            onChange={this.handleChange}
            value={this.state.down}
            required
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
            onClick={this.handleClick}>CREATE</button>
            {this.state.error}</div>
            </div>
        )
        return(
            <div className="container flex column">
                <h2>{this.state.header}</h2>
            {this.state.create ? <Creator across={this.state.across} down={this.state.down}/> : inputs}
            </div>
        )
    }

}

export default CrosswordCreator