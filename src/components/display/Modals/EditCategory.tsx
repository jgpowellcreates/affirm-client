import React, {Fragment} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import AuthContext from '../../site/AuthContext';
import {} from '../../../types/Models';
import {FaPencilAlt} from 'react-icons/fa';

interface IEditCatState {
    modalIsOpen: boolean;
    categoryName: string;
    categoryError: boolean;
}

interface IEditCatProps {
    categoryId: number;
    categoryName: string;
    refreshDash: CallableFunction;
}

export default class EditCateogry extends React.Component <IEditCatProps, IEditCatState>{
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>
    
    constructor(props:IEditCatProps) {
        super(props)
        this.state ={
            modalIsOpen: false,
            categoryName: this.props.categoryName,
            categoryError: false,
        }
    }

    closeModal() {
        this.setState({modalIsOpen:false})
    }

    openModal() {
        this.setState({modalIsOpen: true})
    }

    handleChange = (prop: keyof IEditCatState) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, [prop]: event.target.value });
      };

    validateForm(e:React.MouseEvent<HTMLButtonElement>) {
        if (e) {e.preventDefault(); }

        this.state.categoryName.match(/[A-Za-z0-9]{1,24}/) ? this.updateCategory() : this.setState({categoryError: true})

    }

    updateCategory = () => {
        const bodyObj = {name: this.state.categoryName}

        fetch(`${process.env.REACT_APP_DATABASE_URL}category/edit-${this.props.categoryId}`, {
            method: "PUT",
            body: JSON.stringify(bodyObj),
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": `${this.context.token}`
            })
        })
        .then(data => data.json())
        .then(() => {this.setState({modalIsOpen: false,categoryName: '',categoryError: false},this.props.refreshDash())})
    }

    render() {
        return(
        <>
            <div>
                <button
                type="button"
                onClick={() => this.openModal()}
                className="px-3 py-2 text-sm font-medium text-amber-500 rounded-lg bg-opacity-20 hover:bg-amber-500 hover:bg-opacity-80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
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
                    Edit Category:
                    </Dialog.Title>
                    <br />
                    <hr />
                    <div className="mt-2">
                    
                        <div>
                            <label htmlFor="name" className="block">
                                <span className="text-gray-700">Name:</span>

                                <input
                                    required
                                    type="text"
                                    className="mt-1 block w-full rounded-md bg-black bg-opacity-10 p-2 border-transparent focus:border-cyan-900 focus:bg-white focus:ring-0"
                                    placeholder="Updated Category Name..."
                                    value={this.state.categoryName}
                                    onChange={this.handleChange('categoryName')}
                                />
                            </label>
                            {this.state.categoryError ? <p className="text-alert text-sm">'Name' field cannot be empty.</p> : <></>}

                        </div>

                    </div>

                    <div className="mt-4 flex flex-row justify-end">
                    <button
                        type="button"
                        className="ml-3 px-4 py-2 text-sm font-medium text-amber-900 bg-amber-100 border border-transparent rounded-md hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500"
                        onClick={() => this.closeModal()}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="ml-3 px-4 py-2 text-sm font-medium text-cyan-900 bg-cyan-100 border border-transparent rounded-md hover:bg-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500"
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