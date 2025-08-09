import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//no need to import the layout component because we are using the router-outlet to export the header
//import { LayoutComponent } from './components/layout/layout.component';

@Component({
 selector: 'app-root',
 standalone: true,
 //only use the router-outlet to export the header
 imports: [RouterOutlet], //LayoutComponent],
 //changed to router-outlet to export the header
 template: '<router-outlet></router-outlet>'
})
export class AppComponent {
 title = 'Task Management System';
}