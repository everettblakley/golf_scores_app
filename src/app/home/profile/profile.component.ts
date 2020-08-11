import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'ns-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private router: RouterExtensions) { }

  goBack() {
    this.router.backToPreviousPage();
  }

  ngOnInit(): void {
  }

}
