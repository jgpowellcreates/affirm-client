import React, {Fragment} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {IAffirmations, ICollections} from '../../../types/Models';

interface IAffList {
    modalIsOpen: boolean;
}

interface IAffBrowseProps {
    title: string | null;
    description: string | null;
    affirmations: IAffirmations[] | null;
}

export default class AffirmationList extends React.Component <IAffBrowseProps, IAffList>{
    constructor(props:IAffBrowseProps) {
        super(props)
        this.state ={
            modalIsOpen: false,
        }
    }

    closeModal() {
        this.setState({modalIsOpen:false})
    }

    openModal() {
        this.setState({modalIsOpen: true})
    }

    render() {
        return(
        <>
            <div>
                <button
                type="button"
                onClick={() => this.openModal()}
                className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                >
                View Collection
                </button>
            </div>

            <Transition appear show={this.state.modalIsOpen} as={Fragment}>
            <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={() => this.closeModal()}
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
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                    >
                    {this.props.title}
                    </Dialog.Title>
                    <div className="mt-2">
                        <p>{this.props.description}</p>
                        {this.props.affirmations?.map((aff, index) => {
                            return(
                                <div key={index} className="shadow border rounded-lg">
                                    <div className="flex items-center space-x-4 p-2">
                                        <h4>{aff.statement}</h4>
                                        <button className="">Add</button>
                                    </div>
                                </div>
                            )
                        })}

                    </div>

                    <div className="mt-4">
                    <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={() => this.closeModal()}
                    >
                        Add This Collection to My Collections
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