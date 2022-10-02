import { Component, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { SwiperComponent } from "swiper/angular";
import SwiperCore, { Mousewheel, Navigation, Pagination, Virtual } from 'swiper';

import { Pagination as MyPagination } from '@shared/app-pagination';
import { environment } from '@environment/environment';
import { CharacterService } from '@modules/character/service';
import { Character, CharacterHelper } from 'src/app/model';

SwiperCore.use([Pagination, Navigation, Virtual, Mousewheel]);

@Component({
  selector: 'app-character-swiper',
  templateUrl: './character-swiper.component.html',
  styleUrls: ['./character-swiper.component.scss']
})
export class CharacterSwiperComponent implements OnInit, OnDestroy {
  @ViewChild('swiperRef', { static: false }) swiper!: SwiperComponent;
  private pagination: MyPagination = new MyPagination().size(20);
  public entityList: Character[] = [];
  private subscription!: Subscription;
  private paginationSubs!: Subscription;
  private loading: boolean = false;
  private initialized: boolean = false;
  private firstTime: boolean = true;

  constructor(private service: CharacterService) { }

  ngOnInit(): void {
    this.service.initialize();
    
    this.paginationSubs = this.service.getPaginationSubject$().subscribe({
      next: (result) => {
        this.pagination.pageNumber = result.pageNumber;
        this.pagination.pageSize = result.pageSize;
        this.pagination.totalPages = result.totalPages;
        this.pagination.totalElements = result.totalElements;
      }
    });
    this.subscription = this.service.getSearchingSubject$().subscribe({
      next: (result) => {
        if (result.searching) {
          // this.spinner.show();
          this.loading = true;
        } else {
          // this.spinner.hide();
          this.loading = true;

          if (result.isClear && !this.firstTime) {
            this.clearSlides();
            this.addSlides(result.entityList);
            this.slideTo(1);
          } else {
            this.addSlides(result.entityList);
            this.firstTime = false;
          }
          
          this.loading = false;
        }
      }
    });
  }
  
  ngOnDestroy(): void {
    this.paginationSubs.unsubscribe();
    this.subscription.unsubscribe();
  }
  
  private addSlide(slide: Character) {
    this.entityList = [ ...this.entityList, { ...slide, description: this.getDescription(slide) } ];
    // this.entityList.push({ ...slide, description: this.getDescription(slide) });
  }
  
  private addSlides(slides: Character[]) {
    slides.forEach( slide => this.addSlide(slide) );
  }

  private clearSlides() {
    this.entityList.splice(0, this.entityList.length);
    this.swiper.swiperRef.virtual.removeAllSlides();
  }

  private slideTo(index: number) {
    this.swiper!.swiperRef.slideTo(index - 1, 0);
  }
  
  private removeSlide(slide: Character) {
    const index = this.entityList.indexOf(slide, 0);
    if (index > -1) {
      this.entityList.splice(index, 1);
    }
  }
  
  private slidesSize(): number {
    return this.entityList.length;
  }

  public activeIndexChange(swiper: any) {
    let indice: number = swiper[0].activeIndex;
    
    if (this.loading) {
      return;
    }

    // this.log('activeIndexChange');

    if (this.slidesSize() >= this.pagination.getTotalElements()) {
      return;
    }

    // this.log('activeIndexChange INSIDE');
    // this.log(indice);

    if (indice + 10 >= this.slidesSize()) {
      this.log('============== Lazy load ==============');
      // this.log(this.pagination.getpageNumber());
      
      this.service.pageChange(this.pagination.getpageNumber() + 1);
    }
  }
  
  public onClick(entity: Character) {
      this.service.selectEntity(entity);
  }

  public getDescription(entity: Character) {
    // {{slide.status + ', ' + slide.species + ', ' + slide.gender + ', ' + slide.origin!.name}}
    return CharacterHelper.getDescription(entity);
  }

  private log(value: any) {
    if (!environment.production) {
      console.log(value);
    }
  }
}
