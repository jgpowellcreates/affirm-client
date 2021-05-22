import React from 'react';
import TimerDisplay from './TimerDisplay';
import {IAffirmations} from '../../../types/Models';

//This interval display component


interface ITimerState {
    modalIsOpen: boolean;
    errorEmptyArray: boolean;
}

interface ITimerProps {
    setIntervalFilter: CallableFunction;
    intervalArray: IAffirmations[];
}

export default class IntervalTimer extends React.Component <ITimerProps, ITimerState>{
    constructor(props:ITimerProps) {
        super(props)
        this.state ={
            modalIsOpen: false,
            errorEmptyArray: false,
        }
    }

    closeModal = () => {
        this.setState({modalIsOpen:false})
    }

    openModal() {
        this.props.setIntervalFilter()
        if (this.props.intervalArray.length > 0) {
            this.setState({modalIsOpen: true, errorEmptyArray: false})
        } else {
            this.setState({errorEmptyArray: true})
        }
    }

    modalContents = () => {
        if (this.props.intervalArray) {
            {this.props.intervalArray.map((aff, index) => {
                return <p>{aff.statement}</p>
            })}
        } else {
            return <></>
        }
    }

    render() {
        return(
        <>
            <div>
                <div className="shadow border rounded-lg">
                    <div onClick={() => this.openModal()}>  {/* added the setIntervalFilter to the openModal function because this logic couldn't handle a progression of functions */}

                        <h4>Add a play button over this image that changes on hover</h4>
                        <h4>Interval slider should live below image</h4>
                    <img src="https://greentreeyogadotcom.files.wordpress.com/2014/08/peaceful-water-1480533.jpg" alt="pretty leaves" />
                    </div>
                </div>
                
                {this.state.modalIsOpen
                ?<TimerDisplay
                    modalIsOpen={this.state.modalIsOpen}
                    closeModal={this.closeModal}
                    intervalArray={this.props.intervalArray}
                />
                :<></>
                }
                {!this.state.errorEmptyArray
                    ?<></>
                    :<>
                        <p>You cannot start your practice without affirmations selected!</p>
                        <p>Use the collections on the left to choose the statements you'd like to use</p>
                     </>
                }

            </div>
        </>
        )
    }
}