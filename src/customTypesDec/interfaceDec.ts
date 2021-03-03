interface UserMessage {
    email: string,
    username: string
}

interface EmailObj {
    email: string
    links: string[]
}

interface ConfirmationEmail {
    email: string
    code: string
}

export { UserMessage, EmailObj, ConfirmationEmail };