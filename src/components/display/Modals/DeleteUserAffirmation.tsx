import React, {Fragment} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import AuthContext from '../../site/AuthContext';
import {IAffirmations} from '../../../types/Models';
import {FaTrashAlt} from 'react-icons/fa'

interface IDeleteUserAffState {
    modalIsOpen: boolean;
}

interface IDeleteUserAffProps {
    affirmationId: number;
    affirmationInfo: IAffirmations;
    refreshDash: CallableFunction;
}

export default class DeleteAffirmation extends React.Component <IDeleteUserAffProps, IDeleteUserAffState>{
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>

    constructor(props:IDeleteUserAffProps) {
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

    deleteAffirmation = (e:React.MouseEvent<HTMLButtonElement>) => {
        if (e) {e.preventDefault(); }

        fetch(`${process.env.REACT_APP_DATABASE_URL}affs/delete-${this.props.affirmationId}`, {
            method: "DELETE",
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": `${this.context.token}`
            })
        })
        .then(data => data.json())
        .then(() => {this.closeModal(); this.props.refreshDash()})
    }

    render() {
        return(
        <>
            <div>
                <button
                type="button"
                onClick={() => this.openModal()}
                className="px-3 py-2 text-custom-orange text-sm font-semibold rounded-lg hover:bg-alert hover:bg-opacity-80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                >
                <FaTrashAlt />
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
                <Dialog.Overlay className="fixed inset-0 bg-custom-darkblue bg-opacity-60" />
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
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-custom-darkblue-dark shadow-xl rounded-2xl">
                    <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-white"
                    >
                    Are you sure?
                    </Dialog.Title>
                    <div className="mt-2">
                    
                        {/* THIS IS THE BODY OF THE MODAL */}
                        <p className="text-white">You cannot undo this action.</p>

                    </div>

                    <div className="mt-4 flex flex-row justify-end">
                    <button
                        type="button"
                        className="inline-flex justify-center ml-3 px-4 py-2 text-md font-semibold text-custom-deeppurple-light bg-custom-lightblue-light border border-transparent rounded-md hover:bg-custom-lightblue focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500"
                        onClick={() => this.closeModal()}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="inline-flex justify-center ml-3 px-4 py-2 text-md font-semibold text-custom-deeppurple-light bg-custom-orange border border-transparent rounded-md hover:bg-custom-orange-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500"
                        onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.deleteAffirmation(e)}
                    >
                        Yes, Delete
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