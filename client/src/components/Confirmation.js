import React from 'react'



function Confirmation({user, handleChange, handleConfirm, handleClose}) {
    return (
        <div className="confirmation-container">
            <div className="confirmation-header">
                <p>Confirm with your password</p>
            </div>
            <div className="confirmation-content">
        <div>Are you sure you want to do this action for {user}?</div>
                <form id="confirm-form">
                    <div className="form-container">
                        <label>Your password</label>
                        <div className="form-field">
                            <input
                            name="password"
                            onChange={handleChange.bind()}
                            placeholder="Type your password"
                            type="password"
                            />
                        </div>
                    </div>
                    <button onClick={handleConfirm.bind(null)} className="form-button"><i className="fas fa-check"></i></button> 
                    <button onClick={handleClose.bind(null)} style={{backgroundColor: "red"}} className="form-button"><i className="fas fa-times"></i></button>
                </form>
            </div>
        </div>
    )
}

export default Confirmation