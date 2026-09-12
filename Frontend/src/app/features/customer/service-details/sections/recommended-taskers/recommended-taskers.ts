import { Component, signal } from '@angular/core';
import { TaskerCard, TaskerPresentation } from './tasker-card/tasker-card';

type TaskerSectionState = 'loading' | 'success' | 'empty' | 'location-required' | 'error';

@Component({
  selector: 'app-recommended-taskers',
  imports: [TaskerCard],
  templateUrl: './recommended-taskers.html',
  styleUrl: './recommended-taskers.css',
})
export class RecommendedTaskers {
  readonly taskerState = signal<TaskerSectionState>('success');

  readonly taskers: readonly TaskerPresentation[] = [
    {
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXaBCyr_hsLmdqYGiX_5buAkVNoyXNSFYa2imA5m5ZyipW_N3R7BvnTS7ccYzzV4hPJGX5lXL5a8JEBBT73SVAyXuEficKh-Q0UxGAHNOx_-hDbhw57HVrXIjvO6HiJecCvTjws921VTd0vEPdObLT-xVBjCpWpwUwDIlhpcaR_Uckhr8zwRLL921nWo_hy8MJNZgOLH2-9mMqaR76dLhW0H_mRalr23PpDpr29mw4Ad-lZGM1ZxJA',
      name: 'Rahul Kumar', title: 'Plumbing Specialist', rating: '4.8', reviewCount: 124, distance: '3.2 km', availability: 'Available Today',
    },
    {
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7_8xm_N97tozW778khQ7mGs88HJ87KJkAwxW-T4-Bd_UD5m3GEwYvWDBKt0Nl0lGTkX1QNI6C9WYoMxL_7Qv55d4L1BfO5KlYO8aJVBF1q5gsqs98fFo5RWt1SSu1Dh8y6mt-30sgsgtnyqfuEqd2iPz4HejoFtcYxX83TMG_ylFOOxuEPY8GCGuTUuaGXeyzKt7zNhQba8p_YB_SDPxsQ3GbVzaORSkRNDX21PNoRlTQxleQgiXe',
      name: 'Mohammed Ali', title: 'Master Plumber & Pipe Fitter', rating: '5.0', reviewCount: 210, distance: '4.7 km', availability: 'Available Today',
    },
    {
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASYY3K7Kjwq6gnOrJy7VPcgq1XkrLnnubexjP6YXHhI6yTEQ_NSkb66DsqAMVI1m6VRzcPptPoS0YxrsfqiNmSiuRfcFT4nE_E1wVGBH6GjjCQvx0XNd8WYcGmayzbG6PM8cfrYkANzrYWvmIcj6weF6pjT7Fa8NjlDKow6MsW_K_JuE52RQ5YheRgEYs_anzBftEjt9gogCLsjwpRt-jcDjc83wEVWf8_fVIFoapQLvaUhd9NmW6R',
      name: 'Anil Thomas', title: 'Drain & Pipeline Specialist', rating: '4.7', reviewCount: 86, distance: '5.1 km', availability: 'Available Tomorrow',
    },
    {
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOztd4WU0tXPwSodDV2AjzIKPMhGAw-y02YLv1p_a0xps7llOY0eKXmrFK5UDjeSCfX8FMmhpfu3KAMw_SRz5kjZi3fZbzSbNJRnJDl8J295PjpvEBvfCwcMITtJSiHp2kWr7AJOzop59ToI4OIOMhwmqY3hj0XJK7XfFHf1lnnC8MyQVke0Gjg5IBnHKX2Y2aWkZmRFwPcT6fs6XV7-N8e6LifAHAcAJorNE8ZCFH_01wk1W60zW3',
      name: 'Suresh R.', title: 'Sanitary & Leakage Expert', rating: '4.9', reviewCount: 97, distance: '6.4 km', availability: 'Next available Sep 14',
    },
  ];
}
