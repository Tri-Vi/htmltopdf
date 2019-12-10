'use strict'
var Report = require('../data/Report.js');

class ReportController {
  getAllReport(){
    return Report;
  }

  getReportById(reportId){
    var found = Report.find(function(report){
      return report["reportIdentifier"] == reportId;
    });
    if(found){
      return found;
    } else {
      let errMsg = "Unable to find Report with report id " + reportId;
      return errMsg
    }
  }

  updateReport(reportId, newReportInfo){
    
  }

  addReport(reportInfo){
  }

  deleteReport(reportId){
    let msg;
    var found = Report.findIndex(function(report){
      return report["reportIdentifier"] == reportId;
    });
    if(found > -1){
      Report.splice(found, 1);
      msg = "Delete successfully";
      return msg;
    } else {
      msg = "Report with report id " + reportId + " does not exist";
      return errMsg;
    }
  }
}

module.exports = new ReportController();