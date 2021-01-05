import { LightningElement } from 'lwc';

export default class FilterCombobox extends LightningElement {
    value = 'High';

    get options() {
        return [
            { label: 'High', value: 'High' },
            { label: 'Medium', value: 'Medium' },
            { label: 'Low', value: 'Low' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }
}
