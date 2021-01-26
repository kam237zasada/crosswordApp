import React from 'react';
import { getAddedCrosswords, getSolvedCrosswords, getProgressCrosswords, getUser, getCrossword } from '../actions';
import { getCookie } from '../js';
import { connect } from 'react-redux';
import Loader from './Loader'
import { getDate } from '../js'
import { baseURL } from '../apis'


class AccountCrosswords extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            section: 'added',
            user: {},
            addedSite: 1,
            solvedSite: 1,
            progressSite: 1,
            addedCrosswords: [],
            solvedCrosswords: [],
            progressCrosswords: [],
            addCrL: 0,
            slvCrL: 0,
            prCrL: 0,
            lastSiteAdded: false,
            lastSiteSolved: false,
            lastSiteProgress: false,
            loaded: false,
            crosswordDetails: {},
            dtlSlv: 0,
            dtlRts: 0,
            dtlAdb: '',
            prevSection: ''
        }
    }

    componentDidMount = async () => {
        let token = getCookie("jwt_access")
        if(token) {
            try {
                await this.props.getUser(token)
            } catch(err) {
                return window.location.replace(`${baseURL}/login`)
            }
        } 
        
        this.setState({user: this.props.user})

        await this.props.getAddedCrosswords(this.state.user._id, this.state.addedSite)
        await this.setState({addedCrosswords: this.props.crosswords.crosswords})
        await this.setState({addCrL: this.props.crosswords.length})

        await this.props.getSolvedCrosswords(this.state.user._id, this.state.solvedSite)
        await this.setState({solvedCrosswords: this.props.crosswords.crosswords})
        await this.setState({slvCrL: this.props.crosswords.length})

        await this.props.getProgressCrosswords(this.state.user._id, this.state.progressSite)
        await this.setState({progressCrosswords: this.props.crosswords.crosswords})
        await this.setState({prCrL: this.props.crosswords.length})

        if(this.state.addedSite * 2 >= this.state.addCrL) {
            this.setState({lastSiteAdded: true})
        }
        if(this.state.solvedSite * 2 >= this.state.slvCrL) {
            this.setState({lastSiteSolved: true})
        }
        if(this.state.progressSite * 2 >= this.state.prCrL) {
            this.setState({lastSiteProgress: true})
        }

        this.setState({loaded: true})

        
    }


    handleSection = async e => {
        this.setState({prevSection: this.state.section})
        this.setState({section: e.target.attributes.section.value})
        if(e.target.attributes.section.value==="details") {
            this.setState({loaded: false});
            await this.props.getCrossword(Number(e.target.attributes.crossword.value));
            this.setState({crosswordDetails: this.props.crossword})
            this.setState({dtlRts: this.props.crossword.ratings.length})
            this.setState({dtlSlv: this.props.crossword.solvedBy.length})
            this.setState({dtlAdb: this.props.crossword.addedBy.login})
            this.setState({loaded: true})
        }
    }

    handleSite = async e => {
        this.setState({loaded: false})
        let currentSite;
        switch(this.state.section) {

            case 'added':
                currentSite = this.state.addedSite
                switch(e.target.attributes.action.value) {
                    case 'prev':
                        await this.setState({addedSite: currentSite-1})
                        break;
                    case 'next':
                        await this.setState({addedSite: currentSite+1})
                        break;
                    default:
                        break;
                }
                await this.props.getAddedCrosswords(this.state.user._id, this.state.addedSite)
                this.setState({addedCrosswords: this.props.crosswords.crosswords})
                this.setState({addCrL: this.props.crosswords.length})
                if(this.state.addedSite * 2 >= this.state.addCrL) {
                    this.setState({lastSiteAdded: true})
                } else {
                    this.setState({lastSiteAdded: false})
                }
                this.setState({loaded: true})
                break;

                case 'solved':
                currentSite = this.state.solvedSite
                switch(e.target.name) {
                    case 'prev':
                        await this.setState({solvedSite: currentSite-1})
                        break;
                    case 'next':
                        await this.setState({solvedSite: currentSite+1})
                        break;
                    default:
                        break;
                }
                await this.props.getSolvedCrosswords(this.state.user._id, this.state.solvedSite)
                this.setState({solvedCrosswords: this.props.crosswords.crosswords})
                this.setState({slvCrL: this.props.crosswords.length})
                if(this.state.solvedSite * 2 >= this.state.slvCrL) {
                    this.setState({lastSiteSolved: true})
                } else {
                    this.setState({lastSiteSolved: false})
                }
                this.setState({loaded: true})
                break;

                case 'continue':
                    currentSite = this.state.progressSite
                    switch(e.target.name) {
                        case 'prev':
                            await this.setState({progressSite: currentSite-1})
                            break;
                        case 'next':
                            await this.setState({progressSite: currentSite+1})
                            break;
                        default:
                            break;
                    }
                    await this.props.getProgressCrosswords(this.state.user._id, this.state.progressSite)
                    this.setState({progressCrosswords: this.props.crosswords.crosswords})
                    this.setState({prCrL: this.props.crosswords.length})
                    if(this.state.progressSite * 2 >= this.state.prCrL) {
                        this.setState({lastSiteProgress: true})
                    } else {
                        this.setState({lastSiteProgress: false})
                    }
                    this.setState({loaded: true})
                    break;
        }
        
    }

    renderAdded = (handleSection) => {

        return this.state.addedCrosswords.map(crossword => {
            return <div className="crossword-bar">
                    <div>#{crossword.ID}</div> 
                    <div>{crossword.values.length} x {crossword.values[0].length}</div>
                    <div>TRIED: {crossword.tries}</div>
                    <div>SOLVED: {crossword.solvedBy.length}</div>
                        {crossword.isApproved ? <div className="green">APPROVED</div> : null}
                        {!crossword.isRejected && !crossword.isApproved ? <div className="orange">UNAPPROVED</div> : null}
                        {crossword.isRejected ? <div className="red">REJECTED</div> : null}
                        <button className="form-button" section="details" crossword={crossword.ID} onClick={handleSection}><i section="details" crossword={crossword.ID} onClick={handleSection} className="fas fa-info"></i></button>
        </div>
        })
    }

    renderSolved = (handleSection) => {
        return this.state.solvedCrosswords.map(crossword => {
            let date = getDate(new Date(crossword.dateSolved))
            return <div className="crossword-bar">
                    <div>#{crossword.ID}</div> 
                    <div>{crossword.across} x {crossword.down}</div>
                    <div> added by {crossword.addedBy.login}</div> 
                    <div>Date solved: {date}</div>
                    <button className="form-button" section="details" crossword={crossword.ID} onClick={handleSection}><i section="details" crossword={crossword.ID} onClick={handleSection} className="fas fa-info"></i></button>
        </div>
        })
    }

    renderProgress = (handleSection) => {
        return this.state.progressCrosswords.map(crossword => {
            return <a className="crossword-bar">
                    <div>#{crossword.ID}</div> 
                    <div>{crossword.values.length} x {crossword.values[0].length}</div>
                    <div><button className="form-button" section="details" crossword={crossword.ID} onClick={handleSection}><i section="details" crossword={crossword.ID} onClick={handleSection} className="fas fa-info"></i></button>
                    <a href={`/crosswords/${crossword.ID}`} ><button className="form-button"><i className="fas fa-play"></i></button></a>
                    </div>
        </a>
        })
    }

    render() {
        let string;
        if(this.state.crosswordDetails) {
            let date = new Date(this.state.crosswordDetails.dateCreated);
            string = getDate(date);
        }
        const details = (
            <div className="details-container">
                <button className="form-button" section={this.state.prevSection} onClick={this.handleSection}><i section={this.state.prevSection} className="fas fa-chevron-left"></i></button>
                <div>ID: {this.state.crosswordDetails.ID}</div>
                <div>Date Added: {string}</div>
                <div>Tried: {this.state.crosswordDetails.tries}</div>
                <div>Rating: {this.state.crosswordDetails.ovrRating} ({this.state.dtlRts})</div>
                <div>Solved: {this.state.dtlSlv}</div>
                <div>Added by: {this.state.dtlAdb}</div>
                <div>Difficult: {this.state.crosswordDetails.difficult}</div>
                {this.state.crosswordDetails.isRejected ? <div><b>Reject message: {this.state.crosswordDetails.rejectMsg}</b></div> : null }
            <a href={`/crosswords/${this.state.crosswordDetails.ID}`}><button className="form-button"><i className="fas fa-eye"></i></button></a>
            </div>
        )
        const added = (
            <div className="type-container">{this.renderAdded(this.handleSection)}
            <div className="button-container">
                    {this.state.addedSite>1 ? <button action="prev" onClick={this.handleSite}className="form-button"><i action="prev" className="fas fa-chevron-left"></i></button> : null }
                    {this.state.lastSiteAdded ? null : <button action="next" onClick={this.handleSite} className="form-button"><i action="next" className="fas fa-chevron-right"></i></button>}
                </div></div>
        )

        const progress = (
            <div className="type-container">{this.renderProgress(this.handleSection)}
            <div className="button-container">
                    {this.state.progressSite>1 ? <button action="prev" onClick={this.handleSite}className="form-button"><i action="prev" className="fas fa-chevron-left"></i></button> : null }
                    {this.state.lastSiteProgress ? null : <button action="next" onClick={this.handleSite}className="form-button"><i action="next"className="fas fa-chevron-right"></i></button>}
                </div></div>
        )


        const solved = (
            <div className="type-container">{this.renderSolved(this.handleSection)}
            <div className="button-container">
                    {this.state.solvedSite>1 ? <button action="prev" onClick={this.handleSite}className="form-button"><i action="prev" className="fas fa-chevron-left"></i></button> : null }
                    {this.state.lastSiteSolved ? null : <button action="next" onClick={this.handleSite}className="form-button"><i action="next" className="fas fa-chevron-right"></i></button>}
                </div></div>
        )

        const loaded = (
            <>{this.state.section==="added" ? <>{added}</> : null}
                {this.state.section==="solved" ? <div>{solved}</div> : null}
                {this.state.section==="continue" ? <div>{progress}</div> : null}
                {this.state.section==="details" ? <div>{details}</div> : null}</>
        )
        
        return(
            <>
            <div className="section-menu-container">
                {this.state.section==="added" ? 
                <button onClick={this.handleSection} section="added"className="section-menu-element-active">Added</button> :
                <button onClick={this.handleSection} section="added"className="section-menu-element">Added</button>}
                {this.state.section==="solved" ?
                <button onClick={this.handleSection} section="solved" className="section-menu-element-active">Solved</button> :
                <button onClick={this.handleSection} section="solved" className="section-menu-element">Solved</button>}
                {this.state.section==="continue" ?
                <button onClick={this.handleSection} section="continue" className="section-menu-element-active">In Progress</button> :
                <button onClick={this.handleSection} section="continue" className="section-menu-element">In Progress</button>}
            </div>
            <div className="section-content">
                {this.state.loaded ? loaded : <Loader/>}

                

            </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return { crosswords: state.crosswords, user: state.user, crossword: state.crossword };

};

export default connect(
    mapStateToProps,
    { getAddedCrosswords, getSolvedCrosswords, getProgressCrosswords, getUser, getCrossword }
    )(AccountCrosswords);