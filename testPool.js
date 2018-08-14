var executeTasks = require("./dataChange/notification");
var receiveTask = {
    "sql": "select ug.user_id, count(1) " +
    "from T_TASK t,T_USER_GROUP ug " +
    "where instr(t.receive_group_id, ug.group_id) > 0 " +
    "and t.delete_state = '0' " +
    "and t.receive_state = 0 " +
    "group by ug.user_id ", "eventName": "receive", "defaultData": "0", "resultHandle": function (result) {
        console.log(result.rows);
    }
};

var feedbackTask = {
    "sql": "select ug.user_id,count(1) " +
    "from T_TASK t,T_USER_GROUP ug " +
    "where instr(t.receive_group_id, ug.group_id) > 0 " +
    "and t.delete_state = '0' " +
    "and t.reminder_state = 1 " +
    "group by ug.user_id ", "eventName": "feedback", "defaultData": "0", "resultHandle": function (result) {
        console.log(result.rows);
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
        console.log(result.rows);
    }
};

var taskStreamTask = {
    "sql": "select t.group_id,count(1) from T_TASK t " +
    "group by t.group_id", "eventName": "taskStream", "defaultData": "0", "resultHandle": function (result) {
        console.log(result.rows);
    }
};

var taskFeedbackStreamTask = {
    "sql": "select t.group_id,count(1) from T_TASK_FEEDBACK t " +
    "group by t.group_id", "eventName": "taskFeedbackStream", "defaultData": "0", "resultHandle": function (result) {
        console.log(result.rows);
    }
};

var groupMessageTask = {
    "sql": "select t.group_id,count(1) from T_GROUP_MESSAGE t " +
    "group by t.group_id", "eventName": "groupMessage", "defaultData": "0", "resultHandle": function (result) {
        console.log(result.rows);
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
        console.log(result.rows);
    }
};

// tasks = [receiveTask, feedbackTask, reminderTask, taskStreamTask, taskFeedbackStreamTask, groupMessageTask, groupStatusTask];
tasks = [];

// var execSql = require("./utils/oracleUtil");
//
// execSql("select 1 from dual",function (result) {
//     console.log(result.rows);
// });

executeTasks();