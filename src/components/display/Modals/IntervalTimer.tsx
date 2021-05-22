import React, {Fragment} from 'react';
import {Dialog, Transition} from '@headlessui/react';
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



interface IDisplayState {

}

interface IDisplayProps {
    modalIsOpen: boolean;
    closeModal: CallableFunction;
    intervalArray: IAffirmations [];
}

class TimerDisplay extends React.Component <IDisplayProps, IDisplayState>{
    constructor(props:IDisplayProps) {
        super(props);
        this.state = {

        }
    }

    /* componentDidMount() {
        console.log("Timer Display mounted")
        console.log(this.props.intervalArray)
    } */

    render() {
        return(
            <>
                <Transition appear show={this.props.modalIsOpen} as={Fragment}>
            <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={() => /* this.props.closeModal() */ console.log("not in my house!")}
            >
            <div className="min-h-screen px-4 text-center">
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
                <Dialog.Overlay className="fixed inset-0" />
                </Transition.Child>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
                >
                &#8203;
                </span>
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                >
                <div className="inline-block w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl" style={{height:"90vh", marginTop: "4em"}}>
                    <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                    >
                    MODAL TITLE
                    </Dialog.Title>
                    <div className="mt-2">
                
                        {/* THIS IS THE BODY OF THE MODAL */}

                        <DisplayedStatements intervalArray={this.props.intervalArray} userSetInterval={3000} closeModal={this.props.closeModal}/>

                    </div>

                    <div className="mt-4">
                    <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={() => this.props.closeModal()}
                    >
                       X (icon)
                    </button>
                    </div>
                </div>
                </Transition.Child>
            </div>
            </Dialog>
        </Transition>
            </>
        )
    }
}


interface IStatementState {
    testArray: string[];
    arrayNum: number;
    defaultInterval: number;
}

interface IStatementProps {
    intervalArray: IAffirmations[];
    userSetInterval: number;
    closeModal: CallableFunction;
}

class DisplayedStatements extends React.Component <IStatementProps,IStatementState> {
    constructor(props:IStatementProps){
        super(props);
        this.state = {
            testArray: [],
            arrayNum: 0,
            defaultInterval: 7000,
        }
    }

    fillerArray : string[] = [];

    componentDidMount() {
        this.fillerArray.push("Make sure you're comfortable before we begin","Ready?", "Let's get started")
        for (let i = 0; i < this.props.intervalArray.length; i++) {
            this.fillerArray.push(this.props.intervalArray[i].statement)
        }
        this.fillerArray.push("Great job today!","Remember that this, like any exercise, takes consistent practice.","But the results are so worth the effort.","We hope to see you back tomorrow!")

        if(this.state.defaultInterval === this.props.userSetInterval) {
            this.setState({testArray: this.fillerArray, defaultInterval: this.props.userSetInterval}, () => this.runTimer())
        } else {
            this.setState({testArray: this.fillerArray}, () => this.runTimer())
        }
    }

    interval: any;
    timeVar = 2000;

    runTimer = () => {
        this.interval = setInterval(() => this.incrementArray(), this.timeVar)
    }

    componentDidUpdate() {
        if (this.state.arrayNum < 3) {
            console.log("Looping my intro text")
        } else if (/* this.state.arrayNum >= 3 &&  */this.state.arrayNum < (this.state.testArray.length -4)) {
            console.log("statement text")
            clearInterval(this.interval)
            this.timeVar = this.state.defaultInterval;
            this.runTimer();
        } else if (this.state.arrayNum < this.state.testArray.length) {
            console.log("outro text")
            clearInterval(this.interval)
            this.timeVar = 2000;
            this.runTimer();
        } else {
            console.log("Run timer is being reset right now w/ an interval of", this.timeVar)
            clearInterval(this.interval)
            this.props.closeModal();
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    incrementArray = () => {
        this.setState({arrayNum: this.state.arrayNum + 1})
        console.log("Increment Array is running. ArrayNum is currently at:", this.state.arrayNum, "and Time Variable is at:", this.timeVar)
    }


    render() {
        return(
            <>
                <p>{this.state.testArray[this.state.arrayNum]}</p>
            </>
        )
    }
}