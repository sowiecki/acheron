import { Validator } from 'jsonschema';
import { forEach } from 'lodash';

import filesSchemas from './schemas/files';

const validator = new Validator();

forEach(filesSchemas, (schema) => validator.addSchema(schema, schema.id));

export default validator;
