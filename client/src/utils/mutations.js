import { gql } from 'apollo/client';

export const LOGIN_USER = gql`
mutation login($email: String!, $Password: String!) {
    login(email: $email, Password: $Password ) {
        token
        user {
            _id
            username
            email
        }
    }
}`;

export const ADD_USER = gql`
mustation addUsers($Username: String!, $email: String!,$Password: String!) {
    addUser(email: $email, Password: $Password ) {
        token
        user {
            _id
            username
            email
        }
    }
}`;


export const SAVE_BOOK = gql`
mutation saveBook($bookData: BookInput!) {
    saveBook(bookData: $bookData) { 
        _id
        username
        email
        saveBooks
        bookCount {
            bookId
            title
            authors
            description
            image
            link
        }
    }
}`;

export const REMOVE_BOOK = gql`
mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) { 
            _id
            username
            email
            saveBooks
            bookCount {
                bookId
                title
                authors
                description
                image
                link
            }
        }
    }
}`;