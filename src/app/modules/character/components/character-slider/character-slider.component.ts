import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Pagination } from '@shared/app-pagination';
import { CharacterService } from '@modules/character/service';
import { Character } from 'src/app/model/character';
import { CharacterHelper } from 'src/app/model/character-helper';
import { ViewChild } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';

@Component({
  selector: 'app-character-slider',
  templateUrl: './character-slider.component.html',
  styleUrls: ['./character-slider.component.scss']
})
export class CharacterSliderComponent implements OnInit, OnDestroy {
  @ViewChild('slickModal', { static: true }) slickModal!: SlickCarouselComponent;
  private pagination: Pagination = new Pagination().size(50);
  public slides: {img: string}[] = [];
  public entityList: Character[] = [];
  private subscription!: Subscription;
  private paginationSubs!: Subscription;
  private loading: boolean = false;
  private initialized: boolean = false;

  constructor(private service: CharacterService) { }

  ngOnInit(): void {
    this.service.findEntities('', true);
    
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

          if (result.isClear) {


            
            // if (this.slickModal.initialized) {
            //   this.slickModal.unslick();
            //   console.log('unslick');
              
            // }

            this.entityList.splice(0, this.entityList.length);
            
            // if (!this.slickModal.initialized) {
            //   this.slickModal.initSlick();
            //   console.log('initSlick');
            // }
          }
          result.entityList.forEach( val => this.entityList.push(Object.assign({}, val)) );
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
    lazyLoad: 'ondemand',
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
  
  addSlide() {
    // this.slides.push({img: "https://material.angular.io/assets/img/examples/shiba2.jpg"})
  }
  
  removeSlide() {
    // this.slides.length = this.slides.length - 1;
  }
  
  slickInit(e: any) {
    this.initialized = true;
    // console.log('slick initialized');
    // console.log(e);
  }
  
  breakpoint(e: any) {
    console.log('breakpoint');
    // console.log(e);
  }
  
  afterChange(e: any) {
    console.log('afterChange');
    // console.log(e);
  }
  
  beforeChange(e: any) {
    if (this.loading) {
      return;
    }
    // console.log(e);
    
    // console.log('beforeChange');
    // console.log(e);
    // console.log('currentSlide: ' + e.currentSlide);
    // console.log('nextSlide: ' + e.nextSlide);
    // console.log('slidesToScroll: ' + e.slick.options.slidesToScroll);
    // console.log('slidesToShow: ' + e.slick.options.slidesToShow);
    // console.log('totalSlides: ' + this.entityList.length);
    // console.log('getTotalElements: ' + this.pagination.getTotalElements());
    

    if (this.entityList.length >= this.pagination.getTotalElements()) {
      return;
    }

    if (e.nextSlide + (e.slick.options.slidesToScroll*2) >= this.entityList.length) {
      console.log('Lazy load');
      // console.log(this.pagination.getpageNumber());
      
      this.service.pageChange(this.pagination.getpageNumber() + 1);
    }
      
  }
  
  _trackBy(index: number, slide: Character) {
    console.log(index);
    console.log(slide);
    
    
    if (slide) {
      return slide.id;
    }
    else return 0;
  }

  // selected: boolean = false;
  public onClick(entity: Character) {
    // if (!this.selected) {
    //   this.selected = true;
      this.service.entitySelection(entity);
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

}
