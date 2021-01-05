import { LightningElement, wire, track } from 'lwc';
import getCaseList from '@salesforce/apex/CasesController.getCaseList';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex'



const columns = [
    {label: 'Id', fieldName: 'Id', editable: false},
    {label: 'Case Number', fieldName: 'CaseNumber', editable: false},
    {
        label: 'Priority',
        fieldName: 'Priority',
        editable: true,
    },
    {
        label: 'Status',
        fieldName: 'Status',
        editable: true,
    },
    {label: 'Type', fieldName: 'Type', editable: true},
    {label: 'Subject', fieldName: 'Subject', editable: true},
    {label: 'Contact Email', fieldName: 'ContactEmail', type: 'email', editable: true},
]

export default class RefreshLWC extends LightningElement {

    // Initialize variables
    columns = columns;
    draftValues = [];
    ALL_CASES = [];
    cases = [];
    contactResult = null;
    

    // Wire the getCaseList() method from Apex Controller
    @wire(getCaseList)
    contact;
    
    // Use getCaseList to assign data to cases and ALL_CASES to be used when filtering
    @track data;
    @wire(getCaseList)
    wiredCases({ error, data }) {
        if (data) {
            this.ALL_CASES = data;
            this.cases = data;
            console.log(this.cases)
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.contacts = undefined;
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
            return refreshApex(this.contact)
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


    // handleHeaderAction(event) {
    //     // gives the selection header action name
    //     const actionName = event.detail.action.name;
    //     console.log("Action Name: " + actionName)

    //     // gives selected column definition
    //     const colDef = event.detail.columnDefinition;
    //     console.log("Column Defenition: " + JSON.stringify(colDef));

    //     // assigning colmuns to new variable
    //     let cols = this.columns;
    //     console.log("Columns: " + JSON.stringify(cols));

    //     if (actionName !== undefined && actionName !== 'all') {
    //         // filtering cases on selected actionname
    //         console.log(this.cases)
    //         this.cases = this.ALL_CASES.filter(_case => _case[colDef.label] === actionName);
    //         console.log(`All ${colDef.label} cases: ` + JSON.stringify(this.cases))
    //     } else if (actionName === 'all') {
    //         // returning all cases
    //         this.cases = this.ALL_CASES;
    //         console.log(this.cases);
    //     }

    //     /* Following line is responsible for finding which header action selected and return corresponding actions then we will mark selcted as checked/true and remaining will be marked as unchecked/marked */

    //     cols.find(col => col.label === colDef.label).actions.forEach(action => action.checked = action.name === actionName);
    //     this.columns = [...cols];
    //     console.log("End");
    // }
}