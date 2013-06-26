/*
 * Copyright 2013 Joyent, Inc.  All rights reserved.
 *
 */

var util = require('util'),
    format = util.format;
var restify = require('restify'),
    RestError = restify.RestError;


//---- globals

var samples = {};


///--- Errors

/**
 * Usage:
 *      new ValidationFailedError("boom", errors)
 *      new ValidationFailedError(cause, "boom", errors)
 * I.e. optional *first* arg "cause", per WError style.
 */
function ValidationFailedError(cause, message, errors) {
    if (errors === undefined) {
        errors = message;
        message = cause;
        cause = undefined;
    }
    RestError.call(this, {
        restCode: this.constructor.restCode,
        statusCode: this.constructor.statusCode,
        message: message,
        cause: cause,
        body: {
            code: this.constructor.restCode,
            message: message,
            errors: errors
        }
    });
}
util.inherits(ValidationFailedError, RestError);
ValidationFailedError.prototype.name = 'ValidationFailedError';
ValidationFailedError.restCode = 'ValidationFailed';
ValidationFailedError.statusCode = 422;
ValidationFailedError.description = 'Validation of parameters failed.';
samples.ValidationFailedError = new ValidationFailedError('boom', []);


function InvalidParameterError(cause, message, errors) {
    if (errors === undefined) {
        errors = message;
        message = cause;
        cause = undefined;
    }
    RestError.call(this, {
        restCode: this.constructor.restCode,
        statusCode: this.constructor.statusCode,
        message: message,
        cause: cause,
        body: {
            code: this.constructor.restCode,
            message: message,
            errors: errors
        }
    });
}
util.inherits(InvalidParameterError, RestError);
InvalidParameterError.prototype.name = 'InvalidParameterError';
InvalidParameterError.restCode = 'InvalidParameter';
InvalidParameterError.statusCode = 422;
InvalidParameterError.description = 'Given parameter was invalid.';
samples.InvalidParameterError = new InvalidParameterError(
    'invalid "foo"', [ {field: 'foo', code: 'Invalid'} ]);


function ImageFilesImmutableError(cause, imageUuid) {
    if (imageUuid === undefined) {
        imageUuid = cause;
        cause = undefined;
    }
    var message = 'cannot modify files on activated image ' + imageUuid;
    RestError.call(this, {
        restCode: this.constructor.restCode,
        statusCode: this.constructor.statusCode,
        message: message,
        cause: cause
    });
}
util.inherits(ImageFilesImmutableError, RestError);
ImageFilesImmutableError.prototype.name = 'ImageFilesImmutableError';
ImageFilesImmutableError.restCode = 'ImageFilesImmutable';
ImageFilesImmutableError.statusCode = 422;
ImageFilesImmutableError.description =
    'Cannot modify files on an activated image.';
samples.ImageFilesImmutableError = new ImageFilesImmutableError(
    '82ce32a2-9cb4-9a4c-a303-7a63254bacf4');


function ImageAlreadyActivatedError(cause, imageUuid) {
    if (imageUuid === undefined) {
        imageUuid = cause;
        cause = undefined;
    }
    var message = format('image "%s" is already activated', imageUuid);
    RestError.call(this, {
        restCode: this.constructor.restCode,
        statusCode: this.constructor.statusCode,
        message: message,
        cause: cause
    });
}
util.inherits(ImageAlreadyActivatedError, RestError);
ImageAlreadyActivatedError.prototype.name = 'ImageAlreadyActivatedError';
ImageAlreadyActivatedError.restCode = 'ImageAlreadyActivated';
ImageAlreadyActivatedError.statusCode = 422;
ImageAlreadyActivatedError.description = 'Image is already activated.';
samples.ImageAlreadyActivatedError = new ImageAlreadyActivatedError(
    'ed8cd007-2065-0140-8d41-e32247b71748');


// Oh my Little sister, don't she'd no tears...
function NoActivationNoFileError(cause, imageUuid) {
    if (imageUuid === undefined) {
        imageUuid = cause;
        cause = undefined;
    }
    var message = format('image "%s" cannot be activated: it has no file',
        imageUuid);
    RestError.call(this, {
        restCode: this.constructor.restCode,
        statusCode: this.constructor.statusCode,
        message: message,
        cause: cause
    });
}
util.inherits(NoActivationNoFileError, RestError);
NoActivationNoFileError.prototype.name = 'NoActivationNoFileError';
NoActivationNoFileError.restCode = 'NoActivationNoFile';
NoActivationNoFileError.statusCode = 422;
NoActivationNoFileError.description = 'Image must have a file to be activated.';
samples.NoActivationNoFileError = new NoActivationNoFileError(
    'ed8cd007-2065-0140-8d41-e32247b71748');


function OperatorOnlyError(cause) {
    var message = 'this endpoint may only be called by an operator';
    RestError.call(this, {
        restCode: this.constructor.restCode,
        statusCode: this.constructor.statusCode,
        message: message,
        cause: cause
    });
}
util.inherits(OperatorOnlyError, RestError);
OperatorOnlyError.prototype.name = 'OperatorOnlyError';
OperatorOnlyError.restCode = 'OperatorOnly';
OperatorOnlyError.statusCode = 403;
OperatorOnlyError.description =
    'Operator-only endpoint called by a non-operator.';
samples.OperatorOnlyError = new OperatorOnlyError();


