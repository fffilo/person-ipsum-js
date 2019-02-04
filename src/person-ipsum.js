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
     * Extend PersonIpsum constructor
     * with new names
     *
     * @param  {Object}   config
     * @return {Function}
     */
    PersonIpsum.extend = function(config) {
        var PersonIpsumCustom = function(options) {
            if (!(this instanceof PersonIpsumCustom))
                throw "PersonIpsumCustom: PersonIpsumCustom is a constructor.";

            this._init(options);
        }

        // extend
        _extend(PersonIpsumCustom, PersonIpsum);
        _extend(PersonIpsumCustom.prototype, PersonIpsum.prototype);

        // config
        if (config) {
            if ("lastName" in config)
                PersonIpsumCustom.prototype._lastName = config.lastName;
            if ("firstNameMale" in config)
                PersonIpsumCustom.prototype._firstNameMale = config.firstNameMale;
            if ("firstNameFemale" in config)
                PersonIpsumCustom.prototype._firstNameFemale = config.firstNameFemale;
            if ("initial" in config)
                PersonIpsumCustom.prototype._initial = config.initial;
        }

        return PersonIpsumCustom;
    }

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
         * @type {Array}
         */
        _lastName: [ "Adams", "Allen", "Anderson", "Baker", "Brown", "Campbell", "Carter", "Clark", "Collins", "Davis", "Edwards", "Evans", "Garcia", "Gonzalez", "Green", "Hall", "Harris", "Hernandez", "Hill", "Jackson", "Johnson", "Jones", "King", "Lee", "Lewis", "Lopez", "Martin", "Martinez", "Miller", "Mitchell", "Moore", "Nelson", "Parker", "Perez", "Phillips", "Roberts", "Robinson", "Rodriguez", "Scott", "Smith", "Taylor", "Thomas", "Thompson", "Turner", "Walker", "White", "Williams", "Wilson", "Wright", "Young" ],

        /**
         * 50 most common American
         * male first names
         *
         * @type {Array}
         */
        _firstNameMale: [ "Anthony", "Brian", "Charles", "Christopher", "Daniel", "David", "Donald", "Edward", "George", "James", "Jason", "Jeff", "John", "Joseph", "Kenneth", "Kevin", "Mark", "Michael", "Paul", "Richard", "Robert", "Ronald", "Steven", "Thomas", "William" ],

        /**
         * 50 most common American
         * female first names
         *
         * @type {Array}
         */
        _firstNameFemale: [ "Barbara", "Betty", "Carol", "Deborah", "Donna", "Dorothy", "Elizabeth", "Helen", "Jennifer", "Karen", "Kimberly", "Laura", "Linda", "Lisa", "Margaret", "Maria", "Mary", "Michelle", "Nancy", "Patricia", "Ruth", "Sandra", "Sarah", "Sharon", "Susan" ],

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
         * Get property by key name
         *
         * @param  {String} key
         * @return {Number}
         */
        _get: function(key) {
            var result = this[key],
                enums = this._enum(key),
                source = [];
            Object.keys(enums).forEach(function(item) {
                source.push(enums[item]);
            });

            return this._random(source);
        },

        /**
         * Get enum as object
         *
         * @param  {String} key
         * @return {Object}
         */
        _enum: function(key) {
            key = key.toString().toUpperCase();

            var result = {};
            for (var prop in PersonIpsum) {
                if (prop.substr(0, key.length) === key) {
                    var num = PersonIpsum[prop],
                        str = prop.substring(key.length + 1);

                    result[str] = num;
                }
            }

            return result;
        },

        /**
         * Validate enum
         *
         * @param  {String} key
         * @param  {Mixed}  value
         * @return {Number}
         */
        _validate: function(key, value) {
            if (key) {
                key = key.toString().toUpperCase();
                var enums = this._enum(key);

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
            return this._random(this._lastName);
        },

        /**
         * Generate random first name
         *
         * @param  {Number} gender (optional)
         * @return {String}
         */
        _randomFirstName: function(gender) {
            if (gender === PersonIpsum.GENDER_MALE)
                return this._random(this._firstNameMale);
            else if (gender === PersonIpsum.GENDER_FEMALE)
                return this._random(this._firstNameFemale);

            var source = [].concat(this._firstNameMale).concat(this._firstNameFemale);
            return this._random(source);
        },

        /**
         * Generate random initial
         *
         * @return {String}
         */
        _randomInitial: function() {
            return this._random(this._initial);
        },

        /**
         * Generate random name
         *
         * @return {String}
         */
        generate: function() {
            var gender = this._get("gender"),
                format = this._get("format");

            if (format === PersonIpsum.FORMAT_REVERSE)
                return this._randomLastName() + ", " + this._randomFirstName(gender);
            else if (format === PersonIpsum.FORMAT_MIDDLE)
                return this._randomFirstName(gender) + " " + this._randomFirstName(gender) + " " + this._randomLastName();
            else if (format === PersonIpsum.FORMAT_INITIAL)
                return this._randomFirstName(gender) + " " + this._randomInitial() + ". " + this._randomLastName();
            else
                return this._randomFirstName(gender) + " " + this._randomLastName();
        },

    });

    // globalize
    window.PersonIpsum = PersonIpsum;

})(window, document);
