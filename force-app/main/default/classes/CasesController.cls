// Apex controller for Cases
public with sharing class CasesController {

    // Return a list of cases
    @AuraEnabled(cacheable=true)
    public static List <Case> getCaseList() {
        return [
            SELECT Id, CaseNumber, Priority, Type, Subject, ContactEmail, Status
            FROM Case
            ];
    }

    // Return High Priority cases
    @AuraEnabled(cacheable=true)
    public static List <Case> getHighPriorityCases() {
        return [
            SELECT CaseNumber,Status 
            FROM Case 
            WHERE Priority='High'
        ];
    }

    // Return Medium Priority cases
    @AuraEnabled(cacheable=true)
    public static List <Case> getMediumPriorityCases () {
        return [
            SELECT CaseNumber,Status 
            FROM Case 
            WHERE Priority='Medium'
        ];
    }

    // Return Low Priority cases
    @AuraEnabled(cacheable=true)
    public static List <Case> getLowPriorityCases () {
        return [
            SELECT CaseNumber,Status 
            FROM Case 
            WHERE Priority='Low'
        ];
    }

    // Return Closed Cases
    @AuraEnabled(cacheable=true)
    public static List <Case> getClosedCases() {
        return [
            SELECT CaseNumber,Status 
            FROM Case 
            WHERE Status='Closed'
        ];
    }

    // Return Active Cases
    @AuraEnabled(cacheable=true)
    public static List <Case> getActiveCases() {
        return [
            SELECT CaseNumber,Status 
            FROM Case 
            WHERE Status='Active'
        ];
    }

    // Return Submitted Cases
    @AuraEnabled(cacheable=true)
    public static List <Case> getSubmittedCases() {
        return [
            SELECT CaseNumber,Status 
            FROM Case 
            WHERE Status='Submitted'
        ];
    }
}