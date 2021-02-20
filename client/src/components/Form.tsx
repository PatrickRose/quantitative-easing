import {ChangeEvent, Component, FormEvent} from "react";
import {v4 as uuidv4} from 'uuid';


type FormField = {
    caption: string,
    validator?: (value: string) => true | string
};

export type FormFields = {
    [key: string]: FormField
}

type FormProps<T extends FormFields> = {
    submit: (values: { [P in keyof T]?: string }) => boolean,
    submitCaption: string,
    overrideID?: string,
    fields: T,
    active: boolean
}

type StateField = {
    value: string,
    validation?: string
};
type FormState<T extends FormFields> = {
    submitting: boolean,
    id: string,
    fields: {
        [P in keyof T]?: StateField
    }
}

type FormFieldElementProps = {
    caption: string,
    fieldName: string,
    validationMessage?: string,
    value: string,
    active: boolean,
    validationID: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

function FormFieldElement(props: FormFieldElementProps) {
    const {
        caption,
        active,
        value,
        fieldName,
        validationMessage,
        onChange,
        validationID
    } = props;

    const isValid = validationMessage === undefined;

    const validationElement = isValid
        ? undefined
        : <span id={validationID}>
                    {validationMessage}
                </span>

    return <div className="form-group" aria-live="polite">
        <label htmlFor={fieldName}>{caption}</label>
        <input
            name={fieldName}
            id={fieldName}
            type="text"
            className={`form-control ${isValid ? '' : 'is-invalid'}`}
            value={value}
            onChange={onChange}
            aria-invalid={isValid ? 'false' : 'true'}
            disabled={!active}
            aria-errormessage={isValid ? undefined : validationID}
        />
        {validationElement}
    </div>
}

export default class Form<T extends FormFields> extends Component<FormProps<T>, FormState<T>> {

    constructor(props: FormProps<T>) {
        super(props);

        const fields: { [P in keyof T]?: StateField } = {};

        for (let fieldName in props.fields) {
            if (!props.fields.hasOwnProperty(fieldName)) {
                continue;
            }

            fields[fieldName] = {
                value: ''
            }
        }

        this.state = {
            submitting: false,
            id: this.props.overrideID ? this.props.overrideID : uuidv4(),
            fields: fields
        }
    }

    render() {
        const fieldVals = this.state.fields;

        const fields = [];
        const onChange = (e: ChangeEvent<HTMLInputElement>) => this.handleInputChange(e);

        for (const field in this.props.fields) {
            if (!this.props.fields.hasOwnProperty(field)) {
                continue;
            }

            const fieldDef = this.props.fields[field];
            let value: string = '';

            let fieldVal = fieldVals[field];

            if (fieldVal !== undefined) {
                value = fieldVal.value;
            }

            const validationMessage = fieldVal?.validation;

            const name = `${this.state.id}-${field}`;
            const validationID = `${name}-validation`;

            fields.push(
                <FormFieldElement
                    fieldName={name}
                    caption={fieldDef.caption}
                    validationMessage={validationMessage}
                    value={value}
                    active={this.props.active}
                    validationID={validationID}
                    onChange={onChange}
                    key={field}
                />
            )
        }

        return <form onSubmit={this.onSubmit.bind(this)}>
            {fields}
            <button type="submit" disabled={!this.props.active}>{this.props.submitCaption}</button>
        </form>
    }

    handleInputChange(e: ChangeEvent<HTMLInputElement>): void {
        const target = e.target;
        const name = target.name.replace(this.state.id, '');
        const value = target.value;
        const state = this.state;

        const stateToSet: typeof state.fields = {};

        for (const field in this.props.fields) {
            if (!this.props.fields.hasOwnProperty(field)) {
                continue;
            }

            if (name === field) {
                stateToSet[field] = {value};
                break;
            }
        }

        this.setState({fields: stateToSet});
    }

    onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const values: { [P in keyof T]?: string } = {}
        const state: { submitting: boolean, fields: { [P in keyof T]?: StateField } } = {
            submitting: true,
            fields: {}
        };

        for (const field in this.props.fields) {
            if (!this.props.fields.hasOwnProperty(field)) {
                continue;
            }

            const fieldDef = this.props.fields[field];
            const rawValue = this.state.fields[field]?.value;
            const value = rawValue === undefined ? '' : rawValue;
            values[field] = value;

            if (fieldDef.validator) {
                const validationMessage = fieldDef.validator(value);

                if (validationMessage !== true) {
                    state.fields[field] = {
                        value: value,
                        validation: validationMessage
                    }

                    state.submitting = false;
                }
            }
        }

        if (state.submitting) {
            this.props.submit(values)
        }

        this.setState(state);
    }
}
