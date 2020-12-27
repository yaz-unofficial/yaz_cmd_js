# yaz_node_cmd_js
## Requires 
* Recommend [Node version manager](https://github.com/creationix/nvm) to install `node` and `npm`
* [http://zoom.z3950.org/bind/nodejs/](http://zoom.z3950.org/bind/nodejs/)
  * [https://github.com/dengelke/node-zoom2](https://github.com/dengelke/node-zoom2)
  * [https://www.npmjs.com/package/node-zoom2](https://www.npmjs.com/package/node-zoom2)
    * `npm install node-zoom2`
      * (`npm install -g node-zoom2')
    * `npm install commander`
    * `npm install utf8`
    * `npm install fs`
    * `npm install xml-js`
    * `npm install marcjs`

* needs libyaz from yaz toolkit
  * [https://www.indexdata.com/resources/software/yaz/](https://www.indexdata.com/resources/software/yaz/)
  * [http://ftp.indexdata.dk/pub/yaz/yaz-5.27.1.tar.gz](http://ftp.indexdata.dk/pub/yaz/yaz-5.27.1.tar.gz)
    * `./buildconf.sh`
    * `./configure`
    * `make`
    * `sudo make install`
  * or
    * `./buildconf.sh`
    * `./configure --prefix=$HOME/myapps`
    * `make`
    * `make install`
    * ...
    * Add `export PATH="$HOME/myapps/bin:$PATH"` to `.bashrc`
    * (Reload file with `source ~/.bashrc`
    
## Usage
`node yaz_cmd_js.js <host> <port> <databaseName> <user> <password> <syntax> <query>`  
`node yaz_cmd_js.js --test <number_from_1-5>`  
Syntax is either `mab`or `usmarc`  
Query in pqf format  
