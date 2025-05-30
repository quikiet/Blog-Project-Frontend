import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'black' | 'none' | 'warning' | 'full' | 'success' = 'primary';
  @Output() clicked = new EventEmitter<void>();
  @Input() disabled: boolean = false;
  getButtonClasses() {
    const baseClass = 'transition-all';
    const variantClass = {
      primary: 'btn btn-xs sm:btn-sm md:btn-md rounded-none bg-primary border-black text-white font-medium hover:bg-secondary hover:border-black',
      success: 'btn btn-xs sm:btn-sm md:btn-md rounded-none bg-success border-black text-white font-bold hover:bg-secondary-content hover:border-black',
      full: 'min-w-full btn btn-xs sm:btn-sm md:btn-md rounded-none bg-primary border-black text-white font-medium hover:bg-secondary hover:border-black',
      secondary: 'btn btn-xs sm:btn-sm md:btn-md rounded-none bg-secondary border-black text-white font-medium hover:bg-primary hover:border-black',
      black: 'py-1.5 px-4 rounded-md text-xs bg-black select-none text-white hover:bg-primary',
      none: 'btn rounded-none bg-white hover:bg-gray-300 text-black text-sm',
      warning: 'btn btn-xs sm:btn-sm md:btn-md rounded-none bg-yellow-500 border-black text-white font-medium hover:bg-yellow-600 hover:border-black',
    };
    return `${baseClass} ${variantClass[this.variant]}`;
  }

  onClick() {
    this.clicked.emit();
  }



}
