import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { io } from "socket.io-client";
import { AppService } from '../app.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: Array<any> = []
  room = '';
  user = ''
  users :Array<any>= []
  disabled = false;
  chat = new FormControl('');
  socket = io('ws://localhost:3000');

  constructor(
    private activatedRoute: ActivatedRoute,
    private appService:AppService
  ) {

  }


  setSocketObservers() {
    this.socket.on('message', (message) => {
      console.log('client', message.text);
    })
    this.socket.on('countUpdated', (count) => {
      console.log('client', 'count updated' + count);
    })
    this.socket.on('clientMessage', (message) => {
      console.log('client', 'message', message);

      this.messages.push({
        message: message.text,
        createdAt: message.createdAt,
        user: message.username,
        userClass: message.id === this.socket.id ? 'yellowUser' : 'blueUser',
        divClass: message.id === this.socket.id ? 'message-purple' : 'message-blue',
        userInitials: message.initials,
        isMessage:true
      })

      this.autoScroll()
    })

    this.socket.on('location', (message) => {
      console.log('client', 'location', message.url);

      this.messages.push({
        location: message.url,
        createdAt: message.createdAt,
        user: message.username,
        userClass: message.id === this.socket.id ? 'yellowUser' : 'blueUser',
        divClass: message.id === this.socket.id ? 'message-purple' : 'message-blue',
        userInitials: message.initials,
        isLocation:true
      })

      this.autoScroll()
    })

    this.socket.on('roomData', ({ room, users }) => {
      this.room = room;
      this.users = users;
    })



  }
  ngOnInit(): any {
    this.user = this.activatedRoute.snapshot.params['username'];
    this.room = this.activatedRoute.snapshot.params['room'];
    if (!this.user || !this.activatedRoute.snapshot.params['room']) {
      return location.href = '/';
    }
    this.socket.emit('join', { username: this.user, room: this.room }, (data: any) => {
      if (!data) {
        location.href = '/';
      }

      this.appService.addUser({name:this.user,room:this.room,id:data.id  })
      this.refreshUsers()
    });

    this.setSocketObservers()
    const messageForm = document.querySelector('#message-form')
    if (messageForm) {
      messageForm.addEventListener('submit', (e) => {
        e.preventDefault()
        this.chat.disable()
        this.socket.emit('clientMessage', this.chat.value, (result: any) => {
          if (result == 'success') {
            this.chat.setValue('')
            console.log('message delivered')
          }
          if (result == "bad-words") {
            console.log('message can not be delivered as it contain inappropriate words')
          }
          this.disabled = false;
          this.chat.enable()
        })
      })
    }

    const locationButton = document.querySelector('#sendLocation')
    if (locationButton)
      locationButton.addEventListener('click', () => {
        locationButton.setAttribute('disabled', 'disabled')
      })

  }
  sendLocation() {

    if (!navigator.geolocation) {
      return alert('geo location is not supported')
    }

    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position)

      this.socket.emit('location', {
        lat: position.coords.latitude,
        long: position.coords.longitude
      }, () => {
        console.log('location sent')
      })
    })
  }

  autoScroll() {
    var objDiv = document.getElementById("messages");
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;

    }
  }

 async refreshUsers(){
    await this.appService.getUsersInRoom(this.room).subscribe(resp=>{
      if(resp){
        this.users=resp;
      }

    })
  }
}
