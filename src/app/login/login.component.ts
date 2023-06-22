import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  name = new FormControl('');
  room = new FormControl('');
  constructor(private appService: AppService,
    private router: Router) {

  }
  ngOnInit(): void {
    const messageForm = document.querySelector('#login-form')
    if (messageForm) {
      messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const response = await this.appService.login()
        console.log(response);
        if (response) {
          this.router.navigate(['chat', { username: this.name.value , room: this.room.value }])
        }
      })
    }
  }

}
