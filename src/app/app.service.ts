import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {
appUrl=`http://localhost:3000/`
  constructor(
    private http: HttpClient
  ) { }


  login() {

    return this.http.get<string>(this.appUrl,{})
  }

  addUser(body:any) {
    return this.http.post<string>(this.appUrl+`users`,body)
  }

  getUser(id:string) {

    return this.http.get<string>(`${this.appUrl}users/${id}`,{})
  }


  getUsersInRoom(id:string) {
    return this.http.get<Array<any>>(`${this.appUrl}users/room/${id}`,{})
  }


}
