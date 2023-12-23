// is-object-id.validator.ts

import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { ObjectId } from 'mongodb';

@ValidatorConstraint({ name: 'isValidObjectId', async: false })
export class IsValidObjectId implements ValidatorConstraintInterface {
    validate(text: string, args: ValidationArguments) {
        if (text && typeof text === 'string' && ObjectId.isValid(text)) {
            return true;
        }
        return false;
    }

    defaultMessage(args: ValidationArguments) {
        const propertyName = args.property;
    
        return `${propertyName} contains an invalid ObjectId format`;
      }
}
