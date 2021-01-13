import { LightningElement, wire, api, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class RecordEditForm extends LightningElement {

    @track strCaseId; // Case ID
    
    // This is called once the Case is created successfully.
    handleSuccess(event){
        this.strCaseId = event.detail.id;
        this.showToastMsg('Success', 'Case Created');
        setTimeout(function() {
            window.location.reload();
        }, 2000);
    }
    
    // Clears fields in the record edit form when the cancel button is clicked
    handleReset(event) {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
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