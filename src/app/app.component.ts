import {Component} from '@angular/core';
import {routes} from './app-routing.module';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'POISSON';
  routerLinks = routes.filter((route) => route.linkText);
}

