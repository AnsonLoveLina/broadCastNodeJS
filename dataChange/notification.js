var execSql = require("../utils/oracleUtil");
var schedule = require("node-schedule");
var async = require("async");

function resutlHandle(sql, resutlHandle, rule) {
    if (!rule) {
        rule = new schedule.RecurrenceRule();
        var times2 = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56];
        rule.second = times2;
    }
    schedule.scheduleJob(rule, function () {
        execSql(sql, resutlHandle);
    });
}

function executeTasks() {
    if (tasks.length==0){
        return;
    }
    var asyncTasks = [];
    tasks.forEach(function (task) {
        asyncTasks.push(function () {
            resutlHandle(task.sql, task.resultHandle, task.rule);
        });
    });
    async.parallel(asyncTasks);
}

// executeTasks([{
//     "sql": "select * from t_case where ajbh like '%0337'", "resultHandle": function (result) {
//         console.log(result.metaData);
//         console.log(result.rows);
//     }
// }]);
//
// console.log(999);

module.exports = executeTasks;