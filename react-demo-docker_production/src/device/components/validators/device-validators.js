function Validate(value, rules) {

    function minLengthValidator(value, minLength) {
        return value.length >= minLength;
    }

    function requiredValidator(value) {
        return value.trim() !== '';
    }

    function emailValidator(value) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(value).toLowerCase());
    }

    let isValid = true;

    for (let rule in rules) {

        switch (rule) {
            case 'minLength': isValid = isValid && minLengthValidator(value, rules[rule]);
                break;

            case 'isRequired': isValid = isValid && requiredValidator(value);
                break;

            case 'emailValidator': isValid = isValid && emailValidator(value);
                break;

            default: isValid = true;
        }

    }

    return isValid;
};

export default Validate;
