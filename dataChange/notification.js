var execSql = require("../utils/oracleUtil");
var schedule = require("node-schedule");
var async = require("async");

var io = null;

var receiveTask = {
    "sql": "select ug.user_id, count(1) " +
    "from T_TASK t,T_USER_GROUP ug " +
    "where instr(t.receive_group_id, ug.group_id) > 0 " +
    "and t.delete_state = '0' " +
    "and t.receive_state = 0 " +
    "group by ug.user_id ", "eventName": "receive", "defaultData": "0", "resultHandle": function (result) {
        var task = receiveTask;
        for (var i = 0; i < result.rows.length; i++) {
            var key = result.rows[i][0];
            var value = result.rows[i][1];
            if (task.preData) {
                if (task.preData[key] && value != task.preData[key]) {
                    console.log(key + "，对应数据发生变化：" + value + "，之前的：" + task.preData[key]);
                    io.sockets.to(key).emit(task.eventName, value);
                } else if (!task.preData[key]) {
                    console.log(key + "，对应数据从未产生：" + value);
                    io.sockets.to(key).emit(task.eventName, value);
                }
            } else if (!task.preData) {
                task.preData = {};
                console.log(key + ",对应数据从未产生：" + value);
                io.sockets.to(key).emit(task.eventName, value);
            }
            task.preData[key] = value;
        }
    }
};

var feedbackTask = {
    "sql": "select ug.user_id,count(1) " +
    "from T_TASK t,T_USER_GROUP ug " +
    "where instr(t.receive_group_id, ug.group_id) > 0 " +
    "and t.delete_state = '0' " +
    "and t.reminder_state = 1 " +
    "group by ug.user_id ", "eventName": "feedback", "defaultData": "0", "resultHandle": function (result) {
        var task = feedbackTask;
        for (var i = 0; i < result.rows.length; i++) {
            var key = result.rows[i][0];
            var value = result.rows[i][1];
            if (task.preData) {
                if (task.preData[key] && value != task.preData[key]) {
                    console.log(key + "，对应数据发生变化：" + value + "，之前的：" + task.preData[key]);
                    io.sockets.to(key).emit(task.eventName, value);
                } else if (!task.preData[key]) {
                    console.log(key + "，对应数据从未产生：" + value);
                    io.sockets.to(key).emit(task.eventName, value);
                }
            } else if (!task.preData) {
                task.preData = {};
                console.log(key + ",对应数据从未产生：" + value);
                io.sockets.to(key).emit(task.eventName, value);
            }
            task.preData[key] = value;
        }
    }
};

var reminderTask = {
    "sql": "select t.create_id,COUNT(1) " +
    "from T_TASK t, T_TASK_FEEDBACK f " +
    "where t.id = f.task_id " +
    "and f.feedback_state = 0 " +
    "and t.delete_state = 0 " +
    "and f.delete_state = 0 " +
    "group by t.create_id", "eventName": "reminder", "defaultData": "0", "resultHandle": function (result) {
        var task = reminderTask;
        for (var i = 0; i < result.rows.length; i++) {
            var key = result.rows[i][0];
            var value = result.rows[i][1];
            if (task.preData) {
                if (task.preData[key] && value != task.preData[key]) {
                    console.log(key + "，对应数据发生变化：" + value + "，之前的：" + task.preData[key]);
                    io.sockets.to(key).emit(task.eventName, value);
                } else if (!task.preData[key]) {
                    console.log(key + "，对应数据从未产生：" + value);
                    io.sockets.to(key).emit(task.eventName, value);
                }
            } else if (!task.preData) {
                task.preData = {};
                console.log(key + ",对应数据从未产生：" + value);
                io.sockets.to(key).emit(task.eventName, value);
            }
            task.preData[key] = value;
        }
    }
};

var taskStreamTask = {
    "sql": "select t.group_id,count(1) from T_TASK t " +
    "group by t.group_id", "eventName": "taskStream", "defaultData": "0", "resultHandle": function (result) {
        var task = taskStreamTask;
        for (var i = 0; i < result.rows.length; i++) {
            var key = result.rows[i][0];
            var value = result.rows[i][1];
            if (task.preData) {
                if (task.preData[key] && value != task.preData[key]) {
                    console.log(key + "，对应数据发生变化：" + value + "，之前的：" + task.preData[key]);
                    io.sockets.to(key).emit(task.eventName, value);
                } else if (!task.preData[key]) {
                    console.log(key + "，对应数据从未产生：" + value);
                    io.sockets.to(key).emit(task.eventName, value);
                }
            } else if (!task.preData) {
                task.preData = {};
                console.log(key + ",对应数据从未产生：" + value);
                io.sockets.to(key).emit(task.eventName, value);
            }
            task.preData[key] = value;
        }
    }
};

