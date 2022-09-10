import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, Observable, of } from 'rxjs';

import { PaisSmall } from '../interfaces/paises.interfaces';
import { Pais } from '../interfaces/pais.interfaces';



@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private baseUrl : string = `https://restcountries.com/v3.1`
  private _regiones : string[] = [ 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania' ];

  get regiones() : string[] { 
    return [ ...this._regiones ];
  }

  constructor( private http : HttpClient ) { }


  getPaisesPorRegion ( region : string ) : Observable<PaisSmall[]> {

    const url : string = `${this.baseUrl}/region/${region}?fields=cca3,name`
    return this.http.get<PaisSmall[]>(url)
  }

  getPaisPorCodigo ( codigo : string ) : Observable<Pais[] | null>{
   if (!codigo){
      return of(null);
   }
    const url : string = `${this.baseUrl}/alpha/${codigo}`;
    return this.http.get<Pais[]>(url)
  }

  getPaisPorCodigoSmall ( codigo : string ) : Observable<PaisSmall>{

     const url : string = `${this.baseUrl}/alpha/${codigo}?fields=cca3,name,borders`;
     return this.http.get<PaisSmall>(url)
   }

  getPaisesPorCodigos ( borders :string[] ) : Observable<PaisSmall[]> {

    if ( !borders ) {
      return of ([]);
    }

    const peticiones : Observable<PaisSmall> [] = [] ;

    borders.forEach( codigo =>{
      const peticion = this.getPaisPorCodigoSmall( codigo );
      peticiones.push( peticion );
    } );

    return combineLatest( peticiones ); 

  }

}
