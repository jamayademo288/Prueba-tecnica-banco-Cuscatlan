import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PokemonDataService } from 'src/app/core/services/pokemon-data.service';
import { Subject, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { UserData } from 'src/app/core/models/user-data.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {
  searchTerm$ = new Subject<string>();
  pokemons: any[] = [];
  pokemonsGrouped: any[][] = [];
  seleccionados: { id: number; name: string }[] = [];
  @Output() loadingStart = new EventEmitter<void>();
  @Output() dataListaCargada = new EventEmitter<void>();
  userData!: UserData;
  constructor(
    private readonly pokemonDataService : PokemonDataService,
    private readonly userDataService : UserDataService,
    private readonly router: Router,
  ){}

  ngOnInit() {
    this.get150Pokemons();
    this.obtener();

    this.searchTerm$
    .pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
    .subscribe((term: string) => {
      this.filtrarPokemons(term);
    });
  }

  get150Pokemons() {
    //setTimeout(() => this.loadingStart.emit(), 0);
    this.pokemonDataService.obtenerPrimeros150()
      .pipe(
        tap((data) => {
          this.pokemons = data;
          this.pokemonsGrouped = this.groupPokemonsInRows(data, 3);
          // if (this.pokemonsGrouped.length > 0) {
          //   this.dataListaCargada.emit(true);
          // }
      })
      )
    .subscribe({
      error: (err) => {
        console.error('Error al cargar pokemones:', err);
        //this.finalizoCarga.emit(); // también emite en caso de error
      }
    });

  }

  groupPokemonsInRows(pokemons: any[], cols: number): any[][] {
    const rows = [];
    for (let i = 0; i < pokemons.length; i += cols) {
      rows.push(pokemons.slice(i, i + cols));
    }
    return rows;
  }

  onBuscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm$.next(input.value);
  }

  filtrarPokemons(term: string): void {
    const lowerTerm = term.toLowerCase().trim();

    const filtrados = this.pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(lowerTerm) ||
      pokemon.id.toString().includes(lowerTerm)
    );

    this.pokemonsGrouped = this.groupPokemonsInRows(filtrados, 3);
  }

  toggleSeleccion(pokemon: any): void {
    const index = this.seleccionados.findIndex(p => p.id === pokemon.id);

    if (index >= 0) {
      // Ya estaba seleccionado, lo quitamos
      this.seleccionados.splice(index, 1);
    } else {
      if (this.seleccionados.length < 3) {
        this.seleccionados.push({ id: pokemon.id, name: pokemon.name });
      } else {
        alert('Solo puedes seleccionar hasta 3 Pokémon.');
      }
    }
  }

  estaSeleccionado(pokemon: any): boolean {
    return this.seleccionados.some(p => p.id === pokemon.id);
  }

  guardarEquipo() {
    console.log('Equipo guardado:', this.seleccionados);
    const datosCompletos = {
      ...this.userData, // o tu objeto original
      pokemonesSeleccionados: this.seleccionados
    };
    this.loadingStart.emit();
        timer(500).pipe(
          tap(() => this.userDataService.guardar(datosCompletos)),
          tap(() => this.dataListaCargada.emit()),
          tap(() => this.router.navigate(['config']))
        ).subscribe();
    // Ej: localStorage.setItem('equipo', JSON.stringify(this.seleccionados));
  }

  obtener(){
    this.userData = this.userDataService.obtener()!;
    console.log('Equipo guardado:', this.userData);

    if (this.userData?.pokemonesSeleccionados) {
      this.seleccionados = [...this.userData.pokemonesSeleccionados];
    }
  }

}
