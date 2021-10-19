import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { faMap, faUsers, faFileAlt, faPencilAlt, faGlobeAfrica, faMoneyBillAlt, faAlignJustify } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  chats: any;
  users: any = [];
  authDocs: any = [];
  lostDocuments: any = [];
  foundDocuments: any = [];
  
  counter: number = 0;
  paymentApprovs: any = [];
  paymentCancells: any = [];

  p: number = 1;

  headerMenu: string = '';
  closeResult: string = '';

  faUsers = faUsers;
  faFileAlt = faFileAlt;
  faPencilAlt = faPencilAlt;
  faGlobeAfrica = faGlobeAfrica;
  faMoneyBillAlt = faMoneyBillAlt;
  faAlignJustify = faAlignJustify;

  constructor(
    public firestore: AngularFirestore,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadLostDocuments();
    this.loadFoundDocuments();
    this.loadChats();
    // this.loadAuthDocs();
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/home');
  }

  navigateTo(url: string) {
    this.router.navigateByUrl('/' + url);
  }

  private loadUsers() {
    return this.firestore.collection<any>(`users`)
      .valueChanges()
      .subscribe((resp) => {
        this.users = resp;
      })
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

  private loadFoundDocuments() {
    return this.firestore.collection<any>(`foundDocuments`, ref => {
      return ref
        .where('isDeleted', '==', false)
    }).valueChanges()
      .subscribe((resp) => {
        this.foundDocuments = resp;
      })
  }

  private loadChats() {
    return this.firestore.collectionGroup<any>(`chats`)
      .valueChanges()
      .subscribe((chats) => {
        this.aggregateChat(chats);
      })
  }

  aggregateChat(chats: any) {
    this.chats = this.groupBy(chats, (chat: { chatId: any; }) => chat.chatId);
    this.counter = this.chats.size;
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


