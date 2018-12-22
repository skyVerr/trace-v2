import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Api } from "../models/api.class";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient
  ) { }

  signUp(user){
    return this.http.post(Api.URL+'sign-up',user);
  }

}
