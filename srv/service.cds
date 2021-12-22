using app.deductions from '../db/schema';


service CatalogService {
//service CatalogService @(requires : 'authenticated-user') {

    entity Deductions_Upload  as projection on deductions.Deductions_Upload;
    entity Deductions_History as projection on deductions.Deductions_History;

    type uploadPayload {
        Personnel_Number     : Integer;
        Wage_Type            : Integer;
        Wagetype_Description : String;
        Amount               : String;
        Currency             : String;
        WBS                  : String;
        uploadedBy           : String;
    }

    type response {
        data : String
    };

    type responseData {
        data : array of String
    };

    function retriveUploadID(uploadID : String) returns response;
    function getUserInfo() returns response;
    action sendDataToUpload(uploadedBy : String, payload : array of uploadPayload) returns response; //post

}
