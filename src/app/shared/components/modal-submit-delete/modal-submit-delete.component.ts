import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-submit-delete',
  standalone: true,
  imports: [ButtonComponent, CommonModule],
  templateUrl: './modal-submit-delete.component.html',
  styleUrl: './modal-submit-delete.component.css'
})
export class ModalSubmitDeleteComponent {
  @Input() isOpen = false;

  @Output() confirmModal = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();


  confirm() {
    this.confirmModal.emit();
  }

  close() {
    this.closeModal.emit();
  }
}
