import React, {Fragment, Component} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import AuthContext from '../../site/AuthContext';
import {} from '../../../types/Models';

interface IAddCatState {
    modalIsOpen: boolean;
    categoryName: string;
    categoryError: boolean;
}

interface IAddCatProps {
    refreshDash: CallableFunction
}

class AddCategory extends Component <IAddCatProps, IAddCatState>{
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>
    
    constructor(props:IAddCatProps) {
        super(props)
        this.state ={
            modalIsOpen: false,
            categoryName: '',
            categoryError: false,
        }
    }

    closeModal() {
        this.setState({modalIsOpen:false})
    }

    openModal() {
        this.setState({modalIsOpen: true})
    }

    handleChange = (prop: keyof IAddCatState) => (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, [prop]: event.target.value });
      };

    validateForm(e:React.MouseEvent<HTMLButtonElement>) {
        if (e) {e.preventDefault(); }

        this.state.categoryName.match(/[A-Za-z0-9]{1,24}/) ? this.createCategory() : this.setState({categoryError: true})
    }

    createCategory = () => {
        const bodyObj = {name: this.state.categoryName}

        fetch(`${process.env.REACT_APP_DATABASE_URL}category/new`, {
            method: "POST",
            body: JSON.stringify(bodyObj),
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": `${this.context.token}`
            })
        })
        .then(data => {data.json(); console.log(data, bodyObj, `${process.env.REACT_APP_DATABASE_URL}category/new`)})
        .then(() => {
            this.closeModal(); this.props.refreshDash();
            console.log("Made it to the end somehow");
        })
        .catch((err) => console.log(err, "I actually messed up"))
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
                +
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
                    Create a New Category
                    </Dialog.Title>
                    <br />
                    <hr />
                    <div className="mt-2">
                    
                        {/* THIS IS THE BODY OF THE MODAL */}
                        <div>
                            <label htmlFor="name" className="block">
                                <span className="text-gray-700">Name:</span>

                                <input
                                    required
                                    type="text"
                                    className="mt-1 block w-full rounded-md bg-gray-100 p-2 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                                    placeholder="New Category Name"
                                    value={this.state.categoryName}
                                    onChange={this.handleChange('categoryName')}
                                />
                            </label>
                            {this.state.categoryError ? <p>'Name' field cannot be empty.</p> : <></>}

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
                        Create Category
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

export default AddCategory;