import { LightningElement, api, wire, track} from 'lwc';

// Importing controllers to get cases based on status level
import getClosedCases from '@salesforce/apex/CasesController.getClosedCases';
import getActiveCases from '@salesforce/apex/CasesController.getActiveCases';
import getSubmittedCases from '@salesforce/apex/CasesController.getSubmittedCases';

// Importing controllers to get cases based on priority level
import getHighPriorityCases from '@salesforce/apex/CasesController.getHighPriorityCases';
import getMediumPriorityCases from '@salesforce/apex/CasesController.getMediumPriorityCases';
import getLowPriorityCases from '@salesforce/apex/CasesController.getLowPriorityCases';



console.log('Starting Stat Cards...');
export default class StatCards extends LightningElement {

    // Gets the number of closed cases
    @track data;
    @track closed;
    @wire(getClosedCases) closedCases({error, data}) {
        if(data) {
            this.closed = data.length;
            console.log("Number of Closed Cases: " + data.length)
        } 
        else if (error) {
            this.closed = undefined;
            console.log("Error : " + error)
        }
    }

    // Gets the number of new cases
    @track data;
    @track active;
    @wire(getActiveCases) activeCases({error, data}) {
        if(data) {
            this.active = data.length;
            console.log("Number of Active Cases: " + data.length)
        } 
        else if (error) {
            this.recent = undefined;
            console.log("Error : " + error)
        }
    }

    // Get the number of submitted cases
    @track data;
    @track submitted;
    @wire(getSubmittedCases) submittedCases({error, data}) {
        if(data) {
            this.submitted = data.length;
            console.log("Number of Submitted Cases: " + data.length)
        } 
        else if (error) {
            this.escalated = undefined;
            console.log("Error : " + error)
        }
    }

    // Get the number of high priority cases
    @track data;
    @track high;
    @wire(getHighPriorityCases) highPriorityCases({error, data}) {
        if(data) {
            this.high = data.length;
            console.log("Number of High Priority Cases: " + data.length)
        } 
        else if (error) {
            this.high = undefined;
            console.log("Error : " + error)
        }
    }

    // Get the number of medium priority cases
    @track data;
    @track medium;
    @wire(getMediumPriorityCases) mediumPriorityCases({error, data}) {
        if(data) {
            this.medium = data.length;
            console.log("Number of Medium Priority Cases: " + data.length)
        } 
        else if (error) {
            this.medium = undefined;
            console.log("Error : " + error)
        }
    }

    // Get the number of low priority cases
    @track data;
    @track low;
    @wire(getLowPriorityCases) lowPriorityCases({error, data}) {
        if(data) {
            this.low = data.length;
            console.log("Number of Low Priority Cases: " + data.length)
        } 
        else if (error) {
            this.low = undefined;
            console.log("Error : " + error)
        }
    }

    
}