CREATE TABLE users (
  userID varchar(255),
  userName varchar(255) NOT NULL UNIQUE,
  pass varchar(255) DEFAULT NULL,
  isOwner tinyint(4) DEFAULT NULL,
  PRIMARY KEY (userID)
);

CREATE TABLE shops(
  shopID varchar(255),
  ownerID varchar(255),
  shopName varchar(255) DEFAULT NULL,
  shopDescription varchar(600) DEFAULT NULL,
  contactInformation varchar(600) DEFAULT NULL,
  workingHours varchar(600) DEFAULT NULL,
  PRIMARY KEY (shopID)
);

CREATE TABLE category(
  categoryID varchar(255),
  categoryName varchar(600) DEFAULT NULL,
  shopID varchar(255) DEFAULT NULL,
  PRIMARY KEY (categoryID)
);


CREATE TABLE service(
  serviceID varchar(255),
  serviceType varchar(600) DEFAULT NULL,
  categoryID varchar(255) DEFAULT NULL,
  shopID varchar(255) DEFAULT NULL,
  price varchar(255) DEFAULT NULL,
  PRIMARY KEY (serviceID)
);



CREATE TABLE request(
  requestID varchar(255),
  shopName varchar(255) DEFAULT NULL,
  serviceType varchar(255) DEFAULT NULL,
  requestedBy varchar(255) DEFAULT NULL,
  requestedForShop varchar(255) DEFAULT NULL,
  status varchar(255) DEFAULT NULL,
  requestTime varchar(255) DEFAULT NULL,
  timestamp  BIGINT DEFAULT NULL,
  PRIMARY KEY (requestID)
);
