import { LightningElement, track, api, wire } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { deleteRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
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
    
    @track selectedValue; // Selected value in filter combobox
    @track selectedRecord; // Selected row record
    @track error;
    @track columns = columns; // Columns for the data table
    @track opps; // All opportunities available for data table    
    @track showTable = false; // Used to render table after we get the data from apex controller    
    @track recordsToDisplay = []; // Records to be displayed on the page
    @track rowNumberOffset; // Row number
    draftValues = []; // Values to be saved on edit


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
            this.initialRecords = recs;
            //console.log('Cases: '+ JSON.stringify(this.opps));
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
            setTimeout(function() {
                window.location.reload();
            }, 2000);
            //return refreshApex(this.recordsToDisplay)
        }).catch(error => {
            // On error show error message
            this.showToastMsg('Error Updating Case', error.body.message, error)

        })
    }

    // Handles selecting a row and passing that cases Id
    handleSelection(event) {
        if(event.detail.selectedRows.length > 0) {
            this.selectedRecord = event.detail.selectedRows[0].Id;
        }
    }

    // Deletes the selected record
    deleteRecord() {
        deleteRecord(this.selectedRecord)
        .then(() => {
            this.showToastMsg('Success', 'Cases Deleted')
            setTimeout(function() {
                window.location.reload();
            }, 2000);
            //refreshApex(this.recordsToDisplay);
        })
        .catch(error => {
            this.showToastMsg('Error Deleting Case', error.body.message, error)

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

    get options() {
        return [
            {label: 'All', value: 'All'},
            {label: 'Low', value: 'Low'},
            {label: 'Medium', value: 'Medium'},
            {label: 'High', value: 'High'}
        ]
    }
    
    
    handleChange(event) {
        this.selectedValue = event.target.value;
        //console.log('Selected Priority: ' + this.selectedValue);

        if(this.selectedValue === 'All') {
            this.recordsToDisplay = this.initialRecords;
        } else {
            this.filter();
        }
    }

    filter() {
        console.log('Filter method called');
        if(this.selectedValue) {
            this.opps = this.initialRecords;
            //console.log('Initial Records: ' + JSON.stringify(this.initialRecords));
        }

        if(this.opps) {
            let recs = [];
            for (let rec of this.opps) {
                //console.log('Record is: ' + JSON.stringify(rec));
                //console.log('Records priority' + JSON.stringify(rec.Priority));

                if(rec.Priority === this.selectedValue) {
                    recs.push(rec);
                }
            }

            //console.log('Seleced records: ' + JSON.stringify(recs));
            this.opps = recs;
            this.recordsToDisplay = this.opps;
            //console.log('Records to display: ' + JSON.stringify(this.recordsToDisplay));
        } else {
            this.opps = this.initialRecords;
            this.recordsToDisplay = this.opps;
            //console.log('Records to display: ' + JSON.stringify(this.recordsToDisplay));
            
        }
    }
}