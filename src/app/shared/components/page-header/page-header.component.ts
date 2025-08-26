import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="page-header text-center">
      <h2>{{ title() }}</h2>
      @if (subtitle()) {
        <p class="subtitle">{{ subtitle() }}</p>
      }
    </header>
  `,
  styles: `
    .page-header {
      margin-bottom: var(--space-xxl);
      padding-bottom: var(--space-md);
      border-bottom: 1px solid var(--color-border);
    }
    .page-header h2 {
      font-size: 2.5rem;
      color: var(--color-primary-dark);
      margin: 0;
      font-weight: 700;
    }
    .page-header .subtitle {
      font-size: 1.15rem;
      color: var(--color-text-medium);
      margin-top: var(--space-sm);
    }

    @media (max-width: 768px) {
      .page-header h2 {
        font-size: 2rem;
      }
      .page-header .subtitle {
        font-size: 1rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageHeaderComponent {
  public title = input.required<string>();
  public subtitle = input<string | undefined>();
}