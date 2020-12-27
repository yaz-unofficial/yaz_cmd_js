#!/usr/bin/env node
//requires node-zoom2

const program = require('commander');
var zoom = require('node-zoom2');
var fs = require("fs");
var utf8 = require('utf8');
var convert = require('xml-js');
let MARC = require('marcjs');
//const { getResults } = require('./logic');

program
  .version('0.0.1')
  .description('cmd-line yaz');
  
program
  .command('getResults <host> <port> <dbname> <user> <pw> <syntax> <query>')
  .alias('g')
  .description('Get yaz results')
  .action((host, port, dbname, user, pw, syntax, query) => {
    getResults(host, port, dbname, user, pw, syntax, query);
  });

function getResults(host, port, dbname, user, pw, syntax, query){
	// console.log("test ");
	// console.log(host, port, dbname, login, syntax, query);
	var test = 6;
	var host2 = host;
	var port2 = port;
	var dbname2 = dbname;
	var user2 = user;
	var pw2 = pw;
	var syntax2 = syntax;
	var query2 = query;
	
	if(test==1){
		host2 = "192.83.186.170";
		port2 = "210";
		dbname2 = "INNOPAC";
		syntax2 = "usmarc";
		query2 = '@attr 1=7 ' + '9780073383095';
	}
	else if(test==4){
		host2 = "z3950.kobv.de";
		port2 = "9991";
		dbname2 = "U-KBV90";
		user2 = "z39";
		pw2 = "z39";
		syntax2 = "usmarc";
		query2 = 'Funktion';
		// query2 = '@attr 1=7 ' + '@attr 1=7 3540591680';
	}
	
	console.log(host2, port2, dbname2, user2, pw2, syntax2, query2);
	var result = [];
	// zoom.connection(host2 + ":" + port2 + "/" + dbname2)
    zoom.connection(host2 + ":" + port2 )
	.set('preferredRecordSyntax', syntax2.toUpperCase())
        .set('databaseName', dbname2)
	// .set('user', login2)
        .set('user', user2)
        .set('password', pw2)
	.query('prefix', query2)
	.search(function (err, resultset){
		// console.log(resultset.size);
        if (resultset != null) {
            var size = resultset.size;
            if(resultset.size > 0){
                resultset.getRecords(0,1, function(err, records){
                    if (err) {
                        return console.log(err);
                    }
                    for(var i = 1; i <= size; i++){
                        // if(i > 3){
                        // 	break;
                        // }
                        if(records && records.hasNext()){
                            var record = records.next();
                            console.log(record.render)
                            // console.log(record.json);
                            // console.log(record.raw)
                            if(syntax2 == 'usmarc'){
                                var parsed = parse_usmarc(record,i);
                                result.push(parsed);

                                // var str = record.raw;
                                // str = str.replace("<","");
                                // str = str.replace(">","");
                                // var split = str.split("\n");
                                // console.log(split);


                                // let rec = MARC.parse(record.xml,'Marcxml');
                                // console.log(Object.keys(record.json['fields'][0]));
                                // console.log(record.json['fields'][5]);

                                // console.log(record.json);
                                // console.log(parsed['245']['subfields']);
                                // console.log(parsed['fields']['245']['subfields']['a']);
                                // console.log(parsed);
                                // var json = rec.as('json')
                                // console.log(rec.as('json'));

                                // console.log(result);
                            }
                            else if(syntax2 == 'mab'){
                                parsed = parse_mab(record);
				result.push(parsed);   
                                // console.log(record.render);
                                // console.log(record.raw);
                                // console.log(record.xml);
                                // console.log(utf8.decode(record.raw));
                                // console.log(parse_mab_string(record.raw));
                            }


                        }
                    }
                    // console.log(result);
                    return JSON.stringify(result);
                });
            }
        }



	});
}

function parse_mab(record){
    return parse_mab_string(record.render);
}

function parse_mab_string(str, num = Math.random()) {
    // exchange some characters that are returned malformed (collected over time))
    // str = exchange_chars_utf8(str);
    // split the returned fields at their separation character 
    var record = str.split(chr(0x001E));

    var map = {};

    //skip last in list, since it is separation character
    for(var i = 0; i < record.length -1; i++) {
        var entry = record[i];
        var field = entry.substring(0,3);
        var subfield = entry.substring(3,4)



        var value = entry.substring(4);
        // var value = entry.substring(4);

        if(field == "331"){
            // console.log(field);
            // console.log(value);
            // console.log(exchange_chars_js_utf8(value));
            // var charcodes = [];
            // for(var j= 0; j < value.length;j++){
            //     charcodes.push(value.charCodeAt(j));
            // }
            // console.log(charcodes);
        }

        value = exchange_chars_js_utf8(value);
        var newvalue = {};
        var subvalues = value.split(String.fromCharCode(31));
        if(subfield != " "){
            newvalue[subfield] = value;
        }
        else if(subvalues.length > 1){
            //start from 1 since first is separation character
            for(var j = 1; j < subvalues.length;j++){
                var subvalue = subvalues[j].substring(0,1);
                var subvaluevalue = subvalues[j].substring(1);
                newvalue[subvalue] = subvaluevalue;
                // console.log(subvalues[j]);
                // console.log(subvalue, subvaluevalue);
            }
        }
        else{
            newvalue = value;
        }
        map[field] = newvalue;

        // console.log(field, subfield, value);

        if(field == '419'){
            // console.log(field);
            // console.log(value);
            // console.log(exchange_chars_js_utf8(value));
            // var charcodes = [];
            // for(var j= 0; j < value.length;j++){
            //     charcodes.push(value.charCodeAt(j));
            //     // charcodes.push(parseInt(value[j]));
            // }
            // console.log(charcodes);
        }
        // if(field == "331"){
        //     console.log(field);
        //     console.log(value);
        //     console.log(exchange_chars_js_utf8(value));
        //     var charcodes = [];
        //     for(var j= 0; j < value.length;j++){
        //         charcodes.push(value.charCodeAt(j));
        //     }
        //     console.log(charcodes);
        // }
        // console.log(field);
        // console.log(value);
    }

    // return str;
    // console.log(map);
    return {'num': num, 'fields': map};
}

