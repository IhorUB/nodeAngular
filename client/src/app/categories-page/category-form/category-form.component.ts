import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router'
import {FormGroup, FormControl, Validators} from '@angular/forms'
import {switchMap} from 'rxjs/internal/operators'
import {of} from 'rxjs';

import {CategoriesService} from '../../shared/services/categories.service'
import {MaterialService} from '../../shared/classes/material.service'
import {Category} from '../../shared/interfaces'

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html'
})
export class CategoryFormComponent implements OnInit {

  @ViewChild('input') inputRef!: ElementRef

  form: FormGroup = new FormGroup({})
  image?: File
  imagePreview: any
  isNew: boolean = true
  category?: any

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })

    this.form.disable()

    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.isNew = false
              return this.categoriesService.getById(params['id'])
            }
            return of(null)
          }
        )
      )
      .subscribe(
        category => {
          if (category) {
            this.category = category
            this.form.patchValue({
              name: category.name
            })
            this.imagePreview = category.imageSrc
            MaterialService.updateTextInputs()
          }
          this.form.enable()
        },
        error => MaterialService.toast(error.error.message)
      )
  }

  onSubmit() {
    let obs$
    this.form.disable()

    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.image)
    } else {
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image)
    }

    obs$.subscribe(
      category => {
        this.category = category
        MaterialService.toast('Save data')
        this.form.enable()
      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }

  triggerClick() {
    this.inputRef.nativeElement.click()
  }

  onFileUpload(event: any) {

    if (event.target.files) {
      let reader = new FileReader();
      const file: File = event.target.files[0]
      reader.readAsDataURL(file);
      this.image = file
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result
      }
    }




    // const reader: FileReader = new FileReader()
    //
    // reader.onload = async () => {
    //   this.imagePreview = await reader.result
    // }
  }

}

