var oracledb = require('oracledb');
var config = require('../config').initConfig();
var async = require("async");
var oraclePool = null;

var initOracleConnectPool = function (getConnection) {
    oraclePool = oracledb.createPool(config.connInfo, function (err, pool) {
        getConnection(err, pool);
    });
};

execSql("select 1 from dual", function (result) {
    console.log(result.rows);
});

function execSql(sql, resultHandle) {
    async.series([function (getConnection) {
        if (!oraclePool) {
            initOracleConnectPool(getConnection);
        }
    }], function (err, pool) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.error(err.message);
                setTimeout(function () {
                    execSql(sql, resultHandle);
                }, 10000);
                return;
            }
            connection.execute(sql,
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        doRelease(connection);
                        return;
                    }
                    resultHandle(result);
                });
        });
    });
}

// var config = {
//     user: 'xingji',　　//用户名
//     password: 'xingji',　　//密码
//     //IP:数据库IP地址，PORT:数据库端口，SCHEMA:数据库名称
//     connectString: "192.168.1.81:1521/orcl"
// };
//
// function execSql(sql, resutlHandle) {
//     oracledb.getConnection(
//         config,
//         function (err, connection) {
//             if (err) {
//                 console.error(err.message);
//                 setTimeout(function () {
//                     execSql(sql, resutlHandle);
//                 }, 10000);
//                 return;
//             }
//             // try {
//             connection.execute(sql,
//                 function (err, result) {
//                     if (err) {
//                         console.error(err.message);
//                         doRelease(connection);
//                         return;
//                     }
//                     resutlHandle(result);
//                 });
// //             // } finally {
// //             //     doRelease(connection);
// //             // }
// //             // doRelease(connection);
//         });
// }
//
function doRelease(connection) {
    connection.close(
        function (err) {
            if (err) {
                console.error(err.message);
            }
        });
}

module.exports = execSql;