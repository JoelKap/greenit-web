import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedInClicked: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    this.isLoggedInClicked = true;
    this.router.navigateByUrl('/login');
  }

  navigateTo(url: string) {
    this.router.navigateByUrl('/' + url);
  }

}
