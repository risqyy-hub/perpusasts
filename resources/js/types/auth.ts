export type User = {
    id: number;
    username: string;
    avatar?: string | null;
    [key: string]: unknown;
};

export type Auth = {
    user: User | null;
};
