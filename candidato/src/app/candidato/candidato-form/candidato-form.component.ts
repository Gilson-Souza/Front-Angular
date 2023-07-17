import { Candidatoo } from './../models/Candidato';
import { CandidatosService } from './../services/candidatos.service';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-candidato-form',
  templateUrl: './candidato-form.component.html',
  styleUrls: ['./candidato-form.component.scss']
})
export class CandidatoFormComponent {

meuFormulario: FormGroup;

    constructor(
      private formBuilder: FormBuilder,
      public dialog: MatDialog,
      private router : Router,
      private route: ActivatedRoute,
      private candidatoService: CandidatosService,
      private bar: MatSnackBar

      )

    {

      this.meuFormulario = this.formBuilder.group({

        Nome: ['' ,Validators.required],

          Filiacao: this.formBuilder.group({
            NomePai: [''],
            NomeMae: ['', Validators.required]
          }),

          Endereco: this.formBuilder.group({
            Logradouro: ['' ,Validators.required],
            Cep: ['' ,Validators.required],
            Numero: ['' ,Validators.required],
            Cidade: this.formBuilder.group({
              Nome: ['',Validators.required],
              Estado: this.formBuilder.group({
                Nome: ['',Validators.required],
                Sigla: ['',Validators.required]
              })

            })

          }),

          Telefones: this.formBuilder.array([]),

          Cursos: this.formBuilder.array([])

      })

    }

    get Nome(){
      return this.meuFormulario.get('Nome')!;
    }
    get NomeMae(){
      return this.meuFormulario.get('Filiacao.NomeMae')!;
    }
    get Logradouro(){
      return this.meuFormulario.get('Endereco.Logradouro')!;
    }
    get Numero(){
      return this.meuFormulario.get('Endereco.Numero')!;
    }
    get Cep(){
      return this.meuFormulario.get('Endereco.Cep')!;
    }
    get Cidade(){
      return this.meuFormulario.get('Endereco.Cidade.Nome')!;
    }
    get Estado(){
      return this.meuFormulario.get('Endereco.Cidade.Estado.Nome')!;
    }
    get Sigla(){
      return this.meuFormulario.get('Endereco.Cidade.Estado.Sigla')!;
    }
    get Telefones(){
      return this.meuFormulario.controls["Telefones"] as FormArray;
    }
    get Cursos(){
      return this.meuFormulario.controls["Cursos"] as FormArray;
    }


    get telefones() {
      return this.meuFormulario.controls["Telefones"] as FormArray;
    }

    get cursos(){
      return this.meuFormulario.controls["Cursos"] as FormArray;
    }


    addPhone() {
      const phoneForm = this.formBuilder.group({
        Numero: ['', Validators.required],
        Tipo: ['', Validators.required]
      });
      this.telefones.push(phoneForm);
    }

    deletePhone(phoneIndex: number) {
      this.telefones.removeAt(phoneIndex);
    }

    addCourse(){
    const courseForm =  this.formBuilder.group({
      Nome: ['', Validators.required]
      });
      this.cursos.push(courseForm);
    }

    deleteCourse(courseIndex: number) {
      this.cursos.removeAt(courseIndex)
    }

    onError() {
      this.bar.open('Erro ao salvar candidato', '' , {duration: 5000})
    };

    onSucess(){
      this.bar.open('Sucesso ao salvar candidato', '' , {duration: 5000})
    }

    home(){
      this.router.navigate([''], {relativeTo: this.route })
    }



    enviarFormulario(): void {
      if (this.meuFormulario.invalid || this.Cursos.length > 3 || this.Cursos.length < 1 || this.Telefones.length > 3 || this.Telefones.length < 1) {
        this.bar.open('Existem campos que não foram corretamente preenchidos .', 'Fechar');
        return;
      } else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: 'Deseja realmente inserir um candidato?'
      });
      dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const candidatoData: Candidatoo = this.meuFormulario.value;
        console.log(candidatoData);
        this.candidatoService.save(this.meuFormulario.value).subscribe(
        () => {
            this.dialog.closeAll();
            this.bar.open('Candidato inserido com sucesso!', 'Fechar', { duration: 5000 });
            this.home();
        },
          (error) => {
            this.onError();
            if (error && error.errors && error.errors.CandidatoModel) {
              const candidatoModelError = error.errors.CandidatoModel;
              this.bar.open('Erro ao inserir candidato. Tente novamente mais tarde.', 'Fechar');
              }
            }
          );
        }
      });
    }
    }


}



