import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    isLoggedInClicked: boolean = false;
    private agents: any = [];
    constructor(private http: HttpClient) {
    }

    getAgents(): Observable<any> {
        return of();
        // if (!this.agents.length) {
        //     return this.http.get(`${BACKEND_URL}/api/agent/GetAgents`).pipe(map(res => {
        //         this.agents.push.apply(this.agents, res);
        //         return res;
        //     }));
        // } else {
        //     return of(this.agents)
        // }
    }

    save(request: any): Observable<any> {
        return of();
        // this.agents = [];
        // return this.http.post(`${BACKEND_URL}/api/agent/CreateAgent/`, request);
    }

    update(request: any) {
        return of();
        // this.agents = [];
        // return this.http.put(`${BACKEND_URL}/api/agent/UpdateAgent/`, request);
    }

    saveLogToStore(isLoggedInClicked: boolean) {
        return of();
        // this.isLoggedInClicked = isLoggedInClicked;
    }

    getLogToStore() {
        return of();
        //return this.isLoggedInClicked;
    }

}