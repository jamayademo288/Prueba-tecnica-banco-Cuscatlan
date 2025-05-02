import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { PokemonDetail } from '../models/list-pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonDataService {
  private readonly url = 'https://pokeapi.co/api/v2/pokemon/';
  constructor(
    private readonly http: HttpClient
  ) { }

  obtenerPrimeros150(): Observable<PokemonDetail[]> {
    const requests: Observable<PokemonDetail>[] = [];

    for (let id = 1; id <= 150; id++) {
      const request = this.http.get<any>(`${this.url}${id}`).pipe(
        map(pokemon => ({
          id: pokemon.id,
          name: pokemon.name,
          sprites: pokemon.sprites,
          stats: pokemon.stats
        }))
      );

      requests.push(request);
    }

    return forkJoin(requests); // Espera a que terminen los 150 llamados
  }

}
