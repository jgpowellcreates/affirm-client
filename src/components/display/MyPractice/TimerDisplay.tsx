import React, {Fragment} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import DisplayedStatements from './DisplayedStatements';
import {IAffirmations} from '../../../types/Models';
import {logo} from '../../../assets/index'

interface IDisplayState {

}

interface IDisplayProps {
    modalIsOpen: boolean;
    closeModal: CallableFunction;
    intervalArray: IAffirmations [];
}

export default class TimerDisplay extends React.Component <IDisplayProps, IDisplayState>{
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
                <div className="inline-block static overflow-y-scroll w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gradient-to-b from-cyan-500 via-cyan-200 to-amber-500 shadow-xl rounded-2xl" style={{height:"90vh", marginTop: "4em"}}>
                    <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                    >
                        {/* MODAL TITLE.... DOESN'T NEED A TITLE */}
                    </Dialog.Title>
                    <div id="modalContentHolder" className="flex flex-col h-full justify-center content-center text-center">
                        <div id="topInfo" className="flex flex-row justify-between">
                            <div>
                                {/* I initially had an IMG here, but it didn't go well w/ the existing nav logo and it stretched the X */}
                            </div>
                            <div className="flex py-auto w-28 align-middle">
                                <img src={logo}
                                    alt="Well Said Logo"
                                    className="w-full relative m-auto"
                                />
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="inline-flex w-min h-min px-4 py-2 text-sm font-medium text-cyan-900 bg-cyan-100 border border-transparent rounded-md hover:bg-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                    onClick={() => this.props.closeModal()}
                                >
                                X
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-center content-center h-full mt-16 text-center
                                        transition duration-500 ease-in-out">
                    
                            {/* THIS IS THE BODY OF THE MODAL */}
                            <DisplayedStatements intervalArray={this.props.intervalArray} userSetInterval={3000} closeModal={this.props.closeModal}/>

                        </div>
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