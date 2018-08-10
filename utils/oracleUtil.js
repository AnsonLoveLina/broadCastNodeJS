// var oracledb = require('oracledb');
// var config = require('../config').initConfig();
// var async = require("async");
// var oraclePool = null;
//
// function initOracleConnectPool(callback) {
//     oracledb.createPool(config.connInfo, function (err, pool) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("oracle pool created");
//             oraclePool = pool;
//             callback(pool);
//         }
//     });
// }
//
// function execSql(sql, resultHandle) {
//     async.series([function (callback) {
//         if (!oraclePool) {
//             initOracleConnectPool(callback);
//         } else {
//             callback(oraclePool);
//         }
//     }], function (pool) {
//         pool.getConnection(function (err, connection) {
//             if (err) {
//                 console.error("oracledb error" + err.message);
//                 setTimeout(function () {
//                     execSql(sql, resultHandle);
//                 }, 10000);
//                 return;
//             }
//             connection.execute(sql,
//                 function (err, result) {
//                     if (err) {
//                         console.error(err.message);
//                         doRelease(connection);
//                         return;
//                     }
//                     async.series([function (callBack) {
//                         resultHandle(result);
//                         callBack();
//                     }],function () {
//                         connection.close();
//                     });
//                 });
//         });
//     });
// }
//
// // function execSql(sql, resutlHandle) {
// //     oracledb.getConnection(
// //         config.connInfo,
// //         function (err, connection) {
// //             if (err) {
// //                 console.error(err.message);
// //                 setTimeout(function () {
// //                     execSql(sql, resutlHandle);
// //                 }, 10000);
// //                 return;
// //             }
// //             connection.execute(sql,
// //                 function (err, result) {
// //                     if (err) {
// //                         console.error(err.message);
// //                         doRelease(connection);
// //                         return;
// //                     }
// //                     resutlHandle(result);
// //                 });
// //         });
// // }
//
// function doRelease(connection) {
//     connection.close(
//         function (err) {
//             if (err) {
//                 console.error(err.message);
//             }
//         });
// }
//
// module.exports = execSql;