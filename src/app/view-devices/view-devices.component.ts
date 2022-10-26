import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import {
  faMap,
  faUsers,
  faFileAlt,
  faPencilAlt,
  faGlobeAfrica,
  faMoneyBillAlt,
  faAlignJustify,
  faBackward,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-view-devices',
  templateUrl: './view-devices.component.html',
  styleUrls: ['./view-devices.component.css'],
})
export class ViewDevicesComponent implements OnInit {
  p: number = 1;
  userType: string = '';
  devices: any = [];
  imageUrl = '';
  headerMenu: string = '';
  closeResult: string = '';
  faMap = faMap;
  faUsers = faUsers;
  faFileAlt = faFileAlt;
  faPencilAlt = faPencilAlt;
  faGlobeAfrica = faGlobeAfrica;
  faMoneyBillAlt = faMoneyBillAlt;
  faAlignJustify = faAlignJustify;
  faBackward = faBackward;
  faEye = faEye;

  constructor(
    private authService: AuthService,
    private router: Router,
    public firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal
  ) {
    this.userType = this.authService.getUserTypeFromStore();
  }

  ngOnInit(): void {
    this.loadDevices();
  }

  private loadDevices() {
    this.spinner.hide();
    return this.firestore
      .collection<any>(`devices`, (ref) => {
        return ref
          .where('isFound', '==', false)
          .where('isDeleted', '==', false);
      })
      .valueChanges()
      .subscribe((resp) => {
        this.devices = resp;
      });
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/home');
  }

  navigateTo(url: string) {
    this.router.navigateByUrl('/' + url);
  }

  view(device: any, content: any) {
    this.spinner.show();
    const downloadURL = this.storage
      .ref(`/deviceFiles/${device.id}`)
      .getDownloadURL();

    downloadURL.subscribe((url) => {
      this.spinner.hide();
      if (url) {
        this.headerMenu = device.deviceModel;
        this.imageUrl = url;
        this.modalService
          .open(content, {
            ariaLabelledBy: 'modal-basic-title',
            modalDialogClass: 'modal-lg',
          })
          .result.then(
            (result: any) => {
              this.closeResult = `Closed with: ${result}`;
            },
            (reason: any) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
          );
      }
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
