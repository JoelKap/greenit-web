import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdminService } from './service/admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'lostnfound-web';
  isLoggedInClicked: boolean = false;

  constructor(private router: Router,
    private adminService: AdminService) { }

    isLoggedIn() {
      return !!localStorage.getItem('token');
    }

  ngOnInit(): void {
    this.isLoggedInClicked = this.adminService.isLoggedInClicked;
  }
}
