import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { faEye, faPlusSquare, faBackward} from '@fortawesome/free-solid-svg-icons';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-chats',
  templateUrl: './view-chats.component.html',
  styleUrls: ['./view-chats.component.css']
})
export class ViewChatsComponent implements OnInit {
  chats: any;
  selectedChat: any = {};
  p: number = 1;

  counter: number = 0;
  headerMenu: string = '';
  closeResult: string = '';

  faEye = faEye;
  faBackward = faBackward;

  constructor(
    public firestore: AngularFirestore,
    private modalService: NgbModal,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadChats();
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/home');
  }

  navigateTo(url: string) {
    this.router.navigateByUrl('/' + url);
  }

  aggregateChat(chats: any) {
    this.chats = this.groupBy(chats, (chat: { chatId: any; }) => chat.chatId);
  }

  view(chat: any, content: any) {
    this.headerMenu = 'View Chats'
    chat.value.forEach((chat: any) => {
        if(chat.from === 'CurrentUser') {
          chat.from = 'Lost'
        } else {
          chat.from = 'Found'
        }
    });
    this.selectedChat = chat;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', modalDialogClass: 'modal-lg', backdrop: 'static', keyboard: false }).result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  private loadChats() {
    return this.firestore.collectionGroup<any>(`chats`)
      .valueChanges()
      .subscribe((chats) => {
        this.aggregateChat(chats);
      })
  }

  private groupBy(chats: any, keyGetter: any) {
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
