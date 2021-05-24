import React, {Fragment} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import AuthContext from '../../site/AuthContext';
import {IAffirmations, ICollections} from '../../../types/Models';
import {FaBookmark, FaRegBookmark} from 'react-icons/fa/index';

interface IAffList {
    modalIsOpen: boolean;
}

interface IAffBrowseProps {
    title: string | null;
    description: string | null;
    affirmations: IAffirmations[] | null;
    update: CallableFunction;
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
            <div className="relative bottom-0">
                <button
                type="button"
                onClick={() => this.openModal()}
                className="px-4 py-2 text-sm font-medium text-white bg-cyan-800 rounded-md bg-opacity-50 hover:bg-opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
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
                    className="text-lg leading-6 text-cyan-900 font-semibold"
                    >
                    {this.props.title}
                    </Dialog.Title>
                    <div className="mt-2">
                        <p className="text-md text-cyan-900 font-medium">{this.props.description}</p>
                        {this.props.affirmations && this.props.affirmations.length > 0
                            ? <FavoriteAffs affirmations={this.props.affirmations} update={this.props.update}/>
                            : <p>Oops! This is an empty collection!</p>
                         }

                    </div>

                    <div className="mt-4">
                    <button                         //I'm interested in adding this functionality at a later time, but not for MVP.
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={() => this.closeModal()}
                    >
                        Back to Collections
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



interface IFavoriteAffState {

}

interface IFavoriteAffProps {
    affirmations: IAffirmations[] | null;
    update: CallableFunction;
}

class FavoriteAffs extends React.Component <IFavoriteAffProps, IFavoriteAffState> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>

    constructor(props: IFavoriteAffProps) {
        super(props);
        this.state = {

        }
    }

    componentDidUpdate(prevProps: IFavoriteAffProps, prevState:IFavoriteAffState) {
        if (prevProps.affirmations !== this.props.affirmations) {
            this.context.update();
        }
    }

    addToMyPractice(e:React.MouseEvent<HTMLButtonElement>, aff:IAffirmations) {
        if (e) {e.preventDefault(); }

        console.log("Adding practice fired")
        //This looks at all of the User's Collections and grabs the oldest one (likely the one auto-generated for them).
        let allCollections : number[]= [];
        this.context.allUserColls.map((userColl) => allCollections.push(userColl.id));
        let earliestCollection = Math.min.apply(null, allCollections)
        //Eventually, I'd like to add a dropdown menu for them to choose what Collection they'll add to.

        const bodyObj = {
            statement: aff.statement,
            collectionId: null,
            userCollectionId: earliestCollection
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
        .then(() => this.props.update())
    }

    removePractice(e:React.MouseEvent<HTMLButtonElement>, aff:IAffirmations) {
        if (e) {e.preventDefault(); }
        let deletedId = this.context.allAffs.find(x => x.statement == aff.statement)?.id

        fetch(`${process.env.REACT_APP_DATABASE_URL}affs/delete-${deletedId}`, {
            method: "DELETE",
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": `${this.context.token}`
            })
        })
        .then(data => {data.json(); console.log(data)})
        .then(() => this.props.update())
    }

    render() {
        return(
            <>
                {this.props.affirmations?.map((aff, index) => {
                    return(
                        <div key={index} className="rounded-lg shadow-md my-2 bg-cyan-50 border-cyan-800 border-opacity-50 border-2">
                            <div className="flex justify-between items-center space-x-4 py-2 px-4 m-2">
                                <h4 className="text-cyan-900 font-semibold">{aff.statement}</h4>
                                <div id="buttonOption" className="flex justify-end">
                                    {this.context.allAffs.map((owned) => owned.statement).includes(aff.statement)
                                        ? 
                                        <>
                                            <button
                                            className="flex flex-row px-1 text-cyan-800"
                                            onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.removePractice(e,aff)}
                                            >
                                                <p className="pr-2">Remove</p>
                                                <FaBookmark className="self-center"/>
                                            </button>
                                        </>
                                        :
                                        <>
                                            <button
                                            className="flex flex-row px-1 text-cyan-800"
                                            onClick={(e:React.MouseEvent<HTMLButtonElement>) => this.addToMyPractice(e,aff)}
                                            >
                                                <p className="pr-2">Add</p>
                                                <FaRegBookmark className="self-center" />
                                            </button>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    )
                })}
            </>
        )
    }
}