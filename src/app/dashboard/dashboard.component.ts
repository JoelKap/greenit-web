import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import {
  faMap,
  faUsers,
  faFileAlt,
  faPencilAlt,
  faGlobeAfrica,
  faMoneyBillAlt,
  faAlignJustify,
  faTrash,
  faBell,
  faWrench,
  faRecycle,
  faTablet,
  faFile,
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  repairs: any = [];
  users: any = [];
  repairNotifications: any = [];
  recyleNotifications: any = [];
  devices: any = [];
  recycles: any = [];
  warantees: any = [];
  size = 0;
  counter: number = 0;
  paymentApprovs: any = [];
  paymentCancells: any = [];

  p: number = 1;

  userType: string = '';
  headerMenu: string = '';
  closeResult: string = '';
  faTrash = faTrash;
  faUsers = faUsers;
  faFileAlt = faFileAlt;
  faPencilAlt = faPencilAlt;
  faGlobeAfrica = faGlobeAfrica;
  faMoneyBillAlt = faMoneyBillAlt;
  faAlignJustify = faAlignJustify;
  faBell = faBell;
  faWrench = faWrench;
  faRecycle = faRecycle;
  faTablet = faTablet;
  faFile = faFile;

  constructor(
    public afAuth: AngularFireAuth,
    private authService: AuthService,
    public firestore: AngularFirestore,
    private router: Router,
    private toast: ToastrService
  ) {
    this.userType = this.authService.getUserTypeFromStore();
    if (this.userType === '') {
      this.logout();
    }
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadDevices();
    this.loadRecycles();
    this.loadRepairs();
    this.loadWarantees();
    this.loadRecycleNotifications();
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

  private loadUsers() {
    return this.firestore
      .collection<any>(`users`, (ref) => {
        return ref.where('isDeleted', '==', false);
      })
      .valueChanges()
      .subscribe((resp) => {
        this.users = resp;
      });
  }

  private loadDevices() {
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

  private loadRecycleNotifications() {
    return this.firestore
      .collection<any>(`recycles`, (ref) => {
        return ref
          .where('emailSent', '==', false)
          .where('isDeleted', '==', true);
      })
      .valueChanges()
      .subscribe((resp) => {
        this.recyleNotifications = resp;
        if (this.recyleNotifications.length) {
          this.size = this.recyleNotifications.length;
        }
      });
  }

  private loadRecycles() {
    return this.firestore
      .collection<any>(`companies`, (ref) => {
        return ref.where('isDeleted', '==', false);
      })
      .valueChanges()
      .subscribe((resp) => {
        this.recycles = resp;
      });
  }

  loadWarantees() {
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

  private loadRepairs() {
    this.repairs.length = 0;
    return this.firestore
      .collection<any>(`companiesRepairs`, (ref) => {
        return ref.where('isDeleted', '==', false);
      })
      .valueChanges()
      .subscribe((resp) => {
        if (resp.length) {
          this.repairs = resp;
        }
      });
  }

  async delete(user: any) {
    try {
      user.isDeleted = true;
      await this.firestore.collection('users').doc(user.id).update(user);
      this.loadUsers();
      this.toast.info('deleted successfully');
    } catch (error) {
      this.toast.error('item was not deleted');
    }
  }

  aggregateChat(chats: any) {
    this.repairs = this.groupBy(chats, (chat: { chatId: any }) => chat.chatId);
    this.counter = this.repairs.size;
  }

  groupBy(chats: any, keyGetter: any) {
    const map = new Map();
    chats.forEach((item: any) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }
}
