import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { touchAllFormFields } from '../angular-helpers/validation';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  selectedUserType: any = {};
  governments = [{ name: 'Police Station' }, { name: 'Post office' }];
  constructor(
    private authService: AuthService,
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
      touchAllFormFields(this.loginForm);
      return;
    }

    if (_.isEmpty(this.selectedUserType)) {
      this.toast.info('Plase select user');
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
    const email = resp.user.multiFactor.user.email;
    if(email === 'postoffice@lostnfound.co.za' || email === 'policestation@lostnfound.co.za') {
      localStorage.setItem('token', 'x!4fgZ45');
      this.authService.saveUserTypeToStore(this.selectedUserType.name);
      this.router.navigateByUrl('/dashboard');
    } else {
      this.toast.error('You have put incorrect credentials');
      return;
    }


  }

  hasFailed(err: any) {
    this.spinner.hide();
    this.toast.error('Incorrect user credentials');
  }

}
