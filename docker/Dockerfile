FROM daocloud.io/centos:7

MAINTAINER 326236882@qq.com

COPY resource /usr/local

RUN cd /usr/local \
    && mv instantclient_11_2 instantclient \
    && cd instantclient \
    && ln -s libclntsh.so.11.1 libclntsh.so
#oracleClient需要
RUN yum install libaio

ENV LD_LIBRARY_PATH=/usr/local/instantclient:$LD_LIBRARY_PATH \
    OCI_LIB_DIR=/usr/local/instantclient \
    OCI_INC_DIR=/usr/local/instantclient/sdk/include

RUN cd /
RUN yum -y update; yum clean all
RUN yum -y install epel-release; yum clean all
RUN yum -y install nodejs npm; yum clean all

RUN npm install broadcastnodejs
RUN node /node_modules/broadcastnodejs/bin/www