function ImageUuidAlreadyExistsError(cause, imageUuid) {
    if (imageUuid === undefined) {
        imageUuid = cause;
        cause = undefined;
    }
    var message = format('image uuid "%s" already exists', imageUuid);
    RestError.call(this, {
        restCode: this.constructor.restCode,
        statusCode: this.constructor.statusCode,
        message: message,
        cause: cause
    });
}
util.inherits(ImageUuidAlreadyExistsError, RestError);
ImageUuidAlreadyExistsError.prototype.name = 'ImageUuidAlreadyExistsError';
ImageUuidAlreadyExistsError.restCode = 'ImageUuidAlreadyExists';
ImageUuidAlreadyExistsError.statusCode = 409;
ImageUuidAlreadyExistsError.description =
    'Attempt to import an image with a conflicting UUID';
samples.ImageUuidAlreadyExistsError = new ImageUuidAlreadyExistsError();


function UploadError(cause, message) {
    if (message === undefined) {
        message = cause;
        cause = undefined;
    }
    RestError.call(this, {
        restCode: this.constructor.restCode,
        statusCode: this.constructor.statusCode,
        message: message,
        cause: cause
    });
}
util.inherits(UploadError, RestError);
UploadError.prototype.name = 'UploadError';
UploadError.restCode = 'Upload';
UploadError.statusCode = 400;
UploadError.description = 'There was a problem with the upload.';


function StorageIsDownError(cause) {
    var message = 'storage is down at the moment';
    RestError.call(this, {
        restCode: this.constructor.restCode,
        statusCode: this.constructor.statusCode,
        message: message,
        cause: cause
    });
}
util.inherits(StorageIsDownError, restify.ServiceUnavailableError);
StorageIsDownError.prototype.name = 'StorageIsDownError';
StorageIsDownError.restCode = 'StorageIsDown';
StorageIsDownError.statusCode = 503;
StorageIsDownError.description = 'Storage system is down.';
samples.StorageIsDownError = new StorageIsDownError();


function OwnerDoesNotExistError(cause, owner) {
    if (owner === undefined) {
        owner = cause;
        cause = undefined;
    }
    RestError.call(this, {
        restCode: this.constructor.restCode,
        statusCode: this.constructor.statusCode,
        message: format('owner "%s" does not exist', owner),
        cause: cause
    });
}
util.inherits(OwnerDoesNotExistError, RestError);
OwnerDoesNotExistError.prototype.name = 'OwnerDoesNotExistError';
OwnerDoesNotExistError.restCode = 'OwnerDoesNotExist';
OwnerDoesNotExistError.statusCode = 422;
OwnerDoesNotExistError.description = (
    'No user exists with the UUID given in the "owner" field in image '
    + 'creation or import does not exist.');



// Guessing we will have to deal with more specific manta errors in the future?
function parseErrorFromStorage(err, message) {
    if (message === undefined) message = 'storage backend error';

    if (err.restCode && err.restCode === 'ServiceUnavailableError') {
        return new StorageIsDownError();
    } else {
        return new restify.InternalError(err, '%s: %s', message, err);
    }
}


samples.InternalError = new restify.InternalError('boom');



//---- exports

module.exports = {
    ValidationFailedError: ValidationFailedError,
    InvalidParameterError: InvalidParameterError,
    ImageFilesImmutableError: ImageFilesImmutableError,
    ImageAlreadyActivatedError: ImageAlreadyActivatedError,
    NoActivationNoFileError: NoActivationNoFileError,
    OperatorOnlyError: OperatorOnlyError,
    ImageUuidAlreadyExistsError: ImageUuidAlreadyExistsError,
    UploadError: UploadError,
    StorageIsDownError: StorageIsDownError,
    OwnerDoesNotExistError: OwnerDoesNotExistError,

    // Core restify RestError and HttpError classes used by IMGAPI.
    InternalError: restify.InternalError,
    ResourceNotFoundError: restify.ResourceNotFoundError,
    InvalidHeaderError: restify.InvalidHeaderError,
    ServiceUnavailableError: restify.ServiceUnavailableError,
    UnauthorizedError: restify.UnauthorizedError,
    BadRequestError: restify.BadRequestError,

    // Helper function to parse errors that come from manta
    parseErrorFromStorage: parseErrorFromStorage,

    samples: samples
};


//---- mainline (to print out errors table for the docs)

// Some error table data that isn't included on the error classes above.
var descFromError = {
    InvalidHeaderError: 'An invalid header was given in the request.'
};

function generateRestdownTable(errors) {
    var http = require('http');
    var rows = ['||**Code**||**HTTP status code**||**Description**||'];
    Object.keys(errors).forEach(function (name) {
        var E = errors[name];
        var restCode, statusCode;
        if (!E.restCode) {
            var e = new E();
            restCode = e.restCode || e.body.code;
            statusCode = e.statusCode;
        } else {
            restCode = E.restCode;
            statusCode = E.statusCode;
        }
        var desc = E.description;
        if (!desc) {
            desc = descFromError[name];
        }
        if (!desc) {
            desc = http.STATUS_CODES[statusCode];
        }
        rows.push(format('||%s||%s||%s||', restCode, statusCode, desc));
    });
    return rows.join('\n');
}

if (require.main === module) {
    var p = console.log;
    var errs = {};
    Object.keys(module.exports).forEach(function (e) {
        if (/Error$/.test(e)) {
            errs[e] = module.exports[e];
        }
    });
    var table = generateRestdownTable(errs);
    p(table);
}
