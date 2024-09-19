import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-field-regrex',
  templateUrl: './field-regrex.component.html',
  styleUrls: ['./field-regrex.component.scss'],
})
export class FieldRegrexComponent {
  form!: FormGroup;
  formType!: FormGroup;
  success: string[] = [];
  error: string[] = [];
  successTypeValidation: string[] = [];
  errorTypeValidation: string[] = [];
  variablesDeclaradas: Map<string, string> = new Map();

  regrex = /^declare\s+([a-zA-Z][a-zA-Z0-9_]{0,14}(?:\s*,\s*[a-zA-Z][a-zA-Z0-9_]{0,14})*)\s+(entero|real|cadena|logico|fecha)\s*;$/i;

  constructor() {
    this.form = new FormGroup({
      fieldText: new FormControl('', Validators.required),
    });

    this.formType = new FormGroup({
      type: new FormControl('', Validators.required),
    });
  }


  validateRegrex() {
    this.error = [];
    this.success = [];
    this.variablesDeclaradas.clear();
    const getField = this.form.get('fieldText')?.value;
    const lineas = getField.split('\n');

    for (let i = 0; i < lineas.length; i++) {
      const linea = lineas[i].trim();

      if (linea === '') continue;

      if (!linea.startsWith('declare ')) {
        this.error.push(`Línea ${i + 1}: La declaración debe comenzar con "declare".`);
      } else if (!linea.endsWith(';')) {
        this.error.push(`Línea ${i + 1}: La declaración debe finalizar con ";".`);
      } else if (!this.regrex.test(linea)) {
        this.error.push(`Línea ${i + 1}: Estructura inválida.`);
      } else {
        const partes = linea.match(this.regrex);
        const listaVariables = partes![1].split(/\s*,\s*/);
        const tipoDato = partes![2];

        let variableRepetida = false;

        for (let variable of listaVariables) {
          if (this.variablesDeclaradas.has(variable)) {
            this.error.push(`Línea ${i + 1}: La variable "${variable}" ya ha sido declarada con tipo "${this.variablesDeclaradas.get(variable)}".`);
            variableRepetida = true;
            break;
          }
          this.variablesDeclaradas.set(variable, tipoDato);
        }

        if (!variableRepetida) {
          this.success.push(`Línea ${i + 1}: Declaración válida.`);
        }
      }
    }
  }


  validateTypeAndVariable() {
    this.errorTypeValidation = [];
    this.successTypeValidation = [];
    const regrexType = /^(entero|real|cadena|logico|fecha)$/;
    const getType = this.formType.get('type')?.value;

    if (!regrexType.test(getType)) {
      this.errorTypeValidation.push('El tipo de dato es incorrecto');
      return;
    }

    const getField = this.form.get('fieldText')?.value;
    const lineas = getField.split('\n');
    let variablesEncontradas = false;
    const variablesDeclaradas: Map<string, { tipo: string, linea: number }> = new Map();


    for (let i = 0; i < lineas.length; i++) {
      const linea = lineas[i].trim();
      const tipoDeclarado = linea.match(/declare\s+([\w\s,]+)\s+(\w+)/);

      if (tipoDeclarado) {
        const [_, variables, tipoDato] = tipoDeclarado;
        const listaVariables = variables.split(/\s*,\s*/);

        for (const variable of listaVariables) {
          if (!variablesDeclaradas.has(variable)) {
            variablesDeclaradas.set(variable, { tipo: tipoDato, linea: i + 1 });
          }
        }
      }
    }

    for (const [variable, { tipo, linea }] of variablesDeclaradas) {
      if (tipo === getType) {
        this.successTypeValidation.push(`Línea ${linea}: Variable "${variable}" es válida para el tipo "${getType}".`);
        variablesEncontradas = true;
      }
    }

    if (!variablesEncontradas) {
      this.errorTypeValidation.push(`No se encontraron variables del tipo "${getType}".`);
    }
  }




}
