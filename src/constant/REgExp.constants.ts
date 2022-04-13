export const VARIABLE_REGEXP = /\{\{([\s\S]*?)\}\}/g;

export const VARIABLE_NAME_REGEXP = /[a-zA-Z_$]+([a-zA-Z0-9_]*)/;
export const VARIABLE_NAME_REGEXP_ALL = new RegExp(VARIABLE_NAME_REGEXP, 'g');