function parse_usmarc(record, num) {
    return parse_usmarc_json_fields(record.json['fields'], num);
}

//returns a flattened json/ object for a
function parse_usmarc_json_fields(list, num = Math.random()) {
	//create new map that holds flattened json
	var map = {};

	//for every entry in the list of dicts
	for (var i = 0; i< list.length;i++){
		var entry = list[i];
		var key = null;
		var value = null;

		//each individual dict has only one key-value pair
		for(var k in entry){
			key = k;
			break;
		}
		value = entry[key];

		//check if value is simple or another list/dict
		if(typeof value == "object"){
            var subfields = {};
            var newvalue = {};
			for(var k in value){
				//keys that are not 'subfields' generally have simple values
				if(k != "subfields"){
					newvalue[k] = value[k];
				}
				//keys that are 'subfields' generally have another list of dicts inside
				else{
					//subfields flatten dict
					// {0: {sf1: ""}, ...} -> {sf1: "",...}
					var sfs = value[k];
					for(var numberkey in sfs){
						var numberkeyval = sfs[numberkey];
						for(var sf in numberkeyval){
                            subfields[sf] = numberkeyval[sf];
						}
					}
					newvalue['subfields'] = subfields;
				}
			}
			value = newvalue;
		}

		//add flattened key-value pair to new dict
		map[key]=value;

	}
	return {'num':num,'fields':map};
}

function exchange_chars_js_utf8(str){
    // error character is always String.fromCharCode(65533)
    //how to differentiate between é è ê ???
    var newstr = str;
    var bad_chars = [
        String.fromCharCode(65533).concat("o"),String.fromCharCode(65533).concat("O"),
        String.fromCharCode(65533).concat("a"),String.fromCharCode(65533).concat("A"),
        String.fromCharCode(65533).concat("u"),String.fromCharCode(65533).concat("U"),
        String.fromCharCode(65533),
        String.fromCharCode(65533).concat("e"),String.fromCharCode(65533).concat("E"),
        String.fromCharCode(65533).concat("c"),String.fromCharCode(65533).concat("C"),
        String.fromCharCode(65533).concat("s"),String.fromCharCode(65533).concat("S"),
        String.fromCharCode(65533).concat("i"),String.fromCharCode(65533).concat("I")


    ];
    var rep_chars = [
        "ö", "Ö",
        "ä", "Ä",
        "ü", "Ü",
        "",
        "é", "É",
        "ç", "Ç",
        "š", "Š",
        "ï", "ï"
    ];

    if(bad_chars.length != rep_chars.length){
        //error
    }
    else{
        var regex;
        for(var i = 0; i < rep_chars.length;i++){
            regex = new RegExp(bad_chars[i], "g");
            newstr = newstr.replace(regex, rep_chars[i]);
        }
    }
    return newstr;
}

// the following helper function restores a collection of malformed characters,
// it is based on nearly 3 years experience with several Z39.50 servers
function exchange_chars_utf8(str){
    var newstr = str;
    var bad_chars = [
        chr(0x00C9).concat("o"), chr(0x00C9).concat("O"), chr(0x00C9).concat("a"),
        chr(0x00C9).concat("A"), chr(0x00C9).concat("u"), chr(0x00C9).concat("U"),
        chr(137), chr(136), chr(251) , chr(194).concat("a") ,
        chr(194).concat("i"), chr(194).concat("e"), chr(208).concat("c"), chr(194).concat("E"),
        chr(207).concat("c"), chr(207).concat("s"), chr(207).concat("S"), chr(201).concat("i"),
        chr(200).concat("e"), chr(193).concat("e"), chr(193).concat("a"), chr(193).concat("i"),
        chr(193).concat("o"), chr(193).concat("u"), chr(195).concat("u"), chr(201).concat("e"),
        chr(195).concat(chr(194)), "&amp;#263;", "Ã¤"
    ];
    // console.log(bad_chars);
    var rep_chars = [
                    "ö", "Ö", "ä",
                    "Ä", "ü", "Ü",
                    "" , "" , "ß", "á",
                    "í", "é", "ç", "É",
                    "č", "š", "Š", "ï",
                    "ë", "è", "à", "ì",
                    "ò", "ú", "û", "ë",
                    "ä", "ć", "ä"
    ];
    if(bad_chars.length != rep_chars.length){
        //error
    }
    else{
        var regex;
        for(var i = 0; i < rep_chars.length;i++){
            regex = new RegExp(bad_chars[i], "g");
            newstr = newstr.replace(regex, rep_chars[i]);
        }
    }
    return newstr;

}

function chr (codePt) {
    //  discuss at: http://locutus.io/php/chr/
    // original by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Brett Zamir (http://brett-zamir.me)
    //   example 1: chr(75) === 'K'
    //   example 1: chr(65536) === '\uD800\uDC00'
    //   returns 1: true
    //   returns 1: true

    if (codePt > 0xFFFF) { // Create a four-byte string (length 2) since this code point is high
        //   enough for the UTF-16 encoding (JavaScript internal use), to
        //   require representation with two surrogates (reserved non-characters
        //   used for building other characters; the first is "high" and the next "low")
        codePt -= 0x10000;
        return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
    }
    return String.fromCharCode(codePt);
}


program.parse(process.argv);
