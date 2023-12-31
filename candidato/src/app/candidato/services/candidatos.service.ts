import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, first, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Candidatoo } from '../models/Candidato';


@Injectable({
  providedIn: 'root'
})
export class CandidatosService {

  private readonly API = 'api/Candidato';
  http: any;

  constructor( private httpClient: HttpClient) { }

  list() {
    return this.httpClient.get<Candidatoo[]>(this.API)
    .pipe(
      first(),
      tap(candidatos => console.log(candidatos))
    );
  }

  display(id: number){
      return this.httpClient.get<Candidatoo>(`${this.API}/display/${id}`)
      .pipe(
        first(),
        tap(candidatos => console.log(candidatos))
      );

  }


  edit(candidato: Candidatoo, id: number): Observable<Candidatoo> {
    const url = `${this.API}/edit/${id}`;
    return this.httpClient.put<Candidatoo>(url, candidato).
    pipe(
      tap(updatedCandidato => console.log(`Candidato atualizado: ${updatedCandidato.id}`))
    );
  }

  delete(id: number): Observable<void> {
    const url = `${this.API}/${id}`;
    return this.httpClient.delete<void>(url).pipe(
      tap(() => console.log(`Candidato deletado: ${id}`))
    );
  }

  save(candidato: Candidatoo): Observable<Candidatoo> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post<Candidatoo>(this.API, candidato, { headers });
  }


}
