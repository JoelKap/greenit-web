import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Image } from './image';

declare var require: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedInClicked: boolean = false;
  imgname = '';
  image: any = Image;

  constructor(private router: Router) {
    this.image = { src: '../assets/images/lost.png', alt: 'LostnFound', title: 'LostnFound' };
   }

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
