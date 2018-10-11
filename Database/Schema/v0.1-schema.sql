drop database if exists sample;
create database sample;

create table sample.test(
  id bigint(20) auto_increment      comment 'Unique id for this thing',
  name varchar(20) not null         comment 'The (short) name of the thing',
  description varchar(150)          comment 'Full (optional) description of the thing',

  constraint test_id_pk primary key (id)
) engine=InnoDB char set=utf8;