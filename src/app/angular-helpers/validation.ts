import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { forEach, has, includes, isEmpty, omitBy } from 'lodash';

export function touchAllFormFields(formGroup: FormGroup): void {
    forEach(formGroup.controls, control => {
        if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
            touchAllFormFields(control);
        }
    });
}

export function patchValidationErrors(
    control: AbstractControl,
    modelErrors: ValidationErrors | null,
    ...errorsToPatch: string[]
) {
    if (!control || isEmpty(errorsToPatch)) {
        return;
    }
    const newErrors = omitBy(control.errors, (_, key) => includes(errorsToPatch, key));
    if (modelErrors) {
        forEach(errorsToPatch, key => {
            if (has(modelErrors, key)) {
                newErrors[key] = modelErrors[key];
            }
        });
    }
    control.setErrors(isEmpty(newErrors) ? null : newErrors);
}
