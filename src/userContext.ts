import { User, UserRole } from './models/user';

export const users = [
    new User(1, "Admin", "Admin", UserRole.admin, "adminPass"),
    new User(2, "Jane", "Doe", UserRole.developer, "janePass"),
    new User(3, "John", "Smith", UserRole.devops, "johnPass")
];

export const loggedInUser = users[0]
