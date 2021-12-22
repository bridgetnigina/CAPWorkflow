const cds = require('@sap/cds');
const datetime = require('node-datetime');
const { Deductions_Upload } = cds.entities('app.deductions');
const { Deductions_History } = cds.entities('app.deductions');
let seqIDValue;
module.exports = cds.service.impl(async function () {
    const db = await cds.connect.to("db");
    
    this.on("getUserInfo", async (req) => {
        let oUserinfo = {};
        oUserinfo.user = req.user.id;
        return JSON.stringify(oUserinfo);
    });

    this.on('sendDataToUpload', async (req) => {
        try {
            let HistoryResult;
            let dt = datetime.create();
            var uploadedOn = dt.format('Y/m/d H:M:S').toString();
            let sUploadedBy = req.data.uploadedBy;
            let dataToUpload = req.data.payload;
            let sequence_ID = await db.run(`SELECT "db.src.UPLOAD_ID".NEXTVAL as Sequence_number FROM DUMMY`)
            console.log("sequence inside send data to upload" + sequence_ID[0].SEQUENCE_NUMBER);
            seqIDValue = sequence_ID[0].SEQUENCE_NUMBER;
            HistoryResult = await cds.tx(req).run(INSERT.into(Deductions_History).entries(
                {
                    uploadID: seqIDValue,
                    status: 'awaiting approval',
                    uploadedOn: uploadedOn,
                    uploadedBy: sUploadedBy
                }
            ));
            console.log("result::" + HistoryResult);
            let uploadResult;
            for (let i in dataToUpload) {
                let row = dataToUpload[i];
                if (row.Personnel_Number) {
                    uploadResult = await cds.tx(req).run(INSERT.into(Deductions_Upload).entries(
                        {
                            personnelNumber: row.Personnel_Number,
                            wageType: row.Wage_Type,
                            wageTypeDescription: row.Wagetype_Description,
                            amount: row.Amount,
                            CURRENCY: row.Currency,
                            wbs: row.WBS,
                            UPLOADID_UPLOADID: seqIDValue
                        }
                    ));
                }
                console.log(uploadResult);
            }
            let sMessage = "Deductions successfully uploaded";
            let uploadId = seqIDValue;
            let resultData = {
                data: { sMessage, uploadId }
            }
            return resultData;
        }
        catch (e) {
            console.log(e);
            return {
                ERROR: JSON.stringify(e)
            }
        }
    });


    this.on('retriveUploadID', async (req) => {
        try {
            const tx = cds.transaction(req);
            let iUploadedID = req.data.uploadID;
            var deductionUpload = await tx.run(SELECT.from(Deductions_Upload, ['personnelNumber', 'wageType',
                'wageTypeDescription', 'amount', 'CURRENCY', 'wbs'])
                .where({ UPLOADID_UPLOADID: iUploadedID }));
            let resultData = {
                data: deductionUpload
            }
            return resultData;
        }
        catch (e) {
            console.log(e);
            return {
                ERROR: JSON.stringify(e)
            }
        }
    });
});

