import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { UserData } from 'src/app/core/models/user-data.model';
import { PokemonDataService } from 'src/app/core/services/pokemon-data.service';
import { UserDataService } from 'src/app/core/services/user-data.service';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.css']
})
export class PokemonCardComponent implements OnInit{
  pokemons: any[] = [];
  userData!: UserData;
  pokemonsSeleccionados: any[] = [];
  editCard: boolean = false;
  readonly MAX_STATS = {
    hp: 255,
    attack: 190,
    defense: 230,
    'special-attack': 194,
    'special-defense': 230,
    speed: 180
  };
  edit: boolean = false;
  constructor(
    private readonly pokemonDataService : PokemonDataService,
    private readonly userDataService : UserDataService,
    private readonly router: Router,
  ){
  }

  ngOnInit(): void {
    this.obtener();
    this.get150Pokemons()
  }

  // editStack(){
  //   this.edit = true;
  //   this.editCard = true
  // }

  editStack(){
    this.router.navigate(['selection'])
  }

  get150Pokemons(): void {
    this.pokemonDataService.obtenerPrimeros150()
      .pipe(
        tap((data) => {
          this.pokemons = data;
          const selectedList = this.userData.pokemonesSeleccionados || [];
          const selectedIds = selectedList.map((p: any) => p.id);

          this.pokemonsSeleccionados = this.pokemons
            .filter(pokemon => selectedIds.includes(pokemon.id))
            .map(pokemon => ({
              ...pokemon,
              stats: pokemon.stats.map((s: any) => ({
                ...s,
                original_stat: s.base_stat
              }))
            }));


        })
      )
      .subscribe({
        error: (err) => {
          console.error('❌ Error al cargar pokemones:', err);
        }
      });
  }

  getStatColor(statName: string): string {
    switch (statName.toLowerCase()) {
      case 'hp':
        return '#7ED876'
      case 'attack':
      case 'defense':
        return '#7ED876'
      case 'special-attack':
      case 'special-defense':
        return '#7ED876'
      case 'speed':
        return '#7ED876'
      default:
        return '#7ED876';
    }
  }
  obtener(){
    this.userData = this.userDataService.obtener()!;
    //console.log('Equipo guardado:', this.userData);
  }

  getMaxStat(statName: string): number {
    return this.MAX_STATS[statName.toLowerCase() as keyof typeof this.MAX_STATS] || 100;
  }

  onStatChange(pokemon: any, index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = Number(input.value);
    pokemon.stats[index].base_stat = newValue;
  }

  actualizarStatsNormalizadas(): void {
    this.pokemonsSeleccionados = this.pokemonsSeleccionados.map(pokemon => {
      const statsNormalizadas = pokemon.stats.map((statObj: any) => {
        const nombre = statObj.stat.name;
        const max = this.getMaxStat(nombre);
        const normalizada = Math.round((statObj.base_stat / max) * 100);

        return {
          ...statObj,
          base_stat: statObj.base_stat,
          normalizada
        };
      });
      this.edit = false;
      this.editCard = false

      const newListOfPokemon = {
        ...pokemon,
        stats: statsNormalizadas
      };

      this.userDataService.guardar(newListOfPokemon);

      return newListOfPokemon
    });

    this.userData.pokemonesSeleccionados = this.pokemonsSeleccionados;
    this.userDataService.guardar(this.userData);

    this.edit = false;
    //console.log('stats normalizadas y guardadas:', this.pokemonsSeleccionados);
  }
}
