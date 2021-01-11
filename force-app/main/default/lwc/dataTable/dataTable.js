import { LightningElement, wire, track } from 'lwc';
import getCaseList from '@salesforce/apex/CasesController.getCaseList';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import { refreshApex } from '@salesforce/apex';


const columns = [
    {label: 'Id', fieldName: 'Id', editable: false},
    {label: 'Case Number', fieldName: 'CaseNumber', editable: false},
    {label: 'Priority',fieldName: 'Priority',editable: true},
    {label: 'Status',fieldName: 'Status',editable: true},
    {label: 'Type', fieldName: 'Type', editable: true},
    {label: 'Subject', fieldName: 'Subject', editable: true},
    {label: 'Contact Email', fieldName: 'ContactEmail', type: 'email', editable: true},
]

export default class DataTable extends LightningElement {

    // Initialize variables
    @track records;
    @track initialRecords;
    selectedValue = 'All';
    draftValues = [];
    columns = columns;

    
    @wire(getCaseList)
    wiredCases({error, data}) {

        if(data) {
            this.records = data;
            this.initialRecords = data;
            this.error = undefined;
        } else if(error) {
            this.error = error;
            this.initialRecords = undefined;
            this.records = undefined;
        }
    }

        
    get options() {
        return [
            { label: 'All', value: 'All' },
            { label: 'High', value: 'High' },
            { label: 'Medium', value: 'Medium' },
            { label: 'Low', value: 'Low' }
        ];
    }

    
    // Handles change of combobox values
    handleChange(event) {
        this.selectedValue = event.target.value;
        if (this.selectedValue === 'All') {
            this.records = this.initialRecords;
        }
        else{
            this.filter();
        }
    }

    // Filters records based on the selectedValue in the combobox
    filter() {
        if(this.selectedValue) {
            this.records = this.initialRecords;
            if(this.records) {
                let recs = [];
                for(let rec of this.records) {
                    console.log('Rec is: ' + JSON.stringify(rec));
                    if(rec.Priority === this.selectedValue) {
                        recs.push(rec);
                    }
                }
                console.log("Recs are: " + JSON.stringify(recs));
                this.records = recs;
            }
        } else {
            this.records = initialRecords;
        }
    }

    // Handle save event
    handleSave(event) {
        console.log(event.detail.draftValues);

        // Slice the draft values array
        const recordInputs = event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft)
            return {fields}
        })
        console.log("recordInputs", recordInputs)

        // Map recordInput to using the updateRecord method from uiRecordApi
        const promises = recordInputs.map(recordInput => updateRecord(recordInput))
        Promise.all(promises).then(result => {
            // On success show success message
            this.showToastMsg('Success', 'Cases Updated')
            // Clear out draft values
            this.draftValues = [];
            // Use refreshApex to update list view w/o refreshing the page
            window.location.reload();
            // return refreshApex(this.contact)
        }).catch(error => {
            // On error show error message
            this.showToastMsg('Error Updating Case', error.body.message, error)

        })
    }

    // Simple toast message to signals sucess or error
    showToastMsg(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant || 'success'
            })
        )
    }
}
