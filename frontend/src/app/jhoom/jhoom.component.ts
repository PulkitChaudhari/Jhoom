import { Component } from '@angular/core';
import { DataShareService } from '../services/data.share.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-jhoom',
  templateUrl: './jhoom.component.html',
  styleUrls: ['./jhoom.component.css'],
})
export class JhoomComponent {
  constructor(private dataShareService: DataShareService) {}
}
