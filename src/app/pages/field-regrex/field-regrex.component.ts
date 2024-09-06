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
  success: string = '';
  error: string = '';
  type: string = '';
  variable: string = '';
  message: string = '';
  regrex =
    /^declare\s+([a-zA-Z][a-zA-Z0-9_]{0,14}(?:\s*,\s*[a-zA-Z][a-zA-Z0-9_]{0,14})*)\s+(entero|real|cadena|logico|fecha)\s*;$/i


  constructor() {
    this.form = new FormGroup({
      fieldText: new FormControl('', Validators.required),
    });

    this.formType = new FormGroup({
      type: new FormControl('', Validators.required),
    });
  }

  validateRegrex() {
    this.error = '';
    this.success = '';
    const getField = this.form.get('fieldText')?.value;
    if (!getField.startsWith('declare ')) {
      this.error = 'La declaración debe comenzar con "declare"';
    } else if (!getField.endsWith(';')) {
      this.error = 'La declaración debe finalizar con ";"';
    } else if (!this.regrex.test(getField)) {
      this.error = 'Estructura invalidad';
    } else {
      this.success = 'Estructura validad';
    }
  }

  validateTypeAndvariable() {
    this.message = '';
    this.type = '';
    this.variable = '';
    const regrexType = /^(entero|real|cadena|logico|fecha)$/;
    const getType = this.formType.get('type')?.value;
    if (regrexType.test(getType)) {
      const getField = this.form.get('fieldText')?.value;
      const typeEntered = getField.match(this.regrex);
      if (typeEntered) {
        if (getType === typeEntered[2]) {
          this.type = typeEntered[2];
          this.variable = typeEntered[1];
        } else {
          this.message =
            'el tipo de dato ' + getType + ' no fue ingresado por el usuario';
        }
      } else if (typeEntered === null) {
        this.message =
          'Si la estructura ingresada es incorrecta no se mostrara el tipo de dato y variables ingresadas';
      }
    } else {
      this.message = 'El tipo de dato es incorrecto';
    }
  }
}
