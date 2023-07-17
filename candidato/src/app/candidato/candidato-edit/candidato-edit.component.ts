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
        nomeMae: ['' , Validators.required]
      }),
      enderecoId:[''],
      endereco: this.formBuilder.group({
        id: [''],
        logradouro: ['', Validators.required],
        cep: ['' ,Validators.required],
        numero: ['' , Validators.required],
        cidade: this.formBuilder.group({
          id:[''],
          nome: ['', Validators.required],
          estado: this.formBuilder.group({
            id:[''],
            nome: ['', Validators.required],
            sigla: ['' , Validators.required]
          }),
          estadoId:['']
        }),
        cidadeId:['']
      }),
      telefones: this.formBuilder.array([]),
      cursos: this.formBuilder.array([])
    });



  }




  get nome(){
    return this.formulario.get('nome')!;
  }
  get nomeMae(){
    return this.formulario.get('filiacao.nomeMae')!;
  }
  get logradouro(){
    return this.formulario.get('endereco.logradouro')!;
  }
  get numero(){
    return this.formulario.get('endereco.numero')!;
  }
  get cep(){
    return this.formulario.get('endereco.cep')!;
  }
  get cidade(){
    return this.formulario.get('endereco.cidade.nome')!;
  }
  get estado(){
    return this.formulario.get('endereco.cidade.estado.nome')!;
  }
  get sigla(){
    return this.formulario.get('endereco.cidade.estado.sigla')!;
  }

  get telefones() {
    return this.formulario.controls["telefones"] as FormArray;
  }

  get cursos(){
    return this.formulario.controls["cursos"] as FormArray;
  }


  addPhone() {
    const phoneForm = this.formBuilder.group({
      numero: ['', Validators.required],
      tipo: ['' ,Validators.required]
    });
    this.telefones.push(phoneForm);
  }

  deletePhone(phoneIndex: number) {
    this.telefones.removeAt(phoneIndex);
  }

  addCourse(){
  const courseForm = this.formBuilder.group({
    nome: ['', Validators.required]
    });
    this.cursos.push(courseForm);
  }

  deleteCourse(courseIndex: number) {
    this.cursos.removeAt(courseIndex)
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
    if (this.formulario.invalid) {
      this.bar.open('Existem campos que não foram corretamente preenchidos .', 'Fechar');
      return;
    } else {
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
          this.home();
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


}
