import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
  standalone: true,
  pure: false
})
export class RelativeTimePipe implements PipeTransform {

  transform(value: string | Date): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) {
      return `Gần đây`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} phút trước`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} giờ trước`;
    }

    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `${days} ngày trước`;
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months} tháng trước`;
    }

    const years = Math.floor(months / 12);
    return `${years} năm trước`;
  }

}
