import React, {Fragment} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import AuthContext from '../../site/AuthContext';
import {ICollections, IUserCollections } from '../../../types/Models';
import {FaPlus} from 'react-icons/fa/index'

interface IAddAffState {
    modalIsOpen: boolean;
    statement: string;
    collectionId: number | null;
    userCollectionId: number | null;
    isUserMade: boolean | null;
    statementError: boolean | null;
    collectionError: boolean | null;
}

interface IAddAffProps {
    collectionResults?: ICollections[] | IUserCollections[] | null;
    refreshDash: CallableFunction;
}

export default class AddAffirmation extends React.Component <IAddAffProps, IAddAffState>{
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>
    
    constructor(props:IAddAffProps) {
        super(props)
        this.state ={
            modalIsOpen: false,
            statement: '',
            collectionId: null,
            userCollectionId: null,
            isUserMade: null,
            statementError: null,
            collectionError: null,
        }
    }

    componentDidMount() {
        if (window.location.href.indexOf("admindash") > -1) {
            this.setState({isUserMade: false})
        } else if (window.location.href.indexOf("mypractice") > -1) {
            this.setState({isUserMade: true})
        }
    }

    closeModal() {
        this.setState({modalIsOpen:false})
    }

    openModal() {
        this.setState({modalIsOpen: true})
    }

    handleChange = (prop: keyof IAddAffState) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        this.setState({ ...this.state, [prop]: event.target.value });
    };

    validateForm(e:React.MouseEvent<HTMLButtonElement>) {
        if (e) {e.preventDefault(); }

        console.log("Start of validation.", this.state)

        let statementError: boolean;
        let collectionError: boolean;
        let userCollectionError: boolean;

        this.state.statement.match(/[A-Za-z0-9]{3,140}/) ? statementError = false : statementError = true;
        this.state.collectionId !== null ? collectionError = false : collectionError = true;
        this.state.userCollectionId !== null ? userCollectionError = false : userCollectionError = true;

        if (this.state.isUserMade) {
            console.log("Start of if", this.state)
            if (!statementError && !userCollectionError) {
                this.createAffirmation();
            } else {
                this.setState({statementError: statementError, collectionError:userCollectionError})
                console.log("End of userMade", this.state)
            }
        } else {
            if (!statementError && !collectionError) {
                this.createAffirmation();
            } else {
                this.setState({statementError: statementError, collectionError: collectionError})
                console.log("End of siteMade", this.state)
            }
        }
    }

    createAffirmation = () => {
        const bodyObj = {
            statement: this.state.statement,
            collectionId: this.state.collectionId,
            userCollectionId: this.state.userCollectionId,
        }

        fetch(`${process.env.REACT_APP_DATABASE_URL}affs/new`, {
            method: "POST",
            body: JSON.stringify(bodyObj),
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": `${this.context.token}`
            })
        })
        .then(data => {data.json(); console.log(data)})
        .then(() => {this.setState({modalIsOpen:false,statement:'',collectionId:null,userCollectionId:null,statementError:null,collectionError:null}); this.props.refreshDash()})
    }

    render() {
        return(
        <>
            <div>
                <button
                type="button"
                onClick={() => this.openModal()}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-full bg-opacity-50 hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                >
                <FaPlus />
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
                <Dialog.Overlay className="fixed inset-0 bg-white bg-opacity-60" />
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
                    Create a New Affirmation
                    </Dialog.Title>
                    <div className="mt-2">
                    
                        {/* THIS IS THE BODY OF THE MODAL */}
                        <div>
                            <label htmlFor="statement" className="block">
                                <span className="text-gray-700">Name:</span>

                                <input
                                    required
                                    type="text"
                                    className="mt-1 block w-full rounded-md bg-black bg-opacity-10 p-2 border-transparent focus:border-cyan-900 focus:bg-white focus:ring-0"
                                    placeholder="New Affirmation Statement"
                                    value={this.state.statement}
                                    onChange={this.handleChange('statement')}
                                />
                            </label>
                            {this.state.statementError ? <p className="text-alert text-sm">Need to submit a valid affirmation.</p> : <></>}


                            {!this.state.isUserMade         //if isUserMade is false, sets Collection Info to check/set collections. Not userCollections
                            ?   <label htmlFor="collectionId" className="block">
                                    <span className="text-gray-700">Collection:</span>

                                    <select
                                        required
                                        className="mt-1 block w-full rounded-md bg-black bg-opacity-10 p-2 border-transparent focus:border-cyan-900 focus:bg-white focus:ring-0"
                                        onChange={this.handleChange('collectionId')}
                                    >
                                        <option value="" disabled selected>Pick a Collection</option>
                                        {this.props.collectionResults?.map((coll : ICollections | IUserCollections) => {
                                            return <option key={coll.id} value={coll.id}>{coll.title}</option>
                                        })}  
                                    </select>
                                </label>
                                
                            :   <label htmlFor="userCollectionId" className="block">  {/* but if isUserMade is truthy, it will check and set userCollections */}
                                    <span className="text-gray-700">Collection:</span>

                                    <select
                                        required
                                        className="mt-1 block w-full rounded-md bg-black bg-opacity-10 p-2 border-transparent focus:border-cyan-900 focus:bg-white focus:ring-0"
                                        onChange={this.handleChange('userCollectionId')}
                                    >
                            
                                        <option value="" disabled selected>Pick a Collection</option>
                                        {this.props.collectionResults?.map((coll: ICollections | IUserCollections) => {
                                            return <option key={coll.id} value={coll.id}>{coll.title}</option>
                                        })}  
                                    </select>
                                </label>
                            }
                            {this.state.collectionError ? <p className="text-alert text-sm">Affirmation must be added to a collection.</p> : <></>}

                            

                        </div>

                    </div>

                    <div className="mt-4 flex flex-row justify-end">
                        <button
                            type="button"
                            className="inline-flex justify-center ml-3 px-4 py-2 text-sm font-medium text-amber-900 bg-amber-100 border border-transparent rounded-md hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500"
                            onClick={() => this.closeModal()}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center ml-3 px-4 py-2 text-sm font-medium text-cyan-900 bg-cyan-100 border border-transparent rounded-md hover:bg-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500"
                            onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.validateForm(e)}
                        >
                            Create Affirmation
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