var taskFeedbackStreamTask = {
    "sql": "select t.group_id,count(1) from T_TASK_FEEDBACK t " +
    "group by t.group_id", "eventName": "taskFeedbackStream", "defaultData": "0", "resultHandle": function (result) {
        var task = taskFeedbackStreamTask;
        for (var i = 0; i < result.rows.length; i++) {
            var key = result.rows[i][0];
            var value = result.rows[i][1];
            if (task.preData) {
                if (task.preData[key] && value != task.preData[key]) {
                    console.log(key + "，对应数据发生变化：" + value + "，之前的：" + task.preData[key]);
                    io.sockets.to(key).emit(task.eventName, value);
                } else if (!task.preData[key]) {
                    console.log(key + "，对应数据从未产生：" + value);
                    io.sockets.to(key).emit(task.eventName, value);
                }
            } else if (!task.preData) {
                task.preData = {};
                console.log(key + ",对应数据从未产生：" + value);
                io.sockets.to(key).emit(task.eventName, value);
            }
            task.preData[key] = value;
        }
    }
};

var groupMessageTask = {
    "sql": "select t.group_id,count(1) from T_GROUP_MESSAGE t " +
    "group by t.group_id", "eventName": "groupMessage", "defaultData": "0", "resultHandle": function (result) {
        var task = groupMessageTask;
        for (var i = 0; i < result.rows.length; i++) {
            var key = result.rows[i][0];
            var value = result.rows[i][1];
            if (task.preData) {
                if (task.preData[key] && value != task.preData[key]) {
                    console.log(key + "，对应数据发生变化：" + value + "，之前的：" + task.preData[key]);
                    io.sockets.to(key).emit(task.eventName, value);
                } else if (!task.preData[key]) {
                    console.log(key + "，对应数据从未产生：" + value);
                    io.sockets.to(key).emit(task.eventName, value);
                }
            } else if (!task.preData) {
                task.preData = {};
                console.log(key + ",对应数据从未产生：" + value);
                io.sockets.to(key).emit(task.eventName, value);
            }
            task.preData[key] = value;
        }
    }
};

var groupStatusTask = {
    "sql": "select k.id, " +
    "decode(count(s.id), 0, 0, 2) taksStatus, " +
    "decode(count(u.id), 0, 0, 3) peopleStatus, " +
    "decode(nvl(a.archive_reason, 0), 0, 0, 1, 5, 4) archiveStatus, " +
    "nvl(count(u.id), 0) peopleCount, " +
    "nvl(count(f.id), 0) feedbackCount " +
    "from T_GROUP k " +
    "left join T_TASK s " +
    "on k.id = s.group_id " +
    "left join T_GROUP_SUSPECTS u " +
    "on k.id = u.group_id " +
    "left join T_GROUP_SUSPECTS_FEEDBACK f " +
    "on k.id = f.group_id " +
    "left join T_GROUP_ARCHIVE a " +
    "on k.id = a.group_id " +
    "group by k.id, a.archive_reason",
    "eventName": "groupStatus",
    "defaultData": "0",
    "resultHandle": function (result) {
        var task = groupStatusTask;
        for (var i = 0; i < result.rows.length; i++) {
            var key = result.rows[i][0];
            var value = {
                    status: result.rows[i][3] == 0 ? (result.rows[i][2] == 0 ? result.rows[i][1] : result.rows[i][2]) : result.rows[i][3],
                    peopleCount: result.rows[i][4],
                    feedbackCount: result.rows[i][5]
                }
            ;
            if (task.preData) {
                if (task.preData[key] && value.status != task.preData[key].status) {
                    console.log(key + "，对应数据发生变化：" + value.status + "，之前的：" + task.preData[key].status);
                    io.sockets.to(key).emit(task.eventName, value);
                } else if (task.preData[key] && (value.peopleCount != task.preData[key].peopleCount || value.feedbackCount != task.preData[key].feedbackCount)) {
                    console.log(key + "，对应数据发生变化：" + value + "，之前的：" + task.preData[key]);
                    io.sockets.to(key).emit(task.eventName, value);
                } else if (!task.preData[key]) {
                    console.log(key + "，对应数据从未产生：" + value);
                    io.sockets.to(key).emit(task.eventName, value);
                }
            } else if (!task.preData) {
                task.preData = {};
                console.log(key + ", 对应数据从未产生：" + value);
                io.sockets.to(key).emit(task.eventName, value);
            }
            task.preData[key] = value;
        }
    }
};

var tasks = [receiveTask, feedbackTask, reminderTask, taskStreamTask, taskFeedbackStreamTask, groupMessageTask, groupStatusTask];
// var tasks = [];

function resutlHandle(sql, resutlHandle, rule) {
    if (!rule) {
        rule = new schedule.RecurrenceRule();
        var times2 = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56];
        rule.second = times2;
    }
    schedule.scheduleJob(rule, function () {
        console.log(new Date());
        execSql(sql, resutlHandle);
    });
}

function executeTasks(myIo) {
    io = myIo;
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