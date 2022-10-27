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
  selector: 'app-warranty',
  templateUrl: './warranty.component.html',
  styleUrls: ['./warranty.component.css'],
})
export class WarrantyComponent implements OnInit {
  p: number = 1;
  userType: string = '';
  lostDocuments: any = [];
  warantees: any = [];
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
    this.loadWarantees();
  }

  private loadWarantees() {
    debugger;
    this.warantees.length = 0;
    return this.firestore
      .collection<any>(`devices`, (ref) => {
        return ref.where('isDeleted', '==', false);
      })
      .valueChanges()
      .subscribe((resp) => {
        if (resp.length)
          resp.forEach((device) => {
            var purchaseDate = new Date(device.datePurchased);
            if (device.warranty.includes('MONTHS')) {
              var month = device.warranty.replace(' MONTHS', '');
              var waranty = parseInt(month);
              var warantyDate = purchaseDate.getDate();
              var monthInt = purchaseDate.getMonth() + 1;
              var remainingWarantee = monthInt - waranty;

              if ((remainingWarantee = 0)) {
                var result = warantyDate - new Date().getDate();
                if (result > 0 && result <= 7) {
                  this.warantees.push(device);
                }
              }
            }
          });
      });
  }

  sendWaranteeNotification(device: any) {
    debugger;
    const result = this.firestore
      .collection<any>(`devices`, (ref) => {
        return ref.where('id', '==', device.id).where('isDeleted', '==', true);
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
        savedDevice.emailSent = true;
        this.firestore
          .collection('devices')
          .doc(savedDevice.id)
          .update(savedDevice)
          .then(async () => {
            alert(
              'device warrantee notification has been updated accordingly, an email notification will be sent to the device user'
            );
            return this.sendNotifications(device);
          });
      }
    });
  }

  sendNotifications(device: any) {
    debugger;
    const resolvedMsg = `Please be aware your device warantee will soon be expired <b>${device.deviceBrand} ${device.deviceModel}</b>`;
    const message = {
      message: resolvedMsg,
      to: device.email,
      name: device.owner,
      subject: 'DEVICE WARRANTY',
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

  navigateTo(url: string) {
    this.router.navigateByUrl('/' + url);
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/home');
  }
}
