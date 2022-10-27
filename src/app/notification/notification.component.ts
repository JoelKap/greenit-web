import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {
  faEye,
  faBackward,
  faAlignJustify,
  faFileAlt,
  faGlobeAfrica,
  faMap,
  faMoneyBillAlt,
  faPencilAlt,
  faUsers,
  faDownload,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl;

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  authDocs: any[] = [];
  p: number = 1;
  userType: string = '';
  lostDocuments: any = [];

  repairNotifications: any = [];
  recyleNotifications: any = [];

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
  faEnvelope = faEnvelope;

  constructor(
    private authService: AuthService,
    public firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private modalService: NgbModal,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private http: HttpClient
  ) {
    this.userType = this.authService.getUserTypeFromStore();
  }

  ngOnInit(): void {
    this.spinner.hide();
    this.loadRepairNotifications();
    this.loadRecycleNotifications();
  }

  private loadRepairNotifications() {
    return this.firestore
      .collection<any>(`repairs`, (ref) => {
        return ref.where('emailSent', '==', false);
      })
      .valueChanges()
      .subscribe((resp) => {
        this.repairNotifications = resp;
      });
  }

  private loadRecycleNotifications() {
    return this.firestore
      .collection<any>(`recycles`, (ref) => {
        return ref.where('emailSent', '==', false);
      })
      .valueChanges()
      .subscribe((resp) => {
        this.recyleNotifications = resp;
      });
  }

  sendRecycleNotification(recycle: any) {
    debugger;
    const result = this.firestore
      .collection<any>(`devices`, (ref) => {
        return ref.where('id', '==', recycle.id).where('isDeleted', '==', true);
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
        savedDevice.saleStatus = 'RECYCLED';
        this.firestore
          .collection('devices')
          .doc(savedDevice.id)
          .update(savedDevice)
          .then(async () => {
            recycle.saleStatus = 'RECYCLED';
            recycle.emailSent = true;
            this.firestore
              .collection('recycles')
              .doc(recycle.recycleId)
              .update(recycle)
              .then(async () => {
                alert(
                  'device status has been updated accordingly, an email notification will be sent to the device user'
                );
                return this.sendNotifications(recycle);
              });
          });
      }
    });
  }

  sendNotifications(device: any) {
    debugger;
    const resolvedMsg = `This device has been recycled by the requested company <b>${device.name}</b>`;
    const message = {
      message: resolvedMsg,
      to: device.ownerEmail,
      name: device.owner,
      subject: 'DEVICE RECYCLE',
    };
    return this.http
      .post(BACKEND_URL + '/sendMail', message)
      .subscribe((resp: any) => {
        if (resp.data) {
          this.toast.success('email sent successfully!!');
          this.sendSecondNotification(device);
        } else {
          this.toast.error('email did not sent');
        }
      });
  }

  sendSecondNotification(device: any) {
    const resolvedMsg = `You have received a device to recycle from <b>${device.owner}</b>`;
    const message = {
      message: resolvedMsg,
      to: device.companyEmail,
      name: device.email,
      subject: 'DEVICE RECYCLE',
    };
    return this.http
      .post(BACKEND_URL + '/sendMail', message)
      .subscribe((resp: any) => {
        if (resp.data) {
        } else {
          this.toast.error('email did not sent');
        }
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
