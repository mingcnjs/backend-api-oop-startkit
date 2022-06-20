export function hasAllValues<T>(object: T, keys: string[]) {
  if (!object) {
    return false;
  }

  return keys.every((key) => !isEmptyValue(getDescentValue(object, key)));
}

export function hasAnyValue<T>(object: T, keys: string[]) {
  if (!object) {
    return false;
  }

  return keys.some((key) => !isEmptyValue(getDescentValue(object, key)));
}

// Allow access value by dot nation like 'name' or 'country.code'

export function getDescentValue<T>(object: T, key: string) {
  const childKeys = key.split(".");

  return childKeys.reduce(
    // eslint-disable-next-line
    (obj: any, k) => (obj && obj[k] ? obj[k] : undefined),

    object
  );
}

export function isEmptyValue<T>(value: T) {
  return value === undefined || value === null;
}

export function removeNulls<T>(value: T) {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      if (value[i] == null) {
        value.splice(i, 1);

        i--;
      }
    }
  }

  if (typeof value !== "object") {
    return;
  }

  for (const s in value) {
    if (isEmptyValue(value[s])) {
      delete value[s];
    } else {
      removeNulls(value[s]);
    }
  }
}
