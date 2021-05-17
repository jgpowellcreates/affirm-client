//These are the data models created in the Express server.
//Any fetch to an endpoint should be bringing back some combination of these types.

export interface IUser {
    id: string;
    email: string;
    password: string;
    fName: string;
    lName: string;
    roleId: number;
}

export interface IRole {
    id: number;
    status: string;
}

export interface ICategory {
    id: number;
    name: string;
    collections: ICollection[];
}

export interface ICollection {
    id: number;
    title: string;
    description: string;
    bannerImg?: string;
    isPublic: boolean;
    categoryId: number;
    affirmations: IAffirmation[];
}

export interface IUserCollection {
    id: number;
    title: string;
    description: string;
    ownerRole: number;
    userId: string;
    affirmations: IAffirmation[];
}

export interface IAffirmation {
    id: number;
    statement: string;
    ownerRole: number;
    collectionId: number | null;
    userCollectionId: number | null;
}