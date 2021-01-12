import { LightningElement, track, wire } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getCaseList from '@salesforce/apex/CasesController.getCaseList';

const columns = [
    {label: 'Id', fieldName: 'Id', editable: false},
    {label: 'Case Number', fieldName: 'CaseNumber', editable: false},
    {label: 'Priority',fieldName: 'Priority',editable: true},
    {label: 'Status',fieldName: 'Status',editable: true},
    {label: 'Type', fieldName: 'Type', editable: true},
    {label: 'Subject', fieldName: 'Subject', editable: true},
    {label: 'Contact Email', fieldName: 'ContactEmail', type: 'email', editable: true},
]

export default class OppTable extends LightningElement {
    @track error;
    @track columns = columns;
    @track opps; //All opportunities available for data table    
    @track showTable = false; //Used to render table after we get the data from apex controller    
    @track recordsToDisplay = []; //Records to be displayed on the page
    @track rowNumberOffset; //Row number
    draftValues = [];

    @wire(getCaseList)
    wopps({error,data}){
        if(data){
            let recs = [];
            for(let i=0; i<data.length; i++){
                let opp = {};
                opp.rowNumber = ''+(i+1);
                opp.oppLink = '/'+data[i].Id;
                opp = Object.assign(opp, data[i]);
                recs.push(opp);
            }
            this.opps = recs;
            this.showTable = true;
        }else{
            this.error = error;
        }       
    }
    //Capture the event fired from the paginator component
    handlePaginatorChange(event){
        this.recordsToDisplay = event.detail;
        this.rowNumberOffset = this.recordsToDisplay[0].rowNumber-1;
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