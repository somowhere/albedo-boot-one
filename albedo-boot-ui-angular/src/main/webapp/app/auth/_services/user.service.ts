import { Injectable } from "@angular/core"

import { User } from "../_models/index"
import { HttpClient } from "@angular/common/http";

@Injectable()
export class UserService {
    constructor(private http: HttpClient) {
    }

    verify() {
        return this.http.get('/api/authenticate').map((data: any) => data)
    }

    forgotPassword(email: string) {
        return this.http.post('/api/forgot-password', JSON.stringify({ email })).map((data: any) => data)
    }

    getAll() {
        return this.http.get('/api/users').map((data: any) => data)
    }

    getById(id: number) {
        return this.http.get('/api/users/' + id).map((data: any) => data)
    }

    create(user: User) {
        return this.http.post('/api/users', user).map((data: any) => data)
    }

    update(user: User) {
        return this.http.put('/api/users/' + user.id, user).map((data: any) => data)
    }

    delete(id: number) {
        return this.http.delete('/api/users/' + id).map((data: any) => data)
    }


}
