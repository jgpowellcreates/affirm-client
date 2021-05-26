import React from 'react';
import TimerDisplay from './TimerDisplay';
import {IAffirmations} from '../../../types/Models';
import styled from 'styled-components';
import mountain from '../../../assets/mountain-gradient.jpg';
import {FaPlayCircle} from 'react-icons/fa'

//This interval display component
const MtnBg = styled.div`
    background-image: url("./mountain-gradient.jpg");
    background-position: center;
    background-size: cover;
`

interface ITimerState {
    modalIsOpen: boolean;
    errorEmptyArray: boolean;
}

interface ITimerProps {
    setIntervalFilter: CallableFunction;
    intervalArray: IAffirmations[];
}

export default class TimerContainer extends React.Component <ITimerProps, ITimerState>{
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
        console.log("Opened the modal")
        this.props.setIntervalFilter();
        setTimeout(()=>this.checkForTimerContents(), 1000);
    }

    checkForTimerContents() {
        console.log("I can open now")
        if (this.props.intervalArray.length > 0) {
            this.setState({modalIsOpen: true, errorEmptyArray: false})
        } else {
            this.setState({errorEmptyArray: true})
        }
    }

    modalContents = () => {
        if (this.props.intervalArray) {
            this.props.intervalArray.map((aff, index) => {
                return <p>{aff.statement}</p>
            })
        } else {
            return <></>
        }
    }

    hideError = () => {
        setTimeout(() => this.setState({errorEmptyArray: false}), 7000)
    }

    render() {
        return(
        <>  
            <div>
                <MtnBg className="relative group cursor-pointer rounded-3xl" onClick={() => this.openModal()}>
                    <div className="absolute mx-auto left-0 right-0 top-1/3 pt-6 float-left max-w-min">  {/* added the setIntervalFilter to the openModal function because this logic couldn't handle a progression of functions */}
                        <FaPlayCircle className="text-white opacity-50 text-7xl group-hover:opacity-80"/>
                    </div>
                    <img src={mountain} alt="Mountain BG Sized" style={{visibility:"hidden"}} className="hover:opacity-20"/>
                </MtnBg>
                
                {this.state.modalIsOpen
                ?<TimerDisplay
                    modalIsOpen={this.state.modalIsOpen}
                    closeModal={this.closeModal}
                    intervalArray={this.props.intervalArray}
                />
                :<></>
                }
            </div>
            {!this.state.errorEmptyArray
                    ?<></>
                    :<>
                        <p className="text-center text-md font-bold pt-1 text-custom-deeppurple">You cannot start your practice without affirmations selected!</p>
                        <p className="text-center text-md font-bold text-custom-deeppurple">Pick the collection on the left that you'd like to use.</p>
                        {this.hideError()}
                     </>  
                }
        </>
        )
    }
}