import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    userType: string = '';
    constructor() {}

    saveUserTypeToStore(userType: string) {
        this.userType = userType
    }

    getUserTypeFromStore() {
        return this.userType;
    }

}