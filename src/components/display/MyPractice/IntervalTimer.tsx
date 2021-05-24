import React from 'react';
import TimerDisplay from './TimerDisplay';
import {IAffirmations} from '../../../types/Models';
import styled from 'styled-components';
import mountain from '../../../assets/mountain-gradient.jpg';
import {FaPlay, FaPlayCircle} from 'react-icons/fa'

//This interval display component
const MtnBg = styled.div`
    background-image: url("./mountain-gradient.jpg");
    background-position: center;
    background-size: cover;
    border-radius: 3em;

    &:hover {
        
    }
`




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
                <MtnBg className="relative group cursor-pointer" onClick={() => this.openModal()}>
                    <div className="absolute mx-auto left-0 right-0 top-1/3 pt-6 float-left max-w-min">  {/* added the setIntervalFilter to the openModal function because this logic couldn't handle a progression of functions */}
                        <FaPlayCircle className="text-white opacity-50 text-7xl group-hover:opacity-80"/>
                    {/* <img src="https://greentreeyogadotcom.files.wordpress.com/2014/08/peaceful-water-1480533.jpg" alt="pretty leaves" /> */}
                    </div>
                    <img src={mountain} style={{visibility:"hidden"}} className="hover:opacity-20"/>
                </MtnBg>
                
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