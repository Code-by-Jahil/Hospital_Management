import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  constructor(private http: HttpClient) { }

  private apiUrl = 'https://localhost:44377/api';
  loginApi = `${this.apiUrl}/Login/Login`;
  registerApi = `${this.apiUrl}/Register/Create`;

  login(data: any) {
    return this.http.post(this.loginApi, data);
  }

  register(data: any) {
    return this.http.post(this.registerApi, data);
  }
}

