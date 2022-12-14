import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import {
  faUsers,
  faFileAlt,
  faPencilAlt,
  faGlobeAfrica,
  faMoneyBillAlt,
  faAlignJustify,
  faTimes,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl;

@Component({
  selector: 'app-repair-dashboard',
  templateUrl: './repair-dashboard.component.html',
  styleUrls: ['./repair-dashboard.component.css'],
})
export class RepairDashboardComponent implements OnInit, OnDestroy {
  devices: any = [];
  p: number = 1;
  device: any;
  userType: string = '';
  headerMenu: string = '';
  closeResult: string = '';
  isFixed: boolean = false;
  subscription: any;

  commentForm!: FormGroup;
  faUsers = faUsers;
  faFileAlt = faFileAlt;
  faPencilAlt = faPencilAlt;
  faGlobeAfrica = faGlobeAfrica;
  faMoneyBillAlt = faMoneyBillAlt;
  faAlignJustify = faAlignJustify;
  faTimes = faTimes;
  faCheck = faCheck;

  constructor(
    public afAuth: AngularFireAuth,
    private authService: AuthService,
    public firestore: AngularFirestore,
    private router: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toast: ToastrService
  ) {
    this.userType = this.authService.getUserTypeFromStore();
    this.createFormBuild();
    if (this.userType === '') {
      this.logout();
    }
  }

  ngOnInit(): void {
    this.loadDevicesForRepair();
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

  logout() {
    this.afAuth.signOut().then(() => {
      localStorage.clear();
      this.router.navigateByUrl('/home');
    });
  }

  navigateTo(url: string) {
    this.authService.saveUserTypeToStore(this.userType);
    this.router.navigateByUrl('/' + url);
  }

  submit() {
    if (!this.commentForm.controls.comment.value) {
      return;
    }

    if (!this.isFixed) {
      const result = this.firestore
        .collection<any>(`devices`, (ref) => {
          return ref
            .where('id', '==', this.device.deviceId)
            .where('isDeleted', '==', false);
        })
        .get()
        .pipe(
          map((item: any) => {
            return item.docs.map((dataItem: any) => dataItem.data());
          })
        );

      result.subscribe((resp) => {
        if (resp.length) {
          let savedDevice = resp[0];
          savedDevice.saleStatus = 'CANT REPAIR';
          savedDevice.comment = this.commentForm.controls.comment.value;
          this.firestore
            .collection('devices')
            .doc(savedDevice.id)
            .update(savedDevice)
            .then(async () => {
              this.device.saleStatus = 'CANT REPAIR';
              this.firestore
                .collection('repairs')
                .doc(this.device.repairId)
                .update(this.device)
                .then(async () => {
                  this.modalService.dismissAll();
                  alert(
                    'device status has been updated accordingly, an email notification will be sent to the device user'
                  );
                  return this.sendNotification(this.device);
                });
            });
        }
      });
    } else {
      this.acceptFix();
    }
  }

  private acceptFix() {
    const result = this.firestore
      .collection<any>(`devices`, (ref) => {
        return ref
          .where('id', '==', this.device.deviceId)
          .where('isDeleted', '==', false);
      })
      .get()
      .pipe(
        map((item: any) => {
          return item.docs.map((dataItem: any) => dataItem.data());
        })
      );

    result.subscribe((resp) => {
      if (resp.length) {
        let savedDevice = resp[0];
        savedDevice.saleStatus = '';
        this.firestore
          .collection('devices')
          .doc(savedDevice.id)
          .update(savedDevice)
          .then(async () => {
            this.device.saleStatus = '';
            this.firestore
              .collection('repairs')
              .doc(this.device.repairId)
              .update(this.device)
              .then(async () => {
                alert(
                  'device status has been updated accordingly, an email notification will be sent to the device user'
                );
                return this.sendNotification(this.device);
              });
          });
      }
    });
  }

  fixed(device: any, isFixed: any, content: any) {
    this.device = device;
    this.isFixed = isFixed;

    if (isFixed) {
      return this.acceptFix();
    }

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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  sendNotification(device: any) {
    let resolvedMsg = '';
    if (this.isFixed) {
      resolvedMsg = `This device has been fixed by the requested repaired, company <b>${device.name}</b>`;
    } else {
      resolvedMsg = `This device has NOT been fixed by the requested repaired, company <b>${device.name}</b>
                      <br/> the reason being <i>${this.commentForm.controls.comment.value}</i>`;
    }
    const message = {
      message: resolvedMsg,
      to: device.ownerEmail,
      name: device.owner,
      subject: 'DEVICE REPAIR',
    };

    return this.http
      .post(BACKEND_URL + '/sendMail', message)
      .subscribe((resp: any) => {
        if (resp.data) {
          this.toast.success('email sent successfully!!');
        } else {
          this.toast.error('email did not sent');
        }
      });
  }

  private loadDevicesForRepair() {
    return this.firestore
      .collection<any>(`repairs`, (ref) => {
        return ref
          .where('isFound', '==', false)
          .where('isDeleted', '==', false)
          .where('saleStatus', '==', 'UNDER REPAIR');
      })
      .valueChanges()
      .subscribe((resp) => {
        this.devices = resp;
      });
  }

  private createFormBuild() {
    this.commentForm = this.formBuilder.group({
      comment: [''],
    });
  }
}
