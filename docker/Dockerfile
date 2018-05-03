FROM daocloud.io/centos:latest

MAINTAINER 326236882@qq.com

COPY resource /usr/local

RUN cd /usr/local \
    && mv instantclient_11_2 instantclient \
    && cd instantclient \
    && ln -s libclntsh.so.11.1 libclntsh.so

RUN yum -y update; yum clean all
RUN yum -y install epel-release; yum clean all
RUN yum -y install nodejs npm; yum clean all

ENV LD_LIBRARY_PATH=/usr/local/instantclient:$LD_LIBRARY_PATH \
    OCI_LIB_DIR=/usr/local/instantclient \
    OCI_INC_DIR=/usr/local/instantclient/sdk/include
