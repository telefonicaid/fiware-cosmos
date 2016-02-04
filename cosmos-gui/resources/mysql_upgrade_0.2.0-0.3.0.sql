USE cosmos;

ALTER TABLE cosmos_user RENAME idm_username TO email;
ALTER TABLE cosmos_user RENAME username TO id;