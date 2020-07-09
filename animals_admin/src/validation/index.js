export const required = value =>
  value ? undefined : 'Value is required';

export const minLength = value =>
  value.length < 4
    ? 'Value must be at least 4 characters'
    : undefined;
export const maxLength = value =>
  value.length > 10
    ? 'Value is too long'
    : undefined;
export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
    'Invalid email address' : undefined;
export const phone = value =>
  value && !/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s/0-9]*$/.test(value) ?
    'Invalid phone number' : undefined;

export const url = value =>
  value && !/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([/-/.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(value) ?
    'Invalid url address' : undefined;

export const apiUrl = value =>
  value && !/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([/-/.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(value) ?
    false : true;

export const matchesPassword = (value, allValues) =>
  value === allValues.password ? undefined : 'Passwords must match';

export const matchDate = (value, allValues) => {
  const data = new Date(value) - new Date(allValues.startDate);
  if(data > 0) {
    return undefined
  }else{
    return 'date danger'
  }
};

