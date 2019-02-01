;(function(window, document) {

    // strict mode
    "use strict";

    /**
     * Extend objects (additional arguments) into
     * target respecting getters and setters
     *
     * @param  {Object} target
     * @return {Object}
     */
    var _extend = function(target) {
        Array.prototype.slice.call(arguments, 1).forEach(function(item) {
            for (var prop in item) {
                Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(item, prop));
            }
        });

        return target;
    }

    /**
     * PersonIpsum constructor
     *
     * @param  {Object} options see PersonIpsum.prototype._defaults
     * @return {Void}
     */
    var PersonIpsum = function(options) {
        if (!(this instanceof PersonIpsum))
            throw "PersonIpsum: PersonIpsum is a constructor.";

        this._init(options);
    }

    /**
     * PersonIpsum enums
     *
     * @type {Number}
     */
    PersonIpsum.GENDER_FEMALE = 1;
    PersonIpsum.GENDER_MALE = 2;
    PersonIpsum.FORMAT_NORMAL = 1;
    PersonIpsum.FORMAT_INITIAL = 2;
    PersonIpsum.FORMAT_MIDDLE = 4;
    PersonIpsum.FORMAT_REVERSE = 8;

    /**
     * PersonIpsum prototype
     *
     * @type {Object}
     */
    _extend(PersonIpsum.prototype, {

        /**
         * 50 most common American
         * last names
         *
         * source: http://eslyes.com/namesdict/popular_names.htm
         *
         * @type {Array}
         */
        _lastName: [ "Adams", "Allen", "Anderson", "Baker", "Brown", "Campbell", "Carter", "Clark", "Collins", "Davis", "Edwards", "Evans", "Garcia", "Gonzalez", "Green", "Hall", "Harris", "Hernandez", "Hill", "Jackson", "Johnson", "Jones", "King", "Lee", "Lewis", "Lopez", "Martin", "Martinez", "Miller", "Mitchell", "Moore", "Nelson", "Parker", "Perez", "Phillips", "Roberts", "Robinson", "Rodriguez", "Scott", "Smith", "Taylor", "Thomas", "Thompson", "Turner", "Walker", "White", "Williams", "Wilson", "Wright", "Young" ],

        /**
         * 50 most common American
         * male first names
         *
         * @type {Array}
         */
        _male: [ "Anthony", "Brian", "Charles", "Christopher", "Daniel", "David", "Donald", "Edward", "George", "James", "Jason", "Jeff", "John", "Joseph", "Kenneth", "Kevin", "Mark", "Michael", "Paul", "Richard", "Robert", "Ronald", "Steven", "Thomas", "William" ],

        /**
         * 50 most common American
         * female first names
         *
         * @type {Array}
         */
        _female: [ "Barbara", "Betty", "Carol", "Deborah", "Donna", "Dorothy", "Elizabeth", "Helen", "Jennifer", "Karen", "Kimberly", "Laura", "Linda", "Lisa", "Margaret", "Maria", "Mary", "Michelle", "Nancy", "Patricia", "Ruth", "Sandra", "Sarah", "Sharon", "Susan" ],

        /**
         * Possible initial character
         *
         * @type {String}
         */
        _initial: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",

        /**
         * Default options
         *
         * @type {Object}
         */
        _defaults: {
            format: PersonIpsum.FORMAT_NORMAL | PersonIpsum.FORMAT_INITIAL | PersonIpsum.FORMAT_MIDDLE,
            gender: PersonIpsum.GENDER_FEMALE | PersonIpsum.GENDER_MALE,
        },

        /**
         * Constructor
         *
         * @return {Void}
         */
        _init: function(options) {
            options = _extend({}, this._defaults, options);
            for (var prop in this._defaults) {
                var value = this._validate(prop, options[prop])
                if (value === -1)
                    value = this._defaults[prop];

                this["_" + prop] = value;
            }
        },

        /**
         * Property format getter
         *
         * @return {Number}
         */
        get format() {
            return this._format;
        },

        /**
         * Property format setter
         *
         * @param  {Mixed} value
         * @return {Void}
         */
        set format(value) {
            value = this._validate("format", value);
            if (value === -1)
                return;

            this._format = value;
        },

        /**
         * Property gender getter
         *
         * @return {Number}
         */
        get gender() {
            return this._gender;
        },

        /**
         * Property gender setter
         *
         * @param  {Mixed} value
         * @return {Void}
         */
        set gender(value) {
            value = this._validate("gender", value);
            if (value === -1)
                return;

            this._gender = value;
        },

        /**
         * Get enum as object
         *
         * @param  {String} prefix
         * @return {Object}
         */
        _enum: function(prefix) {
            prefix = prefix.toString().toUpperCase();

            var result = {};
            for (var prop in PersonIpsum) {
                if (prop.substr(0, prefix.length) === prefix) {
                    var num = PersonIpsum[prop],
                        str = prop.substring(prefix.length + 1);

                    result[str] = num;
                }
            }

            return result;
        },

        /**
         * Validate enum
         *
         * @param  {String} prefix
         * @param  {Mixed}  value
         * @return {Number}
         */
        _validate: function(prefix, value) {
            if (prefix) {
                prefix = prefix.toString().toUpperCase();
                var enums = this._enum(prefix);

                if (typeof value === "number") {
                    var num = Object.keys(enums).map(function(item) {
                        return enums[item];
                    });
                    var max = Math.max.apply(null, num);
                    var valid = true
                        && value === Math.round(value)
                        && value === Math.max(value, 1)
                        && value === Math.min(value, max * 2 - 1);

                    if (valid) {
                        for (var prop in enums) {
                            if (enums[prop] & value)
                                return value;
                        }
                    }
                }
                else if (typeof value === "string") {
                    var result = 0,
                        arr = value
                            .toUpperCase()
                            .replace(/[^A-Z,]/g, "")
                                .split(",");

                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] in enums)
                            result = result | enums[arr[i]];
                    }

                    if (result)
                        return result;
                }
            }

            return -1;
        },

        /**
         * Get random item from array
         * or string
         *
         * @param  {Mixed}  source
         * @return {String}
         */
        _random: function(source) {
            return source[Math.floor(Math.random() * source.length)];
        },

        /**
         * Generate random last name
         *
         * @return {String}
         */
        _randomLastName: function() {
            var source = this._lastName;
            return this._random(source);
        },

        /**
         * Generate random first name
         *
         * @return {String}
         */
        _randomFirstName: function() {
            var source, gender = this.gender;
            if (gender === PersonIpsum.GENDER_MALE)
                source = this._male;
            else if (gender === PersonIpsum.GENDER_FEMALE)
                source = this._female;
            else
                source = [].concat(this._male).concat(this._female);

            return this._random(source);
        },

        /**
         * Generate random initial
         *
         * @return {String}
         */
        _randomInitial: function() {
            var source = this._initial;
            return this._random(source);
        },

        /**
         * Generate random name
         *
         * @return {String}
         */
        generate: function() {
            var result,
                uses = [],
                format = this.format;
            if (format & PersonIpsum.FORMAT_REVERSE)
                uses.push(PersonIpsum.FORMAT_REVERSE);
            if (format & PersonIpsum.FORMAT_MIDDLE)
                uses.push(PersonIpsum.FORMAT_MIDDLE);
            if (format & PersonIpsum.FORMAT_INITIAL)
                uses.push(PersonIpsum.FORMAT_INITIAL);
            if (format & PersonIpsum.FORMAT_NORMAL)
                uses.push(PersonIpsum.FORMAT_NORMAL);
            format = uses[Math.floor(Math.random() * uses.length)];

            if (format === PersonIpsum.FORMAT_REVERSE)
                return this._randomLastName() + ", " + this._randomFirstName();
            else if (format === PersonIpsum.FORMAT_MIDDLE)
                return this._randomFirstName() + " " + this._randomFirstName() + " " + this._randomLastName();
            else if (format === PersonIpsum.FORMAT_INITIAL)
                return this._randomFirstName() + " " + this._randomInitial() + ". " + this._randomLastName();
            else
                return this._randomFirstName() + " " + this._randomLastName();
        },

    });

    // globalize
    window.PersonIpsum = PersonIpsum;

})(window, document);