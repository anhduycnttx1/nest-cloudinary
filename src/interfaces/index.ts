export interface IFUser {
     id: number,
     username: string,
     displayName: string
}

export interface IFToken {
     accessToken: string,
     refreshToken: string
}

export interface PayloadToken {
     sub: string
     iat: any
     exp: any
     email?: string
     username?: string
}