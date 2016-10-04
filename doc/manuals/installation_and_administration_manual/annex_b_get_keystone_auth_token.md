#Annex B: get a Keystone auth token

    $ curl -i -H "Content-Type: application/json" -d '{ "auth": { "identity": { "methods": ["password"], "password": { "user": { "name": "admin", "domain": { "id": "default" }, "password": "xxxxxxxx" } } } } }' http://localhost:5000/v3/auth/tokens) ; echo

    HTTP/1.1 201 Created Date: Wed, 29 Jul 2015 12:11:24 GMT Server:
    Apache/2.4.7 (Ubuntu) X-Subject-Token: bd122eff39084b3698f8bce8e0bva816
    Vary: X-Auth-Token x-openstack-request-id:
    req-1ae65420-0d84-4e4f-b3d4-144c6fb54e23 Content-Length: 297
    Content-Type: application/json

    {"token": {"methods": ["password"], "expires_at": "2015-07-29T13:11:24.754603Z", "extras": {}, "user": {"domain": {"id": "default", "name": "Default"}, "id": "c6e65f07a79941f481adfe25bcf95919", "name": "admin"}, "audit_ids": ["zmYq_7EuS4CCR8GLxqCDka"], "issued_at": "2015-07-29T12:11:24.754626Z"}}
