import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { faMap, faUsers, faFileAlt, faPencilAlt, faGlobeAfrica, faMoneyBillAlt, faAlignJustify, faBackward } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-view-lost-documents',
  templateUrl: './view-lost-documents.component.html',
  styleUrls: ['./view-lost-documents.component.css']
})
export class ViewLostDocumentsComponent implements OnInit {
  p: number = 1;
  userType: string = '';
  lostDocuments: any = [];

  faMap = faMap;
  faUsers = faUsers;
  faFileAlt = faFileAlt;
  faPencilAlt = faPencilAlt;
  faGlobeAfrica = faGlobeAfrica;
  faMoneyBillAlt = faMoneyBillAlt;
  faAlignJustify = faAlignJustify;
  faBackward = faBackward;

  constructor(
    private authService: AuthService,
    private router: Router,
    public firestore: AngularFirestore,
  ) {
    this.userType = this.authService.getUserTypeFromStore();
   }

  ngOnInit(): void {
    this.loadLostDocuments();
  }

  private loadLostDocuments() {
    return this.firestore.collection<any>(`lostDocuments`, ref => {
      return ref
        .where('isFound', '==', false)
    }).valueChanges()
      .subscribe((resp) => {
        this.lostDocuments = resp;
      })
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/home');
  }

  navigateTo(url: string) {
    this.router.navigateByUrl('/' + url);
  }

}
