import { gql } from '@apollo/client'

export count GET_ME = gql`
    query me {
        me {
            _id
            username
            email
            bookCount
            saveBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }`;
    