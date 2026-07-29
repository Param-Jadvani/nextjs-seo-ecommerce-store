export interface UserModel {
    username: string;
    email: string;
    password: string;
    comparePassword(password: string): Promise<boolean>;
}

export interface UserType extends Omit<UserModel, "password" | "comparePassword"> {
    id: string;
}