import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs';
import {Term} from './models/Term';

@Injectable()
export class TermService {
  constructor(private http : Http) {}

  getTerms(term : string, snomed : string):Observable<Term[]> {
    console.log(snomed);
    var params : URLSearchParams = new URLSearchParams();
    params.append('term', term);
    params.append('snomed', snomed);
    return this.http.get('api/library/getTerms', {search : params})
      .map(res => res.json());
  }

  getTermChildren(code : string): Observable<Term[]>{
    var params : URLSearchParams = new URLSearchParams();
    params.append('code', code);
    return this.http.get('api/library/getTermChildren', {search : params})
      .map(res => res.json());
  }

  getTermParents(code : string): Observable<Term[]>{
    var params : URLSearchParams = new URLSearchParams();
    params.append('code', code);
    return this.http.get('api/library/getTermParents', {search : params})
      .map(res => res.json());
  }

}
