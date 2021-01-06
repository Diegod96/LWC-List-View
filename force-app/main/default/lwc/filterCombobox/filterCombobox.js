import { LightningElement, api, wire, track } from 'lwc';
import getHighPriorityCases from '@salesforce/apex/CasesController.getHighPriorityCases';
import getMediumPriorityCases from '@salesforce/apex/CasesController.getMediumPriorityCases';
import getLowPriorityCases from '@salesforce/apex/CasesController.getLowPriorityCases'

export default class FilterCombobox extends LightningElement {
    value = 'All';

    get options() {
        return [
            { label: 'High', value: 'High' },
            { label: 'Medium', value: 'Medium' },
            { label: 'Low', value: 'Low' },
        ];
    }

    // Getting high priority cases
    @track data;
    @track high;
    @wire(getHighPriorityCases) highPriorityCases({error,data}) {
        if(data) {
            this.high = data;
            console.log("High Priority Cases: " + JSON.stringify(this.high));
        }
        else if(error) {
            this.high = undefined;
            console.log("Error: " + error);
        }
    }

    // Getting medium priority cases
    @track data;
    @track medium;
    @wire(getMediumPriorityCases) mediumPriorityCases({error,data}) {
        if(data) {
            this.medium = data;
            console.log("Medium Priority Cases: " + JSON.stringify(this.medium));
        }
        else if(error) {
            this.medium = undefined;
            console.log("Error: " + error);
        }
    }

    // Getting low priority cases
    @track data;
    @track low;
    @wire(getLowPriorityCases) lowPriorityCases({error,data}){
        if(data) {
            this.low = data;
            console.log("Low Priority Cases: " + JSON.stringify(this.low));
        }
        else if(error) {
            this.low = undefined;
            console.log("Error: " + error);
        }
    }

    handleChange(event) {
        this.selectedValue = event.detail.value;
        console.log("Priority Selected: " + this.valuselectedValuee);   
    }
}
