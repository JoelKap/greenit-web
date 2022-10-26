import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  faEye,
  faMap,
  faUsers,
  faFileAlt,
  faPencilAlt,
  faGlobeAfrica,
  faMoneyBillAlt,
  faAlignJustify,
  faBackward,
  faTrash,
  faPlusSquare,
} from '@fortawesome/free-solid-svg-icons';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-repairs-chats',
  templateUrl: './view-repairs.component.html',
  styleUrls: ['./view-repairs.component.css'],
})
export class ViewRepairsComponent implements OnInit {
  p: number = 1;
  repairs: any = [];
  userType: string = '';
  closeResult: string = '';
  faEye = faEye;
  faMap = faMap;
  faTrash = faTrash;
  faUsers = faUsers;
  faFileAlt = faFileAlt;
  faPencilAlt = faPencilAlt;
  faGlobeAfrica = faGlobeAfrica;
  faMoneyBillAlt = faMoneyBillAlt;
  faAlignJustify = faAlignJustify;
  faBackward = faBackward;
  faPlusSquare = faPlusSquare;
  repairForm!: FormGroup;

  file!: File;
  imagePreview!: any;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    public firestore: AngularFirestore,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private storage: AngularFireStorage,
    private toast: ToastrService
  ) {
    this.userType = this.authService.getUserTypeFromStore();
    this.createFormBuild();
  }

  ngOnInit(): void {
    this.loadRepairs();
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/home');
  }

  navigateTo(url: string) {
    this.router.navigateByUrl('/' + url);
  }

  create(content: any) {
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

  async update() {
    try {
      await this.firestore
        .collection('companiesRepairs')
        .doc(this.repairForm.controls.id.value)
        .update(this.repairForm.value);
      this.toast.success('updated successfully');
      this.modalService.dismissAll();
    } catch {
      this.toast.error('something went wrong, please contact admin!');
      this.modalService.dismissAll();
    }
  }

  add() {
    const id = this.firestore.createId();
    this.repairForm.controls.createdAt.setValue(new Date());
    this.repairForm.controls.isDeleted.setValue(false);
    this.repairForm.controls.companyId.setValue(id);
    this.repairForm.controls.id.setValue(id);
    this.firestore
      .doc(`companiesRepairs/${id}`)
      .set({
        companyId: id,
        id,
        ...this.repairForm.value,
      })
      .then(async (res) => {
        const reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload = () => {
          console.log(reader.result);
          const photo = `${reader.result}`;
          var uploadTask = this.storage.ref(`deviceFiles/${id}`);
          uploadTask.putString(photo, 'data_url');
          this.modalService.dismissAll();
          this.toast.success('saved successfully');
          this.repairForm.reset();
        };
      });
  }

  edit(device: any, content: any) {
    this.repairForm.setValue(device);
    this.storage
      .ref(`/deviceFiles/${device.id}`)
      .getDownloadURL()
      .toPromise()
      .then((url) => {
        if (url) {
          this.imagePreview = url;
        }
      });
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

  async delete(device: any) {
    try {
      device.isDeleted = true;
      this.repairForm.setValue(device);
      await this.firestore
        .collection('companiesRepairs')
        .doc(this.repairForm.controls.id.value)
        .update(this.repairForm.value);
      this.ngOnInit();
      this.toast.info('deleted successfully');
    } catch (error) {
      this.toast.error('item was not deleted');
    }
  }

  detectFiles(event: any) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.file);
  }

  private createFormBuild() {
    this.repairForm = this.formBuilder.group({
      address: [''],
      cellphone: [''],
      contactPerson: [''],
      email: [''],
      name: [''],
      isDeleted: [Boolean],
      companyId: [''],
      createdAt: [''],
      companyReg: [''],
      id: [''],
      services: [''],
    });
  }

  private loadRepairs() {
    this.spinner.show();
    return this.firestore
      .collection<any>(`companiesRepairs`, (ref) => {
        return ref.where('isDeleted', '==', false);
      })
      .valueChanges()
      .subscribe((resp) => {
        this.spinner.hide();
        this.repairs = resp;
      });
  }
}
