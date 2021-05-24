import React, {Fragment} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import AuthContext from '../../site/AuthContext';
import {IAffirmations, ICollections} from '../../../types/Models';
import {FaPencilAlt} from 'react-icons/fa/index';

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
            statement: '',
            collectionId: this.props.thisCollId,
            statementError: false,
        }
    }

    closeModal() {
        this.setState({modalIsOpen:false})
    }

    openModal() {
        this.setState({modalIsOpen: true})
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

        console.log("Body Obj:", bodyObj)
        fetch(`${process.env.REACT_APP_DATABASE_URL}affs/edit-${this.props.affInfo.id}`, {
            method: "PUT",
            body: JSON.stringify(bodyObj),
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": `${this.context.token}`
            })
        })
        .then(data => {data.json(); console.log("Here's what's returned:",data)})
        .then(() => {this.closeModal(); this.props.refreshDash()})
    }

    render() {
        return(
        <>
            <div>
                <button
                type="button"
                onClick={() => this.openModal()}
                className="px-3 py-2 text-sm font-medium text-violet-500 rounded-lg bg-opacity-20 hover:bg-violet-500 hover:bg-opacity-80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
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
                    Edit Affirmation:
                    </Dialog.Title>
                    <br />
                    <hr />
                    <div className="mt-2">
                    
                        {/* THIS IS THE BODY OF THE MODAL */}
                        <div>
                            <label htmlFor="statement" className="block">
                                <span className="text-gray-700">Name:</span>

                                <input
                                    required
                                    type="text"
                                    className="mt-1 block w-full rounded-md bg-gray-100 p-2 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                                    placeholder={this.props.affInfo.statement}
                                    value={this.state.statement}
                                    onChange={this.handleChange('statement')}
                                />
                            </label>
                            {this.state.statementError ? <p>Need to submit a valid affirmation.</p> : <></>}


                            <label htmlFor="collectionId" className="block">
                                <span className="text-gray-700">Collection:</span>

                                <select
                                    required
                                    className="mt-1 block w-full rounded-md bg-gray-100 p-2 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
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
                    <div className="mt-4">
                    <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={() => this.closeModal()}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
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