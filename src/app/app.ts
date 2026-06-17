import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '@app/layout/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  public title = 'Performance Metrics';
  public subTitle = 'Employee Performance Analytics - FY2025 Q4';
}
