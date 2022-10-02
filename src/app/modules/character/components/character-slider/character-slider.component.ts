import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Pagination } from '@shared/app-pagination';
import { CharacterService } from '@modules/character/service';
import { Character } from 'src/app/model/character';
import { CharacterHelper } from 'src/app/model/character-helper';
import { ViewChild } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { environment } from '@environment/environment';

@Component({
  selector: 'app-character-slider',
  templateUrl: './character-slider.component.html',
  styleUrls: ['./character-slider.component.scss']
})
export class CharacterSliderComponent implements OnInit, OnDestroy {
  @ViewChild('slickModal', { static: true }) slickModal!: SlickCarouselComponent;
  private pagination: Pagination = new Pagination().size(20);
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
          } else {
            this.addSlides(result.entityList);
            this.firstTime = false;
          }

          if (result.isClear && this.initialized) {
            this.slickModal.slickGoTo(1);
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
  
  slideConfig = {
    // lazyLoad: 'progressive', // progressive, ondemand  <img [attr.data-lazy]="slide.image" alt=""/>
    slidesToShow: 6,
    slidesToScroll: 6,
    infinite: false,
    variableWidth: false,
    outerEdgeLimit: true,
    // adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1430,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          // infinite: true,
          // dots: true
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        }
      },
      {
        breakpoint: 740,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
    ]
    // nextArrow: '<div style=\'position: absolute; top: 35%; right: 5px; cursor: pointer;\' class=\'next-slide\'><i class="fa fa-angle-double-right"></i></div>',
    // prevArrow: '<div style=\'position: absolute; top: 35%; left: 5px; z-index: 1; cursor: pointer;\' class=\'next-slide\'><i class="fa fa-angle-double-left"></i></div>',
  };
  
  private addSlide(slide: Character) {
    // Object.assign({}, val)
    this.entityList.push({ ...slide, description: this.getDescription(slide) });
  }
  
  private addSlides(slides: Character[]) {
    slides.forEach( slide => this.addSlide(slide) );
  }

  private clearSlides() {
    // if (this.slickModal.initialized) {
    //   this.slickModal.unslick();
    //   this.log('unslick');
      
    // }

    this.entityList.splice(0, this.entityList.length);

    // if (!this.slickModal.initialized) {
    //   this.slickModal.initSlick();
    //   this.log('initSlick');
    // }
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
  
  slickInit(e: any) {
    this.initialized = true;
    // this.log('slick initialized');
    // this.log(e);
  }
  
  breakpoint(e: any) {
    // this.log('breakpoint');
    // this.log(e);
  }
  
  afterChange(e: any) {
    // this.log('afterChange');
    // this.log(e);
  }
  
  beforeChange(e: any) {
    // this.log('beforeChange');

    if (this.loading) {
      return;
    }
    
    // this.log('beforeChange inside');
    // this.log(e);
    
    // this.log(e);
    // this.log('currentSlide: ' + e.currentSlide);
    // this.log('nextSlide: ' + e.nextSlide);
    // this.log('slidesToScroll: ' + e.slick.options.slidesToScroll);
    // this.log('slidesToShow: ' + e.slick.options.slidesToShow);
    // this.log('totalSlides: ' + this.entityList.length);
    // this.log('getTotalElements: ' + this.pagination.getTotalElements());
    

    if (this.slidesSize() >= this.pagination.getTotalElements()) {
      return;
    }

    if (e.nextSlide + (e.slick.options.slidesToScroll*2) >= this.slidesSize()) {
      this.log('============== Lazy load ==============');
      // this.log(this.pagination.getpageNumber());
      
      this.service.pageChange(this.pagination.getpageNumber() + 1);
    }
      
  }
  
  _trackBy(index: number, slide: Character): number {
    // *ngFor="let slide of slides; trackBy: _trackBy"
    // this.log(index);
    // console.log(slide);
    return slide.id;
  }

  // selected: boolean = false;
  public onClick(entity: Character) {
    // if (!this.selected) {
    //   this.selected = true;
      this.service.selectEntity(entity);
    // } else {
    //   this.selected = false;
    //   this.service.entitySelection(null);
    // }
    
  }

  public onBlur() {
    // this.service.entitySelection(null);
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
