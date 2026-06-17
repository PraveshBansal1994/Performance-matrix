import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IEmployees } from '@app/shared/models/employees.model';
import { PaginationInfo } from '@app/shared/models/pagination.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pagination-bar',
  imports: [FormsModule, CommonModule],
  templateUrl: './pagination-bar.html',
  styleUrl: './pagination-bar.scss',
})
export class PaginationBar {
  @Input() data!: Observable<IEmployees>;
  @Output() paginationData = new EventEmitter<PaginationInfo>();
  public totalItems!: number | null | undefined;
  public currentPage = 1;
  public prevPage = 0;
  public nextPage = 2;
  public lastPage!: number | null | undefined;
  public fromItemIndex = signal(0);
  public toItemIndex = signal(0);
  public selectedPage = signal<string>('15');

  public getPages(data: IEmployees | null): number[] {
    this.lastPage = data?.last;
    this.totalItems = data?.items;
    setTimeout(() => {
      this.getCalculatedStartingIndex();
      this.getCalculatedEndIndex();
    });

    return Array.from(
      { length: (data?.last ?? 0) - (data?.first ?? 0) + 1 },
      (_, i) => (data?.first ?? 0) + i
    );
  }

  public rowPerPage(event: Event): void {
    this.selectedPage.set((event?.target as HTMLSelectElement)?.value);
    this.currentPage = 1;
    this.prevPage = 0;
    this.paginationData.emit({ page: this.currentPage, pageSize: Number(this.selectedPage()) });
  }

  public onPageClick(page: number | string): void {
    if (
      (page === 'prev' && this.currentPage === 1) ||
      (page === 'next' && this.currentPage === this.lastPage)
    ) {
      return;
    }
    switch (page) {
      case 'prev':
        this.currentPage--;
        this.prevPage--;
        this.nextPage--;
        break;
      case 'next':
        this.currentPage++;
        this.prevPage++;
        this.nextPage++;
        break;
      default:
        this.currentPage = Number(page);
        this.prevPage = this.currentPage - 1;
        this.nextPage = this.currentPage + 1;
    }
    this.paginationData.emit({ page: this.currentPage, pageSize: Number(this.selectedPage()) });
  }

  private getCalculatedStartingIndex(): void {
    this.fromItemIndex.set(this.prevPage * Number(this.selectedPage()) + 1);
  }

  private getCalculatedEndIndex(): void {
    const endIndex = this.prevPage * Number(this.selectedPage()) + Number(this.selectedPage());
    this.toItemIndex.set(
      this.totalItems ? (endIndex > this.totalItems ? this.totalItems : endIndex) : 0
    );
  }
}
