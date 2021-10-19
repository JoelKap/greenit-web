import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { faMap, faUsers, faFileAlt, faPencilAlt, faGlobeAfrica, faMoneyBillAlt, faAlignJustify, faBackward } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-view-found-documents',
  templateUrl: './view-found-documents.component.html',
  styleUrls: ['./view-found-documents.component.css']
})
export class ViewFoundDocumentsComponent implements OnInit {
  p: number = 1;
  foundDocuments: any = [];
  userType: string = '';
  
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
    this.loadFoundDocuments();
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/home');
  }

  navigateTo(url: string) {
    this.router.navigateByUrl('/' + url);
  }

  private loadFoundDocuments() {
    return this.firestore.collection<any>(`foundDocuments`, ref => {
      return ref
        .where('isDeleted', '==', false)
    }).valueChanges()
      .subscribe((resp) => {
        this.foundDocuments = resp;
      })
  }

}
