import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'GreenIt-web';
  isLoggedInClicked: boolean = false;
  private authState: Observable<any>;
  // private currentUser: firebase.User = null;

  constructor(private router: Router, public afAuth: AngularFireAuth) {
    this.authState = this.afAuth.authState;
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  ngOnInit(): void {
    // debugger;
    // const xx = this.authState !== null;
    // this.isLoggedInClicked = this.adminService.isLoggedInClicked;
  }
}
