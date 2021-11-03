import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { faEye, faBackward, faAlignJustify, faFileAlt, faGlobeAfrica, faMap, faMoneyBillAlt, faPencilAlt, faUsers, faDownload } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-auth-doc',
  templateUrl: './auth-doc.component.html',
  styleUrls: ['./auth-doc.component.css']
})
export class AuthDocComponent implements OnInit {
  authDocs: any[] = [];
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
  faDownload = faDownload;
  faBackward = faBackward;
  faEye = faEye;

  constructor(
    private authService: AuthService,
    public firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private modalService: NgbModal,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router) {
    this.userType = this.authService.getUserTypeFromStore();
  }

  ngOnInit(): void {
    this.authDocuments();
  }

  private authDocuments() {
    this.spinner.show();
    this.authDocs.length = 0;
    return this.firestore.collection<any>(`userDocuments`)
      .valueChanges()
      .subscribe((resp) => {
        this.authDocs.length = 0;
        resp.forEach((doc) => {
          this.firestore.collection<any>(`users`, (ref) => ref.where('email', '==', doc.email))
            .valueChanges()
            .subscribe((users) => {
              this.spinner.hide();
              const user = users[0].name + ' ' + users[0].lastname;
              doc.uploadedBy = user;
              this.authDocs.push(doc);
            })
        })
      })
  }


  Download(doc: any) {
    this.spinner.show();
    var fileRef = this.storage.ref(`files/${doc.documentId}`);

    fileRef.getDownloadURL().toPromise().then((url) => {
      this.spinner.hide();
      var link = document.createElement("a");
      if (link.download !== undefined) {
          link.setAttribute("href", url);
          link.setAttribute("target", "_blank");
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
    }).catch((error) => {
      debugger;
      // Handle any errors
    });
  }

  navigateTo(url: string) {
    this.router.navigateByUrl('/' + url);
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/home');
  }

}
