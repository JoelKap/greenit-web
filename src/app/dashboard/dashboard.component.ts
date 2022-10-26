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
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  repairs: any;
  users: any = [];
  repairNotifications: any = [];
  recyleNotifications: any = [];
  devices: any = [];
  recycles: any = [];
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
    this.loadRepairNotifications();
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
      .collection<any>(`users`)
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

  private loadRepairNotifications() {
    return this.firestore
      .collection<any>(`repairs`, (ref) => {
        return ref.where('emailSent', '==', false);
      })
      .valueChanges()
      .subscribe((resp) => {
        this.repairNotifications = resp;
        if (this.recyleNotifications.length) {
          this.size =
            this.recyleNotifications.length + this.repairNotifications.length;
        }
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
        if (this.repairNotifications.length) {
          this.size =
            this.repairNotifications.length + this.recyleNotifications.length;
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

  private loadRepairs() {
    return this.firestore
      .collection<any>(`companiesRepairs`, (ref) => {
        return ref.where('isDeleted', '==', false);
      })
      .valueChanges()
      .subscribe((resp) => {
        this.repairs = resp;
      });
  }

  async delete(user: any) {
    try {
      user.isDeleted = true;
      await this.firestore.collection('users').doc(user.id).update(user);
      this.ngOnInit();
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
