#Annex A: creating a public-private key pair and installing the public key

In order to get a public-private key pair, just run the following command:

    $ ssh-keygen -t rsa

You will be prompted for a file path containing the private key and a passphrase. Once created, you will have the private key file within the specified file and another `.pub` sufixed file containing the public key.

In order to install this key pair for remote authenticated accesses into a certain host, just copy the public key in the ssh authorized keys file owned by the user we want to be authenticated in the host:

    $ cat `<key_name>`.pub >> /home/`<user>`/.ssh/authorized_keys
