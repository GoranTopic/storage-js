import { write_json, read_json, delete_json, mkdir, ls_files, rm_dir } from 'files-js'
import osPath from 'path';

class jsonStorage {

    async open({name, path}){
        // let make a dir with the name on the path
        path = osPath.join(path, name);
        mkdir(path);
        // save the path for later use
        this.path = path;
    }

    async set(key, value) {
        // if key is a number, convert it to string
        if (typeof key === 'number')
            key = this._convet_to_string_int(key);
        // check if value is a js object
        if (typeof value !== 'object') {
            throw new Error('value must be a js object');
        }
        return write_json(value, osPath.join(this.path, key + '.json'), { format: true })
    }

    async get(key) {
        if (typeof key === 'number')
            key = this._convet_to_string_int(key);
        return read_json(osPath.join(this.path, key + '.json'));
    }

    async getAll() {
        let files = ls_files(this.path);
        let jsons = [];
        // for each file, read it and return it
        for ( let file of files )
            // get base name if file 
            jsons.push( { 
                key: osPath.basename(file, '.json'), 
                value: read_json( osPath.join(this.path, file) )
            } );
        return jsons;
    }

    async remove(key) {
        if (typeof key === 'number')
            key = this._convet_to_string_int(key);
        return delete_json(osPath.join(this.path, key + '.json'));
    }

    async delete() {
        let files = ls_files(this.path);
        for (let i = 0; i < files.length; i++) 
            delete_json(files[0]);
        // delete the dir
        rm_dir(this.path);
    }

    _convet_to_string_int(number) {
        let n = 10; // Change this to the number of zeros you want to add
        // convert number to string
        let integerStr = number.toString();
        // get the number of digits
        let digits = integerStr.length;
        // Concatenate zeros to the left
        let resultStr = "0".repeat(n - digits) + integerStr;
        // Return the result
        return resultStr;
    }
}

export default jsonStorage;

