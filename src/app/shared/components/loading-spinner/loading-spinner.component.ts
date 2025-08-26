import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner" [class.spinner-small]="size() === 'small'" role="status" aria-label="Loading">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
  `,
  styles: `
    .spinner {
      width: 40px;
      height: 40px;
      position: relative;
      margin: var(--space-xl) auto;
    }
    .spinner-small {
      width: 20px;
      height: 20px;
      margin: 0;
    }

    .double-bounce1, .double-bounce2 {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: var(--color-primary); /* Use primary color for spinner */
      opacity: 0.6;
      position: absolute;
      top: 0;
      left: 0;
      animation: sk-bounce 2.0s infinite ease-in-out;
    }

    .double-bounce2 {
      animation-delay: -1.0s;
    }

    @keyframes sk-bounce {
      0%, 100% {
        transform: scale(0.0);
      }
      50% {
        transform: scale(1.0);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinnerComponent {
  public size = input<'small' | 'medium' | 'large'>('medium');
}