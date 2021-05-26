//These are the data models created in the Express server.
//Any fetch to an endpoint should be bringing back some combination of these types.

export interface ICategories {
    collections: ICollections[];
    createdAt: string;
    id: number;
    name: string;
    updatedAt: string;
}

export interface ICollections {
    affirmations: IAffirmations[];
    bannerImg: string | undefined | null;
    description?: string;
    categoryId: number;
    createdAt: string;
    id: number;
    isPublic: boolean;
    title: string;
    updatedAt: string;
}

export interface IUserCollections {
    affirmations: IAffirmations[];
    createdAt: string;
    description: string;
    id: number;
    ownerRole: number;
    title: string;
    updatedAt: string;
    userId: string;
}

export interface IAffirmations {
    collectionId?: number | null;
    createdAt: string;
    id: number;
    ownerRole: number;
    statement: string;
    updatedAt: string;
    userCollectionId?: number[] | null;
}

export enum userRoles {user = 1, premium_user, team_member, admin};