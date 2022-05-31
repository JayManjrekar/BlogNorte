export interface User {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    github: string;
}

export interface UserCredentials {
    username: string;
    password: string;
    rememberMe: boolean;
}

export interface UserRegistrationCredentials {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
}