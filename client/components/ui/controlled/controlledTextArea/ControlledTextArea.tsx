import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';

import { TextArea, TextAreaProps } from '@/components/ui/textArea/TextArea';

export type ControlledTextAreaProps<T extends FieldValues> = UseControllerProps<T> &
    Omit<TextAreaProps, 'onChange' | 'value'>;

export const ControlledTextArea = <T extends FieldValues>({
    name,
    control,
    ...restProps
}: ControlledTextAreaProps<T>) => {
    const {
        field: { value, onChange },
        fieldState: { error },
    } = useController({ name, control });

    return (
        <TextArea
            name={name}
            value={value ?? ''}
            onValueChange={onChange}
            errorMessage={error?.message}
            {...restProps}
        />
    );
};
