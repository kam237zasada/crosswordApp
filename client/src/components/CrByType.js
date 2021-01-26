import React from 'react';

function CrByType({crosswords, user}) {
    return crosswords.map( crossword => {
        let tried = false;
        let fields;
        let filled;
        let percent;
        if(user) {
        for(let i =0; i<user.tries.length; i++) {
            if(crossword._id==user.tries[i]._id) {
                fields=0;
                filled=0;
                tried = true
                user.tries[i].values.map(row => {
                    row.map( field => {
                        if(field.value!="blank") {
                            fields+=1
                        }
                        if(field.value!="" && field.value!="blank") {
                            filled+=1
                        }
                    })
                })
                let x =filled/fields*100;
                percent = Number(Math.round(x + 'e+0') + 'e-0');
            }
        }
    }
        if(crossword.solved) {
            return  (
            <a href={`/crosswords/${crossword.ID}`} className="crossword-bar">
                        <div>#{crossword.ID}</div> 
                        <div>{crossword.values.length} x {crossword.values[0].length} added by {crossword.addedBy.login}</div>
                        <div className="ui progress" data-percent="100">
                                <div className="bar" style={{transitionDuration: "300ms", width:"100%", height: "100%"}}>
                                    <div className="progress" style={{color: "black"}}>100%</div>
                                </div> 
                        </div>
                        <div>SOLVED! <i style={{color:"lime", fontSize: "30px"}} className="fas fa-check"></i></div>
                        <div className="rating-bar-container"><i style={{color: "gold"}} className="fas fa-star"></i><div>{crossword.ovrRating}/5 ({crossword.ratings.length})</div></div>
                    </a>
            )

        } else if(tried) {
            return (
                <a href={`/crosswords/${crossword.ID}`} className="crossword-bar">
                        <div>#{crossword.ID}</div> 
                        <div>{crossword.values.length} x {crossword.values[0].length} added by {crossword.addedBy.login} </div>
                        <div className="ui progress" data-percent={percent}>
                                <div className="bar" style={{transitionDuration: "300ms", width:`${percent}%`, height: "100%"}}>
                                    <div className="progress" style={{color: "black"}}>{percent}%</div>
                                </div> 
                            </div>
                            <div>IN PROGRESS</div>
                            <div className="rating-bar-container"><i style={{color: "gold"}} className="fas fa-star"></i><div>{crossword.ovrRating}/5 ({crossword.ratings.length})</div></div>
                    </a>
            )
        } else 
            {
                return (
                    <a href={`/crosswords/${crossword.ID}`} className="crossword-bar">
                            <div>#{crossword.ID}</div> 
                            <div>{crossword.values.length} x {crossword.values[0].length} added by {crossword.addedBy.login}</div>
                            <div></div>
                            <div></div>
                            <div className="rating-bar-container"><i style={{color: "gold"}} className="fas fa-star"></i><div>{crossword.ovrRating}/5 ({crossword.ratings.length})</div></div>

                        </a>
                )
            }
        
    })
    
}

export default CrByType