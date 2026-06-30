export interface userType {
    expires_in: number,
    token?: string,
    data: {
        id: number,
        nome: string,
        email: string,
        perfil: number,
        situacao: number
    }
}