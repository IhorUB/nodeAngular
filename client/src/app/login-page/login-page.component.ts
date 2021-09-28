import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from 'rxjs'
import {ActivatedRoute, Params, Router} from '@angular/router'

import {AuthService} from '../shared/services/auth.service'
import {MaterialService} from '../shared/classes/material.service'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
})

export class LoginPageComponent implements OnInit, OnDestroy {

  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  })
  aSub!: Subscription;

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MaterialService.toast('You are welcome!')
      } else if (params['accessDenied']) {
        MaterialService.toast('Access denied, you shoud login')
      } else if (params['sessionFailed']) {
        MaterialService.toast('sessionFailed, login please')
      }
    })
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

  onSubmit() {
    this.form.disable()

    this.aSub = this.auth.login(this.form.value).subscribe(
      () => this.router.navigate(['/overview']),
      error => {
        MaterialService.toast(error.error.message)
        console.error(error)
        this.form.enable()
      }
    )
  }
}
