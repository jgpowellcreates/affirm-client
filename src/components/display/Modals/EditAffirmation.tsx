import React, {Fragment} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import AuthContext from '../../site/AuthContext';
import {IAffirmations, ICollections} from '../../../types/Models';
import {FaPencilAlt} from 'react-icons/fa';

interface IEditAffState {
    modalIsOpen: boolean;
    statement: string;
    collectionId?: number | null;
    statementError: boolean;
}

interface IEditAffProps {
    collectionResults?: ICollections[] | null;
    thisCollId?: number | null;
    affInfo: IAffirmations;
    refreshDash: CallableFunction;
}

export default class EditAffirmation extends React.Component <IEditAffProps, IEditAffState>{
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>
    
    constructor(props:IEditAffProps) {
        super(props)
        this.state ={
            modalIsOpen: false,
            statement: this.props.affInfo.statement,
            collectionId: this.props.thisCollId,
            statementError: false,
        }
    }

    closeModal() {
        this.setState({modalIsOpen:false})
    }

    openModal() {
        this.setState({modalIsOpen: true, statement:this.props.affInfo.statement, collectionId:this.props.thisCollId})
    }

    handleChange = (prop: keyof IEditAffState) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        this.setState({ ...this.state, [prop]: event.target.value });
    };

    validateForm(e:React.MouseEvent<HTMLButtonElement>) {
        if (e) {e.preventDefault(); }
        this.state.statement.match(/[A-Za-z0-9]{3,140}/) ? this.updateAffirmation() : this.setState({statementError: true});
    }

    updateAffirmation = () => {
        const bodyObj = {
            statement: this.state.statement,
            collectionId: this.state.collectionId,
        }

        fetch(`${process.env.REACT_APP_DATABASE_URL}affs/edit-${this.props.affInfo.id}`, {
            method: "PUT",
            body: JSON.stringify(bodyObj),
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": `${this.context.token}`
            })
        })
        .then(data => data.json())
        .then(() => {this.setState({modalIsOpen: false,collectionId: this.props.thisCollId,statementError: false}, this.props.refreshDash())})
    }

    render() {
        return(
        <>
            <div>
                <button
                type="button"
                onClick={() => this.openModal()}
                className="px-3 py-2 text-sm font-medium text-custom-orange rounded-lg hover:bg-custom-yellow hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                >
                <FaPencilAlt />
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
                    Edit Affirmation:
                    </Dialog.Title>
                    <br />
                    <hr className="text-transparent h-0.5 rounded bg-gradient-to-r from-custom-yellow to-custom-orange-dark" />
                    <div className="mt-4">
                    
                        {/* THIS IS THE BODY OF THE MODAL */}
                        <div>
                            <label htmlFor="statement" className="block">
                                <span className="text-white">Statement:</span>

                                <input
                                    required
                                    type="text"
                                    className="block mt-1 py-1 px-2 w-full rounded-md text-custom-deeppurple bg-white bg-opacity-80 border-transparent focus:border-custom-yellow-light focus:bg-white outline-none ring-custom-yellow-light focus:ring-2"
                                    placeholder={this.props.affInfo.statement}
                                    value={this.state.statement}
                                    onChange={this.handleChange('statement')}
                                />
                            </label>
                            {this.state.statementError ? <p className="text-custom-orange text-sm font-semibold">Need to submit a valid affirmation.</p> : <></>}


                            <label htmlFor="collectionId" className="block">
                                <span className="text-white">Collection:</span>

                                <select
                                    required
                                    className="block mt-1 py-1 px-2 w-full rounded-md text-custom-deeppurple bg-white bg-opacity-80 border-transparent focus:border-custom-yellow-light focus:bg-white outline-none ring-custom-yellow-light focus:ring-2"
                                    defaultValue={this.props.thisCollId!}
                                    onChange={this.handleChange('collectionId')}
                                >
                                    {this.props.collectionResults?.map((coll) => {
                                        return <option key={coll.id} value={coll.id}>{coll.title}</option>
                                    })}  
                                </select>
                            </label>
                        </div>
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
                        onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.validateForm(e)}>
                        Commit Changes
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