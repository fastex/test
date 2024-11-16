import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoCardComponent } from './photo-card.component';
import { ComponentRef } from '@angular/core';

describe('PhotoCardComponent', () => {
  let component: PhotoCardComponent;
  let componentRef: ComponentRef<PhotoCardComponent>;
  let fixture: ComponentFixture<PhotoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit loaded event with id on ngOnInit', () => {
    const expectedId = '123';
    spyOn(component.loaded, 'emit');
    componentRef.setInput('id', expectedId);
    fixture.detectChanges();
    expect(component.loaded.emit).toHaveBeenCalledWith(expectedId);
  });
});
