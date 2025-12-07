import pickBy from 'lodash/pickBy';

function removeNullOrEmptyValues(obj: any) {
  return pickBy(obj, (value) => value !== null && value !== '');
}

export { removeNullOrEmptyValues };
