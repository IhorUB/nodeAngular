import {Component, AfterViewInit, ViewChild, ElementRef} from '@angular/core'
import {Router} from '@angular/router'

import {AuthService} from '../../services/auth.service'
import {MaterialService} from '../../classes/material.service'

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements AfterViewInit {

  @ViewChild('floating') floatingRef: any

  links = [
    {url: '/overview', name: 'Overview'},
    {url: '/analytics', name: 'Analytics'},
    {url: '/history', name: 'History'},
    {url: '/order', name: 'Add order'},
    {url: '/categories', name: 'Categories'}
  ]

  constructor(private auth: AuthService,
              private router: Router) {
  }


  ngAfterViewInit() {
    MaterialService.initializeFloatingButton(this.floatingRef)
  }

  logout(event: Event) {
    event.preventDefault()
    this.auth.logout()
    this.router.navigate(['/login'])
  }
}
