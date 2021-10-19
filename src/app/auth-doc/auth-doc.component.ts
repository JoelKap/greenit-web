import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { faEye, faBackward } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-auth-doc',
  templateUrl: './auth-doc.component.html',
  styleUrls: ['./auth-doc.component.css']
})
export class AuthDocComponent implements OnInit {
  authDocs: any = [];
  p: number = 1;

  faEye = faEye;
  faBackward = faBackward;

  constructor(public firestore: AngularFirestore,
    private modalService: NgbModal,
    private router: Router) { }

  ngOnInit(): void {
  }

  view(chat: any) {
    console.log('work in progress');
  }

  navigateTo(url: string) {
    this.router.navigateByUrl('/' + url);
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/home');
  }

}
