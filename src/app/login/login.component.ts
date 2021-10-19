import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { touchAllFormFields } from '../angular-helpers/validation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private toast: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private angularFireAuth: AngularFireAuth,
    private formBuilder: FormBuilder) { 
      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });
    }

  ngOnInit(): void {
  }

  async login(): Promise<void> {
    if (!this.loginForm.valid) {
      debugger;
      touchAllFormFields(this.loginForm);
      return;
    }
    this.spinner.show();
    return new Promise<any>((resolve, reject) => {
      this.angularFireAuth.signInWithEmailAndPassword(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value)
        .then(res => resolve(this.isSuccessfully(res)),
          err => reject(this.hasFailed(err)))
    })
  }

  isSuccessfully(resp: any) {
    this.spinner.hide();
    this.router.navigateByUrl('/dashboard');
  }

  hasFailed(err: any) {
    this.spinner.hide();
    this.toast.error('Incorrect user credentials');
  }

}
