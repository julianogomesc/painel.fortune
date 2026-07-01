export interface userType {
    expires_in: number,
    token?: string,
    user: {
        id: number,
        nome: string,
        email: string,
        perfil: number,
        situacao: number
    }
}