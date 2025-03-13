import { Component } from '@angular/core';
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { ModalSubmitDeleteComponent } from '../../../shared/components/modal-submit-delete/modal-submit-delete.component';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [ButtonComponent, ModalSubmitDeleteComponent],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent {
  isDeleted = false;
}
