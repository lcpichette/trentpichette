export interface Artwork {
    made?: Date;
    createdAt: Date;
    id: string;
    title: string;
    tag?: string;
    file: File;
}

interface File {
    id: string;
    url: string;
}