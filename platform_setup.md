Droplet
=======

```
Droplet Name: app-standard
IP Address: 138.197.112.239
Username: root
Password: JumpingJax123!
```


New User
--------

```
useradd -d /home/forgeduser -m forgeduser
passwd forgeduser
MtnClimber123!

usermod -aG sudo forgeduser
```

Lock Down SSH
-------------

```
vi /etc/ssh/sshd_config
Port 7777
PermitRootLogin no

/etc/init.d/ssh reload
```

## Remote Access

```
ssh -p 7777 forgeduser@138.197.112.239
MtnClimber123!
```

demo-helm-sc
```
ssh -p 7777 forgeduser@174.138.71.113
MtnClimber123!
```


Firewall
--------

## Firewall Software

```
sudo apt-get update
sudo apt-get install iptables-persistent
```

## Firewall Rules

```
sudo iptables -P INPUT DROP
sudo iptables -P OUTPUT ACCEPT
sudo iptables -F
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 7777 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT 1 -i lo -j ACCEPT
```

### Save Changes

```
dpkg-reconfigure iptables-persistent
-- press enter for each prompt
```

Stack Components
================

File System
-----------

Shop files are stored in a specific set of directories for easy management.

```
sudo mkdir -p /shop/forged/products/
sudo mkdir -p /shop/forged/cloud

sudo chown -R forgeduser:forgeduser /shop
```


NGINX
-----
Reverse proxy for SSL redirection to Express Web Server

## Install Commands
```
sudo apt-get update
sudo apt-get install nginx
```

## Copy Certificate to server from laptop
```
/* Save from Demo Server */
rsync -avzh -e "ssh -p 7777" forgeduser@159.203.85.122:/shop/forged/cloud/nginx/ /shop/forged/cloud/nginx/



rsync -avzh -e "ssh -p 7777" /shop/forged/cloud/nginx/ forgeduser@138.197.112.239:/shop/forged/cloud/nginx/
MtnClimber123!

```

## Copy default site to nginx directory
```
chown -R forgeduser:forgeduser /shop/forged/
cp /shop/forged/cloud/nginx/sites-available/default /etc/nginx/sites-available/default

```

## Restart Commands
```
sudo service nginx restart

# Check for Errors
journalctl -xe

```

## DNS create A record for droplet
Use the networking tab at Digital Ocean to map the sub domain to a droplet ip.
```
A demo-helm.forged.com 138.197.112.239
```


NodeJs
------

NodeJs is the foundation system for the Express Web Server.

```
sudo apt-get install python

curl --silent --location https://deb.nodesource.com/setup_4.x | sudo bash -
sudo apt-get install --yes nodejs

sudo npm -g install npm

sudo npm -g install pm2
pm2 startup -u forgeduser

```

MySQL
-----

A popular open source database server.

## Install

```
sudo apt-get update
sudo apt-get install mysql-server
```

## App Database

### Launch the mysql console.
```
mysql -uroot -p
MtnClimber123!
```

### Create the database.
```
CREATE DATABASE helm130;
CREATE USER 'helm_user'@'localhost' IDENTIFIED BY 'HellFire9696!!';
GRANT ALL PRIVILEGES ON helm130.* TO 'helm_user'@'localhost';

```


Operations
==========

Git Clone
---------

```
su forgeduser
mkdir -p /shop/forged/products
cd /shop/forged/products


git clone https://github.com/randomsilo/Helm.git

```

Git Update
```
git pull
```

Node Cluster Manager
--------------------

```
sudo chown -R forgeduser:forgeduser  ~forgeduser/

sudo pm2 startup
MtnClimber123!

cd application
pm2 start -i 0 ./bin/www

pm2 save


```
