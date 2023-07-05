import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidatosService } from '../services/candidatos.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, catchError, of } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Candidatoo } from '../models/Candidato';

@Component({
  selector: 'app-candidato-edit',
  templateUrl: './candidato-edit.component.html',
  styleUrls: ['./candidato-edit.component.scss']
})
export class CandidatoEditComponent {

  //candidatos$: Observable<Candidatoo>;
  public candidato: any;
  public formulario: FormGroup;
  public id: number;

  constructor(private candidatoService: CandidatosService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              public dialog: MatDialog,
              private router : Router,
              private bar: MatSnackBar
              )
  {

    this.id = this.route.snapshot.params['id']

    this.candidatoService.display(this.id).subscribe(
      (response) => {
        this.candidato = response;
        this.preencherFormulario();
        console.log(this.candidato)
      },
      (error) => {
        console.log(error);
      }
    );

    this.formulario = this.formBuilder.group({
      nome: ['', Validators.required],
      filiacaoId: [''],
      filiacao: this.formBuilder.group({
        id: [''],
        nomePai: [''],
        nomeMae: ['']
      }),
      enderecoId:[''],
      endereco: this.formBuilder.group({
        id: [''],
        logradouro: [''],
        cep: [''],
        numero: [''],
        cidade: this.formBuilder.group({
          id:[''],
          nome: [''],
          estado: this.formBuilder.group({
            id:[''],
            nome: [''],
            sigla: ['']
          }),
          estadoId:['']
        }),
        cidadeId:['']
      }),
      telefones: this.formBuilder.array([]),
      cursos: this.formBuilder.array([])
    });



  }
  preencherFormulario() {
    this.formulario.patchValue({
      id: this.candidato.id,
      nome: this.candidato.nome,
      filiacaoId: this.candidato.filiacaoId,
      filiacao: {
        id: this.candidato.filiacao.id,
        nomePai: this.candidato.filiacao.nomePai,
        nomeMae: this.candidato.filiacao.nomeMae
      },
      enderecoId: this.candidato.enderecoId,
      endereco: {
        id: this.candidato.endereco.id,
        logradouro: this.candidato.endereco.logradouro,
        cep: this.candidato.endereco.cep,
        numero: this.candidato.endereco.numero,
        cidade: {
          id: this.candidato.endereco.cidade.id,
          nome: this.candidato.endereco.cidade.nome,
          estado: {
            id: this.candidato.endereco.cidade.estado.id,
            nome:this.candidato.endereco.cidade.estado.nome,
            sigla: this.candidato.endereco.cidade.estado.sigla
          },
          estadoId: this.candidato.endereco.cidade.estadoId
        },
        cidadeId: this.candidato.endereco.cidadeId
      }
    });



      // Resto do código para acessar os campos do telefone
      if (this.candidato.telefones && this.candidato.telefones.length > 0) {
      const telefonesFormArray = this.formulario.get('telefones') as FormArray;


      this.candidato.telefones.forEach((telefone: any) => {
          telefonesFormArray.push(this.formBuilder.group({
            id: [telefone.id],
            numero: [telefone.numero],
            tipo: [telefone.tipo]
          }));
        });
      }


    if (this.candidato.cursos && this.candidato.cursos.length > 0) {
      const cursosFormArray = this.formulario.get('cursos') as FormArray;
      this.candidato.cursos.forEach((curso: any) => {
        cursosFormArray.push(this.formBuilder.group({
          id: [curso.id],
          nome: [curso.nome]
        }));
      });
    }

  }



  get telefones() {
    return this.formulario.controls["telefones"] as FormArray;
  }

  get cursos(){
    return this.formulario.controls["cursos"] as FormArray;
  }


  addPhone() {
    const phoneForm = this.formBuilder.group({
      numero: [''],
      tipo: ['']
    });
    this.telefones.push(phoneForm);
  }

  deletePhone(phoneIndex: number) {
    this.telefones.removeAt(phoneIndex);
  }

  addCourse(){
  const courseForm = this.formBuilder.group({
    nome: ['']
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



  editar() {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: 'Deseja realmente alterar este candidato?'
      });
      console.log(this.formulario.value);
      dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      const candidatoData: Candidatoo = this.formulario.value;
      console.log(candidatoData);
      console.log(this.id)
      this.candidatoService.edit(candidatoData, this.id).subscribe(
        (sucess) => {
          this.dialog.closeAll();
          this.bar.open('Candidato editado com sucesso!', 'Fechar', { duration: 5000 });
          this.router.navigate([''], {relativeTo: this.route })
      },
        (error) => {
          this.onError();
          if (error && error.errors && error.errors.CandidatoModel) {
            const candidatoModelError = error.errors.CandidatoModel;
            this.bar.open('Erro ao editar candidato. Tente novamente mais tarde.', 'Fechar');
            }
          }
        );
      }
    });
  }


}
