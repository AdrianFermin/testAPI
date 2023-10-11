import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import { BooksI } from '../models/books/books.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  allBooks: BooksI[] = this.llenarData();
  books: BooksI[] = [];
  page: number = 0;
  formulario: FormGroup;
  form: FormGroup;
  selectedUser: BooksI;
  search: FormGroup
  mostrar: boolean;


  constructor(private apiService: ApiService, private formBuilder: FormBuilder, private searchBuilder: FormBuilder){
    this.formulario = this.formBuilder.group({
      id: ['0', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      pageCount: ['', Validators.required],
      excerpt: ['', Validators.required],
      publishDate: ['', Validators.required]
    })

    this.form = this.formBuilder.group({
      id: ['0', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      pageCount: ['', Validators.required],
      excerpt: ['', Validators.required],
      publishDate: ['', Validators.required]
    })

    this.search = this.searchBuilder.group({
      id: ['', Validators.required]
    })
  }

  ngOnInit(): void{
    console.log(this.mostrar)
  }

  paginacion(numero: number, des: number=0): BooksI[]{
    console.log(this.page)
    if(this.mostrar && des != 0) {
      this.mostrar = false;
    } else if(!this.mostrar && des != 0) {
      this.mostrar = true;
    } else if(this.mostrar == undefined && des != 0) {
      this.mostrar = true;
    }
    console.log(this.mostrar)
    this.allBooks = this.llenarData();
    $("#" + numero).addClass('disabled');
    $("#" + this.page).removeClass('disabled');
    if(numero <= 1 ){
      $("#anterior").addClass('disabled');
    } else {
      $("#anterior").removeClass('disabled');
    }

    if(numero >= 4 ){
      $("#siguiente").addClass('disabled');
    } else {
      $("#siguiente").removeClass('disabled');
    }

    this.page = numero;
    var limite = numero * 50;
    var indice = 0;
    for(var i = limite - 50; i < limite; i++){
      this.books[indice] = this.allBooks[i];
      indice += 1;
    }
    return this.books;
  }

  llenarData(): BooksI[]{
    this.apiService.getAllBooks().subscribe(data => {
      this.allBooks = data;
    })
    return this.allBooks;
  }

  vacear(){
    this.formulario.setValue({
      id: this.form.get('id')?.value,
      title: this.form.get('title')?.value,
        description: this.form.get('description')?.value,
        pageCount: this.form.get('pageCount')?.value,
        excerpt: this.form.get('excerpt')?.value,
        publishDate: this.form.get('publishDate')?.value,
    })
  }

  crearLibro() {
    if (this.formulario.valid){
      this.selectedUser = {
        id: 201,
        title: this.formulario.get('title')?.value,
        description: this.formulario.get('description')?.value,
        pageCount: this.formulario.get('pageCount')?.value,
        excerpt: this.formulario.get('excerpt')?.value,
        publishDate: this.formulario.get('publishDate')?.value,
      }

      let mensaje = "Se ha creado el libro " + this.selectedUser.title + " con el ID " + this.selectedUser.id + " de manera satisfactoria";

      $("#registro").modal('hide');
      this.alertas("Exito!", mensaje, "success");

      this.apiService.createBook(this.selectedUser).subscribe(data => {
        this.selectedUser = data;
      })
      }
    }

    editar(id: number): void{
      this.apiService.getById(id).subscribe(data => {
        this.selectedUser = data;
        this.formulario.setValue({
          id: this.selectedUser.id,
          title: this.selectedUser.title,
          description: this.selectedUser.description,
          pageCount: this.selectedUser.pageCount,
          excerpt: this.selectedUser.excerpt,
          publishDate: this.selectedUser.publishDate

        })
      })
    }

    guardar() {
      if (this.formulario.valid) {
        this.selectedUser = {
          id: this.formulario.get('id')?.value,
          title: this.formulario.get('title')?.value,
          description: this.formulario.get('description')?.value,
          pageCount: this.formulario.get('pageCount')?.value,
          excerpt: this.formulario.get('excerpt')?.value,
          publishDate: this.formulario.get('publishDate')?.value,
        }

        let mensaje = "Se ha editado el " + this.selectedUser.title + " con el ID " + this.selectedUser.id + " de manera satisfactoria";

        $("#registro").modal('hide');
        this.alertas("Exito!", mensaje, "success")

        this.apiService.updateBook(this.selectedUser).subscribe(data => {
          this.selectedUser = data;
        })
      }
      
    }

    verDetalles(id: number){
      this.apiService.getById(id).subscribe(data => {
        this.selectedUser = data;
      })
    }

    eliminarLibro(id: number, open: boolean){
      if(this.selectedUser && this.selectedUser.id == id && open == true) {
        let mensaje = "Se ha eliminado el " + this.selectedUser.title + " con el ID " + this.selectedUser.id + " de manera satisfactoria";
        $("#eliminar").modal('hide');
        this.alertas("Exito!", mensaje, "success")
        this.apiService.deleteBook(id).subscribe();
      } else {

        this.apiService.getById(id).subscribe(data => {
          this.selectedUser = data;
        })
      }
      
    }
    
    buscar(){
      if(this.books[0] == undefined){
        if(this.search.valid){
          console.log(this.page)
          this.mostrar = true;
          this.allBooks = [];
          this.apiService.getById(this.search.get('id')?.value).subscribe(data => {
            this.allBooks[0] = data;
          })
          this.alertas("Exito!", "Libro encontrado", "success")
        } else {
          this.alertas("Advertencia!", "Id no valido", "danger")
        }
      } else {
        if(this.search.valid){
          this.books = [];
          this.apiService.getById(this.search.get('id')?.value).subscribe(data => {
            this.books[0] = data;
          })
          this.alertas("Exito!", "Libro encontrado", "success")
        } else {
          this.alertas("Advertencia!", "Id no valido", "danger")
        }
      }
    }

    alertas(estado: string,mensaje: string, color: string){
      let div = document.querySelector('#alertas');
      let contenido = document.createElement("div");
      div?.appendChild(contenido)
      contenido.innerHTML = '<div class="alert alert-' + color + ' alert-dismissible fade show" role"alert">' + 
      '<h6><strong>' + estado + ' </strong>' + mensaje + '</h6><button type="button"' + 
      'class="btn-close" data-bs-dismiss="alert" aria-label="close"></button></div>'
      
    }

    
    
  }






