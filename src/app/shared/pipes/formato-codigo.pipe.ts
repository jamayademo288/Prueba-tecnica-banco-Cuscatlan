import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoCodigo'
})
export class FormatoCodigoPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Eliminar caracteres no numéricos ni guiones
    const soloNumeros = value.replace(/\D/g, '').slice(0, 9);

    // Si tiene menos de 2 caracteres, no puede agregar guion
    if (soloNumeros.length < 2) return soloNumeros;

    // Insertar guion antes del último dígito
    const parte1 = soloNumeros.slice(0, soloNumeros.length - 1);
    const parte2 = soloNumeros.slice(-1);

    return `${parte1}-${parte2}`;
  }
}
