Person Ipsum
============

JavaScript random name generator. It uses *50 Most Popular American Last Names*,
*25 Most Popular American Male Names* and *25 Most Popular American Female Names*
taken from [this site](http://eslyes.com/namesdict/popular_names.htm "50 most Common English Names").

    var ipsum = new PersonIpsum();
    console.log(ipsum.generate());
    >> Wright, Joseph
    console.log(ipsum.generate());
    >> Elizabeth Lopez
    console.log(ipsum.generate());
    >> Kimberly A. King

### Properties

##### Gender

The gender of randomly generated name. It can be `PersonIpsum.GENDER_MALE` and `PersonIpsum.GENDER_FEMALE`.
We can combine them (by using bitwise OR operator `|`) and let script randomly selects one.

    var ipsum = new PersonIpsum();
    ipsum.gender = PersonIpsum.GENDER_MALE;
    ipsum.gender = PersonIpsum.GENDER_FEMALE;
    ipsum.gender = PersonIpsum.GENDER_MALE | PersonIpsum.GENDER_FEMALE;

##### Format

The format of randomly generated name. It can be `PersonIpsum.FORMAT_NORMAL`, `PersonIpsum.FORMAT_INITIAL`,
`PersonIpsum.FORMAT_MIDDLE` and `PersonIpsum.FORMAT_REVERSE`. With each option we can display name in
different format (see examples below).

    var ipsum = new PersonIpsum();
    ipsum.format = PersonIpsum.FORMAT_NORMAL;
    console.log(ipsum.generate());
    >> Carol Carter

    ipsum.format = PersonIpsum.FORMAT_INITIAL;
    console.log(ipsum.generate());
    >> Sandra M. Garcia

    ipsum.format = PersonIpsum.FORMAT_MIDDLE;
    console.log(ipsum.generate());
    >> Jason Edward Edwards

    ipsum.format = PersonIpsum.FORMAT_REVERSE;
    console.log(ipsum.generate());
    >> Martin, Mary

    ipsum.format = PersonIpsum.FORMAT_INITIAL | PersonIpsum.FORMAT_MIDDLE;
    console.log(ipsum.generate());
    >> Brian Christopher Scott

For easier usage we can set gender/format on object initialization. Beside setting it as enumeration we
can use comma separated string.

    var ipsum = new PersonIpsum({
        gender: PersonIpsum.GENDER_FEMALE,
        format: "normal,initial,middle"
    });

### Extensions

Don't like default names? Or we need more different names generators? We can use `extend` method for
defining our own names.

    var PersonIpsumES = PersonIpsum.extend({
        lastName: [ "Hernandez", "Garcia", "Lopez", "Martinez", "Rodriguez" ],
        firstNameMale: [ "Santiago", "Mateo", "Alejandro", "Diego", "Samuel" ],
        firstNameFemale: [ "Sofia", "Isabella", "Camila", "Valentina", "Valeria" ],
        initial: "ABCXYZ"
    });
    var ipsumES = new PersonIpsumES();
    var ipsumUS = new PersonIpsum();
    console.log(ipsumES.generate());
    >> Isabella C. Rodriguez
    console.log(ipsumUS.generate());
    >> Lee, Brian
