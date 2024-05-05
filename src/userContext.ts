import { User, UserRole } from './models/user';

export const loggedInUser = new User(1, "Admin", "Admin", UserRole.admin);

export const users = [
    loggedInUser,
    new User(2, "Jane", "Doe", UserRole.developer),
    new User(3, "John", "Smith", UserRole.devops)
]