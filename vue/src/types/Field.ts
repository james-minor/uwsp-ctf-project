import { FieldType } from '@/enum/FieldType';
import type { SelectOption } from '@/types/SelectOption';
import * as feather from 'feather-icons';

export type Field = {
	modelValue: string,                 // The v-model value.
	name: string,                       // Field name, this should be a property on the model. Example: 'username'.
	type: FieldType,                    // The type of input the field should be.
	editable: boolean,                  // Is this field editable?
	initialValue: string,               // The initial value of the field.

	maxLength?: number,                 // The maximum string length for the input.
	icon?: feather.FeatherIcon,         // The icon for the input. NOTE: Only visible if type === 'text'.
	options?: SelectOption[],			// The list of select options, only used if type === FieldType.SELECT.
}