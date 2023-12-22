import { Component } from '@angular/core';
import { DataShareService } from '../services/data.share.service';

@Component({
  selector: 'app-jhoom',
  templateUrl: './jhoom.component.html',
  styleUrls: ['./jhoom.component.css'],
})
export class JhoomComponent {
  private peerArray: any[];

  constructor(private dataShareService: DataShareService) {}
}
