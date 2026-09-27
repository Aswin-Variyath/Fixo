import { inject, Service, signal } from '@angular/core';
import { TaskerSearchApi } from '../api/tasker-search-api';
import { TaskerSearchItem, TaskerSearchParams } from '../types/tasker-search';

@Service()
export class TaskerSearch {
     private readonly taskerSearchApi = inject(TaskerSearchApi)

     readonly taskers = signal<TaskerSearchItem[]>([])
     readonly loading = signal(false)
     readonly hasMore = signal(false)
     readonly searchId = signal<string | null>(null)
     readonly currentPage = signal(1)

      private currentParams: TaskerSearchParams | null = null;

     search(params: TaskerSearchParams):void {
        this.loading.set(true)
        this.currentParams = params;
    this.currentPage.set(1);

        this.taskerSearchApi.searchTaskers(params).subscribe({
            next:(response) => {
                
                this.taskers.set(response.taskers)
                this.searchId.set(response.searchId)
                this.hasMore.set(response.hasMore)
                this.loading.set(false)
            },
            error:(error)=>{
                console.error('Failed to search tasker', error)
                this.loading.set(false)
            }
        })
     }

loadNextPage(): void {
  console.log('LOAD NEXT PAGE START');

  const currentSearchId = this.searchId();

  if (!currentSearchId || this.loading() || !this.hasMore()) {
    console.log('LOAD NEXT PAGE BLOCKED', {
      currentSearchId,
      loading: this.loading(),
      hasMore: this.hasMore(),
    });

    return;
  }

  const nextPage = this.currentPage() + 1;

  console.log('REQUESTING PAGE:', nextPage);

  this.loading.set(true);

  this.taskerSearchApi.loadNextPage({
    searchId: currentSearchId,
    page: nextPage,
  }).subscribe({
    next: (response) => {
      console.log('PAGE RESPONSE:', response);

      this.taskers.update((currentTaskers) => [
        ...currentTaskers,
        ...response.taskers,
      ]);

      this.searchId.set(response.searchId);
      this.hasMore.set(response.hasMore);
      this.currentPage.set(response.page);
      this.loading.set(false);
    },
    error: (error) => {
      console.error('PAGINATION ERROR:', error);
      this.loading.set(false);
    },
  });
}

}
